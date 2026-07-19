import { Router } from 'express'
import { prisma } from '../prisma.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

export const notificationsRouter = Router()

notificationsRouter.use(authMiddleware)

notificationsRouter.get('/', async (req, res) => {
  const { read } = req.query
  const notifications = await prisma.notification.findMany({
    where: typeof read === 'string' ? { read: read === 'true' } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  res.json(
    notifications.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      entityId: n.entityId ?? undefined,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    }))
  )
})

notificationsRouter.patch('/mark-all-read', async (_req, res) => {
  await prisma.notification.updateMany({ where: { read: false }, data: { read: true } })
  res.json({ ok: true })
})

notificationsRouter.patch('/:id/read', async (req, res) => {
  try {
    const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } })
    res.json({ id: updated.id, read: updated.read })
  } catch {
    res.status(404).json({ error: 'Notification not found' })
  }
})
