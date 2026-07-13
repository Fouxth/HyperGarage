import { Router } from 'express'
import { prisma } from '../prisma.js'

export const reviewsRouter = Router()

reviewsRouter.get('/', async (req, res) => {
  const { productId } = req.query
  const reviews = await prisma.review.findMany({
    where: typeof productId === 'string' ? { productId } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  res.json(
    reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      images: r.images,
      createdAt: r.createdAt.toISOString(),
    }))
  )
})

reviewsRouter.post('/', async (req, res) => {
  const { productId, userName, rating, comment, images } = req.body
  if (!productId || !userName || !rating || !comment) {
    res.status(400).json({ error: 'productId, userName, rating, and comment are required' })
    return
  }

  try {
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    })
    if (!productExists) {
      res.status(400).json({ error: `Product ${productId} not found` })
      return
    }

    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: { productId, userName, rating: Number(rating), comment, images: images ?? [] },
      })
      const agg = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: true,
      })
      await tx.product.update({
        where: { id: productId },
        data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count },
      })
      return created
    })

    res.status(201).json({
      id: review.id,
      productId: review.productId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      images: review.images,
      createdAt: review.createdAt.toISOString(),
    })
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Review creation failed' })
  }
})

reviewsRouter.get('/recent', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20)
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  res.json(
    reviews.map((r) => ({
      id: r.id,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }))
  )
})
