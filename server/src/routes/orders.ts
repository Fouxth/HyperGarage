import { Router } from 'express'
import { prisma } from '../prisma.js'

export const ordersRouter = Router()

const include = {
  items: { include: { product: true } },
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
      quantity: i.quantity,
      priceEach: i.priceEach,
    })),
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
    shippingAddress: o.shippingAddress,
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

ordersRouter.post('/', async (req, res) => {
  const b = req.body as {
    customer: string
    phone: string
    shippingAddress: string
    paymentMethod: string
    items: { productId: string; quantity: number }[]
  }

  if (!b.items?.length) return res.status(400).json({ error: 'Cart is empty' })

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: b.items.map((i) => i.productId) } },
      })
      const byId = new Map(products.map((p) => [p.id, p]))

      let total = 0
      for (const item of b.items) {
        const product = byId.get(item.productId)
        if (!product) throw new Error(`Product ${item.productId} not found`)
        if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`)
        total += product.price * item.quantity
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
          items: {
            create: b.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceEach: byId.get(item.productId)!.price,
            })),
          },
        },
        include,
      })

      for (const item of b.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return created
    })

    res.status(201).json(serialize(order))
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Checkout failed' })
  }
})

ordersRouter.patch('/:id/status', async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
      include,
    })
    res.json(serialize(order))
  } catch {
    res.status(404).json({ error: 'Order not found' })
  }
})
