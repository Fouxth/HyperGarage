import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Save, Landmark, Truck, QrCode, CheckCircle2, RotateCcw, Check } from 'lucide-react'
import { useOrders, useSettings, useUpdateSettings, useUpdatePaymentStatus } from '@/api/hooks'
import { THAI_BANKS, bankInitials } from '@/lib/banks'
import BankBadge from '@/components/shared/BankBadge'

const emptyForm = {
  codEnabled: true,
  transferEnabled: true,
  cardEnabled: true,
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
  promptPayId: '',
  paymentNote: '',
}

export default function PaymentsPage() {
  const { data: orders = [], isLoading } = useOrders()
  const { data: settings } = useSettings()
  const updateSettings = useUpdateSettings()
  const updatePayment = useUpdatePaymentStatus()

  const [form, setForm] = useState(emptyForm)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setForm({
        codEnabled: settings.codEnabled,
        transferEnabled: settings.transferEnabled,
        cardEnabled: settings.cardEnabled,
        bankName: settings.bankName ?? '',
        bankAccountName: settings.bankAccountName ?? '',
        bankAccountNumber: settings.bankAccountNumber ?? '',
        promptPayId: settings.promptPayId ?? '',
        paymentNote: settings.paymentNote ?? '',
      })
    }
  }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    // Merge with existing settings so the general fields aren't wiped.
    await updateSettings.mutateAsync({ ...settings, ...form })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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

  const statusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/15 text-emerald-400'
      case 'refunded':
        return 'bg-amber-500/15 text-amber-400'
      default:
        return 'bg-red-500/15 text-red-400'
    }
  }

  const toggle = (key: 'codEnabled' | 'transferEnabled' | 'cardEnabled', icon: typeof Truck, label: string) => (
    <button
      type="button"
      onClick={() => setForm({ ...form, [key]: !form[key] })}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
        form[key] ? 'border-primary bg-primary/10 text-white' : 'border-border bg-bg text-muted'
      }`}
    >
      {(() => {
        const Icon = icon
        return <Icon size={16} className={form[key] ? 'text-primary' : 'text-muted'} />
      })()}
      <span className="font-medium">{label}</span>
      <span className={`ml-auto h-4 w-8 rounded-full p-0.5 transition-colors ${form[key] ? 'bg-primary' : 'bg-border'}`}>
        <span className={`block h-3 w-3 rounded-full bg-white transition-transform ${form[key] ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  )

  const inputCls =
    'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'
  const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light'

  const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <CreditCard className="w-7 h-7 text-primary" /> การชำระเงิน (Payments)
      </h1>

      {/* Payment settings */}
      <form onSubmit={handleSave} className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-semibold text-white">ตั้งค่าช่องทางการชำระเงิน</h2>
          <p className="mt-1 text-sm text-muted">กำหนดว่าจะเปิดช่องทางใดให้ลูกค้าเลือกที่หน้าเช็คเอาต์ พร้อมข้อมูลบัญชีรับโอน</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {toggle('codEnabled', Truck, 'เก็บเงินปลายทาง')}
          {toggle('transferEnabled', Landmark, 'โอนผ่านธนาคาร')}
          {toggle('cardEnabled', CreditCard, 'บัตรเครดิต/เดบิต')}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>ธนาคาร (สัญลักษณ์ธนาคาร)</label>
            <div className="flex flex-wrap gap-2">
              {THAI_BANKS.map((bank) => {
                const active = form.bankName === bank.name
                return (
                  <button
                    key={bank.name}
                    type="button"
                    onClick={() => setForm({ ...form, bankName: bank.name })}
                    title={bank.name}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors ${
                      active ? 'border-primary bg-primary/10 text-white' : 'border-border bg-bg text-muted-light hover:border-primary/40'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: bank.color }}
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    >
                      {bankInitials(bank)}
                    </div>
                    <span className="max-w-[90px] truncate font-medium">{bank.short}</span>
                    {active && <Check size={13} className="text-primary" />}
                  </button>
                )
              })}
            </div>
            {form.bankName && (
              <p className="mt-2 text-xs text-muted">เลือกแล้ว: {form.bankName}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>ชื่อบัญชี</label>
            <input value={form.bankAccountName} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })} placeholder="ชื่อเจ้าของบัญชี" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>เลขที่บัญชี</label>
            <input value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} placeholder="xxx-x-xxxxx-x" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-light">
              <QrCode size={13} /> พร้อมเพย์ (เบอร์โทร / เลขบัตรประชาชน)
            </label>
            <input value={form.promptPayId} onChange={(e) => setForm({ ...form, promptPayId: e.target.value })} placeholder="0812345678" className={inputCls} />
            <p className="mt-1 text-xs text-muted">ใช้สร้าง QR พร้อมเพย์ให้ลูกค้าสแกนจ่ายอัตโนมัติ</p>
          </div>
        </div>

        <div>
          <label className={labelCls}>ข้อความเพิ่มเติมตอนชำระเงิน</label>
          <textarea rows={2} value={form.paymentNote} onChange={(e) => setForm({ ...form, paymentNote: e.target.value })} placeholder="เช่น กรุณาแจ้งสลิปหลังโอนที่ LINE @hypergarage" className={inputCls} />
        </div>

        <button type="submit" disabled={updateSettings.isPending} className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" /> {saved ? 'บันทึกแล้ว ✓' : 'บันทึกการตั้งค่า'}
        </button>
      </form>

      {/* Orders awaiting payment confirmation */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">ยืนยันการชำระเงิน ({pendingOrders.length} รายการรอตรวจสอบ)</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {orders.length === 0 && !isLoading && <p className="p-4 text-sm text-muted">ยังไม่มีรายการสั่งซื้อ</p>}
          {orders.slice(0, 12).map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{o.orderNumber} · {o.customer}</p>
                <p className="text-xs text-muted">{translateMethod(o.paymentMethod)} · ฿{o.total.toLocaleString()}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(o.paymentStatus)}`}>
                {translateStatus(o.paymentStatus)}
              </span>
              <div className="flex gap-2">
                {o.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => updatePayment.mutate({ id: o.id, paymentStatus: 'paid' })}
                    disabled={updatePayment.isPending}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    <CheckCircle2 size={13} /> ยืนยันชำระแล้ว
                  </button>
                )}
                {o.paymentStatus === 'paid' && (
                  <button
                    onClick={() => updatePayment.mutate({ id: o.id, paymentStatus: 'refunded' })}
                    disabled={updatePayment.isPending}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-light hover:text-white"
                  >
                    <RotateCcw size={13} /> คืนเงิน
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary stats */}
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
