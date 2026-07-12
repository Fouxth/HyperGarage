import { Router } from 'express'
import { prisma } from '../prisma.js'

export const brandsRouter = Router()

function serialize(b: { id: string; name: string; slug: string; logo: string | null; country: string; _count: { products: number } }) {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo,
    country: b.country,
    productCount: b._count.products,
  }
}

brandsRouter.get('/', async (_req, res) => {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
  })
  res.json(brands.map(serialize))
})

brandsRouter.post('/', async (req, res) => {
  const b = req.body
  try {
    const brand = await prisma.brand.create({
      data: { name: b.name, slug: b.slug, logo: b.logo || null, country: b.country },
      include: { _count: { select: { products: true } } },
    })
    res.status(201).json(serialize(brand))
  } catch {
    res.status(409).json({ error: 'A brand with this slug already exists' })
  }
})

brandsRouter.put('/:id', async (req, res) => {
  const b = req.body
  try {
    const brand = await prisma.brand.update({
      where: { id: req.params.id },
      data: { name: b.name, slug: b.slug, logo: b.logo || null, country: b.country },
      include: { _count: { select: { products: true } } },
    })
    res.json(serialize(brand))
  } catch {
    res.status(404).json({ error: 'Brand not found' })
  }
})

brandsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.brand.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(409).json({ error: 'Cannot delete: brand still has products assigned to it' })
  }
})
