import { Router } from 'express'
import { prisma } from '../prisma.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'

export const auditRouter = Router()

auditRouter.use(authMiddleware)
auditRouter.use(requireRole(['SUPERADMIN']))

auditRouter.get('/', async (req, res) => {
  const { entity, action } = req.query
  const logs = await prisma.auditLog.findMany({
    where: {
      ...(typeof entity === 'string' && entity !== 'All' ? { entity } : {}),
      ...(typeof action === 'string' && action !== 'All' ? { action } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  res.json(
    logs.map((l) => ({
      id: l.id,
      actorId: l.actorId,
      actorName: l.actorName,
      action: l.action,
      entity: l.entity,
      entityId: l.entityId,
      createdAt: l.createdAt.toISOString(),
    }))
  )
})
