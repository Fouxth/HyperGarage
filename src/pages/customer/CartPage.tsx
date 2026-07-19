import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Minus, Plus, Trash2, ShoppingCart, Landmark, QrCode, CreditCard, Truck, Copy, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCheckout, useSettings } from '@/api/hooks'
import { formatPrice } from '@/components/shared/ProductCard'
import { rememberOrderId } from '@/lib/recentOrders'
import { localizedName } from '@/lib/localize'
import { promptPayQrDataUrl } from '@/lib/promptpay'
import BankBadge from '@/components/shared/BankBadge'

export default function CartPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { items, setQuantity, removeItem, subtotal, clear } = useCart()
  const checkout = useCheckout()
  const { data: settings } = useSettings()

  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const methods = useMemo(() => {
    const list: { value: string; label: string; icon: typeof Truck }[] = []
    if (!settings || settings.codEnabled) list.push({ value: 'cod', label: t('cart.cod', 'Cash on Delivery'), icon: Truck })
    if (!settings || settings.transferEnabled) list.push({ value: 'transfer', label: t('cart.bankTransfer', 'Bank Transfer'), icon: Landmark })
    if (!settings || settings.cardEnabled) list.push({ value: 'card', label: t('cart.card', 'Credit / Debit Card'), icon: CreditCard })
    return list
  }, [settings, t])

  // Pick the first available method once settings load (or the list changes).
  useEffect(() => {
    if (methods.length && !methods.some((m) => m.value === paymentMethod)) {
      setPaymentMethod(methods[0].value)
    }
  }, [methods, paymentMethod])

  // Generate the PromptPay QR for the current total when paying by transfer.
  useEffect(() => {
    let active = true
    if (paymentMethod === 'transfer' && settings?.promptPayId) {
      promptPayQrDataUrl(settings.promptPayId, subtotal).then((url) => {
        if (active) setQr(url)
      })
    } else {
      setQr(null)
    }
    return () => {
      active = false
    }
  }, [paymentMethod, settings?.promptPayId, subtotal])

  const copyAccount = async () => {
    if (!settings?.bankAccountNumber) return
    try {
      await navigator.clipboard.writeText(settings.bankAccountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  const handleCheckout = async () => {
    setError(null)
    if (!customer || !phone || !shippingAddress) {
      setError(t('cart.fillAllFields', 'Please fill in all fields'))
      return
    }
    if (!paymentMethod) {
      setError(t('cart.selectPayment', 'Please select a payment method'))
      return
    }
    try {
      const order = await checkout.mutateAsync({
        customer,
        phone,
        shippingAddress,
        paymentMethod,
        items: items.map((i) => ({ productId: i.product.id, variantId: i.variant?.id, quantity: i.quantity })),
      })
      rememberOrderId(order.id)
      clear()
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('cart.checkoutFailed', 'Checkout failed'))
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingCart className="h-16 w-16 text-muted" />
        <h1 className="text-xl font-bold">{t('cart.empty', 'Your cart is empty')}</h1>
        <Link to="/products" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          {t('cart.browseProducts', 'Browse Products')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('cart.title', 'Your Cart')}</h1>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const price = item.product.price + (item.variant?.priceDelta ?? 0)
              const maxStock = item.variant ? item.variant.stock : item.product.stock
              return (
                <div
                  key={`${item.product.id}::${item.variant?.id ?? ''}`}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <img
                    src={item.product.images[0]}
                    alt={localizedName(item.product, i18n.language)}
                    className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product.slug}`} className="text-sm font-semibold hover:text-primary">
                        {localizedName(item.product, i18n.language)}
                      </Link>
                      {item.variant && <p className="mt-0.5 text-xs text-muted">{item.variant.name}</p>}
                      <p className="mt-1 text-sm font-bold text-primary">{formatPrice(price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-lg border border-border">
                        <button
                          onClick={() => setQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                          className="flex h-8 w-8 items-center justify-center text-white hover:bg-card-hover"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex h-8 w-10 items-center justify-center border-x border-border text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                          disabled={item.quantity >= maxStock}
                          className="flex h-8 w-8 items-center justify-center text-white hover:bg-card-hover disabled:text-muted"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                        className="flex items-center gap-1 text-xs text-muted hover:text-primary"
                      >
                        <Trash2 size={14} />
                        {t('cart.remove', 'Remove')}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="h-fit rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">{t('cart.checkout', 'Checkout')}</h2>
            <div className="mt-4 space-y-3">
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder={t('cart.name', 'Full name')}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('cart.phone', 'Phone number')}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={t('cart.address', 'Shipping address')}
                rows={3}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
              />

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  {t('cart.paymentMethod', 'Payment method')}
                </p>
                <div className="space-y-2">
                  {methods.map((m) => {
                    const Icon = m.icon
                    const active = paymentMethod === m.value
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setPaymentMethod(m.value)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                          active ? 'border-primary bg-primary/10 text-white' : 'border-border bg-bg text-muted-light hover:border-primary/50'
                        }`}
                      >
                        <Icon size={18} className={active ? 'text-primary' : 'text-muted'} />
                        <span className="font-medium">{m.label}</span>
                        <span className={`ml-auto h-3.5 w-3.5 rounded-full border ${active ? 'border-primary bg-primary' : 'border-border'}`} />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bank transfer / PromptPay details */}
              {paymentMethod === 'transfer' && settings && (
                <div className="rounded-lg border border-border bg-bg p-3 text-sm">
                  {(settings.bankName || settings.bankAccountNumber) && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                        <Landmark size={14} /> {t('cart.bankAccount', 'Bank account')}
                      </div>
                      {settings.bankName && (
                        <div className="flex items-center gap-2">
                          <BankBadge bankName={settings.bankName} size={24} />
                          <p className="text-muted-light">{settings.bankName}</p>
                        </div>
                      )}
                      {settings.bankAccountName && <p className="text-white">{settings.bankAccountName}</p>}
                      {settings.bankAccountNumber && (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold tracking-wider text-primary">{settings.bankAccountNumber}</span>
                          <button type="button" onClick={copyAccount} className="text-muted hover:text-primary" title={t('cart.copy', 'Copy')}>
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {qr && (
                    <div className="mt-3 flex flex-col items-center gap-2 border-t border-border pt-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                        <QrCode size={14} /> {t('cart.promptPay', 'PromptPay QR')}
                      </div>
                      <img src={qr} alt="PromptPay QR" className="h-40 w-40 rounded-lg bg-white p-2" />
                      <p className="text-center text-xs text-muted">{t('cart.scanToPay', 'Scan with your banking app to pay')} {formatPrice(subtotal)}</p>
                    </div>
                  )}
                  <p className="mt-3 border-t border-border pt-2 text-xs text-muted">
                    {t('cart.transferNote', 'After transferring, keep your slip. We will confirm your payment shortly.')}
                  </p>
                </div>
              )}

              {/* Card payment — demo placeholder, no real processing */}
              {paymentMethod === 'card' && (
                <div className="rounded-lg border border-dashed border-border bg-bg p-3 text-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    <CreditCard size={14} /> {t('cart.card', 'Credit / Debit Card')}
                  </div>
                  <div className="mt-2 space-y-2 opacity-60">
                    <div className="rounded-md border border-border bg-card px-3 py-2 font-mono text-muted">•••• •••• •••• ••••</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-md border border-border bg-card px-3 py-2 font-mono text-muted">MM / YY</div>
                      <div className="rounded-md border border-border bg-card px-3 py-2 font-mono text-muted">CVV</div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-amber-500">
                    {t('cart.cardDemo', 'Card payment is a demo. No card details are collected or charged — the order is recorded as pending payment.')}
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="rounded-lg border border-border bg-bg p-3 text-xs text-muted">
                  {t('cart.codNote', 'Pay in cash when your order is delivered.')}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted">{t('cart.subtotal', 'Subtotal')}</span>
              <span className="font-bold text-primary">{formatPrice(subtotal)}</span>
            </div>

            {settings?.paymentNote && paymentMethod !== 'cod' && (
              <p className="mt-2 text-xs text-muted">{settings.paymentNote}</p>
            )}

            {error && <p className="mt-3 text-xs text-primary">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={checkout.isPending}
              className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {checkout.isPending ? t('cart.placingOrder', 'Placing order…') : t('cart.placeOrder', 'Place Order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
