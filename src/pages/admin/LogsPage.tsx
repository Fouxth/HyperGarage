import { motion } from 'framer-motion'
import { FileText, ShoppingCart, Star, Package } from 'lucide-react'
import { useActivity } from '@/api/hooks'

const iconFor = { order: ShoppingCart, review: Star, product: Package }

export default function LogsPage() {
  const { data: events = [], isLoading } = useActivity()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <FileText className="w-7 h-7 text-primary" /> Activity Log
      </h1>
      <p className="text-sm text-muted">A real-time feed of store events — new orders, reviews, and catalog changes.</p>

      <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
        {events.map((event, i) => {
          const Icon = iconFor[event.type]
          return (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Icon className="h-4 w-4 flex-shrink-0 text-muted" />
              <p className="flex-1 text-sm text-muted-light">{event.message}</p>
              <span className="text-xs text-muted">{new Date(event.createdAt).toLocaleString()}</span>
            </div>
          )
        })}
        {!isLoading && events.length === 0 && (
          <p className="px-5 py-16 text-center text-sm text-muted">No activity yet.</p>
        )}
      </div>
    </motion.div>
  )
}
