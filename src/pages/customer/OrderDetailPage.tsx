import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Package } from 'lucide-react'
import { useOrder } from '@/api/hooks'
import { formatPrice } from '@/components/shared/ProductCard'

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrderDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(id)

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted">Loading…</div>
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Package className="h-16 w-16 text-muted" />
        <h1 className="text-xl font-bold">{t('order.notFound', 'Order not found')}</h1>
        <Link to="/" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          {t('order.backHome', 'Back to Home')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="h-14 w-14 text-success" />
          <h1 className="text-2xl font-bold">{t('order.placed', 'Order Placed!')}</h1>
          <p className="text-sm text-muted">
            {t('order.number', 'Order Number')}: <span className="font-mono font-semibold text-white">{order.orderNumber}</span>
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{t('order.status', 'Status')}</span>
            <span className="rounded-full bg-white/5 px-3 py-1 font-semibold capitalize">
              {statusLabel[order.status] ?? order.status}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted">{t('order.customer', 'Customer')}</span>
            <span>{order.customer} · {order.phone}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted">{t('order.address', 'Shipping Address')}</span>
            <span className="max-w-[60%] text-right">{order.shippingAddress}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted">{t('order.payment', 'Payment')}</span>
            <span className="capitalize">{order.paymentMethod} · {order.paymentStatus}</span>
          </div>

          <div className="mt-5 space-y-3 border-t border-border pt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.productImage && (
                  <img src={item.productImage} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <Link to={`/product/${item.productSlug}`} className="text-sm font-medium hover:text-primary">
                    {item.productName}
                  </Link>
                  <p className="text-xs text-muted">
                    {item.quantity} × {formatPrice(item.priceEach)}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.quantity * item.priceEach)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">{t('order.total', 'Total')}</span>
            <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/products" className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-white/5">
            {t('order.continueShopping', 'Continue Shopping')}
          </Link>
          <Link to="/account" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            {t('order.viewAllOrders', 'View My Orders')}
          </Link>
        </div>
      </div>
    </div>
  )
}
