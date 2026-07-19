import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useRegister } from '@/api/customerHooks'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { token, customer } = await register.mutateAsync(form)
      localStorage.setItem('hypergarage_customer_token', token)
      localStorage.setItem('hypergarage_customer_user', JSON.stringify(customer))
      navigate('/account/my-orders')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white"><UserPlus className="h-5 w-5 text-primary" /> สมัครสมาชิก</h1>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">ชื่อ</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">อีเมล</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">เบอร์โทรศัพท์ (ไม่บังคับ)</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">รหัสผ่าน</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={register.isPending} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50">
            {register.isPending ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          มีบัญชีอยู่แล้ว? <Link to="/account/login" className="text-primary hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  )
}
