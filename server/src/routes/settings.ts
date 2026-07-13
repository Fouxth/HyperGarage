import { Router } from 'express'
import { prisma } from '../prisma.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'

export const settingsRouter = Router()

async function getOrCreate() {
  return prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  })
}

settingsRouter.get('/', async (_req, res) => {
  res.json(await getOrCreate())
})

settingsRouter.put('/', authMiddleware, requireRole(['SUPERADMIN']), async (req, res) => {
  const b = req.body
  const settings = await prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {
      storeName: b.storeName,
      contactEmail: b.contactEmail,
      contactPhone: b.contactPhone,
      address: b.address,
      currency: b.currency,
      maintenanceMode: b.maintenanceMode,
    },
    create: {
      id: 'singleton',
      storeName: b.storeName,
      contactEmail: b.contactEmail,
      contactPhone: b.contactPhone,
      address: b.address,
      currency: b.currency,
      maintenanceMode: b.maintenanceMode,
    },
  })
  res.json(settings)
})
