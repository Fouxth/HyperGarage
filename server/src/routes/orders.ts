import { Router } from 'express'
import { prisma } from '../prisma.js'
import jwt from 'jsonwebtoken'
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { logAudit } from '../lib/audit.js'
import { notify } from '../lib/notify.js'
import { getJwtSecret } from '../lib/jwtSecret.js'

export const ordersRouter = Router()

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

async function isStaffRequest(req: AuthenticatedRequest): Promise<boolean> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], getJwtSecret()) as { id: string; role?: string }
    if (!decoded || !decoded.id || !decoded.role) return false
    const staff = await prisma.staff.findUnique({ where: { id: decoded.id } })
    return !!staff
  } catch {
    return false
  }
}

function getCustomerIdFromHeader(req: AuthenticatedRequest): string | undefined {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], getJwtSecret()) as { id: string; role?: string }
    return decoded.role ? undefined : decoded.id
  } catch {
    return undefined
  }
}

ordersRouter.get('/', async (req, res) => {
  const isStaff = await isStaffRequest(req)
  const { status, phone, orderNumber } = req.query

  // Public unauthenticated queries MUST provide either phone or orderNumber
  if (!isStaff && typeof phone !== 'string' && typeof orderNumber !== 'string') {
    return res.status(400).json({ error: 'Phone number or order number is required for guest order lookup' })
  }

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
  if (!order) return res.status(404).json({ error: 'Order not found' })

  const isStaff = await isStaffRequest(req)
  if (isStaff) {
    return res.json(serialize(order))
  }

  const customerId = getCustomerIdFromHeader(req)
  if (customerId && order.customerId === customerId) {
    return res.json(serialize(order))
  }

  const queryPhone = typeof req.query.phone === 'string' ? req.query.phone : undefined
  const queryOrderNumber = typeof req.query.orderNumber === 'string' ? req.query.orderNumber : undefined

  if ((queryPhone && queryPhone === order.phone) || (queryOrderNumber && queryOrderNumber === order.orderNumber)) {
    return res.json(serialize(order))
  }

  // Deny access if no proof of ownership
  return res.status(403).json({ error: 'Access denied: Proof of order ownership required' })
})

ordersRouter.post('/', async (req, res) => {
  const b = req.body as {
    customer: string
    phone: string
    shippingAddress: string
    paymentMethod: string
    items: { productId: string; variantId?: string; quantity: number }[]
  }

  if (!b.customer || typeof b.customer !== 'string' || !b.customer.trim()) {
    return res.status(400).json({ error: 'Customer name is required' })
  }
  if (!b.phone || typeof b.phone !== 'string' || !b.phone.trim()) {
    return res.status(400).json({ error: 'Phone number is required' })
  }
  if (!b.shippingAddress || typeof b.shippingAddress !== 'string' || !b.shippingAddress.trim()) {
    return res.status(400).json({ error: 'Shipping address is required' })
  }
  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > 50) {
    return res.status(400).json({ error: 'Cart must contain between 1 and 50 items' })
  }

  for (const item of b.items) {
    if (!item.productId || typeof item.productId !== 'string') {
      return res.status(400).json({ error: 'Invalid product ID' })
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      return res.status(400).json({ error: 'Item quantity must be a positive integer between 1 and 99' })
    }
  }

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
          if (variant.productId !== item.productId) {
            throw new Error(`Variant ${item.variantId} does not belong to product ${product.name}`)
          }
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
          customer: b.customer.trim(),
          phone: b.phone.trim(),
          shippingAddress: b.shippingAddress.trim(),
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
