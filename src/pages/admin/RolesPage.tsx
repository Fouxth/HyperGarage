import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Plus, Edit3, Trash2, X, Key } from 'lucide-react'

interface Staff {
  id: string
  email: string
  name: string
  role: 'SUPERADMIN' | 'STOCK_STAFF' | 'ORDER_STAFF'
  createdAt: string
}

interface FormState {
  name: string
  email: string
  password?: string
  role: 'SUPERADMIN' | 'STOCK_STAFF' | 'ORDER_STAFF'
}

const emptyForm: FormState = { name: '', email: '', password: '', role: 'STOCK_STAFF' }

export default function RolesPage() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Current logged in user info
  const [currentUser, setCurrentUser] = useState<any>(null)

  const API_BASE = import.meta.env.VITE_API_URL || '/api'
  const token = localStorage.getItem('hypergarage_admin_token')

  useEffect(() => {
    const rawUser = localStorage.getItem('hypergarage_admin_user')
    if (rawUser) {
      try {
        setCurrentUser(JSON.parse(rawUser))
      } catch (e) {
        // ignore
      }
    }
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/staff`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStaffList(data)
    } catch (err) {
      console.error('Failed to load staff list')
    } finally {
      setIsLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (staff: Staff) => {
    setEditingId(staff.id)
    setForm({
      name: staff.name,
      email: staff.email,
      password: '', // blank by default
      role: staff.role
    })
    setFormError(null)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!form.name || !form.email || !form.role) {
      setFormError('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน')
      return
    }

    if (!editingId && !form.password) {
      setFormError('กรุณาระบุรหัสผ่านสำหรับการสร้างบัญชีใหม่')
      return
    }

    setSaving(true)
    try {
      const url = editingId ? `${API_BASE}/staff/${editingId}` : `${API_BASE}/staff`
      const method = editingId ? 'PATCH' : 'POST'
      const payload: any = {
        name: form.name,
        email: form.email,
        role: form.role
      }
      if (form.password) {
        payload.password = form.password
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'บันทึกข้อมูลล้มเหลว')
      }

      setModalOpen(false)
      fetchStaff()
    } catch (err: any) {
      setFormError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (staff: Staff) => {
    if (currentUser?.id === staff.id) {
      alert('คุณไม่สามารถลบบัญชีของคุณเองที่กำลังใช้งานอยู่ได้')
      return
    }

    if (!confirm(`คุณต้องการลบบัญชีของพนักงาน "${staff.name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้`)) return

    try {
      const res = await fetch(`${API_BASE}/staff/${staff.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'ลบข้อมูลไม่สำเร็จ')
      }
      fetchStaff()
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }

  if (currentUser && currentUser.role !== 'SUPERADMIN') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center space-y-4">
          <Shield className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-xl font-bold text-white">เข้าถึงระบบไม่ได้</h1>
          <p className="text-sm text-muted">
            เฉพาะผู้ใช้ตำแหน่ง **SuperAdmin (ผู้ดูแลระบบหลัก)** เท่านั้นที่มีสิทธิ์ในการจัดการสิทธิ์และบัญชีพนักงานคนอื่น
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" /> จัดการบัญชีพนักงาน & สิทธิ์
          </h1>
          <p className="text-xs text-muted mt-1">
            สร้าง, แก้ไข และลบบัญชีของพนักงานในตำแหน่งระดับต่าง ๆ เพื่อให้สามารถเข้าใช้งานระบบหลังบ้านได้
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          เพิ่มบัญชีพนักงาน
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">ชื่อพนักงาน</th>
                <th className="px-5 py-3 text-muted font-medium">อีเมล</th>
                <th className="px-5 py-3 text-muted font-medium">ระดับสิทธิ์ (Role)</th>
                <th className="px-5 py-3 text-muted font-medium">วันที่เพิ่มเข้าระบบ</th>
                <th className="px-5 py-3 text-muted font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 font-semibold text-white">{staff.name}</td>
                  <td className="px-5 py-3 text-muted-light font-mono">{staff.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                        staff.role === 'SUPERADMIN'
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : staff.role === 'STOCK_STAFF'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {staff.role === 'SUPERADMIN'
                        ? 'SuperAdmin (ผู้ดูแลหลัก)'
                        : staff.role === 'STOCK_STAFF'
                        ? 'Stock Staff (ดูแลคลัง)'
                        : 'Order Staff (จัดการออเดอร์)'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(staff.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(staff)}
                        className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(staff)}
                        className="p-1.5 rounded-md hover:bg-error/10 transition-colors text-muted hover:text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && staffList.length === 0 && (
          <p className="text-muted text-sm text-center py-16">ไม่พบรายชื่อพนักงานในระบบ</p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มบัญชีพนักงานใหม่'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">ชื่อพนักงาน *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">อีเมล (ใช้เป็นบัญชีเข้างาน) *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="เช่น somchai@hypergarage.com"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">
                  รหัสผ่าน {editingId && '(ปล่อยว่างไว้หากไม่ต้องการเปลี่ยน)'} *
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="อย่างน้อย 6 ตัวอักษรขึ้นไป"
                    className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">ตำแหน่งงาน (Role) *</label>
                <select
                  value={form.role}
                  onChange={(e: any) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                >
                  <option value="SUPERADMIN">SuperAdmin (ผู้ดูแลระบบหลัก)</option>
                  <option value="STOCK_STAFF">Stock Staff (ผู้จัดการคลังสินค้า/แคตตาล็อก)</option>
                  <option value="ORDER_STAFF">Order Staff (ผู้จัดการรายการสั่งซื้อ/โปรโมชัน)</option>
                </select>
              </div>

              {formError && <p className="text-sm text-error">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-light hover:text-white transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'สร้างบัญชีพนักงาน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
