import { Router } from 'express'
import { prisma } from '../prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { customerAuthMiddleware, AuthenticatedCustomerRequest } from '../middlewares/customerAuthMiddleware.js'

export const accountRouter = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'hypergarage-secret-key-12345'

function serializeCustomer(c: { id: string; email: string; name: string; phone: string | null }) {
  return { id: c.id, email: c.email, name: c.name, phone: c.phone ?? undefined }
}

// Attaches any past guest-checkout orders placed with the same phone number
// to this customer account, so they retroactively show up as "my orders".
async function claimOrdersByPhone(customerId: string, phone: string | null) {
  if (!phone) return
  await prisma.order.updateMany({ where: { phone, customerId: null }, data: { customerId } })
}

accountRouter.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body as { email: string; password: string; name: string; phone?: string }
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' })
  }

  const existing = await prisma.customer.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'Email already registered' })

  const hashed = await bcrypt.hash(password, 10)
  const customer = await prisma.customer.create({ data: { email, password: hashed, name, phone } })
  await claimOrdersByPhone(customer.id, customer.phone)

  const token = jwt.sign({ id: customer.id, email: customer.email, name: customer.name }, JWT_SECRET, { expiresIn: '30d' })
  res.status(201).json({ token, customer: serializeCustomer(customer) })
})

accountRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string }
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  const customer = await prisma.customer.findUnique({ where: { email } })
  if (!customer) return res.status(401).json({ error: 'Invalid email or password' })
  if (customer.banned) return res.status(403).json({ error: 'This account has been suspended' })

  const valid = await bcrypt.compare(password, customer.password)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  await claimOrdersByPhone(customer.id, customer.phone)

  const token = jwt.sign({ id: customer.id, email: customer.email, name: customer.name }, JWT_SECRET, { expiresIn: '30d' })
  res.json({ token, customer: serializeCustomer(customer) })
})

accountRouter.get('/me', customerAuthMiddleware, async (req: AuthenticatedCustomerRequest, res) => {
  const customer = await prisma.customer.findUnique({ where: { id: req.customer!.id } })
  if (!customer) return res.status(404).json({ error: 'Customer not found' })
  res.json(serializeCustomer(customer))
})

accountRouter.get('/orders', customerAuthMiddleware, async (req: AuthenticatedCustomerRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { customerId: req.customer!.id },
    include: { items: { include: { product: true, variant: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(
    orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      trackingNumber: o.trackingNumber ?? undefined,
      carrier: o.carrier ?? undefined,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({
        productName: i.product.name,
        productImage: i.product.images[0],
        variantName: i.variant?.name,
        quantity: i.quantity,
        priceEach: i.priceEach,
      })),
    }))
  )
})

accountRouter.get('/addresses', customerAuthMiddleware, async (req: AuthenticatedCustomerRequest, res) => {
  const addresses = await prisma.customerAddress.findMany({ where: { customerId: req.customer!.id } })
  res.json(addresses)
})

accountRouter.post('/addresses', customerAuthMiddleware, async (req: AuthenticatedCustomerRequest, res) => {
  const { label, address, isDefault } = req.body as { label: string; address: string; isDefault?: boolean }
  if (!label || !address) return res.status(400).json({ error: 'label and address are required' })
  const created = await prisma.customerAddress.create({
    data: { customerId: req.customer!.id, label, address, isDefault: !!isDefault },
  })
  res.status(201).json(created)
})

accountRouter.patch('/addresses/:id', customerAuthMiddleware, async (req: AuthenticatedCustomerRequest, res) => {
  const existing = await prisma.customerAddress.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.customerId !== req.customer!.id) return res.status(404).json({ error: 'Address not found' })
  const { label, address, isDefault } = req.body as { label?: string; address?: string; isDefault?: boolean }
  const updated = await prisma.customerAddress.update({
    where: { id: req.params.id },
    data: { label, address, isDefault },
  })
  res.json(updated)
})

accountRouter.delete('/addresses/:id', customerAuthMiddleware, async (req: AuthenticatedCustomerRequest, res) => {
  const existing = await prisma.customerAddress.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.customerId !== req.customer!.id) return res.status(404).json({ error: 'Address not found' })
  await prisma.customerAddress.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
