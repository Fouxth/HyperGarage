import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Minus, Plus, PackageX } from 'lucide-react'
import { useProducts, useUpdateStock } from '@/api/hooks'

function getStockStatus(stock: number) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'bg-error/15 text-error' }
  if (stock < 10) return { label: 'Low Stock', cls: 'bg-warning/15 text-warning' }
  return { label: 'In Stock', cls: 'bg-success/15 text-success' }
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const { data: products = [], isLoading } = useProducts()
  const updateStock = useUpdateStock()

  const filtered = products.filter(
    (p) =>
      !search ||
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Inventory</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Product</th>
                <th className="px-5 py-3 text-muted font-medium">SKU</th>
                <th className="px-5 py-3 text-muted font-medium">Stock</th>
                <th className="px-5 py-3 text-muted font-medium">Status</th>
                <th className="px-5 py-3 text-muted font-medium">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const status = getStockStatus(product.stock)
                return (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-border/50 bg-bg flex-shrink-0">
                          {product.images[0] && (
                            <img src={product.images[0]} alt={product.nameEn} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-white font-medium">{product.nameEn}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-light">{product.sku}</td>
                    <td className="px-5 py-3 text-white font-semibold">{product.stock}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStock.mutate({ id: product.id, stock: Math.max(0, product.stock - 1) })}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-white hover:bg-bg"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateStock.mutate({ id: product.id, stock: product.stock + 1 })}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-white hover:bg-bg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateStock.mutate({ id: product.id, stock: product.stock + 50 })}
                          className="rounded-md border border-border px-2 py-1 text-xs text-muted-light hover:text-white hover:bg-bg"
                        >
                          Restock +50
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
            <p className="text-muted text-sm">No products match your search.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
