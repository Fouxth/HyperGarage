import { motion } from 'framer-motion'
import { HardDrive, Database } from 'lucide-react'

export default function BackupPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <HardDrive className="w-7 h-7 text-primary" /> Backup
      </h1>

      <div className="max-w-xl rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted" />
          <div>
            <p className="text-sm text-white">
              HyperGarage's data lives in a managed cloud PostgreSQL instance. Automated backup/restore tooling
              isn't wired into this admin panel yet — database backups should be taken directly on the Postgres
              host (e.g. <code className="rounded bg-bg px-1 py-0.5 text-xs">pg_dump</code>) until that integration exists.
            </p>
            <p className="mt-3 text-xs text-muted">
              This page intentionally does not simulate a backup system — building a fake "Backup Now" button
              here would be misleading without real storage behind it.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
