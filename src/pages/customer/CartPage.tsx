import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCheckout } from '@/api/hooks'
import { formatPrice } from '@/components/shared/ProductCard'
import { rememberOrderId } from '@/lib/recentOrders'
import { localizedName } from '@/lib/localize'

export default function CartPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { items, setQuantity, removeItem, subtotal, clear } = useCart()
  const checkout = useCheckout()

  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setError(null)
    if (!customer || !phone || !shippingAddress) {
      setError(t('cart.fillAllFields', 'Please fill in all fields'))
      return
    }
    try {
      const order = await checkout.mutateAsync({
        customer,
        phone,
        shippingAddress,
        paymentMethod,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
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
            {items.map((item) => (
              <div
                key={item.product.id}
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
                    <p className="mt-1 text-sm font-bold text-primary">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center overflow-hidden rounded-lg border border-border">
                      <button
                        onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-white hover:bg-card-hover"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center border-x border-border text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="flex h-8 w-8 items-center justify-center text-white hover:bg-card-hover disabled:text-muted"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="flex items-center gap-1 text-xs text-muted hover:text-primary"
                    >
                      <Trash2 size={14} />
                      {t('cart.remove', 'Remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="cod">{t('cart.cod', 'Cash on Delivery')}</option>
                <option value="transfer">{t('cart.bankTransfer', 'Bank Transfer')}</option>
                <option value="card">{t('cart.card', 'Credit Card')}</option>
              </select>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted">{t('cart.subtotal', 'Subtotal')}</span>
              <span className="font-bold text-primary">{formatPrice(subtotal)}</span>
            </div>

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
