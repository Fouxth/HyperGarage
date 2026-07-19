import { Router } from 'express'
import { prisma } from '../prisma.js'
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { logAudit } from '../lib/audit.js'
import { notify } from '../lib/notify.js'

export const returnsRouter = Router()

function serialize(r: Awaited<ReturnType<typeof findOne>>) {
  if (!r) return r
  return {
    id: r.id,
    orderId: r.orderId,
    orderNumber: r.order.orderNumber,
    customer: r.order.customer,
    reason: r.reason,
    status: r.status,
    refundAmount: r.refundAmount ?? undefined,
    note: r.note ?? undefined,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }
}

function findOne(id: string) {
  return prisma.return.findUnique({ where: { id }, include: { order: true } })
}

returnsRouter.get('/', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req, res) => {
  const { status } = req.query
  const returns = await prisma.return.findMany({
    where: typeof status === 'string' && status !== 'All' ? { status: status as never } : undefined,
    include: { order: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(returns.map(serialize))
})

returnsRouter.post('/', async (req, res) => {
  const { orderId, reason } = req.body as { orderId: string; reason: string }
  if (!orderId || !reason) return res.status(400).json({ error: 'orderId and reason are required' })

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return res.status(404).json({ error: 'Order not found' })

  const created = await prisma.return.create({
    data: { orderId, reason },
    include: { order: true },
  })
  await notify('return_requested', `คำขอคืนสินค้าใหม่สำหรับออเดอร์ ${order.orderNumber}`, created.id)
  res.status(201).json(serialize(created))
})

returnsRouter.patch('/:id/status', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req: AuthenticatedRequest, res) => {
  const { status, refundAmount, note } = req.body as { status: string; refundAmount?: number; note?: string }
  const allowed = ['requested', 'approved', 'rejected', 'refunded']
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })

  try {
    const existing = await prisma.return.findUnique({
      where: { id: req.params.id },
      include: { order: { include: { items: true } } },
    })
    if (!existing) return res.status(404).json({ error: 'Return not found' })

    const restockNeeded = (status === 'approved' || status === 'refunded') && existing.status === 'requested'

    const updated = await prisma.$transaction(async (tx) => {
      if (restockNeeded) {
        for (const item of existing.order.items) {
          if (item.variantId) {
            await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } })
          } else {
            await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
          }
        }
      }
      if (status === 'refunded') {
        await tx.order.update({ where: { id: existing.orderId }, data: { paymentStatus: 'refunded' } })
      }
      return tx.return.update({
        where: { id: req.params.id },
        data: { status: status as never, refundAmount, note },
        include: { order: true },
      })
    })

    await logAudit(req.user!.id, req.user!.name, `return.${status}`, 'Return', updated.id)
    res.json(serialize(updated))
  } catch {
    res.status(404).json({ error: 'Return not found' })
  }
})
