import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  ChevronRight,
  Package,
  Shield,
  Truck,
  ArrowLeft,
} from 'lucide-react'
import { useProduct, useProducts, useProductReviews, useCreateReview } from '@/api/hooks'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import type { Product } from '@/types'

// --- Tabs ---
type TabKey = 'specs' | 'compatibility' | 'reviews'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'specs', label: 'Specifications' },
  { key: 'compatibility', label: 'Compatibility' },
  { key: 'reviews', label: 'Reviews' },
]

// --- Stars component ---
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const half = !filled && i < rating
        return (
          <Star
            key={i}
            size={size}
            className={
              filled
                ? 'fill-yellow-400 text-yellow-400'
                : half
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'text-border-light'
            }
          />
        )
      })}
    </div>
  )
}

// --- Stock badge ---
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-error/15 px-3 py-1 text-sm font-medium text-error">
        <span className="h-2 w-2 rounded-full bg-error" />
        Out of Stock
      </span>
    )
  }
  if (stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-sm font-medium text-warning">
        <span className="h-2 w-2 animate-pulse rounded-full bg-warning" />
        Low Stock — {stock} left
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-sm font-medium text-success">
      <span className="h-2 w-2 rounded-full bg-success" />
      In Stock
    </span>
  )
}

// --- Related product card ---
function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="hover-lift group block min-w-[220px] flex-shrink-0 overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="aspect-square w-full bg-gradient-to-br from-card-hover to-bg-elevated">
        {product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-muted">
          {product.brand}
        </p>
        <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-white">
          {product.name}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary">
            ฿{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">
              ฿{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ==========================================================================
// ProductPage
// ==========================================================================
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()

  const { data: product, isLoading } = useProduct(slug)
  const { data: sameCategoryProducts = [] } = useProducts(
    { category: product?.categorySlug },
    { enabled: !!product },
  )
  const { data: reviews = [] } = useProductReviews(product?.id)

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<TabKey>('specs')
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' })
  const createReview = useCreateReview()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const wishlisted = product ? has(product.id) : false

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // --- Not found ---
  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Package size={64} className="mx-auto mb-4 text-muted" />
          <h1 className="mb-2 text-2xl font-bold text-white">
            Product Not Found
          </h1>
          <p className="mb-6 text-muted">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </motion.div>
      </div>
    )
  }

  // --- Derived ---
  const relatedProducts = sameCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const thumbnailImages =
    product.images.length >= 4
      ? product.images.slice(0, 4)
      : [
          ...product.images,
          ...Array(4 - product.images.length).fill(null),
        ]

  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1))
  const handleIncrement = () =>
    setQuantity((q) => Math.min(product.stock, q + 1))

  // ========================================================================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-bg"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ---- Breadcrumb ---- */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
          <Link to="/" className="transition-colors hover:text-white">
            {t('nav.home', 'Home')}
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/products?category=${product.categorySlug}`}
            className="transition-colors hover:text-white"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">{product.name}</span>
        </nav>

        {/* ---- Product hero: image + info ---- */}
        <div className="mb-16 grid gap-10 lg:grid-cols-5">
          {/* Left – Gallery (3/5 = 60 %) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            {/* Main image */}
            <div className="glass mb-4 overflow-hidden rounded-xl">
              <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-card-hover via-card to-bg-elevated">
                {product.images[selectedImage] && (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
                {product.discount && (
                  <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {thumbnailImages.map((img: string | null, i: number) => (
                <button
                  key={i}
                  onClick={() => img && setSelectedImage(i)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === i
                      ? 'border-primary'
                      : 'border-border hover:border-border-light'
                  } bg-gradient-to-br from-card-hover to-bg-elevated`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={20} className="text-muted" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right – Info (2/5 = 40 %) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5 lg:col-span-2"
          >
            {/* Brand */}
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Stars rating={product.rating} />
              <span className="text-sm text-muted">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-muted">
                ({product.reviewCount.toLocaleString()}{' '}
                {t('product.reviews', 'reviews')})
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-3xl font-extrabold text-primary">
                ฿{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted line-through">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="rounded-md bg-primary/15 px-2.5 py-0.5 text-sm font-bold text-primary">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="self-start">
              <StockBadge stock={product.stock} />
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-light">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted">
                {t('product.quantity', 'Quantity')}
              </span>
              <div className="flex items-center overflow-hidden rounded-lg border border-border">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-card-hover disabled:text-muted"
                >
                  <Minus size={16} />
                </button>
                <span className="flex h-10 w-12 items-center justify-center border-x border-border text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-card-hover disabled:text-muted"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                disabled={product.stock === 0}
                onClick={() => addItem(product, quantity)}
                className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <ShoppingCart size={20} />
                {t('product.addToCart', 'Add to Cart')}
              </button>

              <div className="flex gap-3">
                <button
                  disabled={product.stock === 0}
                  onClick={() => {
                    addItem(product, quantity)
                    navigate('/cart')
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5 disabled:opacity-40"
                >
                  <Zap size={16} />
                  {t('product.buyNow', 'Buy Now')}
                </button>
                <button
                  onClick={() => toggle(product.id)}
                  className={`flex items-center justify-center rounded-xl border px-4 py-3 transition-colors ${
                    wishlisted
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border text-muted hover:border-primary/40 hover:text-primary'
                  }`}
                  title={wishlisted ? t('product.wishlisted', 'Wishlisted') : t('product.addWishlist', 'Add to Wishlist')}
                >
                  <Heart size={18} className={wishlisted ? 'fill-primary' : ''} />
                </button>
              </div>
            </div>

            {/* Meta info */}
            <div className="mt-2 space-y-2 border-t border-border pt-4 text-sm text-muted">
              <p>
                <span className="text-muted-light">SKU:</span> {product.sku}
              </p>
              <p>
                <span className="text-muted-light">
                  {t('product.category', 'Category')}:
                </span>{' '}
                <Link
                  to={`/products?category=${product.categorySlug}`}
                  className="text-white hover:text-primary"
                >
                  {product.category}
                </Link>
              </p>
              <p>
                <span className="text-muted-light">
                  {t('product.brand', 'Brand')}:
                </span>{' '}
                <span className="text-white">{product.brand}</span>
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: 'Genuine' },
                { icon: Truck, label: 'Free Ship' },
                { icon: Package, label: 'Easy Return' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-2 py-3 text-center"
                >
                  <Icon size={18} className="text-primary" />
                  <span className="text-xs text-muted-light">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ---- Tabs ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          {/* Tab headers */}
          <div className="mb-6 flex gap-0 overflow-x-auto border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                    : 'text-muted hover:text-muted-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="glass rounded-xl p-6 sm:p-8">
            {/* Specifications */}
            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-6 text-lg font-bold text-white">
                  Technical Specifications
                </h3>
                <div className="overflow-hidden rounded-lg border border-border">
                  {Object.entries(product.specs).map(
                    ([key, value], i) => (
                      <div
                        key={key}
                        className={`flex ${
                          i % 2 === 0 ? 'bg-card' : 'bg-card-hover'
                        }`}
                      >
                        <span className="w-1/3 shrink-0 border-r border-border px-5 py-3.5 text-sm font-medium text-muted-light sm:w-1/4">
                          {key}
                        </span>
                        <span className="px-5 py-3.5 text-sm text-white">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </motion.div>
            )}

            {/* Compatibility */}
            {activeTab === 'compatibility' && (
              <motion.div
                key="compatibility"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-6 text-lg font-bold text-white">
                  Vehicle Compatibility
                </h3>
                {product.compatibility.length === 0 ? (
                  <p className="text-sm text-muted">
                    No compatibility data available.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border bg-card">
                          <th className="px-5 py-3 font-semibold text-muted-light">
                            Brand
                          </th>
                          <th className="px-5 py-3 font-semibold text-muted-light">
                            Model
                          </th>
                          <th className="px-5 py-3 font-semibold text-muted-light">
                            Generation
                          </th>
                          <th className="px-5 py-3 font-semibold text-muted-light">
                            Year
                          </th>
                          <th className="px-5 py-3 font-semibold text-muted-light">
                            Engine
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.compatibility.map((v, i) => (
                          <tr
                            key={i}
                            className={`border-b border-border last:border-0 ${
                              i % 2 === 0 ? 'bg-card' : 'bg-card-hover'
                            }`}
                          >
                            <td className="px-5 py-3 text-white">
                              {v.brand}
                            </td>
                            <td className="px-5 py-3 text-white">
                              {v.model}
                            </td>
                            <td className="px-5 py-3 text-white">
                              {v.generation}
                            </td>
                            <td className="px-5 py-3 text-muted-light">
                              {v.years}
                            </td>
                            <td className="px-5 py-3 text-muted-light">
                              {v.engine}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-6 text-lg font-bold text-white">
                  Customer Reviews
                </h3>

                {/* Summary */}
                <div className="mb-8 grid gap-8 sm:grid-cols-2">
                  {/* Average */}
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6">
                    <span className="text-5xl font-extrabold text-white">
                      {product.rating.toFixed(1)}
                    </span>
                    <Stars rating={product.rating} size={20} />
                    <span className="text-sm text-muted">
                      {product.reviewCount.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* Breakdown */}
                  <div className="flex flex-col justify-center gap-2.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter((r) => r.rating === stars).length
                      const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="w-8 text-right text-sm text-muted-light">
                            {stars}
                            <Star
                              size={11}
                              className="mb-0.5 ml-0.5 inline fill-yellow-400 text-yellow-400"
                            />
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                            <div
                              className="h-full rounded-full bg-yellow-400"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-xs text-muted">
                            {percent}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Submit a review */}
                <form
                  className="mb-8 space-y-4 rounded-xl border border-border bg-card p-5"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!product || !reviewForm.userName.trim() || !reviewForm.comment.trim()) return
                    createReview.mutate(
                      {
                        productId: product.id,
                        userName: reviewForm.userName.trim(),
                        rating: reviewForm.rating,
                        comment: reviewForm.comment.trim(),
                      },
                      { onSuccess: () => setReviewForm({ userName: '', rating: 5, comment: '' }) }
                    )
                  }}
                >
                  <h4 className="text-sm font-bold text-white">{t('product.writeReview', 'Write a review')}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{t('product.yourRating', 'Your rating')}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                          aria-label={`${n} star`}
                        >
                          <Star
                            size={20}
                            className={n <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    value={reviewForm.userName}
                    onChange={(e) => setReviewForm((f) => ({ ...f, userName: e.target.value }))}
                    placeholder={t('product.yourName', 'Your name') as string}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                  <textarea
                    required
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder={t('product.yourReview', 'Share your experience with this product') as string}
                    className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={createReview.isPending}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {createReview.isPending
                      ? t('product.submittingReview', 'Submitting...')
                      : t('product.submitReview', 'Submit review')}
                  </button>
                </form>

                {/* Review list */}
                {reviews.length === 0 ? (
                  <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted">
                    {t('product.noReviews', 'No reviews yet — be the first to review this product.')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-border bg-card p-5"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {review.userName}
                              </p>
                              <p className="text-xs text-muted">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Stars rating={review.rating} size={14} />
                        </div>
                        <p className="text-sm leading-relaxed text-muted-light">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ---- Related Products ---- */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="mb-6 text-xl font-bold text-white">
              {t('product.related', 'Related Products')}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {relatedProducts.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  )
}
