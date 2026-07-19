import { Router } from 'express'
import { prisma } from '../prisma.js'
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { logAudit } from '../lib/audit.js'

export const customersRouter = Router()

customersRouter.use(authMiddleware)
customersRouter.use(requireRole(['SUPERADMIN', 'ORDER_STAFF']))

customersRouter.get('/', async (_req, res) => {
  const customers = await prisma.customer.findMany({
    include: { orders: { select: { total: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(
    customers.map((c) => ({
      id: c.id,
      email: c.email,
      name: c.name,
      phone: c.phone ?? undefined,
      banned: c.banned,
      orderCount: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
      createdAt: c.createdAt.toISOString(),
    }))
  )
})

customersRouter.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const { name, phone, banned } = req.body as { name?: string; phone?: string; banned?: boolean }
  try {
    const updated = await prisma.customer.update({
      where: { id: req.params.id },
      data: { name, phone, banned },
    })
    await logAudit(req.user!.id, req.user!.name, 'customer.update', 'Customer', updated.id)
    res.json({ id: updated.id, email: updated.email, name: updated.name, phone: updated.phone ?? undefined, banned: updated.banned })
  } catch {
    res.status(404).json({ error: 'Customer not found' })
  }
})
