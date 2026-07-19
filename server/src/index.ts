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
import { authRouter } from './routes/auth.js'
import { staffRouter } from './routes/staff.js'
import { uploadRouter } from './routes/upload.js'
import { returnsRouter } from './routes/returns.js'
import { accountRouter } from './routes/account.js'
import { customersRouter } from './routes/customers.js'
import { notificationsRouter } from './routes/notifications.js'
import { auditRouter } from './routes/audit.js'
import { backupRouter } from './routes/backup.js'

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
app.use('/api/auth', authRouter)
app.use('/api/staff', staffRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/returns', returnsRouter)
app.use('/api/account', accountRouter)
app.use('/api/customers', customersRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/audit', auditRouter)
app.use('/api/backup', backupRouter)
app.use('/uploads', express.static('uploads'))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
