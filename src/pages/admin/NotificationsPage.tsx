import { motion } from 'framer-motion'
import { Bell, ShoppingCart, Star, Package } from 'lucide-react'
import { useActivity } from '@/api/hooks'

const iconFor = { order: ShoppingCart, review: Star, product: Package }

export default function NotificationsPage() {
  const { data: events = [], isLoading } = useActivity()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Bell className="w-7 h-7 text-primary" /> Notifications
      </h1>
      <p className="text-sm text-muted">Derived from real store activity — no separate notification system is stored.</p>

      <div className="space-y-2">
        {events.slice(0, 15).map((event, i) => {
          const Icon = iconFor[event.type]
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{event.message}</p>
                <p className="text-xs text-muted">{new Date(event.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )
        })}
        {!isLoading && events.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">No notifications yet.</p>
        )}
      </div>
    </motion.div>
  )
}
