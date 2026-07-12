import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { useOrders } from '@/api/hooks'

export default function UsersPage() {
  const { data: orders = [], isLoading } = useOrders()

  const customerMap = new Map<string, { name: string; phone: string; orders: number; total: number; lastOrder: string }>()
  for (const order of orders) {
    const existing = customerMap.get(order.phone)
    if (existing) {
      existing.orders += 1
      existing.total += order.total
      if (order.createdAt > existing.lastOrder) existing.lastOrder = order.createdAt
    } else {
      customerMap.set(order.phone, {
        name: order.customer,
        phone: order.phone,
        orders: 1,
        total: order.total,
        lastOrder: order.createdAt,
      })
    }
  }
  const customers = Array.from(customerMap.values()).sort((a, b) => b.total - a.total)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Customers</h1>
      <p className="text-sm text-muted">
        HyperGarage uses guest checkout — there's no account/login system, so this list is derived from real order history grouped by phone number.
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Name</th>
                <th className="px-5 py-3 text-muted font-medium">Phone</th>
                <th className="px-5 py-3 text-muted font-medium">Orders</th>
                <th className="px-5 py-3 text-muted font-medium">Total Spent</th>
                <th className="px-5 py-3 text-muted font-medium">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-muted-light">{c.phone}</td>
                  <td className="px-5 py-3 text-muted-light">{c.orders}</td>
                  <td className="px-5 py-3 text-white font-semibold">฿{c.total.toLocaleString()}</td>
                  <td className="px-5 py-3 text-muted-light">{new Date(c.lastOrder).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && customers.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Users className="w-10 h-10 text-muted" />
            <p className="text-muted text-sm">No customers yet — no orders have been placed.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
