import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Package, User } from 'lucide-react'
import { useOrders } from '@/api/hooks'
import { formatPrice } from '@/components/shared/ProductCard'

const statusColor: Record<string, string> = {
  pending: 'text-warning',
  processing: 'text-primary',
  shipped: 'text-primary',
  delivered: 'text-success',
  cancelled: 'text-muted',
}

export default function AccountPage() {
  const { t } = useTranslation()
  const [phone, setPhone] = useState('')
  const [searchedPhone, setSearchedPhone] = useState('')

  const { data: orders = [], isFetching } = useOrders(searchedPhone ? { phone: searchedPhone } : undefined, {
    enabled: !!searchedPhone,
  })

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <User className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('account.title', 'My Orders')}</h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          {t('account.noAuth', 'No account needed — look up your orders by phone number.')}
        </p>
        <p className="mt-2 text-sm text-muted">
          หรือ{' '}
          <Link to="/account/login" className="text-primary hover:underline">
            เข้าสู่ระบบ
          </Link>{' '}
          /{' '}
          <Link to="/account/register" className="text-primary hover:underline">
            สมัครสมาชิก
          </Link>{' '}
          เพื่อบันทึกที่อยู่และดูประวัติการสั่งซื้อแบบถาวร
        </p>

        <div className="mt-6 flex gap-2">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchedPhone(phone)}
            placeholder={t('account.phonePlaceholder', 'Enter phone number used at checkout')}
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={() => setSearchedPhone(phone)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Search size={16} />
            {t('account.lookup', 'Look Up')}
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {searchedPhone && isFetching && <p className="text-sm text-muted">Loading…</p>}
          {searchedPhone && !isFetching && orders.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Package className="h-12 w-12 text-muted" />
              <p className="text-sm text-muted">{t('account.noOrders', 'No orders found')}</p>
            </div>
          )}
          {searchedPhone &&
            orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-border-light"
              >
                <div>
                  <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                  <p className={`mt-1 text-xs font-medium capitalize ${statusColor[order.status] ?? 'text-muted'}`}>
                    {order.status}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
