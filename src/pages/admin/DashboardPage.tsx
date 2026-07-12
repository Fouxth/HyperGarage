import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, type Variants } from 'framer-motion'
import {
  DollarSign,
  ShoppingCart,
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye as ViewIcon,
  Printer,
  AlertTriangle,
  Star,
  Bell,
  Package,
  Clock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useProducts, useOrders, useDashboardStats, useRecentReviews } from '@/api/hooks'
import type { Order } from '@/types'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const orderStatusFilters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'] as const

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-warning/15 text-warning',
  processing: 'bg-info/15 text-info',
  shipped: 'bg-purple-500/15 text-purple-400',
  delivered: 'bg-success/15 text-success',
  cancelled: 'bg-error/15 text-error',
}

const paymentStatusColors: Record<Order['paymentStatus'], string> = {
  pending: 'bg-warning/15 text-warning',
  paid: 'bg-success/15 text-success',
  refunded: 'bg-error/15 text-error',
}

const categoryColors: Record<string, string> = {
  'exhaust': '#EF4444',
  'suspension': '#3B82F6',
  'brake': '#F59E0B',
  'wheel': '#8B5CF6',
  'engine': '#22C55E',
  'electronics': '#EC4899',
  'exterior': '#14B8A6',
  'interior': '#F97316',
}

function getStockStatus(stock: number) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'bg-error/15 text-error' }
  if (stock < 10) return { label: 'Low Stock', cls: 'bg-warning/15 text-warning' }
  return { label: 'In Stock', cls: 'bg-success/15 text-success' }
}

// Custom tooltip for Recharts
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-xl">
      <p className="text-muted-light text-xs mb-1">{label}</p>
      <p className="text-white font-semibold">฿{payload[0].value.toLocaleString()}</p>
    </div>
  )
}

const chartPeriods = ['7D', '1M', '3M', '1Y'] as const
type ChartPeriod = typeof chartPeriods[number]

