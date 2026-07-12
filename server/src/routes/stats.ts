import { Router } from 'express'
import { prisma } from '../prisma.js'

export const statsRouter = Router()

const categoryColors: Record<string, string> = {
  engine: '#22C55E',
  exhaust: '#EF4444',
  suspension: '#3B82F6',
  brake: '#F59E0B',
  wheel: '#8B5CF6',
  exterior: '#14B8A6',
  interior: '#F97316',
  electronics: '#EC4899',
}

statsRouter.get('/dashboard', async (_req, res) => {
  const [orders, totalProducts, categories] = await Promise.all([
    prisma.order.findMany(),
    prisma.product.count(),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
  ])

  const revenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0)
  const customers = new Set(orders.map((o) => o.customer)).size

  const now = new Date()
  const salesByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const monthOrders = orders.filter(
      (o) => o.createdAt.getFullYear() === d.getFullYear() && o.createdAt.getMonth() === d.getMonth()
    )
    return {
      month: d.toLocaleString('en-US', { month: 'short' }),
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
      orders: monthOrders.length,
    }
  })

  const totalCategoryProducts = categories.reduce((sum, c) => sum + c._count.products, 0)
  const categorySales = categories
    .filter((c) => c._count.products > 0)
    .map((c) => ({
      name: c.nameEn,
      value: totalCategoryProducts > 0 ? Math.round((c._count.products / totalCategoryProducts) * 100) : 0,
      color: categoryColors[c.slug] ?? '#888888',
    }))

  res.json({
    stats: {
      revenue,
      orders: orders.length,
      customers,
      totalProducts,
    },
    salesByMonth,
    categorySales,
  })
})

statsRouter.get('/reports', async (_req, res) => {
  const [orderItems, orders] = await Promise.all([
    prisma.orderItem.findMany({ include: { product: true } }),
    prisma.order.findMany(),
  ])

  const byProduct = new Map<string, { name: string; quantity: number; revenue: number }>()
  for (const item of orderItems) {
    const existing = byProduct.get(item.productId)
    const revenue = item.quantity * item.priceEach
    if (existing) {
      existing.quantity += item.quantity
      existing.revenue += revenue
    } else {
      byProduct.set(item.productId, { name: item.product.name, quantity: item.quantity, revenue })
    }
  }
  const topProducts = Array.from(byProduct.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  const byPaymentMethod = new Map<string, number>()
  for (const order of orders) {
    byPaymentMethod.set(order.paymentMethod, (byPaymentMethod.get(order.paymentMethod) ?? 0) + order.total)
  }
  const revenueByPaymentMethod = Array.from(byPaymentMethod.entries()).map(([method, total]) => ({ method, total }))

  const byStatus = new Map<string, number>()
  for (const order of orders) {
    byStatus.set(order.status, (byStatus.get(order.status) ?? 0) + 1)
  }
  const ordersByStatus = Array.from(byStatus.entries()).map(([status, count]) => ({ status, count }))

  res.json({ topProducts, revenueByPaymentMethod, ordersByStatus })
})

statsRouter.get('/activity', async (_req, res) => {
  const [orders, reviews, products] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.review.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ])

  const events = [
    ...orders.map((o) => ({
      type: 'order' as const,
      message: `New order ${o.orderNumber} from ${o.customer} (฿${o.total.toLocaleString()})`,
      createdAt: o.createdAt.toISOString(),
    })),
    ...reviews.map((r) => ({
      type: 'review' as const,
      message: `${r.userName} left a ${r.rating}-star review`,
      createdAt: r.createdAt.toISOString(),
    })),
    ...products.map((p) => ({
      type: 'product' as const,
      message: `Product "${p.nameEn}" was added to the catalog`,
      createdAt: p.createdAt.toISOString(),
    })),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  res.json(events.slice(0, 30))
})
