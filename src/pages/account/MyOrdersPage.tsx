import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Package, LogOut, MapPin, ChevronRight } from 'lucide-react'
import { useCustomerMe, useCustomerOrders } from '@/api/customerHooks'
import { getCustomerToken } from '@/api/customerClient'

const statusLabels: Record<string, string> = {
  pending: 'รอชำระเงิน',
  processing: 'กำลังเตรียมจัดส่ง',
  shipped: 'จัดส่งแล้ว',
  delivered: 'ส่งถึงแล้ว',
  cancelled: 'ยกเลิกคำสั่งซื้อ',
}

export default function MyOrdersPage() {
  const token = getCustomerToken()
  const navigate = useNavigate()
  const { data: me } = useCustomerMe()
  const { data: orders = [], isLoading } = useCustomerOrders()

  if (!token) return <Navigate to="/account/login" replace />

  const handleLogout = () => {
    localStorage.removeItem('hypergarage_customer_token')
    localStorage.removeItem('hypergarage_customer_user')
    navigate('/account/login')
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">สวัสดี, {me?.name}</h1>
            <p className="mt-1 text-sm text-muted">ประวัติคำสั่งซื้อของคุณ</p>
          </div>
          <div className="flex gap-2">
            <Link to="/account/addresses" className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-light hover:text-white">
              <MapPin size={14} /> ที่อยู่
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-light hover:text-white">
              <LogOut size={14} /> ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {isLoading && <p className="text-sm text-muted">กำลังโหลด...</p>}
          {!isLoading && orders.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Package className="h-12 w-12 text-muted" />
              <p className="text-sm text-muted">ยังไม่มีคำสั่งซื้อ</p>
            </div>
          )}
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-light"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-primary">฿{order.total.toLocaleString()}</p>
                  <ChevronRight size={16} className="text-muted" />
                </div>
              </div>
              <p className="mt-1 text-xs text-muted">
                {new Date(order.createdAt).toLocaleDateString('th-TH')} · {statusLabels[order.status] ?? order.status}
                {order.trackingNumber && <> · เลขพัสดุ {order.trackingNumber}</>}
              </p>
              <div className="mt-2 space-y-1 border-t border-border/50 pt-2">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-muted-light">
                    {item.productName}{item.variantName ? ` (${item.variantName})` : ''} × {item.quantity}
                  </p>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
