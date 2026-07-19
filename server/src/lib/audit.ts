import { prisma } from '../prisma.js'

export async function logAudit(actorId: string, actorName: string, action: string, entity: string, entityId: string) {
  try {
    await prisma.auditLog.create({ data: { actorId, actorName, action, entity, entityId } })
  } catch (err) {
    console.error('Failed to write audit log', err)
  }
}
