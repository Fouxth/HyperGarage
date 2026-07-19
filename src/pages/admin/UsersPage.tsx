import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Ban, CheckCircle2, Pencil, X, Save } from 'lucide-react'
import { useCustomers, useUpdateCustomer } from '@/api/hooks'
import type { AdminCustomer } from '@/types'

function EditModal({ customer, onClose }: { customer: AdminCustomer; onClose: () => void }) {
  const [name, setName] = useState(customer.name)
  const [phone, setPhone] = useState(customer.phone ?? '')
  const updateCustomer = useUpdateCustomer()

  const handleSave = async () => {
    await updateCustomer.mutateAsync({ id: customer.id, input: { name, phone } })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">แก้ไขข้อมูลลูกค้า</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">ชื่อ</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">เบอร์โทรศัพท์</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          <button onClick={handleSave} disabled={updateCustomer.isPending} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50">
            <Save size={14} /> บันทึก
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const { data: customers = [], isLoading } = useCustomers()
  const updateCustomer = useUpdateCustomer()
  const [editing, setEditing] = useState<AdminCustomer | null>(null)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight flex items-center gap-2">
        <Users className="w-7 h-7 text-primary" /> รายชื่อลูกค้า (Customers)
      </h1>
      <p className="text-sm text-muted">
        รายชื่อลูกค้าที่สมัครสมาชิกจริงในระบบ พร้อมยอดสั่งซื้อสะสมและสถานะบัญชี
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">ชื่อลูกค้า</th>
                <th className="px-5 py-3 text-muted font-medium">อีเมล / เบอร์โทร</th>
                <th className="px-5 py-3 text-muted font-medium">จำนวนออเดอร์</th>
                <th className="px-5 py-3 text-muted font-medium">ยอดสั่งซื้อสะสม</th>
                <th className="px-5 py-3 text-muted font-medium">สถานะ</th>
                <th className="px-5 py-3 text-muted font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-muted-light">
                    <div>{c.email}</div>
                    {c.phone && <div className="font-mono text-xs">{c.phone}</div>}
                  </td>
                  <td className="px-5 py-3 text-muted-light">{c.orderCount} ครั้ง</td>
                  <td className="px-5 py-3 text-white font-semibold">฿{c.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.banned ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                      {c.banned ? 'ระงับการใช้งาน' : 'ปกติ'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(c)} className="rounded-lg border border-border p-1.5 text-muted-light hover:text-white" title="แก้ไข">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => updateCustomer.mutate({ id: c.id, input: { banned: !c.banned } })}
                        className={`rounded-lg border border-border p-1.5 ${c.banned ? 'text-emerald-400' : 'text-red-400'} hover:opacity-80`}
                        title={c.banned ? 'ปลดระงับ' : 'ระงับบัญชี'}
                      >
                        {c.banned ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && customers.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Users className="w-10 h-10 text-muted" />
            <p className="text-muted text-sm">ยังไม่มีลูกค้าที่สมัครสมาชิกในระบบ</p>
          </div>
        )}
      </div>

      {editing && <EditModal customer={editing} onClose={() => setEditing(null)} />}
    </motion.div>
  )
}
