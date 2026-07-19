import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, ShoppingCart, Star, Package, ShieldCheck } from 'lucide-react'
import { useActivity, useAuditLog } from '@/api/hooks'

const iconFor = { order: ShoppingCart, review: Star, product: Package }

const translateActivity = (msg: string) => {
  if (msg.startsWith('New order')) return msg.replace('New order', 'คำสั่งซื้อใหม่').replace('from', 'จาก')
  if (msg.includes('left a') && msg.includes('star review')) return msg.replace('left a', 'เขียนรีวิว').replace('star review', 'ดาว')
  if (msg.startsWith('Product') && msg.includes('was added to the catalog')) {
    return msg.replace('Product', 'สินค้า').replace('was added to the catalog', 'ถูกเพิ่มเข้าสู่แคตตาล็อกร้านค้า')
  }
  return msg
}

const actionLabels: Record<string, string> = {
  'order.status_update': 'อัปเดตสถานะออเดอร์',
  'order.payment_update': 'อัปเดตสถานะชำระเงิน',
  'order.shipping_update': 'อัปเดตข้อมูลจัดส่ง',
  'return.approved': 'อนุมัติคำขอคืนสินค้า',
  'return.rejected': 'ปฏิเสธคำขอคืนสินค้า',
  'return.refunded': 'คืนเงินสำเร็จ',
  'customer.update': 'แก้ไขข้อมูลลูกค้า',
}

export default function LogsPage() {
  const [tab, setTab] = useState<'audit' | 'activity'>('audit')
  const { data: events = [], isLoading: activityLoading } = useActivity()
  const { data: auditLogs = [], isLoading: auditLoading } = useAuditLog()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <FileText className="w-7 h-7 text-primary" /> บันทึกกิจกรรมระบบ (Activity Log)
      </h1>
      <p className="text-sm text-muted">แสดงบันทึกประวัติเหตุการณ์ต่าง ๆ ภายในระบบร้านค้า ทั้งกิจกรรมสาธารณะและการดำเนินการของพนักงาน</p>

      <div className="flex gap-2 border-b border-border">
        {(['audit', 'activity'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${tab === t ? 'border-b-2 border-primary text-white' : 'text-muted hover:text-white'}`}
          >
            {t === 'audit' ? 'บันทึกการดำเนินการของพนักงาน' : 'กิจกรรมล่าสุด'}
          </button>
        ))}
      </div>

      {tab === 'audit' && (
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 px-5 py-3">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-muted" />
              <p className="flex-1 text-sm text-muted-light">
                <span className="font-semibold text-white">{log.actorName}</span> {actionLabels[log.action] ?? log.action} ({log.entity})
              </p>
              <span className="text-xs text-muted">{new Date(log.createdAt).toLocaleString('th-TH')}</span>
            </div>
          ))}
          {!auditLoading && auditLogs.length === 0 && (
            <p className="px-5 py-16 text-center text-sm text-muted">ยังไม่มีบันทึกการดำเนินการของพนักงาน</p>
          )}
        </div>
      )}

      {tab === 'activity' && (
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {events.map((event, i) => {
            const Icon = iconFor[event.type as keyof typeof iconFor] || FileText
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <Icon className="h-4 w-4 flex-shrink-0 text-muted" />
                <p className="flex-1 text-sm text-muted-light">{translateActivity(event.message)}</p>
                <span className="text-xs text-muted">{new Date(event.createdAt).toLocaleString('th-TH')}</span>
              </div>
            )
          })}
          {!activityLoading && events.length === 0 && (
            <p className="px-5 py-16 text-center text-sm text-muted">ยังไม่มีบันทึกกิจกรรมล่าสุดในขณะนี้</p>
          )}
        </div>
      )}
    </motion.div>
  )
}
