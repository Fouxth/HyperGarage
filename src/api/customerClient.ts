import type { Customer, CustomerAddress, CustomerOrder } from '@/types'

export interface RegisterInput {
  email: string
  password: string
  name: string
  phone?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AddressInput {
  label: string
  address: string
  isDefault?: boolean
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export function getCustomerToken() {
  return localStorage.getItem('hypergarage_customer_token')
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getCustomerToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: getHeaders() })
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('hypergarage_customer_token')
      localStorage.removeItem('hypergarage_customer_user')
      window.location.href = `${import.meta.env.BASE_URL || '/'}account/login`
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
      localStorage.removeItem('hypergarage_customer_token')
      localStorage.removeItem('hypergarage_customer_user')
      window.location.href = `${import.meta.env.BASE_URL || '/'}account/login`
    }
    throw new Error(`API ${method} ${path} failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const accountApi = {
  register: async (input: RegisterInput) => {
    const res = await fetch(`${API_BASE}/account/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Register failed')
    return res.json() as Promise<{ token: string; customer: Customer }>
  },
  login: async (input: LoginInput) => {
    const res = await fetch(`${API_BASE}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Login failed')
    return res.json() as Promise<{ token: string; customer: Customer }>
  },
  me: () => get<Customer>('/account/me'),
  orders: () => get<CustomerOrder[]>('/account/orders'),
  addresses: () => get<CustomerAddress[]>('/account/addresses'),
  createAddress: (input: AddressInput) => send<CustomerAddress>('POST', '/account/addresses', input),
  updateAddress: (id: string, input: Partial<AddressInput>) => send<CustomerAddress>('PATCH', `/account/addresses/${id}`, input),
  deleteAddress: (id: string) => send<void>('DELETE', `/account/addresses/${id}`),
}
