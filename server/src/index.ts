import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { productsRouter } from './routes/products.js'
import { categoriesRouter } from './routes/categories.js'
import { brandsRouter } from './routes/brands.js'
import { vehiclesRouter } from './routes/vehicles.js'
import { ordersRouter } from './routes/orders.js'
import { reviewsRouter } from './routes/reviews.js'
import { statsRouter } from './routes/stats.js'
import { couponsRouter } from './routes/coupons.js'
import { settingsRouter } from './routes/settings.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/brands', brandsRouter)
app.use('/api/vehicles', vehiclesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/stats', statsRouter)
app.use('/api/coupons', couponsRouter)
app.use('/api/settings', settingsRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
