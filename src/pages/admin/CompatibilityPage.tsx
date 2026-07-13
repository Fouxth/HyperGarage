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
import { useTranslation } from 'react-i18next'

export default function CompatibilityPage() {
  const { t } = useTranslation()
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
      <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">{t('admin.compatibilityPage.title')}</h1>
      <p className="text-sm text-muted">
        {t('admin.compatibilityPage.description')}
      </p>

      <div className="flex gap-2">
        <input
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder={t('admin.compatibilityPage.brandPlaceholder')}
          className="max-w-xs flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={() => {
            if (!newBrand.trim()) return
            createBrand.mutate(newBrand.trim())
            setNewBrand('')
          }}
          className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> {t('admin.compatibilityPage.addBrandBtn')}
        </button>
      </div>

      <div className="space-y-3">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-xl border border-border bg-card p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <button onClick={() => toggle(brand.id)} className="flex items-center gap-2 text-left">
                {expanded.has(brand.id) ? <ChevronDown className="w-4 h-4 text-muted" /> : <ChevronRight className="w-4 h-4 text-muted" />}
                <span className="font-semibold text-white text-base">{brand.name}</span>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">{brand.models.length} {t('admin.compatibilityPage.modelsCount')}</span>
              </button>
              <button
                onClick={() => confirm(t('admin.compatibilityPage.confirmDeleteBrand', { name: brand.name })) && deleteBrand.mutate(brand.id)}
                className="p-1.5 rounded-md hover:bg-error/10 text-muted hover:text-error transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expanded.has(brand.id) && (
              <div className="mt-4 space-y-4 border-t border-border pt-4 pl-6">
                <div className="flex gap-2">
                  <input
                    value={newModel[brand.id] ?? ''}
                    onChange={(e) => setNewModel({ ...newModel, [brand.id]: e.target.value })}
                    placeholder={t('admin.compatibilityPage.modelPlaceholder')}
                    className="max-w-xs flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={() => {
                      const name = newModel[brand.id]?.trim()
                      if (!name) return
                      createModel.mutate({ vehicleBrandId: brand.id, name })
                      setNewModel({ ...newModel, [brand.id]: '' })
                    }}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-light hover:text-white hover:bg-bg transition-colors"
                  >
                    {t('admin.compatibilityPage.addModelBtn')}
                  </button>
                </div>

                {brand.models.map((model) => (
                  <div key={model.id} className="rounded-lg border border-border/60 p-3 bg-bg/25">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                      <span className="text-sm font-semibold text-white">{model.name}</span>
                      <button
                        onClick={() => confirm(t('admin.compatibilityPage.confirmDeleteModel', { name: model.name })) && deleteModel.mutate(model.id)}
                        className="p-1 rounded-md hover:bg-error/10 text-muted hover:text-error transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 space-y-1.5 pl-2 border-l border-primary/25 mb-3">
                      {model.generations.map((gen) => (
                        <div key={gen.id} className="flex items-center justify-between text-xs text-muted-light py-1">
                          <span>
                            <strong className="text-white font-medium">{gen.name}</strong> ({gen.years}) · <span className="italic text-muted">{gen.engines.join(', ') || t('admin.compatibilityPage.noEngines')}</span>
                          </span>
                          <button
                            onClick={() => deleteGeneration.mutate(gen.id)}
                            className="p-1 rounded-md hover:bg-error/10 text-muted hover:text-error transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <input
                        value={newGen[model.id]?.name ?? ''}
                        onChange={(e) => setNewGen({ ...newGen, [model.id]: { ...newGen[model.id], name: e.target.value, years: newGen[model.id]?.years ?? '', engines: newGen[model.id]?.engines ?? '' } })}
                        placeholder={t('admin.compatibilityPage.generationPlaceholder')}
                        className="w-32 rounded-md border border-border bg-bg px-2 py-1 text-xs text-white outline-none focus:border-primary transition-colors"
                      />
                      <input
                        value={newGen[model.id]?.years ?? ''}
                        onChange={(e) => setNewGen({ ...newGen, [model.id]: { ...newGen[model.id], years: e.target.value, name: newGen[model.id]?.name ?? '', engines: newGen[model.id]?.engines ?? '' } })}
                        placeholder={t('admin.compatibilityPage.yearsPlaceholder')}
                        className="w-32 rounded-md border border-border bg-bg px-2 py-1 text-xs text-white outline-none focus:border-primary transition-colors"
                      />
                      <input
                        value={newGen[model.id]?.engines ?? ''}
                        onChange={(e) => setNewGen({ ...newGen, [model.id]: { ...newGen[model.id], engines: e.target.value, name: newGen[model.id]?.name ?? '', years: newGen[model.id]?.years ?? '' } })}
                        placeholder={t('admin.compatibilityPage.enginesPlaceholder')}
                        className="w-40 rounded-md border border-border bg-bg px-2 py-1 text-xs text-white outline-none focus:border-primary transition-colors"
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
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-muted-light hover:text-white hover:bg-bg transition-colors"
                      >
                        {t('admin.compatibilityPage.addGenerationBtn')}
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
