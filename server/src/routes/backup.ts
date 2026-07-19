import { Router } from 'express'
import { prisma } from '../prisma.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'

export const backupRouter = Router()

backupRouter.get('/export', authMiddleware, requireRole(['SUPERADMIN']), async (_req, res) => {
  const [
    categories,
    brands,
    products,
    productVariants,
    vehicleBrands,
    orders,
    orderItems,
    coupons,
    storeSettings,
    reviews,
    returns,
    customers,
    notifications,
  ] = await Promise.all([
    prisma.category.findMany(),
    prisma.brand.findMany(),
    prisma.product.findMany(),
    prisma.productVariant.findMany(),
    prisma.vehicleBrand.findMany({ include: { models: { include: { generations: true } } } }),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
    prisma.coupon.findMany(),
    prisma.storeSettings.findMany(),
    prisma.review.findMany(),
    prisma.return.findMany(),
    prisma.customer.findMany({ select: { id: true, email: true, name: true, phone: true, banned: true, createdAt: true, updatedAt: true } }),
    prisma.notification.findMany(),
  ])

  const payload = {
    exportedAt: new Date().toISOString(),
    categories,
    brands,
    products,
    productVariants,
    vehicleBrands,
    orders,
    orderItems,
    coupons,
    storeSettings,
    reviews,
    returns,
    customers,
    notifications,
  }

  const filename = `hypergarage-backup-${Date.now()}.json`
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(JSON.stringify(payload, null, 2))
})
