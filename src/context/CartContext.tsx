import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Product, ProductVariant } from '@/types'

interface CartLine {
  product: Product
  variant?: ProductVariant
  quantity: number
}

function lineKey(productId: string, variantId?: string) {
  return `${productId}::${variantId ?? ''}`
}

interface CartContextValue {
  items: CartLine[]
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (productId: string, variantId?: string) => void
  setQuantity: (productId: string, quantity: number, variantId?: string) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'hypergarage.cart'

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((prev) => {
      const key = lineKey(product.id, variant?.id)
      const existing = prev.find((i) => lineKey(i.product.id, i.variant?.id) === key)
      if (existing) {
        return prev.map((i) =>
          lineKey(i.product.id, i.variant?.id) === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { product, variant, quantity }]
    })
  }

  const removeItem = (productId: string, variantId?: string) => {
    const key = lineKey(productId, variantId)
    setItems((prev) => prev.filter((i) => lineKey(i.product.id, i.variant?.id) !== key))
  }

  const setQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) return removeItem(productId, variantId)
    const key = lineKey(productId, variantId)
    setItems((prev) => prev.map((i) => (lineKey(i.product.id, i.variant?.id) === key ? { ...i, quantity } : i)))
  }

  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.quantity * (i.product.price + (i.variant?.priceDelta ?? 0)), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQuantity, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
