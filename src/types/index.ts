export interface Product {
  id: string
  name: string
  nameEn: string
  slug: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  brand: string
  category: string
  categorySlug: string
  sku: string
  stock: number
  rating: number
  reviewCount: number
  description: string
  specs: Record<string, string>
  compatibility: VehicleCompatibility[]
  tags: string[]
  isNew?: boolean
  isFeatured?: boolean
  isFlashSale?: boolean
  flashSaleEnd?: string
}

export interface VehicleCompatibility {
  brand: string
  model: string
  generation: string
  years: string
  engine: string
}

export interface Category {
  id: string
  name: string
  nameEn: string
  slug: string
  icon: string
  productCount: number
  image?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo: string
  country: string
  productCount: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  productImage?: string
  quantity: number
  priceEach: number
}

export interface Order {
  id: string
  orderNumber: string
  customer: string
  phone: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
  shippingAddress: string
}

export interface StoreSettings {
  id: string
  storeName: string
  contactEmail: string
  contactPhone: string
  address: string
  currency: string
  maintenanceMode: boolean
  updatedAt: string
}

export interface ActivityEvent {
  type: 'order' | 'review' | 'product'
  message: string
  createdAt: string
}

export interface TopProduct {
  name: string
  quantity: number
  revenue: number
}

export interface ReportsData {
  topProducts: TopProduct[]
  revenueByPaymentMethod: { method: string; total: number }[]
  ordersByStatus: { status: string; count: number }[]
}

export interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  active: boolean
  usageLimit?: number
  usedCount: number
  expiresAt?: string
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  images?: string[]
}

export interface Vehicle {
  brand: string
  models: VehicleModel[]
}

export interface VehicleModel {
  name: string
  generations: VehicleGeneration[]
}

export interface VehicleGeneration {
  name: string
  years: string
  engines: string[]
}

export interface AdminStats {
  revenue: number
  orders: number
  customers: number
  totalProducts: number
}

export interface SalesData {
  month: string
  revenue: number
  orders: number
}

export interface CategorySales {
  name: string
  value: number
  color: string
}
