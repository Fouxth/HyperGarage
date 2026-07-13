import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, Component, type ReactNode } from 'react'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: '#ff4444', background: '#0B0B0B', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1>Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ccc' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#888', fontSize: 12 }}>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

const CustomerLayout = lazy(() => import('@/components/layout/CustomerLayout'))
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'))

const HomePage = lazy(() => import('@/pages/customer/HomePage'))
const ProductsPage = lazy(() => import('@/pages/customer/ProductsPage'))
const ProductPage = lazy(() => import('@/pages/customer/ProductPage'))
const CategoriesPage = lazy(() => import('@/pages/customer/CategoriesPage'))
const BrandsPage = lazy(() => import('@/pages/customer/BrandsPage'))
const CartPage = lazy(() => import('@/pages/customer/CartPage'))
const OrderDetailPage = lazy(() => import('@/pages/customer/OrderDetailPage'))
const WishlistPage = lazy(() => import('@/pages/customer/WishlistPage'))
const AccountPage = lazy(() => import('@/pages/customer/AccountPage'))
const PromotionsPage = lazy(() => import('@/pages/customer/PromotionsPage'))
const BlogPage = lazy(() => import('@/pages/customer/BlogPage'))
const LegalPage = lazy(() => import('@/pages/customer/LegalPage'))
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminProductsPage = lazy(() => import('@/pages/admin/ProductsPage'))
const AdminCategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'))
const AdminBrandsPage = lazy(() => import('@/pages/admin/BrandsPage'))
const AdminOrdersPage = lazy(() => import('@/pages/admin/OrdersPage'))
const InventoryPage = lazy(() => import('@/pages/admin/InventoryPage'))
const CompatibilityPage = lazy(() => import('@/pages/admin/CompatibilityPage'))
const CouponsPage = lazy(() => import('@/pages/admin/CouponsPage'))
const FlashSalePage = lazy(() => import('@/pages/admin/FlashSalePage'))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const RolesPage = lazy(() => import('@/pages/admin/RolesPage'))
const PaymentsPage = lazy(() => import('@/pages/admin/PaymentsPage'))
const ShippingPage = lazy(() => import('@/pages/admin/ShippingPage'))
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const LogsPage = lazy(() => import('@/pages/admin/LogsPage'))
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'))
const BackupPage = lazy(() => import('@/pages/admin/BackupPage'))
const MaintenancePage = lazy(() => import('@/pages/admin/MaintenancePage'))

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-muted text-sm tracking-widest uppercase">Loading</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="legal/:type" element={<LegalPage />} />
        </Route>
        <Route path="admin/login" element={<LoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="compatibility" element={<CompatibilityPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="flash-sale" element={<FlashSalePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="backup" element={<BackupPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
        </Route>
      </Routes>
    </Suspense>
    </ErrorBoundary>
  )
}
