import { Router } from 'express'
import { prisma } from '../prisma.js'

export const categoriesRouter = Router()

function serialize(c: { id: string; name: string; nameEn: string; slug: string; icon: string; image: string | null; _count: { products: number } }) {
  return {
    id: c.id,
    name: c.name,
    nameEn: c.nameEn,
    slug: c.slug,
    icon: c.icon,
    image: c.image,
    productCount: c._count.products,
  }
}

categoriesRouter.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })
  res.json(categories.map(serialize))
})

categoriesRouter.post('/', async (req, res) => {
  const b = req.body
  try {
    const category = await prisma.category.create({
      data: { name: b.name, nameEn: b.nameEn, slug: b.slug, icon: b.icon || '', image: b.image || null },
      include: { _count: { select: { products: true } } },
    })
    res.status(201).json(serialize(category))
  } catch {
    res.status(409).json({ error: 'A category with this slug already exists' })
  }
})

categoriesRouter.put('/:id', async (req, res) => {
  const b = req.body
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name: b.name, nameEn: b.nameEn, slug: b.slug, icon: b.icon || '', image: b.image || null },
      include: { _count: { select: { products: true } } },
    })
    res.json(serialize(category))
  } catch {
    res.status(404).json({ error: 'Category not found' })
  }
})

categoriesRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(409).json({ error: 'Cannot delete: category still has products assigned to it' })
  }
})
