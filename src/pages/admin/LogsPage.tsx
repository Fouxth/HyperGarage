import { motion } from 'framer-motion'
import { FileText, ShoppingCart, Star, Package } from 'lucide-react'
import { useActivity } from '@/api/hooks'

const iconFor = { order: ShoppingCart, review: Star, product: Package }

export default function LogsPage() {
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
        <FileText className="w-7 h-7 text-primary" /> บันทึกกิจกรรมระบบ (Activity Log)
      </h1>
      <p className="text-sm text-muted">แสดงบันทึกประวัติเหตุการณ์ต่าง ๆ ภายในระบบร้านค้าแบบเรียลไทม์ เช่น ออเดอร์ใหม่ รีวิวสินค้า และการแก้ไขแคตตาล็อกสินค้า</p>

      <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
        {events.map((event, i) => {
          const Icon = iconFor[event.type as keyof typeof iconFor] || FileText
          return (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Icon className="h-4 w-4 flex-shrink-0 text-muted" />
              <p className="flex-1 text-sm text-muted-light">{translateMessage(event.message)}</p>
              <span className="text-xs text-muted">
                {new Date(event.createdAt).toLocaleString('th-TH')}
              </span>
            </div>
          )
        })}
        {!isLoading && events.length === 0 && (
          <p className="px-5 py-16 text-center text-sm text-muted">ยังไม่มีบันทึกกิจกรรมล่าสุดในขณะนี้</p>
        )}
      </div>
    </motion.div>
  )
}
