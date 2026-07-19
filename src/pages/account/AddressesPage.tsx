import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { MapPin, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useCustomerAddresses, useCreateAddress, useDeleteAddress } from '@/api/customerHooks'
import { getCustomerToken } from '@/api/customerClient'

export default function AddressesPage() {
  const token = getCustomerToken()
  const { data: addresses = [], isLoading } = useCustomerAddresses()
  const createAddress = useCreateAddress()
  const deleteAddress = useDeleteAddress()
  const [form, setForm] = useState({ label: '', address: '' })

  if (!token) return <Navigate to="/account/login" replace />

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label || !form.address) return
    await createAddress.mutateAsync(form)
    setForm({ label: '', address: '' })
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/account/my-orders" className="flex items-center gap-1.5 text-sm text-muted hover:text-white">
          <ArrowLeft size={14} /> กลับไปประวัติคำสั่งซื้อ
        </Link>
        <h1 className="mt-3 flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <MapPin className="h-7 w-7 text-primary" /> ที่อยู่จัดส่งของฉัน
        </h1>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted">กำลังโหลด...</p>}
          {addresses.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-semibold text-white">{a.label} {a.isDefault && <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">ค่าเริ่มต้น</span>}</p>
                <p className="mt-1 text-sm text-muted-light">{a.address}</p>
              </div>
              <button onClick={() => deleteAddress.mutate(a.id)} className="rounded-lg border border-border p-2 text-muted-light hover:text-error">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {!isLoading && addresses.length === 0 && <p className="text-sm text-muted">ยังไม่มีที่อยู่ที่บันทึกไว้</p>}
        </div>

        <form onSubmit={handleAdd} className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-white">เพิ่มที่อยู่ใหม่</p>
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="ชื่อที่อยู่ เช่น บ้าน, ที่ทำงาน"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
          />
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="ที่อยู่เต็ม"
            rows={2}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
          />
          <button type="submit" disabled={createAddress.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50">
            <Plus size={14} /> เพิ่มที่อยู่
          </button>
        </form>
      </div>
    </div>
  )
}
