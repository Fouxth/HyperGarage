import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, PackageX, Eye, X } from 'lucide-react'
import { useOrders, useUpdateOrderStatus } from '@/api/hooks'
import type { Order } from '@/types'

const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

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
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<Order | null>(null)

  const { data: orders = [], isLoading } = useOrders({
    status: statusFilter,
    orderNumber: search || undefined,
  })
  const updateStatus = useUpdateOrderStatus()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by order number..."
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
          <option value="All">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Order #</th>
                <th className="px-5 py-3 text-muted font-medium">Customer</th>
                <th className="px-5 py-3 text-muted font-medium">Items</th>
                <th className="px-5 py-3 text-muted font-medium">Total</th>
                <th className="px-5 py-3 text-muted font-medium">Payment</th>
                <th className="px-5 py-3 text-muted font-medium">Status</th>
                <th className="px-5 py-3 text-muted font-medium">Date</th>
                <th className="px-5 py-3 text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 font-mono text-white">{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    <p className="text-white">{order.customer}</p>
                    <p className="text-muted text-xs">{order.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-light">{order.items.length}</td>
                  <td className="px-5 py-3 text-white font-medium">฿{order.total.toLocaleString()}</td>
                  <td className="px-5 py-3 text-muted-light capitalize">{order.paymentMethod} · {order.paymentStatus}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as Order['status'] })}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize outline-none ${statusClass(order.status)}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-card text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-muted-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelected(order)}
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
            <p className="text-muted text-sm">No orders match your filters.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white font-mono">{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-light">{selected.customer} · {selected.phone}</p>
              <p className="text-muted-light">{selected.shippingAddress}</p>
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              {selected.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-white">{item.productName} × {item.quantity}</span>
                  <span className="text-muted-light">฿{(item.priceEach * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 font-semibold">
              <span className="text-white">Total</span>
              <span className="text-primary">฿{selected.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
