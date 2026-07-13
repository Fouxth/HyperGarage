import { motion } from 'framer-motion'
import { Bell, ShoppingCart, Star, Package } from 'lucide-react'
import { useActivity } from '@/api/hooks'

const iconFor = { order: ShoppingCart, review: Star, product: Package }

export default function NotificationsPage() {
  const { data: events = [], isLoading } = useActivity()

  const translateMessage = (msg: string) => {
    if (msg.startsWith('New order')) {
      return msg.replace('New order', 'คำสั่งซื้อใหม่').replace('from', 'จาก')
    }
    if (msg.includes('left a') && msg.includes('star review')) {
      return msg.replace('left a', 'เขียนรีวิว').replace('star review', 'ดาว')
    }
    if (msg.startsWith('Product') && msg.includes('was added to the catalog')) {
      return msg.replace('Product', 'สินค้า').replace('was added to the catalog', 'ถูกเพิ่มเข้าสู่แคตตาล็อกร้านค้า')
    }
    return msg
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Bell className="w-7 h-7 text-primary" /> รายการแจ้งเตือน (Notifications)
      </h1>
      <p className="text-sm text-muted">รายงานและแจ้งข้อมูลการเคลื่อนไหวล่าสุดในร้านค้าอย่างเป็นทางการ</p>

      <div className="space-y-2">
        {events.slice(0, 15).map((event, i) => {
          const Icon = iconFor[event.type as keyof typeof iconFor] || Bell
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{translateMessage(event.message)}</p>
                <p className="text-xs text-muted mt-1">
                  {new Date(event.createdAt).toLocaleString('th-TH')}
                </p>
              </div>
            </div>
          )
        })}
        {!isLoading && events.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">ไม่มีการแจ้งเตือนใหม่ในขณะนี้</p>
        )}
      </div>
    </motion.div>
  )
}
