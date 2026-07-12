import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, SlidersHorizontal, X, PackageX } from 'lucide-react'
import { useProducts, useCategories, useBrands } from '@/api/hooks'
import ProductCard from '@/components/shared/ProductCard'
import { localizedName } from '@/lib/localize'

const sortOptions = [
  { value: '', labelKey: 'sort.newest', fallback: 'Newest' },
  { value: 'price-asc', labelKey: 'sort.priceAsc', fallback: 'Price: Low to High' },
  { value: 'price-desc', labelKey: 'sort.priceDesc', fallback: 'Price: High to Low' },
  { value: 'rating', labelKey: 'sort.rating', fallback: 'Highest Rated' },
] as const

export default function ProductsPage() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = searchParams.get('category') ?? undefined
  const brand = searchParams.get('brand') ?? undefined
  const q = searchParams.get('q') ?? undefined
  const sort = searchParams.get('sort') ?? undefined
  const featured = searchParams.get('featured') === 'true' || undefined
  const flashSale = searchParams.get('flashSale') === 'true' || undefined
  const vehicleBrand = searchParams.get('vehicleBrand') ?? undefined
  const vehicleModel = searchParams.get('vehicleModel') ?? undefined
  const vehicleGeneration = searchParams.get('vehicleGeneration') ?? undefined
  const vehicleEngine = searchParams.get('vehicleEngine') ?? undefined

  const { data: products = [], isLoading } = useProducts({
    category,
    brand,
    q,
    sort,
    featured,
    flashSale,
    vehicleBrand,
    vehicleModel,
    vehicleGeneration,
    vehicleEngine,
  })
  const { data: categories = [] } = useCategories()
  const { data: brands = [] } = useBrands()

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const hasActiveFilters = !!(category || brand || q || featured || flashSale || vehicleBrand)

  const clearFilters = () => setSearchParams(new URLSearchParams())

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t('nav.products', 'Products')}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {isLoading ? 'Loading…' : `${products.length} products`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateParam('q', searchInput || null)
              }}
              className="relative"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('search.placeholder', 'Search products...')}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-white placeholder-muted outline-none transition-colors focus:border-primary sm:w-64"
              />
            </form>

            <select
              value={sort ?? ''}
              onChange={(e) => updateParam('sort', e.target.value || null)}
              className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey, opt.fallback)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-white transition-colors hover:border-border-light lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* Filters sidebar */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="space-y-6 rounded-xl border border-border bg-card p-5">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all filters
                </button>
              )}

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  {t('home.categories', 'Categories')}
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', category === cat.slug ? null : cat.slug)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                        category === cat.slug
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-light hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{localizedName(cat, i18n.language)}</span>
                      <span className="text-xs text-muted">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  {t('home.topBrands', 'Brands')}
                </h3>
                <div className="space-y-1">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateParam('brand', brand === b.slug ? null : b.slug)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                        brand === b.slug
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-light hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-xs text-muted">{b.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4.2] animate-pulse rounded-xl bg-card" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card py-24 text-center">
                <PackageX className="h-12 w-12 text-muted" />
                <div>
                  <p className="font-semibold text-white">No products found</p>
                  <p className="mt-1 text-sm text-muted">Try adjusting your filters or search terms.</p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <Link key={p.id} to={`/product/${p.slug}`}>
                    <ProductCard product={p} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
