import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'
import { useSettings, useUpdateSettings } from '@/api/hooks'

export default function MaintenancePage() {
  const { data: settings } = useSettings()
  const updateSettings = useUpdateSettings()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Wrench className="w-7 h-7 text-primary" /> Maintenance
      </h1>
      <p className="text-sm text-muted">
        Toggling maintenance mode here updates the same store setting shown in Admin → Settings. When ON, customers
        are shown a maintenance screen instead of the storefront — the admin panel stays accessible so you can turn
        it back off.
      </p>

      <div className="max-w-xl rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Maintenance Mode</p>
            <p className="text-xs text-muted">
              Currently {settings?.maintenanceMode ? 'ON' : 'OFF'}
            </p>
          </div>
          <button
            onClick={() => settings && updateSettings.mutate({ maintenanceMode: !settings.maintenanceMode })}
            className={`relative h-7 w-12 rounded-full transition-colors ${settings?.maintenanceMode ? 'bg-primary' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${settings?.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
