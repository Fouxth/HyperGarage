import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, PackageX, Eye, X, Truck, Undo2 } from 'lucide-react'
import { useOrders, useUpdateOrderStatus, useCreateReturn } from '@/api/hooks'
import type { Order } from '@/types'
import { useTranslation } from 'react-i18next'

const carrierLabels: Record<string, string> = {
  kerry: 'Kerry Express',
  flash: 'Flash Express',
  thailand_post: 'Thailand Post (ไปรษณีย์ไทย)',
}

const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const statusTranslation: Record<Order['status'], string> = {
  pending: 'รอชำระเงิน',
  processing: 'กำลังเตรียมจัดส่ง',
  shipped: 'จัดส่งแล้ว',
  delivered: 'ส่งถึงแล้ว',
  cancelled: 'ยกเลิกคำสั่งซื้อ'
}

function statusClass(status: Order['status']) {
  switch (status) {
    case 'pending': return 'bg-warning/15 text-warning'
    case 'processing': return 'bg-primary/15 text-primary'
    case 'shipped': return 'bg-primary/15 text-primary'
    case 'delivered': return 'bg-success/15 text-success'
    case 'cancelled': return 'bg-error/15 text-error'
  }
}

export default function AdminOrdersPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<Order | null>(null)
  const [returnReason, setReturnReason] = useState('')
  const [returnSent, setReturnSent] = useState(false)

  const { data: orders = [], isLoading } = useOrders({
    status: statusFilter,
    orderNumber: search || undefined,
  })
  const updateStatus = useUpdateOrderStatus()
  const createReturn = useCreateReturn()

  const translateMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cod':
      case 'cash on delivery':
        return 'เก็บปลายทาง'
      case 'transfer':
      case 'bank transfer':
        return 'โอนเงินธนาคาร'
      case 'card':
      case 'credit card':
        return 'บัตรเครดิต'
      default:
        return method
    }
  }

  const translatePaymentStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'ยังไม่จ่าย'
      case 'paid': return 'ชำระแล้ว'
      case 'refunded': return 'คืนเงินแล้ว'
      default: return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">{t('admin.ordersPage.title')}</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={t('admin.ordersPage.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-white outline-none focus:border-primary/50"
        >
          <option value="All">{t('admin.ordersPage.allStatuses')}</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{statusTranslation[s] || s}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.orderNumCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.customerCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.itemsCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.totalCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.paymentCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.statusCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.dateCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.ordersPage.actionsCol')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 font-mono text-white font-semibold">{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    <p className="text-white font-medium">{order.customer}</p>
                    <p className="text-muted text-xs">{order.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-light">{order.items.length} รายการ</td>
                  <td className="px-5 py-3 text-white font-medium">฿{order.total.toLocaleString()}</td>
                  <td className="px-5 py-3 text-muted-light">
                    {translateMethod(order.paymentMethod)} · <span className={order.paymentStatus === 'paid' ? 'text-green-400 font-medium' : 'text-warning'}>{translatePaymentStatus(order.paymentStatus)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as Order['status'] })}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold outline-none ${statusClass(order.status)}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-card text-white">{statusTranslation[s] || s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-muted-light">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => { setSelected(order); setReturnReason(''); setReturnSent(false) }}
                      className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <PackageX className="w-10 h-10 text-muted" />
            <p className="text-muted text-sm">{t('admin.ordersPage.noOrdersMatch')}</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white font-mono">{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-sm">
              <p className="text-white font-medium">{selected.customer} · <span className="text-muted font-mono">{selected.phone}</span></p>
              <p className="text-muted-light bg-bg/50 p-3 rounded-lg border border-border/50 leading-relaxed">{selected.shippingAddress}</p>
            </div>
            {(selected.trackingNumber || selected.carrier) && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/50 bg-bg/50 p-3 text-sm">
                <Truck className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-muted-light">
                  {selected.carrier ? carrierLabels[selected.carrier] ?? selected.carrier : 'ยังไม่ระบุขนส่ง'}
                  {selected.trackingNumber && <> · เลขพัสดุ <span className="font-mono text-white">{selected.trackingNumber}</span></>}
                </span>
              </div>
            )}
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              {selected.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-white">
                    {item.productName}{item.variantName ? ` (${item.variantName})` : ''} <span className="text-muted text-xs">× {item.quantity}</span>
                  </span>
                  <span className="text-muted-light">฿{(item.priceEach * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 font-semibold">
              <span className="text-white">{t('admin.ordersPage.totalLabel')}</span>
              <span className="text-primary text-lg">฿{selected.total.toLocaleString()}</span>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              {returnSent ? (
                <p className="flex items-center gap-2 text-sm text-emerald-400"><Undo2 size={14} /> ส่งคำขอคืนสินค้าแล้ว ดูสถานะได้ที่หน้าคืนสินค้า</p>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-light">
                    <Undo2 size={13} /> แจ้งคืนสินค้า/คืนเงิน
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="เหตุผลการคืนสินค้า"
                      className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                    />
                    <button
                      disabled={!returnReason || createReturn.isPending}
                      onClick={async () => {
                        await createReturn.mutateAsync({ orderId: selected.id, reason: returnReason })
                        setReturnSent(true)
                      }}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
                    >
                      ส่งคำขอ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
