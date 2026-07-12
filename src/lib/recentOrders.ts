const STORAGE_KEY = 'hypergarage.recentOrderIds'

export function rememberOrderId(orderId: string) {
  const ids = getRememberedOrderIds()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([orderId, ...ids.filter((id) => id !== orderId)].slice(0, 20)))
}

export function getRememberedOrderIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
