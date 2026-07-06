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
const ProductPage = lazy(() => import('@/pages/customer/ProductPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))

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
          <Route path="product/:slug" element={<ProductPage />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
    </ErrorBoundary>
  )
}
