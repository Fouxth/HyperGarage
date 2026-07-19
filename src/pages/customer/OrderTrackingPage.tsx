import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Search, PackageSearch, Clock, PackageCheck, Truck, CheckCircle2, XCircle } from 'lucide-react'
import { useOrders } from '@/api/hooks'
import { getRememberedOrderIds } from '@/lib/recentOrders'
import { formatPrice } from '@/components/shared/ProductCard'
import type { Order } from '@/types'

const flow: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered']
const stepIcon = { pending: Clock, processing: PackageCheck, shipped: Truck, delivered: CheckCircle2 }

const statusText: Record<string, { th: string; en: string }> = {
  pending: { th: 'รอดำเนินการ', en: 'Pending' },
  processing: { th: 'กำลังเตรียมสินค้า', en: 'Processing' },
  shipped: { th: 'จัดส่งแล้ว', en: 'Shipped' },
  delivered: { th: 'ได้รับสินค้าแล้ว', en: 'Delivered' },
  cancelled: { th: 'ยกเลิกแล้ว', en: 'Cancelled' },
}

function Timeline({ status, lang }: { status: Order['status']; lang: 'th' | 'en' }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
        <XCircle className="w-4 h-4" /> {statusText.cancelled[lang]}
      </div>
    )
  }
  const currentIdx = flow.indexOf(status)
  return (
    <div className="flex items-center">
      {flow.map((s, i) => {
        const Icon = stepIcon[s as keyof typeof stepIcon]
        const done = i <= currentIdx
        return (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${done ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-card text-muted'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[11px] text-center ${done ? 'text-white font-medium' : 'text-muted'}`}>{statusText[s][lang]}</span>
            </div>
            {i < flow.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIdx ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        )
      })}
    </div>
  )
}

export default function OrderTrackingPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('th') ? 'th' : 'en'
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState<{ phone?: string; orderNumber?: string } | null>(null)

  const rememberedIds = getRememberedOrderIds()
  const { data: allOrders = [] } = useOrders()
  const remembered = allOrders.filter((o) => rememberedIds.includes(o.id))

  const { data: results = [], isFetching } = useOrders(search ?? undefined)

  const runSearch = () => {
    const q = query.trim()
    if (!q) return setSearch(null)
    // A 9-10 digit string is treated as a phone number; anything else as an order number.
    if (/^\d{9,10}$/.test(q)) setSearch({ phone: q })
    else setSearch({ orderNumber: q })
  }

  const orders = search ? results : remembered

  return (
    <div className="min-h-screen bg-bg py-8 md:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('order.backHome')}</span>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <PackageSearch className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('footer.orderTracking')}</h1>
        </div>
        <p className="text-sm text-muted mb-6">
          {lang === 'th' ? 'กรอกหมายเลขคำสั่งซื้อ หรือเบอร์โทรศัพท์ที่ใช้ตอนสั่งซื้อ เพื่อดูสถานะล่าสุด' : 'Enter your order number or the phone number used at checkout to see the latest status.'}
        </p>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder={lang === 'th' ? 'เช่น HGXXXXXX หรือ 08XXXXXXXX' : 'e.g. HGXXXXXX or 08XXXXXXXX'}
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button onClick={runSearch} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Search size={16} /> {lang === 'th' ? 'ค้นหา' : 'Track'}
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {!search && remembered.length > 0 && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {lang === 'th' ? 'คำสั่งซื้อจากอุปกรณ์นี้' : 'Orders from this device'}
            </p>
          )}
          {isFetching && <p className="text-sm text-muted">{lang === 'th' ? 'กำลังค้นหา…' : 'Searching…'}</p>}
          {!isFetching && orders.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <PackageSearch className="h-12 w-12 text-muted" />
              <p className="text-sm text-muted">
                {search
                  ? lang === 'th' ? 'ไม่พบคำสั่งซื้อที่ตรงกัน' : 'No matching orders found'
                  : lang === 'th' ? 'ยังไม่มีคำสั่งซื้อ ลองค้นหาด้วยหมายเลขหรือเบอร์โทร' : 'No orders yet. Try searching by number or phone.'}
              </p>
            </div>
          )}
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <p className="font-mono text-sm font-semibold text-white">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} {lang === 'th' ? 'รายการ' : 'items'} · {formatPrice(order.total)}
                  </p>
                </div>
                <Link to={`/orders/${order.id}`} className="text-xs font-semibold text-primary hover:underline whitespace-nowrap">
                  {lang === 'th' ? 'ดูรายละเอียด' : 'View details'}
                </Link>
              </div>
              <Timeline status={order.status} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
