import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'
import { useOrders } from '@/api/hooks'

const carriers = [
  { name: 'Kerry Express', eta: '1-2 วัน' },
  { name: 'Flash Express', eta: '1-3 วัน' },
  { name: 'Thailand Post (ไปรษณีย์ไทย)', eta: '2-5 วัน' },
]

export default function ShippingPage() {
  const { data: orders = [] } = useOrders({ status: 'processing' })
  const { data: shipped = [] } = useOrders({ status: 'shipped' })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Truck className="w-7 h-7 text-primary" /> จัดการใบส่งของและการจัดส่ง (Shipping)
      </h1>
      <p className="text-sm text-muted">
        แสดงบริษัทขนส่งสาธารณะที่รองรับสำหรับการจัดส่งชิ้นส่วนและเครื่องแต่งกาย 
        และสรุปคำสั่งซื้อของลูกค้าที่รอการบรรจุจัดส่งและออกหมายเลขติดตามพัสดุ (Tracking Number) โดยดำเนินการผ่านหน้า คำสั่งซื้อ (Orders)
      </p>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">บริษัทขนส่งที่เปิดรองรับ (Supported Carriers)</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {carriers.map((c) => (
            <div key={c.name} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-white">{c.name}</p>
              <p className="mt-1 text-xs text-muted">ระยะเวลาขนส่งโดยประมาณ: {c.eta}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">รายการคำสั่งซื้อที่รอบรรจุพัสดุจัดส่ง ({orders.length} ออเดอร์)</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="font-mono text-white font-semibold">{o.orderNumber}</span>
              <span className="text-muted-light truncate max-w-lg">{o.shippingAddress}</span>
            </div>
          ))}
          {orders.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">ไม่มีคำสั่งซื้อใดรอจัดส่งในขณะนี้</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">สินค้ากำลังอยู่ระหว่างการเดินทางขนส่ง ({shipped.length} ออเดอร์)</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {shipped.map((o) => (
            <div key={o.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="font-mono text-white font-semibold">{o.orderNumber}</span>
              <span className="text-muted-light truncate max-w-lg">{o.shippingAddress}</span>
            </div>
          ))}
          {shipped.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">ไม่มีสินค้าใดอยู่ระหว่างขนส่ง</p>}
        </div>
      </section>
    </motion.div>
  )
}
