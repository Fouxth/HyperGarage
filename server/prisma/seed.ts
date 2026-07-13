import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { categories, brands, products, vehicles } from './seed-data.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const categoryIdBySlug = new Map<string, string>()
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, nameEn: c.nameEn, icon: c.icon, image: c.image },
      create: { name: c.name, nameEn: c.nameEn, slug: c.slug, icon: c.icon, image: c.image },
    })
    categoryIdBySlug.set(c.slug, row.id)
  }

  const brandIdByName = new Map<string, string>()
  for (const b of brands) {
    const row = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, logo: b.logo || null, country: b.country },
      create: { name: b.name, slug: b.slug, logo: b.logo || null, country: b.country },
    })
    brandIdByName.set(b.name, row.id)
  }

  for (const p of products) {
    const brandId = brandIdByName.get(p.brand)
    const categoryId = categoryIdBySlug.get(p.categorySlug)
    if (!brandId || !categoryId) {
      throw new Error(`Missing brand/category for product ${p.slug}`)
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        nameEn: p.nameEn,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        images: p.images,
        sku: p.sku,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        description: p.description,
        specs: p.specs,
        tags: p.tags,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        isFlashSale: p.isFlashSale ?? false,
        flashSaleEnd: p.flashSaleEnd ? new Date(p.flashSaleEnd) : null,
        brandId,
        categoryId,
      },
    })

    await prisma.productCompatibility.deleteMany({ where: { productId: product.id } })
    for (const c of p.compatibility) {
      await prisma.productCompatibility.create({
        data: {
          productId: product.id,
          brand: c.brand,
          model: c.model,
          generation: c.generation,
          years: c.years,
          engine: c.engine,
        },
      })
    }
  }

  await prisma.vehicleBrand.deleteMany()

  for (const v of vehicles) {
    const vehicleBrand = await prisma.vehicleBrand.create({
      data: { name: v.brand },
    })
    for (const m of v.models) {
      const model = await prisma.vehicleModel.create({
        data: { name: m.name, vehicleBrandId: vehicleBrand.id },
      })
      for (const g of m.generations) {
        await prisma.vehicleGeneration.create({
          data: { name: g.name, years: g.years, engines: g.engines, vehicleModelId: model.id },
        })
      }
    }
  }

  // Seed initial SuperAdmin
  const adminEmail = 'admin@hypergarage.com'
  const adminExists = await prisma.staff.findUnique({
    where: { email: adminEmail },
  })

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin1234', 10)
    await prisma.staff.create({
      data: {
        email: adminEmail,
        name: 'System Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    })
    console.log('Seeded default SuperAdmin: admin@hypergarage.com / admin1234')
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
