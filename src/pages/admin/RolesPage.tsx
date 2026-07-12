import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const roles = [
  { name: 'Owner', description: 'Full access to every admin section, including product/catalog CRUD, orders, and store settings.' },
  { name: 'Staff', description: 'Can manage products, categories, brands, inventory, and view orders. Cannot change store-wide settings.' },
  { name: 'Support', description: 'Read-only access to orders and customers for handling inquiries.' },
]

export default function RolesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text tracking-tight">
        <Shield className="w-7 h-7 text-primary" /> Roles
      </h1>
      <p className="text-sm text-muted">
        HyperGarage currently has a single admin login shared by the store operator — there is no multi-user authentication system yet.
        The roles below describe the intended permission model for when multi-admin accounts are introduced.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {roles.map((role) => (
          <div key={role.name} className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold text-white">{role.name}</h2>
            <p className="mt-2 text-sm text-muted-light">{role.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
