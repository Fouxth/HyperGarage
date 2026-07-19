import { prisma } from '../prisma.js'
import type { NotificationType } from '@prisma/client'

export async function notify(type: NotificationType, message: string, entityId?: string) {
  try {
    await prisma.notification.create({ data: { type, message, entityId } })
  } catch (err) {
    console.error('Failed to write notification', err)
  }
}
