import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Truck,
  RefreshCcw,
  Banknote,
  Heart,
  ShoppingCart,
  Star,
  Search,
  ChevronRight,
  Zap,
  ArrowRight,
  Send,
} from 'lucide-react'
import { products, categories, brands, vehicles } from '@/data'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatPrice = (price: number) => `฿${price.toLocaleString()}`

const useCountdown = (targetDate: Date) => {
  const calc = () => {
    const diff = Math.max(0, targetDate.getTime() - Date.now())
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return time
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

const Section = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <section className={`px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="mx-auto max-w-7xl">{children}</div>
  </section>
)

const SectionHeader = ({
  title,
  href,
  viewAllLabel,
}: {
  title: string
  href: string
  viewAllLabel: string
}) => (
  <div className="mb-8 flex items-center justify-between">
    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    <Link
      to={href}
      className="group flex items-center gap-1 text-sm font-medium text-muted-light transition-colors hover:text-white"
    >
      {viewAllLabel}
      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  </div>
)

// ---------------------------------------------------------------------------
// 1. Hero Banner
// ---------------------------------------------------------------------------

const HeroBanner = () => {
  const { t } = useTranslation()
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      {/* background gradient (no actual image) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0000] to-[#2a0008]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(214,0,28,0.15),transparent)]" />
      {/* subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-7xl"
          >
            <span className="block">{t('hero.title1')}</span>
            <span className="gradient-text block">{t('hero.title2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-light sm:text-xl"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/products"
              className="gradient-primary inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
            >
              {t('hero.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
            >
              {t('hero.explore')}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {[
              { stat: '2,000+', label: 'Products' },
              { stat: '50+', label: 'Brands' },
              { stat: '4.9★', label: 'Rating' },
              { stat: '1–3 days', label: 'Delivery' },
            ].map(({ stat, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
              >
                <span className="text-sm font-semibold text-white">{stat}</span>
                <span className="text-xs text-muted-light">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  )
}

// ---------------------------------------------------------------------------
// 2. Compatibility Checker
// ---------------------------------------------------------------------------

const CompatibilityChecker = () => {
  const { t } = useTranslation()

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedGen, setSelectedGen] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedEngine, setSelectedEngine] = useState('')

  const brandList = vehicles.map((v) => v.brand)

  const modelList = useMemo(() => {
    const v = vehicles.find((v) => v.brand === selectedBrand)
    return v ? v.models.map((m) => m.name) : []
  }, [selectedBrand])

  const genList = useMemo(() => {
    const v = vehicles.find((v) => v.brand === selectedBrand)
    const m = v?.models.find((m) => m.name === selectedModel)
    return m ? m.generations.map((g) => g.name) : []
  }, [selectedBrand, selectedModel])

  const selectedGenData = useMemo(() => {
    const v = vehicles.find((v) => v.brand === selectedBrand)
    const m = v?.models.find((m) => m.name === selectedModel)
    return m?.generations.find((g) => g.name === selectedGen)
  }, [selectedBrand, selectedModel, selectedGen])

  const yearList = useMemo(() => {
    if (!selectedGenData) return []
    const [start, end] = selectedGenData.years.split('-')
    const years: string[] = []
    for (let y = parseInt(start); y <= parseInt(end); y++) years.push(String(y))
    return years
  }, [selectedGenData])

  const engineList = useMemo(() => {
    return selectedGenData ? selectedGenData.engines : []
  }, [selectedGenData])

  const resetFrom = (level: number) => {
    if (level <= 1) setSelectedModel('')
    if (level <= 2) setSelectedGen('')
    if (level <= 3) setSelectedYear('')
    if (level <= 4) setSelectedEngine('')
  }

  const selectClass =
    'w-full appearance-none rounded-lg border border-border bg-bg px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <Section className="-mt-16 relative z-20 pb-12">
      <div className="glass-strong rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold sm:text-xl">{t('compatibility.title')}</h2>
          <p className="mt-1 text-sm text-muted">{t('compatibility.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-light">
              {t('compatibility.brand')}
            </label>
            <select
              className={selectClass}
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value)
                resetFrom(1)
              }}
            >
              <option value="">{t('compatibility.selectBrand')}</option>
              {brandList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-light">
              {t('compatibility.model')}
            </label>
            <select
              className={selectClass}
              value={selectedModel}
              disabled={!selectedBrand}
              onChange={(e) => {
                setSelectedModel(e.target.value)
                resetFrom(2)
              }}
            >
              <option value="">{t('compatibility.selectModel')}</option>
              {modelList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Generation */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-light">
              {t('compatibility.generation')}
            </label>
            <select
              className={selectClass}
              value={selectedGen}
              disabled={!selectedModel}
              onChange={(e) => {
                setSelectedGen(e.target.value)
                resetFrom(3)
              }}
            >
              <option value="">{t('compatibility.selectGen')}</option>
              {genList.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-light">
              {t('compatibility.year')}
            </label>
            <select
              className={selectClass}
              value={selectedYear}
              disabled={!selectedGen}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">{t('compatibility.selectYear')}</option>
              {yearList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Engine */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-light">
              {t('compatibility.engine')}
            </label>
            <select
              className={selectClass}
              value={selectedEngine}
              disabled={!selectedGen}
              onChange={(e) => setSelectedEngine(e.target.value)}
            >
              <option value="">{t('compatibility.selectEngine')}</option>
              {engineList.map((eng) => (
                <option key={eng} value={eng}>
                  {eng}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex items-end">
            <Link
              to={`/products${selectedBrand ? `?brand=${selectedBrand}` : ''}${selectedModel ? `&model=${selectedModel}` : ''}${selectedGen ? `&gen=${selectedGen}` : ''}${selectedEngine ? `&engine=${selectedEngine}` : ''}`}
              className="gradient-primary flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              <Search className="h-4 w-4" />
              {t('compatibility.search')}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 3. Guarantee Bar
// ---------------------------------------------------------------------------

const GuaranteeBar = () => {
  const { t } = useTranslation()
  const items = [
    { icon: ShieldCheck, title: t('home.guarantee.authentic'), desc: t('home.guarantee.authenticDesc') },
    { icon: Truck, title: t('home.guarantee.shipping'), desc: t('home.guarantee.shippingDesc') },
    { icon: RefreshCcw, title: t('home.guarantee.returns'), desc: t('home.guarantee.returnsDesc') },
    { icon: Banknote, title: t('home.guarantee.cod'), desc: t('home.guarantee.codDesc') },
  ]

  return (
    <Section className="py-12">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-light"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{title}</p>
              <p className="mt-0.5 text-xs text-muted truncate">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 4. Categories Grid
// ---------------------------------------------------------------------------

const CategoriesGrid = () => {
  const { t } = useTranslation()

  return (
    <Section className="py-16">
      <SectionHeader
        title={t('home.categories')}
        href="/categories"
        viewAllLabel={t('home.viewAll')}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="hover-lift group relative block aspect-[4/3] overflow-hidden rounded-xl border border-border"
          >
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.nameEn}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-card" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/90" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-semibold text-white leading-tight">{cat.nameEn}</h3>
              <p className="mt-0.5 text-xs text-white/55">{cat.productCount} products</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 5. Featured Products
// ---------------------------------------------------------------------------

const ProductCard = ({
  product,
}: {
  product: (typeof products)[number]
}) => {
  const { t } = useTranslation()
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <div className="hover-lift group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-light">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-card to-bg-elevated">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.nameEn}
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
            setWishlisted(!wishlisted)
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? 'fill-primary text-primary' : ''}`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">
          {product.nameEn}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-white">
          <ShoppingCart className="h-4 w-4" />
          {t('product.addToCart')}
        </button>
      </div>
    </div>
  )
}

const FeaturedProducts = () => {
  const { t } = useTranslation()
  const featured = products.filter((p) => p.isFeatured)

  return (
    <Section className="py-16">
      <SectionHeader
        title={t('home.featuredProducts')}
        href="/products?featured=true"
        viewAllLabel={t('home.viewAll')}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((p) => (
          <Link key={p.id} to={`/product/${p.slug}`}>
            <ProductCard product={p} />
          </Link>
        ))}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 6. Flash Sale
// ---------------------------------------------------------------------------

const FlashSale = () => {
  const { t } = useTranslation()
  const flashProducts = products.filter((p) => p.isFlashSale)

  // countdown to a future date (7 days from now, keeps ticking)
  const target = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    d.setHours(23, 59, 59, 0)
    return d
  }, [])

  const countdown = useCountdown(target)

  const pad = (n: number) => String(n).padStart(2, '0')

  if (flashProducts.length === 0) return null

  return (
    <Section className="py-16">
      <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">{t('home.flashSale')}</h2>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-light">{t('home.endsIn')}</span>
            {[
              { val: countdown.days, label: 'D' },
              { val: countdown.hours, label: 'H' },
              { val: countdown.minutes, label: 'M' },
              { val: countdown.seconds, label: 'S' },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-lg bg-black/40 px-3 py-2"
              >
                <span className="text-lg font-bold tabular-nums">{pad(val)}</span>
                <span className="text-[10px] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {flashProducts.map((p) => (
            <Link key={p.id} to={`/product/${p.slug}`}>
              <ProductCard product={p} />
            </Link>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 7. Top Brands
// ---------------------------------------------------------------------------

const countryFlags: Record<string, string> = {
  Japan: '🇯🇵',
  Italy: '🇮🇹',
  USA: '🇺🇸',
  Germany: '🇩🇪',
  UK: '🇬🇧',
  France: '🇫🇷',
  Korea: '🇰🇷',
}

const TopBrands = () => {
  const { t } = useTranslation()

  return (
    <Section className="py-16">
      <SectionHeader
        title={t('home.topBrands')}
        href="/brands"
        viewAllLabel={t('home.viewAll')}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to={`/brand/${brand.slug}`}
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
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 8. Newsletter CTA
// ---------------------------------------------------------------------------

const Newsletter = () => {
  const [email, setEmail] = useState('')

  return (
    <Section className="py-16">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card border border-border">
        <div className="relative px-6 py-16 text-center sm:px-12">
          {/* decorative glow */}
          <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 bg-primary/20 blur-[100px]" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stay in the Fast Lane
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-light">
              Get exclusive deals, new arrivals, and performance tips delivered to your inbox.
            </p>

            <div className="mx-auto mt-8 flex max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-border bg-bg px-4 py-3 text-sm text-white placeholder-muted outline-none transition-colors focus:border-primary"
              />
              <button className="gradient-primary flex shrink-0 items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      <HeroBanner />
      <CompatibilityChecker />
      <GuaranteeBar />
      <CategoriesGrid />
      <FeaturedProducts />
      <FlashSale />
      <TopBrands />
      <Newsletter />
      {/* bottom spacer */}
      <div className="h-16" />
    </main>
  )
}
