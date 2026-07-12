import { motion } from 'framer-motion'
import { CreditCard } from 'lucide-react'
import { useOrders } from '@/api/hooks'

export default function PaymentsPage() {
  const { data: orders = [], isLoading } = useOrders()

  const byMethod = new Map<string, { count: number; total: number }>()
  const byStatus = new Map<string, number>()
  for (const o of orders) {
    const m = byMethod.get(o.paymentMethod) ?? { count: 0, total: 0 }
    m.count += 1
    m.total += o.total
    byMethod.set(o.paymentMethod, m)
    byStatus.set(o.paymentStatus, (byStatus.get(o.paymentStatus) ?? 0) + 1)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <CreditCard className="w-7 h-7 text-primary" /> Payments
      </h1>
      <p className="text-sm text-muted">
        HyperGarage doesn't integrate a live payment gateway yet — orders record the customer's chosen method
        (Cash on Delivery, Bank Transfer, Card) and a payment status that's updated manually. This view summarizes real order data.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-light">By Method</h2>
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            {Array.from(byMethod.entries()).map(([method, m]) => (
              <div key={method} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted-light">{method} ({m.count})</span>
                <span className="font-semibold text-white">฿{m.total.toLocaleString()}</span>
              </div>
            ))}
            {!isLoading && byMethod.size === 0 && <p className="text-sm text-muted">No orders yet.</p>}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-light">By Payment Status</h2>
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            {Array.from(byStatus.entries()).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted-light">{status}</span>
                <span className="font-semibold text-white">{count}</span>
              </div>
            ))}
            {!isLoading && byStatus.size === 0 && <p className="text-sm text-muted">No orders yet.</p>}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
