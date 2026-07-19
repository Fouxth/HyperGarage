import { Router } from 'express'
import { prisma } from '../prisma.js'
import jwt from 'jsonwebtoken'
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { logAudit } from '../lib/audit.js'
import { notify } from '../lib/notify.js'

export const ordersRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'hypergarage-secret-key-12345'
const LOW_STOCK_THRESHOLD = 5

const include = {
  items: { include: { product: true, variant: true } },
} as const

function serialize(o: Awaited<ReturnType<typeof findOne>>) {
  if (!o) return o
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customer: o.customer,
    phone: o.phone,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.product.name,
      productSlug: i.product.slug,
      productImage: i.product.images[0],
      variantId: i.variantId ?? undefined,
      variantName: i.variant?.name,
      quantity: i.quantity,
      priceEach: i.priceEach,
    })),
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
    shippingAddress: o.shippingAddress,
    trackingNumber: o.trackingNumber ?? undefined,
    carrier: o.carrier ?? undefined,
    customerId: o.customerId ?? undefined,
  }
}

function findOne(id: string) {
  return prisma.order.findUnique({ where: { id }, include })
}

ordersRouter.get('/', async (req, res) => {
  const { status, phone, orderNumber } = req.query
  const orders = await prisma.order.findMany({
    where: {
      ...(typeof status === 'string' && status !== 'All' ? { status: status as never } : {}),
      ...(typeof phone === 'string' ? { phone } : {}),
      ...(typeof orderNumber === 'string' ? { orderNumber: { contains: orderNumber, mode: 'insensitive' } } : {}),
    },
    include,
    orderBy: { createdAt: 'desc' },
  })
  res.json(orders.map(serialize))
})

ordersRouter.get('/:id', async (req, res) => {
  const order = await findOne(req.params.id)
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json(serialize(order))
})

function getCustomerIdFromHeader(req: AuthenticatedRequest): string | undefined {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as { id: string; role?: string }
    // Customer tokens carry no `role` claim, unlike staff tokens.
    return decoded.role ? undefined : decoded.id
  } catch {
    return undefined
  }
}

ordersRouter.post('/', async (req, res) => {
  const b = req.body as {
    customer: string
    phone: string
    shippingAddress: string
    paymentMethod: string
    items: { productId: string; variantId?: string; quantity: number }[]
  }

  if (!b.items?.length) return res.status(400).json({ error: 'Cart is empty' })

  const settings = await prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  })
  const allowedMethods = [
    settings.codEnabled && 'cod',
    settings.transferEnabled && 'transfer',
    settings.cardEnabled && 'card',
  ].filter(Boolean)
  if (!allowedMethods.includes(b.paymentMethod)) {
    return res.status(400).json({ error: 'Payment method not available' })
  }

  const customerId = getCustomerIdFromHeader(req)

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: b.items.map((i) => i.productId) } },
      })
      const byId = new Map(products.map((p) => [p.id, p]))

      const variantIds = b.items.map((i) => i.variantId).filter((v): v is string => !!v)
      const variants = variantIds.length
        ? await tx.productVariant.findMany({ where: { id: { in: variantIds } } })
        : []
      const variantById = new Map(variants.map((v) => [v.id, v]))

      let total = 0
      for (const item of b.items) {
        const product = byId.get(item.productId)
        if (!product) throw new Error(`Product ${item.productId} not found`)
        if (item.variantId) {
          const variant = variantById.get(item.variantId)
          if (!variant) throw new Error(`Variant ${item.variantId} not found`)
          if (variant.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name} (${variant.name})`)
          total += (product.price + variant.priceDelta) * item.quantity
        } else {
          if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`)
          total += product.price * item.quantity
        }
      }

      const orderNumber = `HG${Date.now().toString(36).toUpperCase()}`

      const created = await tx.order.create({
        data: {
          orderNumber,
          customer: b.customer,
          phone: b.phone,
          shippingAddress: b.shippingAddress,
          paymentMethod: b.paymentMethod,
          total,
          customerId,
          items: {
            create: b.items.map((item) => {
              const variant = item.variantId ? variantById.get(item.variantId) : undefined
              return {
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                priceEach: byId.get(item.productId)!.price + (variant?.priceDelta ?? 0),
              }
            }),
          },
        },
        include,
      })

      for (const item of b.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }

      return created
    })

    await notify('new_order', `ออเดอร์ใหม่ ${order.orderNumber} จาก ${order.customer}`, order.id)
    for (const item of order.items) {
      if (!item.variantId) {
        const remaining = item.product.stock - item.quantity
        if (remaining <= LOW_STOCK_THRESHOLD) {
          await notify('low_stock', `สินค้า ${item.product.name} เหลือสต็อกต่ำ (${remaining} ชิ้น)`, item.productId)
        }
      }
    }

    res.status(201).json(serialize(order))
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Checkout failed' })
  }
})

ordersRouter.patch('/:id/status', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req: AuthenticatedRequest, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
      include,
    })
    await logAudit(req.user!.id, req.user!.name, 'order.status_update', 'Order', order.id)
    res.json(serialize(order))
  } catch {
    res.status(404).json({ error: 'Order not found' })
  }
})

ordersRouter.patch('/:id/payment', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req: AuthenticatedRequest, res) => {
  const allowed = ['pending', 'paid', 'refunded']
  if (!allowed.includes(req.body.paymentStatus)) {
    return res.status(400).json({ error: 'Invalid payment status' })
  }
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { paymentStatus: req.body.paymentStatus },
      include,
    })
    await logAudit(req.user!.id, req.user!.name, 'order.payment_update', 'Order', order.id)
    res.json(serialize(order))
  } catch {
    res.status(404).json({ error: 'Order not found' })
  }
})

ordersRouter.patch('/:id/shipping', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req: AuthenticatedRequest, res) => {
  const { carrier, trackingNumber } = req.body as { carrier?: string; trackingNumber?: string }
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { carrier, trackingNumber },
      include,
    })
    await logAudit(req.user!.id, req.user!.name, 'order.shipping_update', 'Order', order.id)
    res.json(serialize(order))
  } catch {
    res.status(404).json({ error: 'Order not found' })
  }
})
