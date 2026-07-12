import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, X } from 'lucide-react'
import { useProducts, useUpdateFlashSale } from '@/api/hooks'
import type { AdminProduct } from '@/api/client'

export default function FlashSalePage() {
  const { data: products = [] } = useProducts()
  const updateFlashSale = useUpdateFlashSale()
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [discount, setDiscount] = useState('')
  const [endDate, setEndDate] = useState('')

  const active = products.filter((p) => p.isFlashSale)
  const inactive = products.filter((p) => !p.isFlashSale)

  const openEdit = (p: AdminProduct) => {
    setEditing(p)
    setDiscount(p.discount != null ? String(p.discount) : '20')
    setEndDate(p.flashSaleEnd ? p.flashSaleEnd.slice(0, 16) : '')
  }

  const activate = async () => {
    if (!editing) return
    await updateFlashSale.mutateAsync({
      id: editing.id,
      input: { isFlashSale: true, discount: Number(discount) || null, flashSaleEnd: endDate || null },
    })
    setEditing(null)
  }

  const deactivate = (p: AdminProduct) => {
    updateFlashSale.mutate({ id: p.id, input: { isFlashSale: false, discount: null, flashSaleEnd: null } })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-8">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Zap className="w-7 h-7 text-primary" /> Flash Sale
      </h1>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">Active Flash Sales ({active.length})</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((p) => (
            <div key={p.id} className="rounded-xl border border-primary/30 bg-card p-4">
              <div className="flex items-center gap-3">
                <img src={p.images[0]} alt={p.nameEn} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{p.nameEn}</p>
                  <p className="text-xs text-primary">-{p.discount}% · ฿{p.price.toLocaleString()}</p>
                </div>
              </div>
              {p.flashSaleEnd && (
                <p className="mt-2 text-xs text-muted">Ends {new Date(p.flashSaleEnd).toLocaleString()}</p>
              )}
              <button onClick={() => deactivate(p)} className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs text-muted-light hover:text-white hover:bg-bg">
                Deactivate
              </button>
            </div>
          ))}
          {active.length === 0 && <p className="text-sm text-muted">No active flash sales.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-light">All Products</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Product</th>
                <th className="px-5 py-3 text-muted font-medium">Price</th>
                <th className="px-5 py-3 text-muted font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {inactive.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-5 py-3 text-white">{p.nameEn}</td>
                  <td className="px-5 py-3 text-muted-light">฿{p.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => openEdit(p)} className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25">
                      Start Flash Sale
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing.nameEn}</h2>
              <button onClick={() => setEditing(null)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">Discount %</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-light">Ends at</label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <button onClick={activate} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">
                Activate Flash Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
