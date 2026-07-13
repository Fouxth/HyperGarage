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

  const translateMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cod':
      case 'cash on delivery':
        return 'เก็บเงินปลายทาง (COD)'
      case 'transfer':
      case 'bank transfer':
        return 'โอนเงินผ่านธนาคาร'
      case 'card':
      case 'credit card':
        return 'บัตรเครดิต/เดบิต'
      default:
        return method
    }
  }

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'รอตรวจสอบชำระเงิน'
      case 'paid':
        return 'ชำระเงินแล้ว'
      case 'refunded':
        return 'คืนเงินเรียบร้อย'
      default:
        return status
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <CreditCard className="w-7 h-7 text-primary" /> สรุปยอดการชำระเงิน (Payments)
      </h1>
      <p className="text-sm text-muted">
        ระบบร้านค้าบันทึกประเภทยอดเงินและการชำระเงินของคำสั่งซื้อจากขั้นตอนเช็คเอาต์ของลูกค้า สรุปรายละเอียดสถิติจำแนกได้ดังนี้:
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-light">แยกตามช่องทางชำระเงิน (By Method)</h2>
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            {Array.from(byMethod.entries()).map(([method, m]) => (
              <div key={method} className="flex items-center justify-between text-sm">
                <span className="text-muted-light">{translateMethod(method)} ({m.count} รายการ)</span>
                <span className="font-semibold text-white">฿{m.total.toLocaleString()}</span>
              </div>
            ))}
            {!isLoading && byMethod.size === 0 && <p className="text-sm text-muted">ยังไม่มีรายการสั่งซื้อใด ๆ</p>}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-light">แยกตามสถานะการจ่ายเงิน (By Payment Status)</h2>
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            {Array.from(byStatus.entries()).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-muted-light">{translateStatus(status)}</span>
                <span className="font-semibold text-white">{count} รายการ</span>
              </div>
            ))}
            {!isLoading && byStatus.size === 0 && <p className="text-sm text-muted">ยังไม่มีรายการสั่งซื้อใด ๆ</p>}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