export default function DashboardPage() {
  const { t } = useTranslation()
  const [productSearch, setProductSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState<string>('All')
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('1Y')

  const { data: products = [] } = useProducts()
  const { data: orders = [] } = useOrders()
  const { data: dashboardStats } = useDashboardStats()
  const { data: recentReviews = [] } = useRecentReviews(3)

  const statCards = [
    {
      key: 'revenue',
      icon: DollarSign,
      value: `฿${(dashboardStats?.stats.revenue ?? 0).toLocaleString()}`,
      labelKey: 'admin.revenue',
      fallback: 'Total Revenue',
      accent: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
    },
    {
      key: 'orders',
      icon: ShoppingCart,
      value: (dashboardStats?.stats.orders ?? 0).toLocaleString(),
      labelKey: 'admin.orders',
      fallback: 'Total Orders',
      accent: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
    },
    {
      key: 'totalProducts',
      icon: Package,
      value: (dashboardStats?.stats.totalProducts ?? 0).toLocaleString(),
      labelKey: 'admin.totalProducts',
      fallback: 'Total Products',
      accent: 'text-violet-400',
      iconBg: 'bg-violet-500/10',
    },
    {
      key: 'customers',
      icon: Users,
      value: (dashboardStats?.stats.customers ?? 0).toLocaleString(),
      labelKey: 'admin.customers',
      fallback: 'Customers',
      accent: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
    },
  ]

  const displayProducts = products.slice(0, 5).filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(productSearch.toLowerCase())
  )

  const filteredOrders = orderFilter === 'All'
    ? orders
    : orders.filter((o) => o.status === orderFilter.toLowerCase())

  const lowStockProducts = products.filter((p) => p.stock < 10)

  const notifications = [
    ...orders.slice(0, 1).map((o) => ({
      icon: Package,
      text: `Latest order ${o.orderNumber} — ${o.status}`,
      time: new Date(o.createdAt).toLocaleDateString(),
      type: 'info' as const,
    })),
    ...lowStockProducts.slice(0, 2).map((p) => ({
      icon: AlertTriangle,
      text: `${p.nameEn} stock is low (${p.stock} left)`,
      time: '',
      type: 'warning' as const,
    })),
  ]

  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">
          {t('admin.dashboard', 'Dashboard')}
        </h1>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-light">
            <Clock className="w-3.5 h-3.5" />
            Today &middot; {today}
          </span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              className="bg-card border border-border rounded-xl p-5 hover-lift"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`w-5 h-5 ${stat.accent}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted">{t(stat.labelKey, stat.fallback)}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Overview Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {t('admin.salesOverview', 'Sales Overview')}
            </h2>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-bg">
              {chartPeriods.map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${chartPeriod === p ? 'bg-card text-white' : 'text-muted hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardStats?.salesByMonth ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D6001C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#D6001C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2B2B2B" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888888', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888888', fontSize: 12 }}
                  tickFormatter={(v: number) => `฿${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D6001C"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#D6001C', stroke: '#0B0B0B', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Sales Pie Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('admin.categorySales', 'Category Sales')}
          </h2>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardStats?.categorySales ?? []}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {(dashboardStats?.categorySales ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-muted-light text-xs">{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    background: '#161616',
                    border: '1px solid #2B2B2B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Product Management Table */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border">
          <h2 className="text-lg font-semibold text-white">
            {t('admin.productManagement', 'Product Management')}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder={t('admin.searchProducts', 'Search products...')}
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-bg border border-border rounded-lg text-sm text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors w-full sm:w-56"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shrink-0">
              <Plus className="w-4 h-4" />
              {t('admin.addProduct', 'Add Product')}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Image</th>
                <th className="px-5 py-3 text-muted font-medium">Product Name</th>
                <th className="px-5 py-3 text-muted font-medium">Category</th>
                <th className="px-5 py-3 text-muted font-medium">Price</th>
                <th className="px-5 py-3 text-muted font-medium">Stock</th>
                <th className="px-5 py-3 text-muted font-medium">Status</th>
                <th className="px-5 py-3 text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.map((product) => {
                const status = getStockStatus(product.stock)
                const catColor = categoryColors[product.categorySlug] || '#888888'
                return (
                  <tr
                    key={product.id}
                    className="border-b border-border/50 hover:bg-card-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.nameEn}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: catColor + '30', color: catColor }}
                          >
                            {product.brand.substring(0, 2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-white font-medium">{product.nameEn}</p>
                      <p className="text-muted text-xs">{product.sku}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-light">{product.category}</td>
                    <td className="px-5 py-3 text-white font-medium">฿{product.price.toLocaleString()}</td>
                    <td className="px-5 py-3 text-muted-light">{product.stock}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-error/10 transition-colors text-muted hover:text-error">
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
      </motion.div>

      {/* Recent Orders Table */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-white">
              {t('admin.recentOrders', 'Recent Orders')}
            </h2>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {orderStatusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setOrderFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  orderFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-bg text-muted hover:text-white hover:bg-card-hover'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted font-medium">Order #</th>
                <th className="px-5 py-3 text-muted font-medium">Customer</th>
                <th className="px-5 py-3 text-muted font-medium">Total</th>
                <th className="px-5 py-3 text-muted font-medium">Payment</th>
                <th className="px-5 py-3 text-muted font-medium">Status</th>
                <th className="px-5 py-3 text-muted font-medium">Date</th>
                <th className="px-5 py-3 text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border/50 hover:bg-card-hover transition-colors"
                >
                  <td className="px-5 py-3 text-white font-medium font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {order.customer.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-muted-light">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-white font-medium">฿{order.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted text-xs">{order.createdAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white">
                        <ViewIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-bg transition-colors text-muted hover:text-white">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Low Stock Alert */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-white">
              {t('admin.lowStock', 'Low Stock Alert')}
            </h2>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="space-y-1.5 p-3 rounded-lg bg-bg border border-border/50 hover:border-warning/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium truncate flex-1 mr-3">{product.nameEn}</p>
                  <span className="text-warning text-xs font-bold shrink-0">{product.stock} left</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-warning transition-all"
                    style={{ width: `${Math.min(100, (product.stock / 15) * 100)}%` }}
                  />
                </div>
                <p className="text-muted text-xs">{product.sku}</p>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-muted text-sm text-center py-4">No low stock items</p>
            )}
          </div>
        </motion.div>

        {/* Latest Reviews */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-white">
              {t('admin.latestReviews', 'Latest Reviews')}
            </h2>
          </div>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 rounded-lg bg-bg border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{review.userName}</span>
                  <span className="text-muted text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < review.rating ? 'text-warning fill-warning' : 'text-border'}`}
                    />
                  ))}
                </div>
                <p className="text-muted-light text-xs leading-relaxed">{review.comment}</p>
              </div>
            ))}
            {recentReviews.length === 0 && (
              <p className="text-muted text-sm text-center py-4">No reviews yet</p>
            )}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-info" />
            <h2 className="text-lg font-semibold text-white">
              {t('admin.notifications', 'Notifications')}
            </h2>
          </div>
          <div className="space-y-3">
            {notifications.map((notif, i) => {
              const NotifIcon = notif.icon
              const iconColor = notif.type === 'warning' ? 'text-warning' : 'text-info'
              const bgColor = notif.type === 'warning' ? 'bg-warning/10' : 'bg-info/10'
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-bg border border-border/50 hover:border-border transition-colors"
                >
                  <div className={`p-1.5 rounded-md ${bgColor} shrink-0 mt-0.5`}>
                    <NotifIcon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-light text-xs leading-relaxed">{notif.text}</p>
                    {notif.time && <p className="text-muted text-xs mt-1">{notif.time}</p>}
                  </div>
                </div>
              )
            })}
            {notifications.length === 0 && (
              <p className="text-muted text-sm text-center py-4">No notifications yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
