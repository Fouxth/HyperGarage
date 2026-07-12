import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface WishlistContextValue {
  ids: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)
const STORAGE_KEY = 'hypergarage.wishlist'

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = (productId: string) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const has = (productId: string) => ids.includes(productId)

  return <WishlistContext.Provider value={{ ids, toggle, has }}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
