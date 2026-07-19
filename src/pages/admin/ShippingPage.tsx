import { useState } from 'react'
import { motion } from 'framer-motion'
import { Truck, Save } from 'lucide-react'
import { useOrders, useUpdateShipping } from '@/api/hooks'
import type { Order } from '@/types'

const carriers = [
  { value: 'kerry', label: 'Kerry Express', eta: '1-2 วัน' },
  { value: 'flash', label: 'Flash Express', eta: '1-3 วัน' },
  { value: 'thailand_post', label: 'Thailand Post (ไปรษณีย์ไทย)', eta: '2-5 วัน' },
]

function ShippingRow({ order }: { order: Order }) {
  const [carrier, setCarrier] = useState(order.carrier ?? '')
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? '')
  const updateShipping = useUpdateShipping()

  const dirty = carrier !== (order.carrier ?? '') || trackingNumber !== (order.trackingNumber ?? '')

  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
      <span className="font-mono font-semibold text-white">{order.orderNumber}</span>
      <span className="max-w-xs flex-1 truncate text-muted-light">{order.shippingAddress}</span>
      <select
        value={carrier}
        onChange={(e) => setCarrier(e.target.value)}
        className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
      >
        <option value="">เลือกขนส่ง</option>
        {carriers.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <input
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        placeholder="เลขพัสดุ"
        className="w-36 rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
      />
      <button
        disabled={!dirty || updateShipping.isPending}
        onClick={() => updateShipping.mutate({ id: order.id, input: { carrier, trackingNumber } })}
        className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-40"
      >
        <Save size={13} /> บันทึก
      </button>
    </div>
  )
}

export default function ShippingPage() {
  const { data: orders = [] } = useOrders({ status: 'processing' })
  const { data: shipped = [] } = useOrders({ status: 'shipped' })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Truck className="w-7 h-7 text-primary" /> จัดการใบส่งของและการจัดส่ง (Shipping)
      </h1>
      <p className="text-sm text-muted">
        เลือกขนส่งและกรอกเลขพัสดุให้แต่ละคำสั่งซื้อ ระบบจะบันทึกลงในออเดอร์นั้นทันที
      </p>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">บริษัทขนส่งที่เปิดรองรับ (Supported Carriers)</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {carriers.map((c) => (
            <div key={c.value} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-white">{c.label}</p>
              <p className="mt-1 text-xs text-muted">ระยะเวลาขนส่งโดยประมาณ: {c.eta}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">รายการคำสั่งซื้อที่รอบรรจุพัสดุจัดส่ง ({orders.length} ออเดอร์)</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {orders.map((o) => <ShippingRow key={o.id} order={o} />)}
          {orders.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">ไม่มีคำสั่งซื้อใดรอจัดส่งในขณะนี้</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">สินค้ากำลังอยู่ระหว่างการเดินทางขนส่ง ({shipped.length} ออเดอร์)</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border/50">
          {shipped.map((o) => <ShippingRow key={o.id} order={o} />)}
          {shipped.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">ไม่มีสินค้าใดอยู่ระหว่างขนส่ง</p>}
        </div>
      </section>
    </motion.div>
  )
}
