import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { useProducts } from '@/api/hooks'
import ProductCard from '@/components/shared/ProductCard'

export default function WishlistPage() {
  const { t } = useTranslation()
  const { ids } = useWishlist()
  const { data: allProducts = [], isLoading } = useProducts()
  const products = allProducts.filter((p) => ids.includes(p.id))

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('wishlist.title', 'Wishlist')}</h1>
        <p className="mt-1 text-sm text-muted">
          {isLoading ? 'Loading…' : `${products.length} ${t('wishlist.items', 'items')}`}
        </p>

        {!isLoading && products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <Heart className="h-16 w-16 text-muted" />
            <h2 className="text-lg font-semibold">{t('wishlist.empty', 'Your wishlist is empty')}</h2>
            <Link to="/products" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
              {t('wishlist.browseProducts', 'Browse Products')}
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
