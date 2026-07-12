import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Zap, Ticket } from 'lucide-react'
import { useProducts, useCoupons } from '@/api/hooks'
import ProductCard from '@/components/shared/ProductCard'

export default function PromotionsPage() {
  const { t } = useTranslation()
  const { data: flashSaleProducts = [] } = useProducts({ flashSale: true })
  const { data: coupons = [] } = useCoupons()
  const activeCoupons = coupons.filter((c) => c.active && (!c.expiresAt || new Date(c.expiresAt) > new Date()))

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('promotions.title', 'Promotions')}</h1>

        {activeCoupons.length > 0 && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Ticket className="h-5 w-5 text-primary" /> {t('promotions.coupons', 'Coupon Codes')}
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {activeCoupons.map((c) => (
                <div key={c.id} className="rounded-xl border border-primary/30 bg-card p-4 text-center">
                  <p className="font-mono text-lg font-bold text-primary">{c.code}</p>
                  <p className="mt-1 text-sm text-muted-light">
                    {c.type === 'percent' ? `${c.value}% off` : `฿${c.value} off`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Zap className="h-5 w-5 text-primary" /> {t('promotions.flashSale', 'Flash Sale')}
          </h2>
          {flashSaleProducts.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {flashSaleProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`}>
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">{t('promotions.none', 'No active promotions right now — check back soon.')}</p>
          )}
        </section>
      </div>
    </div>
  )
}
