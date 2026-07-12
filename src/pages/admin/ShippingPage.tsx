import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'
import { useOrders } from '@/api/hooks'

const carriers = [
  { name: 'Kerry Express', eta: '1-2 days' },
  { name: 'Flash Express', eta: '1-3 days' },
  { name: 'Thailand Post (ไปรษณีย์ไทย)', eta: '2-5 days' },
]

export default function ShippingPage() {
  const { data: orders = [] } = useOrders({ status: 'processing' })
  const { data: shipped = [] } = useOrders({ status: 'shipped' })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Truck className="w-7 h-7 text-primary" /> Shipping
      </h1>
      <p className="text-sm text-muted">
        HyperGarage doesn't integrate real carrier tracking yet. This page lists supported carriers and orders that
        currently need fulfillment — update an order's status from Admin → Orders once it ships.
      </p>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">Supported Carriers</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {carriers.map((c) => (
            <div key={c.name} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-white">{c.name}</p>
              <p className="mt-1 text-xs text-muted">Est. delivery: {c.eta}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">Awaiting Fulfillment ({orders.length})</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="font-mono text-white">{o.orderNumber}</span>
              <span className="text-muted-light">{o.shippingAddress}</span>
            </div>
          ))}
          {orders.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">Nothing awaiting fulfillment.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">In Transit ({shipped.length})</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {shipped.map((o) => (
            <div key={o.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="font-mono text-white">{o.orderNumber}</span>
              <span className="text-muted-light">{o.shippingAddress}</span>
            </div>
          ))}
          {shipped.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">Nothing in transit.</p>}
        </div>
      </section>
    </motion.div>
  )
}
