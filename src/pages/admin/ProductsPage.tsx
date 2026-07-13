import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit3, Trash2, X, PackageX } from 'lucide-react'
import {
  useProducts,
  useCategories,
  useBrands,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/api/hooks'
import type { AdminProduct, ProductInput } from '@/api/client'
import { useTranslation } from 'react-i18next'

function getStockStatus(stock: number, t: any) {
  if (stock === 0) return { label: t('admin.productsPage.outOfStock'), cls: 'bg-error/15 text-error' }
  if (stock < 10) return { label: t('admin.productsPage.lowStock'), cls: 'bg-warning/15 text-warning' }
  return { label: t('admin.productsPage.inStock'), cls: 'bg-success/15 text-success' }
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

interface FormState {
  name: string
  nameEn: string
  slug: string
  price: string
  originalPrice: string
  sku: string
  stock: string
  categoryId: string
  brandId: string
  description: string
  images: string
  tags: string
  isFeatured: boolean
  isFlashSale: boolean
}

const emptyForm: FormState = {
  name: '',
  nameEn: '',
  slug: '',
  price: '',
  originalPrice: '',
  sku: '',
  stock: '0',
  categoryId: '',
  brandId: '',
  description: '',
  images: '',
  tags: '',
  isFeatured: false,
  isFlashSale: false,
}

function toFormState(p: AdminProduct): FormState {
  return {
    name: p.name,
    nameEn: p.nameEn,
    slug: p.slug,
    price: String(p.price),
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
    sku: p.sku,
    stock: String(p.stock),
    categoryId: p.categoryId,
    brandId: p.brandId,
    description: p.description,
    images: p.images.join('\n'),
    tags: p.tags.join(', '),
    isFeatured: !!p.isFeatured,
    isFlashSale: !!p.isFlashSale,
  }
}

function toProductInput(f: FormState): ProductInput {
  const price = Number(f.price)
  const originalPrice = f.originalPrice ? Number(f.originalPrice) : null
  return {
    name: f.name,
    nameEn: f.nameEn,
    slug: f.slug || slugify(f.nameEn || f.name),
    price,
    originalPrice,
    discount: originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : null,
    images: f.images.split('\n').map((s) => s.trim()).filter(Boolean),
    sku: f.sku,
    stock: Number(f.stock) || 0,
    description: f.description,
    specs: {},
    tags: f.tags.split(',').map((s) => s.trim()).filter(Boolean),
    isFeatured: f.isFeatured,
    isFlashSale: f.isFlashSale,
    brandId: f.brandId,
    categoryId: f.categoryId,
  }
}

export default function AdminProductsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: products = [], isLoading } = useProducts()
  const { data: categories = [] } = useCategories()
  const { data: brands = [] } = useBrands()

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || p.categorySlug === categoryFilter
    return matchesSearch && matchesCategory
  })

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '', brandId: brands[0]?.id ?? '' })
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (p: AdminProduct) => {
    setEditingId(p.id)
    setForm(toFormState(p))
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!form.name || !form.nameEn || !form.sku || !form.price || !form.categoryId || !form.brandId) {
      setFormError(t('admin.productsPage.errorRequired'))
      return
    }
    try {
      const input = toProductInput(form)
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, input })
      } else {
        await createProduct.mutateAsync(input)
      }
      setModalOpen(false)
    } catch {
      setFormError(t('admin.productsPage.errorFailed'))
    }
  }

  const handleDelete = async (p: AdminProduct) => {
    if (!confirm(t('admin.productsPage.confirmDelete', { name: p.nameEn }))) return
    try {
      await deleteProduct.mutateAsync(p.id)
    } catch {
      alert(t('admin.productsPage.errorDelete'))
    }
  }

  const saving = createProduct.isPending || updateProduct.isPending

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">{t('admin.productsPage.title')}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t('admin.productsPage.addBtn')}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={t('admin.productsPage.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-white outline-none focus:border-primary/50"
        >
          <option value="">{t('admin.productsPage.allCategories')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.imageCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.nameCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.categoryCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.brandCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.priceCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.stockCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.statusCol')}</th>
                <th className="px-5 py-3 text-muted font-medium">{t('admin.productsPage.actionsCol')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const status = getStockStatus(product.stock, t)
                return (
                  <tr
                    key={product.id}
                    className="border-b border-border/50 hover:bg-card-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50 bg-bg">
                        {product.images[0] && (
                          <img src={product.images[0]} alt={product.nameEn} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-white font-medium">{product.nameEn}</p>
                      <p className="text-muted text-xs font-mono">{product.sku}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-light">{product.category}</td>
                    <td className="px-5 py-3 text-muted-light">{product.brand}</td>
                    <td className="px-5 py-3 text-white font-medium">฿{product.price.toLocaleString()}</td>
                    <td className="px-5 py-3 text-muted-light">{product.stock} ชิ้น</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1.5 rounded-md hover:bg-error/10 transition-colors text-muted hover:text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <PackageX className="w-10 h-10 text-muted" />
            <p className="text-muted text-sm">{t('admin.productsPage.noProducts')}</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? t('admin.productsPage.editTitle') : t('admin.productsPage.addTitle')}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.nameThLabel')}</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.nameEnLabel')}</label>
                  <input
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.slugLabel')}</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder={t('admin.productsPage.slugPlaceholder')}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.skuLabel')}</label>
                  <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.priceLabel')}</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.originalPriceLabel')}</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.stockLabel')}</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.categoryLabel')}</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  >
                    <option value="" className="bg-card text-white">{t('admin.productsPage.selectCategory')}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-card text-white">
                        {c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.brandLabel')}</label>
                  <select
                    value={form.brandId}
                    onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  >
                    <option value="" className="bg-card text-white">{t('admin.productsPage.selectBrand')}</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id} className="bg-card text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.descriptionLabel')}</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">
                  {t('admin.productsPage.imagesLabel')}
                </label>
                <textarea
                  rows={2}
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.productsPage.tagsLabel')}</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2.5 text-sm text-muted-light cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded border-border bg-bg text-primary focus:ring-0 focus:ring-offset-0 h-4.5 w-4.5"
                  />
                  <span>{t('admin.productsPage.featuredLabel')}</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm text-muted-light cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isFlashSale}
                    onChange={(e) => setForm({ ...form, isFlashSale: e.target.checked })}
                    className="rounded border-border bg-bg text-primary focus:ring-0 focus:ring-offset-0 h-4.5 w-4.5"
                  />
                  <span>{t('admin.productsPage.flashSaleLabel')}</span>
                </label>
              </div>

              {formError && <p className="text-sm text-error">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-light hover:text-white transition-colors"
                >
                  {t('admin.productsPage.cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? t('admin.productsPage.saving') : editingId ? t('admin.productsPage.saveChangesBtn') : t('admin.productsPage.createBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
