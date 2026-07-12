import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import {
  useVehicleTree,
  useCreateVehicleBrand,
  useDeleteVehicleBrand,
  useCreateVehicleModel,
  useDeleteVehicleModel,
  useCreateVehicleGeneration,
  useDeleteVehicleGeneration,
} from '@/api/hooks'

export default function CompatibilityPage() {
  const { data: brands = [] } = useVehicleTree()
  const createBrand = useCreateVehicleBrand()
  const deleteBrand = useDeleteVehicleBrand()
  const createModel = useCreateVehicleModel()
  const deleteModel = useDeleteVehicleModel()
  const createGeneration = useCreateVehicleGeneration()
  const deleteGeneration = useDeleteVehicleGeneration()

  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [newBrand, setNewBrand] = useState('')
  const [newModel, setNewModel] = useState<Record<string, string>>({})
  const [newGen, setNewGen] = useState<Record<string, { name: string; years: string; engines: string }>>({})

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">Vehicle Compatibility DB</h1>
      <p className="text-sm text-muted">
        Manage the vehicle brand / model / generation taxonomy used by the customer-facing compatibility checker.
      </p>

      <div className="flex gap-2">
        <input
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="New vehicle brand (e.g. Toyota)"
          className="max-w-xs flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={() => {
            if (!newBrand.trim()) return
            createBrand.mutate(newBrand.trim())
            setNewBrand('')
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      <div className="space-y-3">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <button onClick={() => toggle(brand.id)} className="flex items-center gap-2 text-left">
                {expanded.has(brand.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="font-semibold text-white">{brand.name}</span>
                <span className="text-xs text-muted">{brand.models.length} models</span>
              </button>
              <button
                onClick={() => confirm(`Delete brand "${brand.name}"?`) && deleteBrand.mutate(brand.id)}
                className="p-1.5 rounded-md hover:bg-error/10 text-muted hover:text-error"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expanded.has(brand.id) && (
              <div className="mt-4 space-y-3 border-t border-border pt-4 pl-6">
                <div className="flex gap-2">
                  <input
                    value={newModel[brand.id] ?? ''}
                    onChange={(e) => setNewModel({ ...newModel, [brand.id]: e.target.value })}
                    placeholder="New model (e.g. Corolla)"
                    className="max-w-xs flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => {
                      const name = newModel[brand.id]?.trim()
                      if (!name) return
                      createModel.mutate({ vehicleBrandId: brand.id, name })
                      setNewModel({ ...newModel, [brand.id]: '' })
                    }}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-muted-light hover:text-white hover:bg-bg"
                  >
                    Add Model
                  </button>
                </div>

                {brand.models.map((model) => (
                  <div key={model.id} className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{model.name}</span>
                      <button
                        onClick={() => confirm(`Delete model "${model.name}"?`) && deleteModel.mutate(model.id)}
                        className="p-1 rounded-md hover:bg-error/10 text-muted hover:text-error"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      {model.generations.map((gen) => (
                        <div key={gen.id} className="flex items-center justify-between text-xs text-muted-light">
                          <span>
                            {gen.name} ({gen.years}) · {gen.engines.join(', ') || 'no engines listed'}
                          </span>
                          <button
                            onClick={() => deleteGeneration.mutate(gen.id)}
                            className="p-1 rounded-md hover:bg-error/10 text-muted hover:text-error"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <input
                        value={newGen[model.id]?.name ?? ''}
                        onChange={(e) => setNewGen({ ...newGen, [model.id]: { ...newGen[model.id], name: e.target.value, years: newGen[model.id]?.years ?? '', engines: newGen[model.id]?.engines ?? '' } })}
                        placeholder="Gen (e.g. 12th Gen)"
                        className="w-32 rounded-md border border-border bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                      />
                      <input
                        value={newGen[model.id]?.years ?? ''}
                        onChange={(e) => setNewGen({ ...newGen, [model.id]: { ...newGen[model.id], years: e.target.value, name: newGen[model.id]?.name ?? '', engines: newGen[model.id]?.engines ?? '' } })}
                        placeholder="Years (2019-2024)"
                        className="w-32 rounded-md border border-border bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                      />
                      <input
                        value={newGen[model.id]?.engines ?? ''}
                        onChange={(e) => setNewGen({ ...newGen, [model.id]: { ...newGen[model.id], engines: e.target.value, name: newGen[model.id]?.name ?? '', years: newGen[model.id]?.years ?? '' } })}
                        placeholder="Engines, comma-sep"
                        className="w-40 rounded-md border border-border bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => {
                          const g = newGen[model.id]
                          if (!g?.name || !g?.years) return
                          createGeneration.mutate({
                            vehicleModelId: model.id,
                            name: g.name,
                            years: g.years,
                            engines: g.engines.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                          setNewGen({ ...newGen, [model.id]: { name: '', years: '', engines: '' } })
                        }}
                        className="rounded-md border border-border px-2 py-1 text-xs text-muted-light hover:text-white hover:bg-bg"
                      >
                        Add Gen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
