import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { useSettings, useUpdateSettings } from '@/api/hooks'

export default function SettingsPage() {
  const { data: settings } = useSettings()
  const updateSettings = useUpdateSettings()
  const [form, setForm] = useState({
    storeName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    currency: 'THB',
    maintenanceMode: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        currency: settings.currency,
        maintenanceMode: settings.maintenanceMode,
      })
    }
  }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateSettings.mutateAsync(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <SettingsIcon className="w-7 h-7 text-primary" /> Store Settings
      </h1>

      <form onSubmit={handleSave} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-light">Store Name</label>
          <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-light">Contact Email</label>
            <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-light">Contact Phone</label>
            <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-light">Address</label>
          <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-light">Currency</label>
          <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-32 rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-light">
          <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} className="rounded border-border" />
          Maintenance mode (see Admin → Maintenance for details)
        </label>
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </motion.div>
  )
}
