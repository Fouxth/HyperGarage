import type { Product, Category, Brand, Vehicle, Order, AdminStats, SalesData, CategorySales, Coupon, StoreSettings, ActivityEvent, ReportsData, ProductVariant, ReturnRecord, ReturnStatus, AdminCustomer, AppNotification, AuditLogEntry } from '@/types'

interface DashboardStatsResponse {
  stats: AdminStats
  salesByMonth: SalesData[]
  categorySales: CategorySales[]
}

export interface RecentReview {
  id: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ProductReview extends RecentReview {
  productId: string
  images: string[]
}

export interface CreateReviewInput {
  productId: string
  userName: string
  rating: number
  comment: string
  images?: string[]
}

export interface AdminProduct extends Product {
  brandId: string
  categoryId: string
}

export interface ProductInput {
  name: string
  nameEn: string
  slug: string
  price: number
  originalPrice?: number | null
  discount?: number | null
  images: string[]
  sku: string
  stock: number
  description: string
  specs: Record<string, string>
  tags: string[]
  isFeatured?: boolean
  isFlashSale?: boolean
  brandId: string
  categoryId: string
}

export interface CategoryInput {
  name: string
  nameEn: string
  slug: string
  icon: string
  image?: string | null
}

export interface BrandInput {
  name: string
  slug: string
  logo?: string | null
  country: string
}

export interface CheckoutInput {
  customer: string
  phone: string
  shippingAddress: string
  paymentMethod: string
  items: { productId: string; variantId?: string; quantity: number }[]
}

export interface VariantInput {
  name: string
  sku: string
  priceDelta?: number
  stock?: number
  image?: string | null
}

export interface ReturnInput {
  orderId: string
  reason: string
}

export interface UpdateReturnStatusInput {
  status: ReturnStatus
  refundAmount?: number
  note?: string
}

export interface ShippingInput {
  carrier?: string
  trackingNumber?: string
}

export interface CouponInput {
  code: string
  type: 'percent' | 'fixed'
  value: number
  active?: boolean
  usageLimit?: number | null
  expiresAt?: string | null
}

export interface OrdersQuery {
  status?: string
  phone?: string
  orderNumber?: string
}

export interface VehicleGenerationNode {
  id: string
  name: string
  years: string
  engines: string[]
  vehicleModelId: string
}

export interface VehicleModelNode {
  id: string
  name: string
  vehicleBrandId: string
  generations: VehicleGenerationNode[]
}

export interface VehicleBrandNode {
  id: string
  name: string
  models: VehicleModelNode[]
}

export interface FlashSaleInput {
  isFlashSale: boolean
  discount?: number | null
  flashSaleEnd?: string | null
}

export interface ProductsQuery {
  featured?: boolean
  flashSale?: boolean
  category?: string
  brand?: string
  q?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  vehicleBrand?: string
  vehicleModel?: string
  vehicleGeneration?: string
  vehicleEngine?: string
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('hypergarage_admin_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
  })
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('hypergarage_admin_token')
      localStorage.removeItem('hypergarage_admin_user')
      window.location.href = `${import.meta.env.BASE_URL || '/'}admin/login`
    }
    throw new Error(`API ${path} failed: ${res.status}`)
  }
  return res.json()
}

