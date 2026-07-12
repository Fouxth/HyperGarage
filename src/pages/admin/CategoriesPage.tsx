import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/api/hooks'
import type { Category } from '@/types'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

interface FormState {
  name: string
  nameEn: string
  slug: string
  icon: string
  image: string
}

const emptyForm: FormState = { name: '', nameEn: '', slug: '', icon: '', image: '' }

function toFormState(c: Category): FormState {
  return { name: c.name, nameEn: c.nameEn, slug: c.slug, icon: c.icon, image: c.image ?? '' }
}

export default function AdminCategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: categories = [], isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (c: Category) => {
    setEditingId(c.id)
    setForm(toFormState(c))
    setFormError(null)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!form.name || !form.nameEn) {
      setFormError('Please fill in both name fields.')
      return
    }
    const input = {
      name: form.name,
      nameEn: form.nameEn,
      slug: form.slug || slugify(form.nameEn),
      icon: form.icon,
      image: form.image || null,
    }
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, input })
      } else {
        await createCategory.mutateAsync(input)
      }
      setModalOpen(false)
    } catch {
      setFormError('Failed to save — the slug may already be in use.')
    }
  }

  const handleDelete = async (c: Category) => {
    if (!confirm(`Delete "${c.nameEn}"? This cannot be undone.`)) return
    try {
      await deleteCategory.mutateAsync(c.id)
    } catch {
      alert('Could not delete — this category still has products assigned to it.')
    }
  }

  const saving = createCategory.isPending || updateCategory.isPending

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Image</th>
                <th className="px-5 py-3 text-muted font-medium">Name</th>
                <th className="px-5 py-3 text-muted font-medium">Slug</th>
                <th className="px-5 py-3 text-muted font-medium">Products</th>
                <th className="px-5 py-3 text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50 bg-bg">
                      {cat.image && <img src={cat.image} alt={cat.nameEn} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-white font-medium">{cat.nameEn}</p>
                    <p className="text-muted text-xs">{cat.name}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-light font-mono text-xs">{cat.slug}</td>
                  <td className="px-5 py-3 text-muted-light">{cat.productCount}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(cat)} className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="p-1.5 rounded-md hover:bg-error/10 transition-colors text-muted hover:text-error">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && categories.length === 0 && (
          <p className="text-muted text-sm text-center py-16">No categories yet.</p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Name (Thai) *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Name (English) *</label>
                  <input
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
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
                  <label className="mb-1.5 block text-xs font-medium text-muted-light">Icon</label>
                  <input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
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
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
