import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/api/hooks'
import type { Brand } from '@/types'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

interface FormState {
  name: string
  slug: string
  logo: string
  country: string
}

const emptyForm: FormState = { name: '', slug: '', logo: '', country: '' }

function toFormState(b: Brand): FormState {
  return { name: b.name, slug: b.slug, logo: b.logo ?? '', country: b.country }
}

export default function AdminBrandsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: brands = [], isLoading } = useBrands()
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()
  const deleteBrand = useDeleteBrand()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (b: Brand) => {
    setEditingId(b.id)
    setForm(toFormState(b))
    setFormError(null)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!form.name || !form.country) {
      setFormError('Please fill in name and country.')
      return
    }
    const input = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      logo: form.logo || null,
      country: form.country,
    }
    try {
      if (editingId) {
        await updateBrand.mutateAsync({ id: editingId, input })
      } else {
        await createBrand.mutateAsync(input)
      }
      setModalOpen(false)
    } catch {
      setFormError('Failed to save — the slug may already be in use.')
    }
  }

  const handleDelete = async (b: Brand) => {
    if (!confirm(`Delete "${b.name}"? This cannot be undone.`)) return
    try {
      await deleteBrand.mutateAsync(b.id)
    } catch {
      alert('Could not delete — this brand still has products assigned to it.')
    }
  }

  const saving = createBrand.isPending || updateBrand.isPending

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Brands</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Name</th>
                <th className="px-5 py-3 text-muted font-medium">Slug</th>
                <th className="px-5 py-3 text-muted font-medium">Country</th>
                <th className="px-5 py-3 text-muted font-medium">Products</th>
                <th className="px-5 py-3 text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{brand.name}</td>
                  <td className="px-5 py-3 text-muted-light font-mono text-xs">{brand.slug}</td>
                  <td className="px-5 py-3 text-muted-light">{brand.country}</td>
                  <td className="px-5 py-3 text-muted-light">{brand.productCount}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(brand)} className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(brand)} className="p-1.5 rounded-md hover:bg-error/10 transition-colors text-muted hover:text-error">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && brands.length === 0 && (
          <p className="text-muted text-sm text-center py-16">No brands yet.</p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Brand' : 'Add Brand'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Country *</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">Logo URL</label>
                <input
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                />
              </div>

              {formError && <p className="text-sm text-error">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-light hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
