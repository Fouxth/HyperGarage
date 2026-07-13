import { Router } from 'express'
import type { Prisma } from '@prisma/client'
import { prisma } from '../prisma.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'

export const productsRouter = Router()

const include = {
  brand: true,
  category: true,
  compatibility: true,
} satisfies Prisma.ProductInclude

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof include }>

function serialize(p: ProductWithRelations) {
  return {
    id: p.id,
    name: p.name,
    nameEn: p.nameEn,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    discount: p.discount ?? undefined,
    images: p.images,
    brandId: p.brandId,
    brand: p.brand.name,
    categoryId: p.categoryId,
    category: p.category.name,
    categorySlug: p.category.slug,
    sku: p.sku,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    description: p.description,
    specs: p.specs,
    compatibility: p.compatibility.map((c) => ({
      brand: c.brand,
      model: c.model,
      generation: c.generation,
      years: c.years,
      engine: c.engine,
    })),
    tags: p.tags,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    isFlashSale: p.isFlashSale,
    flashSaleEnd: p.flashSaleEnd ?? undefined,
  }
}

productsRouter.get('/', async (req, res) => {
  const { featured, flashSale, category, brand, q, minPrice, maxPrice, sort, vehicleBrand, vehicleModel, vehicleGeneration, vehicleEngine } = req.query

  const compatibilitySome: Prisma.ProductCompatibilityWhereInput = {}
  if (typeof vehicleBrand === 'string') compatibilitySome.brand = vehicleBrand
  if (typeof vehicleModel === 'string') compatibilitySome.model = vehicleModel
  if (typeof vehicleGeneration === 'string') compatibilitySome.generation = vehicleGeneration
  if (typeof vehicleEngine === 'string') compatibilitySome.engine = vehicleEngine
  const hasCompatibilityFilter = Object.keys(compatibilitySome).length > 0

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'price-asc' ? { price: 'asc' } :
    sort === 'price-desc' ? { price: 'desc' } :
    sort === 'rating' ? { rating: 'desc' } :
    { createdAt: 'desc' }

  const products = await prisma.product.findMany({
    where: {
      ...(featured === 'true' ? { isFeatured: true } : {}),
      ...(flashSale === 'true' ? { isFlashSale: true } : {}),
      ...(typeof category === 'string' ? { category: { slug: category } } : {}),
      ...(typeof brand === 'string' ? { brand: { slug: brand } } : {}),
      ...(typeof q === 'string' && q ? { OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { nameEn: { contains: q, mode: 'insensitive' } },
      ] } : {}),
      ...(minPrice ? { price: { gte: Number(minPrice) } } : {}),
      ...(maxPrice ? { price: { ...(minPrice ? { gte: Number(minPrice) } : {}), lte: Number(maxPrice) } } : {}),
      ...(hasCompatibilityFilter ? { compatibility: { some: compatibilitySome } } : {}),
    },
    include,
    orderBy,
  })
  res.json(products.map(serialize))
})

productsRouter.post('/', authMiddleware, requireRole(['SUPERADMIN', 'STOCK_STAFF']), async (req, res) => {
  const b = req.body
  const product = await prisma.product.create({
    data: {
      name: b.name,
      nameEn: b.nameEn,
      slug: b.slug,
      price: b.price,
      originalPrice: b.originalPrice || null,
      discount: b.discount || null,
      images: b.images ?? [],
      sku: b.sku,
      stock: b.stock ?? 0,
      description: b.description ?? '',
      specs: b.specs ?? {},
      tags: b.tags ?? [],
      isFeatured: b.isFeatured ?? false,
      isFlashSale: b.isFlashSale ?? false,
      flashSaleEnd: b.flashSaleEnd ? new Date(b.flashSaleEnd) : null,
      brandId: b.brandId,
      categoryId: b.categoryId,
    },
    include,
  })
  res.status(201).json(serialize(product))
})

productsRouter.put('/:id', authMiddleware, requireRole(['SUPERADMIN', 'STOCK_STAFF']), async (req, res) => {
  const b = req.body
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: b.name,
        nameEn: b.nameEn,
        slug: b.slug,
        price: b.price,
        originalPrice: b.originalPrice || null,
        discount: b.discount || null,
        images: b.images ?? [],
        sku: b.sku,
        stock: b.stock ?? 0,
        description: b.description ?? '',
        specs: b.specs ?? {},
        tags: b.tags ?? [],
        isFeatured: b.isFeatured ?? false,
        isFlashSale: b.isFlashSale ?? false,
        flashSaleEnd: b.flashSaleEnd ? new Date(b.flashSaleEnd) : null,
        brandId: b.brandId,
        categoryId: b.categoryId,
      },
      include,
    })
    res.json(serialize(product))
  } catch {
    res.status(404).json({ error: 'Product not found' })
  }
})

productsRouter.patch('/:id/stock', authMiddleware, requireRole(['SUPERADMIN', 'STOCK_STAFF']), async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { stock: req.body.stock },
      include,
    })
    res.json(serialize(product))
  } catch {
    res.status(404).json({ error: 'Product not found' })
  }
})

productsRouter.patch('/:id/flash-sale', authMiddleware, requireRole(['SUPERADMIN', 'STOCK_STAFF']), async (req, res) => {
  const b = req.body
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        isFlashSale: b.isFlashSale,
        discount: b.discount ?? null,
        flashSaleEnd: b.flashSaleEnd ? new Date(b.flashSaleEnd) : null,
      },
      include,
    })
    res.json(serialize(product))
  } catch {
    res.status(404).json({ error: 'Product not found' })
  }
})

productsRouter.delete('/:id', authMiddleware, requireRole(['SUPERADMIN', 'STOCK_STAFF']), async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(409).json({ error: 'Cannot delete: product is referenced by existing orders' })
  }
})

productsRouter.get('/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include,
  })
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json(serialize(product))
})
