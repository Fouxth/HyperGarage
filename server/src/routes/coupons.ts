import { Router } from 'express'
import { prisma } from '../prisma.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'

export const couponsRouter = Router()

couponsRouter.get('/', async (_req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(coupons)
})

couponsRouter.post('/', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req, res) => {
  const b = req.body
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: b.code.toUpperCase(),
        type: b.type,
        value: b.value,
        active: b.active ?? true,
        usageLimit: b.usageLimit || null,
        expiresAt: b.expiresAt ? new Date(b.expiresAt) : null,
      },
    })
    res.status(201).json(coupon)
  } catch {
    res.status(409).json({ error: 'A coupon with this code already exists' })
  }
})

couponsRouter.put('/:id', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req, res) => {
  const b = req.body
  try {
    const coupon = await prisma.coupon.update({
      where: { id: req.params.id },
      data: {
        code: b.code.toUpperCase(),
        type: b.type,
        value: b.value,
        active: b.active ?? true,
        usageLimit: b.usageLimit || null,
        expiresAt: b.expiresAt ? new Date(b.expiresAt) : null,
      },
    })
    res.json(coupon)
  } catch {
    res.status(404).json({ error: 'Coupon not found' })
  }
})

couponsRouter.delete('/:id', authMiddleware, requireRole(['SUPERADMIN', 'ORDER_STAFF']), async (req, res) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Coupon not found' })
  }
})
