import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/api/hooks'
import type { Category } from '@/types'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      setFormError(t('admin.categoriesPage.errorRequired'))
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
      setFormError(t('admin.categoriesPage.errorFailed'))
    }
  }

  const handleDelete = async (c: Category) => {
    if (!confirm(t('admin.categoriesPage.confirmDelete', { name: c.nameEn }))) return
    try {
      await deleteCategory.mutateAsync(c.id)
    } catch {
      alert(t('admin.categoriesPage.errorDelete'))
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
        <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">{t('admin.categoriesPage.title')}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t('admin.categoriesPage.addBtn')}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">รูปภาพ</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.categoriesPage.nameCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.categoriesPage.slugCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.categoriesPage.productsCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.categoriesPage.actionsCol')}</th>
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
                  <td className="px-5 py-3 text-muted-light">{cat.productCount} รายการ</td>
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
          <p className="text-muted text-sm text-center py-16">{t('admin.categoriesPage.noCategories')}</p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? t('admin.categoriesPage.editTitle') : t('admin.categoriesPage.addTitle')}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.categoriesPage.nameThLabel')}</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.categoriesPage.nameEnLabel')}</label>
                  <input
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.categoriesPage.slugLabel')}</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder={t('admin.categoriesPage.slugPlaceholder')}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">ไอคอน (Icon)</label>
                  <input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.categoriesPage.imageLabel')}</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                />
              </div>

              {formError && <p className="text-sm text-error">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-light hover:text-white transition-colors"
                >
                  {t('admin.categoriesPage.cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? t('admin.categoriesPage.saving') : editingId ? t('admin.categoriesPage.saveBtn') : t('admin.categoriesPage.createBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
