import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useBrands } from '@/api/hooks'

const countryFlags: Record<string, string> = {
  Thailand: '🇹🇭',
  Japan: '🇯🇵',
  Italy: '🇮🇹',
  USA: '🇺🇸',
  Germany: '🇩🇪',
  UK: '🇬🇧',
  France: '🇫🇷',
  Korea: '🇰🇷',
}

export default function BrandsPage() {
  const { t } = useTranslation()
  const { data: brands = [], isLoading } = useBrands()

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t('home.topBrands', 'Brands')}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isLoading ? 'Loading…' : `${brands.length} brands`}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.slug}`}
              className="hover-lift group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[11px] font-extrabold tracking-wider text-white transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {brand.name.slice(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm truncate">{brand.name}</h3>
                <p className="mt-0.5 text-xs text-muted truncate">
                  {countryFlags[brand.country] ?? '🌐'} {brand.country}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{brand.productCount} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
