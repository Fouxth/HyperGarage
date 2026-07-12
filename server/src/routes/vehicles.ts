import { Router } from 'express'
import { prisma } from '../prisma.js'

export const vehiclesRouter = Router()

vehiclesRouter.get('/', async (_req, res) => {
  const vehicleBrands = await prisma.vehicleBrand.findMany({
    include: {
      models: {
        include: { generations: true },
      },
    },
  })

  res.json(
    vehicleBrands.map((vb) => ({
      brand: vb.name,
      models: vb.models.map((m) => ({
        name: m.name,
        generations: m.generations.map((g) => ({
          name: g.name,
          years: g.years,
          engines: g.engines,
        })),
      })),
    }))
  )
})

vehiclesRouter.get('/tree', async (_req, res) => {
  const vehicleBrands = await prisma.vehicleBrand.findMany({
    include: {
      models: {
        include: { generations: true },
      },
    },
  })
  res.json(vehicleBrands)
})

vehiclesRouter.post('/brands', async (req, res) => {
  try {
    const brand = await prisma.vehicleBrand.create({ data: { name: req.body.name } })
    res.status(201).json(brand)
  } catch {
    res.status(409).json({ error: 'A vehicle brand with this name already exists' })
  }
})

vehiclesRouter.delete('/brands/:id', async (req, res) => {
  try {
    await prisma.vehicleBrand.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Vehicle brand not found' })
  }
})

vehiclesRouter.post('/models', async (req, res) => {
  try {
    const model = await prisma.vehicleModel.create({
      data: { name: req.body.name, vehicleBrandId: req.body.vehicleBrandId },
    })
    res.status(201).json(model)
  } catch {
    res.status(400).json({ error: 'Could not create vehicle model' })
  }
})

vehiclesRouter.delete('/models/:id', async (req, res) => {
  try {
    await prisma.vehicleModel.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Vehicle model not found' })
  }
})

vehiclesRouter.post('/generations', async (req, res) => {
  try {
    const generation = await prisma.vehicleGeneration.create({
      data: {
        name: req.body.name,
        years: req.body.years,
        engines: req.body.engines ?? [],
        vehicleModelId: req.body.vehicleModelId,
      },
    })
    res.status(201).json(generation)
  } catch {
    res.status(400).json({ error: 'Could not create vehicle generation' })
  }
})

vehiclesRouter.delete('/generations/:id', async (req, res) => {
  try {
    await prisma.vehicleGeneration.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Vehicle generation not found' })
  }
})