async function send<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: getHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('hypergarage_admin_token')
      localStorage.removeItem('hypergarage_admin_user')
      window.location.href = `${import.meta.env.BASE_URL || '/'}admin/login`
    }
    throw new Error(`API ${method} ${path} failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

function buildQuery(params?: ProductsQuery) {
  const qs = new URLSearchParams()
  if (params?.featured) qs.set('featured', 'true')
  if (params?.flashSale) qs.set('flashSale', 'true')
  if (params?.category) qs.set('category', params.category)
  if (params?.brand) qs.set('brand', params.brand)
  if (params?.q) qs.set('q', params.q)
  if (params?.sort) qs.set('sort', params.sort)
  if (params?.minPrice != null) qs.set('minPrice', String(params.minPrice))
  if (params?.maxPrice != null) qs.set('maxPrice', String(params.maxPrice))
  if (params?.vehicleBrand) qs.set('vehicleBrand', params.vehicleBrand)
  if (params?.vehicleModel) qs.set('vehicleModel', params.vehicleModel)
  if (params?.vehicleGeneration) qs.set('vehicleGeneration', params.vehicleGeneration)
  if (params?.vehicleEngine) qs.set('vehicleEngine', params.vehicleEngine)
  return qs.toString()
}

export const api = {
  products: (params?: ProductsQuery) => {
    const query = buildQuery(params)
    return get<AdminProduct[]>(`/products${query ? `?${query}` : ''}`)
  },
  product: (slug: string) => get<Product>(`/products/${slug}`),
  createProduct: (input: ProductInput) => send<AdminProduct>('POST', '/products', input),
  updateProduct: (id: string, input: ProductInput) => send<AdminProduct>('PUT', `/products/${id}`, input),
  deleteProduct: (id: string) => send<void>('DELETE', `/products/${id}`),
  updateStock: (id: string, stock: number) => send<AdminProduct>('PATCH', `/products/${id}/stock`, { stock }),
  updateFlashSale: (id: string, input: FlashSaleInput) =>
    send<AdminProduct>('PATCH', `/products/${id}/flash-sale`, input),
  categories: () => get<Category[]>('/categories'),
  createCategory: (input: CategoryInput) => send<Category>('POST', '/categories', input),
  updateCategory: (id: string, input: CategoryInput) => send<Category>('PUT', `/categories/${id}`, input),
  deleteCategory: (id: string) => send<void>('DELETE', `/categories/${id}`),
  brands: () => get<Brand[]>('/brands'),
  createBrand: (input: BrandInput) => send<Brand>('POST', '/brands', input),
  updateBrand: (id: string, input: BrandInput) => send<Brand>('PUT', `/brands/${id}`, input),
  deleteBrand: (id: string) => send<void>('DELETE', `/brands/${id}`),
  vehicles: () => get<Vehicle[]>('/vehicles'),
  vehicleTree: () => get<VehicleBrandNode[]>('/vehicles/tree'),
  createVehicleBrand: (name: string) => send<VehicleBrandNode>('POST', '/vehicles/brands', { name }),
  deleteVehicleBrand: (id: string) => send<void>('DELETE', `/vehicles/brands/${id}`),
  createVehicleModel: (vehicleBrandId: string, name: string) =>
    send<VehicleModelNode>('POST', '/vehicles/models', { vehicleBrandId, name }),
  deleteVehicleModel: (id: string) => send<void>('DELETE', `/vehicles/models/${id}`),
  createVehicleGeneration: (vehicleModelId: string, name: string, years: string, engines: string[]) =>
    send<VehicleGenerationNode>('POST', '/vehicles/generations', { vehicleModelId, name, years, engines }),
  deleteVehicleGeneration: (id: string) => send<void>('DELETE', `/vehicles/generations/${id}`),
  orders: (params?: OrdersQuery) => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    if (params?.phone) qs.set('phone', params.phone)
    if (params?.orderNumber) qs.set('orderNumber', params.orderNumber)
    const query = qs.toString()
    return get<Order[]>(`/orders${query ? `?${query}` : ''}`)
  },
  order: (id: string) => get<Order>(`/orders/${id}`),
  checkout: async (input: CheckoutInput) => {
    const customerToken = localStorage.getItem('hypergarage_customer_token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (customerToken) headers['Authorization'] = `Bearer ${customerToken}`
    const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers, body: JSON.stringify(input) })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `API POST /orders failed: ${res.status}`)
    return res.json() as Promise<Order>
  },
  updateOrderStatus: (id: string, status: Order['status']) =>
    send<Order>('PATCH', `/orders/${id}/status`, { status }),
  updatePaymentStatus: (id: string, paymentStatus: Order['paymentStatus']) =>
    send<Order>('PATCH', `/orders/${id}/payment`, { paymentStatus }),
  dashboardStats: () => get<DashboardStatsResponse>('/stats/dashboard'),
  recentReviews: (limit = 5) => get<RecentReview[]>(`/reviews/recent?limit=${limit}`),
  productReviews: (productId: string) => get<ProductReview[]>(`/reviews?productId=${productId}`),
  createReview: (input: CreateReviewInput) => send<ProductReview>('POST', '/reviews', input),
  coupons: () => get<Coupon[]>('/coupons'),
  createCoupon: (input: CouponInput) => send<Coupon>('POST', '/coupons', input),
  updateCoupon: (id: string, input: CouponInput) => send<Coupon>('PUT', `/coupons/${id}`, input),
  deleteCoupon: (id: string) => send<void>('DELETE', `/coupons/${id}`),
  settings: () => get<StoreSettings>('/settings'),
  updateSettings: (input: Partial<StoreSettings>) => send<StoreSettings>('PUT', '/settings', input),
  activity: () => get<ActivityEvent[]>('/stats/activity'),
  reports: () => get<ReportsData>('/stats/reports'),
  updateShipping: (id: string, input: ShippingInput) => send<Order>('PATCH', `/orders/${id}/shipping`, input),
  createVariant: (productId: string, input: VariantInput) => send<AdminProduct>('POST', `/products/${productId}/variants`, input),
  updateVariant: (productId: string, variantId: string, input: VariantInput) =>
    send<AdminProduct>('PATCH', `/products/${productId}/variants/${variantId}`, input),
  deleteVariant: (productId: string, variantId: string) =>
    send<AdminProduct>('DELETE', `/products/${productId}/variants/${variantId}`),
  returns: (status?: string) => get<ReturnRecord[]>(`/returns${status && status !== 'All' ? `?status=${status}` : ''}`),
  createReturn: (input: ReturnInput) => send<ReturnRecord>('POST', '/returns', input),
  updateReturnStatus: (id: string, input: UpdateReturnStatusInput) =>
    send<ReturnRecord>('PATCH', `/returns/${id}/status`, input),
  customers: () => get<AdminCustomer[]>('/customers'),
  updateCustomer: (id: string, input: { name?: string; phone?: string; banned?: boolean }) =>
    send<AdminCustomer>('PATCH', `/customers/${id}`, input),
  notifications: (read?: boolean) => get<AppNotification[]>(`/notifications${read !== undefined ? `?read=${read}` : ''}`),
  markNotificationRead: (id: string) => send<{ id: string; read: boolean }>('PATCH', `/notifications/${id}/read`),
  markAllNotificationsRead: () => send<{ ok: boolean }>('PATCH', '/notifications/mark-all-read'),
  auditLog: (params?: { entity?: string; action?: string }) => {
    const qs = new URLSearchParams()
    if (params?.entity) qs.set('entity', params.entity)
    if (params?.action) qs.set('action', params.action)
    const query = qs.toString()
    return get<AuditLogEntry[]>(`/audit${query ? `?${query}` : ''}`)
  },
  backupExport: async () => {
    const res = await fetch(`${API_BASE}/backup/export`, { headers: getHeaders() })
    if (!res.ok) throw new Error(`Backup export failed: ${res.status}`)
    return res.blob()
  },
}

export type { ProductVariant }
