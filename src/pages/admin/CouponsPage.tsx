import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, X, Ticket } from 'lucide-react'
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/api/hooks'
import type { Coupon } from '@/types'

interface FormState {
  code: string
  type: 'percent' | 'fixed'
  value: string
  active: boolean
  usageLimit: string
  expiresAt: string
}

const emptyForm: FormState = { code: '', type: 'percent', value: '', active: true, usageLimit: '', expiresAt: '' }

export default function CouponsPage() {
  const { data: coupons = [], isLoading } = useCoupons()
  const createCoupon = useCreateCoupon()
  const updateCoupon = useUpdateCoupon()
  const deleteCoupon = useDeleteCoupon()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (c: Coupon) => {
    setEditingId(c.id)
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      active: c.active,
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : '',
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
    })
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.value) {
      setError('Code and value are required.')
      return
    }
    const input = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      active: form.active,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      expiresAt: form.expiresAt || null,
    }
    try {
      if (editingId) {
        await updateCoupon.mutateAsync({ id: editingId, input })
      } else {
        await createCoupon.mutateAsync(input)
      }
      setModalOpen(false)
    } catch {
      setError('Failed to save. Code may already be in use.')
    }
  }

  const handleDelete = async (c: Coupon) => {
    if (!confirm(`Delete coupon "${c.code}"?`)) return
    await deleteCoupon.mutateAsync(c.id)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Coupons</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Code</th>
                <th className="px-5 py-3 text-muted font-medium">Discount</th>
                <th className="px-5 py-3 text-muted font-medium">Usage</th>
                <th className="px-5 py-3 text-muted font-medium">Expires</th>
                <th className="px-5 py-3 text-muted font-medium">Status</th>
                <th className="px-5 py-3 text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 font-mono font-semibold text-white">{c.code}</td>
                  <td className="px-5 py-3 text-muted-light">{c.type === 'percent' ? `${c.value}%` : `฿${c.value}`}</td>
                  <td className="px-5 py-3 text-muted-light">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="px-5 py-3 text-muted-light">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${c.active ? 'bg-success/15 text-success' : 'bg-white/5 text-muted'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-bg text-muted hover:text-white">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 rounded-md hover:bg-error/10 text-muted hover:text-error">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && coupons.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Ticket className="w-10 h-10 text-muted" />
            <p className="text-muted text-sm">No coupons yet.</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary">
                    <option value="percent">Percent %</option>
                    <option value="fixed">Fixed ฿</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Value *</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Usage limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Expires</label>
                  <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-light">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-border" />
                Active
              </label>
              {error && <p className="text-sm text-error">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-light hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium">
                  {editingId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
