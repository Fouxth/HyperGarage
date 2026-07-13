import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { useSettings, useUpdateSettings } from '@/api/hooks'
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t } = useTranslation()
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
        <SettingsIcon className="w-7 h-7 text-primary" /> {t('admin.settingsPage.title')}
      </h1>

      <form onSubmit={handleSave} className="max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.settingsPage.storeName')}</label>
          <input
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.settingsPage.contactEmail')}</label>
            <input
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.settingsPage.contactPhone')}</label>
            <input
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.settingsPage.address')}</label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-light">{t('admin.settingsPage.currency')}</label>
          <input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="w-32 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-sm text-muted-light cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
              className="rounded border-border bg-bg text-primary focus:ring-0 focus:ring-offset-0 h-4.5 w-4.5"
            />
            <span>{t('admin.settingsPage.maintenanceMode')}</span>
          </label>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-4 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <Save className="w-4 h-4" /> {saved ? t('admin.settingsPage.saved') : t('admin.settingsPage.saveBtn')}
        </button>
      </form>
    </motion.div>
  )
}
