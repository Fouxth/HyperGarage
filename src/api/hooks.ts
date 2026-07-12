import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type ProductInput, type CategoryInput, type BrandInput, type CheckoutInput, type CouponInput, type OrdersQuery, type FlashSaleInput, type CreateReviewInput } from './client'
import type { Order, StoreSettings } from '@/types'

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: api.categories })

export const useBrands = () =>
  useQuery({ queryKey: ['brands'], queryFn: api.brands })

export const useVehicles = () =>
  useQuery({ queryKey: ['vehicles'], queryFn: api.vehicles })

export const useProducts = (
  params?: Parameters<typeof api.products>[0],
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => api.products(params),
    enabled: options?.enabled,
  })

export const useProduct = (slug: string | undefined) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.product(slug!),
    enabled: !!slug,
  })

export const useOrders = (params?: OrdersQuery) =>
  useQuery({ queryKey: ['orders', params], queryFn: () => api.orders(params) })

export const useOrder = (id: string | undefined) =>
  useQuery({ queryKey: ['order', id], queryFn: () => api.order(id!), enabled: !!id })

export const useCheckout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CheckoutInput) => api.checkout(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) => api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })
}

export const useCoupons = () => useQuery({ queryKey: ['coupons'], queryFn: api.coupons })

export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CouponInput) => api.createCoupon(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  })
}

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CouponInput }) => api.updateCoupon(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  })
}

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  })
}

export const useDashboardStats = () =>
  useQuery({ queryKey: ['dashboardStats'], queryFn: api.dashboardStats })

export const useRecentReviews = (limit = 5) =>
  useQuery({ queryKey: ['recentReviews', limit], queryFn: () => api.recentReviews(limit) })

export const useProductReviews = (productId: string | undefined) =>
  useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => api.productReviews(productId!),
    enabled: !!productId,
  })

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateReviewInput) => api.createReview(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['recentReviews'] })
    },
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductInput) => api.createProduct(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) => api.updateProduct(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CategoryInput) => api.createCategory(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CategoryInput }) => api.updateCategory(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BrandInput) => api.createBrand(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] }),
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BrandInput }) => api.updateBrand(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] }),
  })
}

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteBrand(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] }),
  })
}

export const useUpdateStock = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) => api.updateStock(id, stock),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useUpdateFlashSale = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: FlashSaleInput }) => api.updateFlashSale(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useVehicleTree = () => useQuery({ queryKey: ['vehicleTree'], queryFn: api.vehicleTree })

export const useCreateVehicleBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => api.createVehicleBrand(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicleTree'] }),
  })
}

export const useDeleteVehicleBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteVehicleBrand(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicleTree'] }),
  })
}

export const useCreateVehicleModel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ vehicleBrandId, name }: { vehicleBrandId: string; name: string }) =>
      api.createVehicleModel(vehicleBrandId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicleTree'] }),
  })
}

export const useDeleteVehicleModel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteVehicleModel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicleTree'] }),
  })
}

export const useCreateVehicleGeneration = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ vehicleModelId, name, years, engines }: { vehicleModelId: string; name: string; years: string; engines: string[] }) =>
      api.createVehicleGeneration(vehicleModelId, name, years, engines),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicleTree'] }),
  })
}

export const useDeleteVehicleGeneration = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteVehicleGeneration(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicleTree'] }),
  })
}

export const useSettings = () => useQuery({ queryKey: ['settings'], queryFn: api.settings })

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<StoreSettings>) => api.updateSettings(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  })
}

export const useActivity = () => useQuery({ queryKey: ['activity'], queryFn: api.activity })

export const useReports = () => useQuery({ queryKey: ['reports'], queryFn: api.reports })
