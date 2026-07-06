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

export interface Order {
  id: string
  orderNumber: string
  customer: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
  shippingAddress: string
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
  revenueChange: number
  orders: number
  ordersChange: number
  visitors: number
  visitorsChange: number
  customers: number
  customersChange: number
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
