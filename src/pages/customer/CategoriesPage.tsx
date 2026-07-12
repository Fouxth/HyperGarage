import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCategories } from '@/api/hooks'
import { localizedName } from '@/lib/localize'

export default function CategoriesPage() {
  const { t, i18n } = useTranslation()
  const { data: categories = [], isLoading } = useCategories()

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t('home.categories', 'Categories')}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isLoading ? 'Loading…' : `${categories.length} categories`}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="hover-lift group relative block aspect-[4/3] overflow-hidden rounded-xl border border-border"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={localizedName(cat, i18n.language)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-card" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/90" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-semibold text-white leading-tight">{localizedName(cat, i18n.language)}</h3>
                <p className="mt-0.5 text-xs text-white/55">{cat.productCount} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
