import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useLogin } from '@/api/customerHooks'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { token, customer } = await login.mutateAsync({ email, password })
      localStorage.setItem('hypergarage_customer_token', token)
      localStorage.setItem('hypergarage_customer_user', JSON.stringify(customer))
      navigate('/account/my-orders')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white"><LogIn className="h-5 w-5 text-primary" /> เข้าสู่ระบบ</h1>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">อีเมล</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-light">รหัสผ่าน</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={login.isPending} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50">
            {login.isPending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          ยังไม่มีบัญชี? <Link to="/account/register" className="text-primary hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  )
}
