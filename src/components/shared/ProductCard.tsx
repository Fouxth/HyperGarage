import { useTranslation } from 'react-i18next'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { localizedName } from '@/lib/localize'

export const formatPrice = (price: number) => `฿${price.toLocaleString()}`

export default function ProductCard({ product }: { product: Product }) {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const wishlisted = has(product.id)
  const name = localizedName(product, i18n.language)

  return (
    <div className="hover-lift group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-light">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-card to-bg-elevated">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white/10">
            {product.brand}
          </div>
        )}

        {product.discount && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">
            -{product.discount}%
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-primary text-primary' : ''}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{name}</h3>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault()
            addItem(product)
          }}
          disabled={product.stock <= 0}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/5"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}
        </button>
      </div>
    </div>
  )
}
