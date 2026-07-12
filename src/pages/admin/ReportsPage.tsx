import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { useReports } from '@/api/hooks'

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <BarChart3 className="w-7 h-7 text-primary" /> Reports
      </h1>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}

      {reports && (
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-light">Top Products by Revenue</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 text-muted font-medium">Product</th>
                    <th className="px-5 py-3 text-muted font-medium">Units Sold</th>
                    <th className="px-5 py-3 text-muted font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.topProducts.map((p) => (
                    <tr key={p.name} className="border-b border-border/50">
                      <td className="px-5 py-3 text-white">{p.name}</td>
                      <td className="px-5 py-3 text-muted-light">{p.quantity}</td>
                      <td className="px-5 py-3 font-semibold text-primary">฿{p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                  {reports.topProducts.length === 0 && (
                    <tr><td colSpan={3} className="px-5 py-8 text-center text-muted">No sales data yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-light">Revenue by Payment Method</h2>
              <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                {reports.revenueByPaymentMethod.map((r) => (
                  <div key={r.method} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-light">{r.method}</span>
                    <span className="font-semibold text-white">฿{r.total.toLocaleString()}</span>
                  </div>
                ))}
                {reports.revenueByPaymentMethod.length === 0 && <p className="text-sm text-muted">No orders yet.</p>}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-light">Orders by Status</h2>
              <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                {reports.ordersByStatus.map((r) => (
                  <div key={r.status} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-light">{r.status}</span>
                    <span className="font-semibold text-white">{r.count}</span>
                  </div>
                ))}
                {reports.ordersByStatus.length === 0 && <p className="text-sm text-muted">No orders yet.</p>}
              </div>
            </section>
          </div>
        </>
      )}
    </motion.div>
  )
}
