import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, ShoppingCart, Star, Package, AlertTriangle, Undo2, Check, CheckCheck } from 'lucide-react'
import { useActivity, useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/api/hooks'
import type { NotificationType } from '@/types'

const activityIconFor = { order: ShoppingCart, review: Star, product: Package }

const notificationIconFor: Record<NotificationType, typeof Bell> = {
  new_order: ShoppingCart,
  low_stock: AlertTriangle,
  new_review: Star,
  return_requested: Undo2,
}

const translateActivity = (msg: string) => {
  if (msg.startsWith('New order')) return msg.replace('New order', 'คำสั่งซื้อใหม่').replace('from', 'จาก')
  if (msg.includes('left a') && msg.includes('star review')) return msg.replace('left a', 'เขียนรีวิว').replace('star review', 'ดาว')
  if (msg.startsWith('Product') && msg.includes('was added to the catalog')) {
    return msg.replace('Product', 'สินค้า').replace('was added to the catalog', 'ถูกเพิ่มเข้าสู่แคตตาล็อกร้านค้า')
  }
  return msg
}

export default function NotificationsPage() {
  const [tab, setTab] = useState<'notifications' | 'activity'>('notifications')
  const { data: events = [], isLoading: activityLoading } = useActivity()
  const { data: notifications = [], isLoading: notifLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
          <Bell className="w-7 h-7 text-primary" /> รายการแจ้งเตือน (Notifications)
          {unreadCount > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">{unreadCount}</span>}
        </h1>
        {tab === 'notifications' && unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-light hover:text-white"
          >
            <CheckCheck size={14} /> อ่านทั้งหมด
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-border">
        {(['notifications', 'activity'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${tab === t ? 'border-b-2 border-primary text-white' : 'text-muted hover:text-white'}`}
          >
            {t === 'notifications' ? 'การแจ้งเตือนระบบ' : 'กิจกรรมล่าสุด'}
          </button>
        ))}
      </div>

      {tab === 'notifications' && (
        <div className="space-y-2">
          {notifications.slice(0, 30).map((n) => {
            const Icon = notificationIconFor[n.type] || Bell
            return (
              <div key={n.id} className={`flex items-center gap-3 rounded-xl border p-4 ${n.read ? 'border-border bg-card' : 'border-primary/40 bg-primary/5'}`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{n.message}</p>
                  <p className="mt-1 text-xs text-muted">{new Date(n.createdAt).toLocaleString('th-TH')}</p>
                </div>
                {!n.read && (
                  <button onClick={() => markRead.mutate(n.id)} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-light hover:text-white">
                    <Check size={13} /> อ่านแล้ว
                  </button>
                )}
              </div>
            )
          })}
          {!notifLoading && notifications.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">ไม่มีการแจ้งเตือนใหม่ในขณะนี้</p>
          )}
        </div>
      )}

      {tab === 'activity' && (
        <div className="space-y-2">
          {events.slice(0, 15).map((event, i) => {
            const Icon = activityIconFor[event.type as keyof typeof activityIconFor] || Bell
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{translateActivity(event.message)}</p>
                  <p className="text-xs text-muted mt-1">{new Date(event.createdAt).toLocaleString('th-TH')}</p>
                </div>
              </div>
            )
          })}
          {!activityLoading && events.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">ไม่มีการแจ้งเตือนใหม่ในขณะนี้</p>
          )}
        </div>
      )}
    </motion.div>
  )
}
