import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type ProductInput, type CategoryInput, type BrandInput, type CheckoutInput, type CouponInput, type OrdersQuery, type FlashSaleInput, type CreateReviewInput, type VariantInput, type ReturnInput, type UpdateReturnStatusInput, type ShippingInput } from './client'
import type { Order, StoreSettings, ReturnStatus } from '@/types'

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

export const useOrders = (params?: OrdersQuery, options?: { enabled?: boolean }) =>
  useQuery({ queryKey: ['orders', params], queryFn: () => api.orders(params), enabled: options?.enabled })

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

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: Order['paymentStatus'] }) =>
      api.updatePaymentStatus(id, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order'] })
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

export const useUpdateShipping = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ShippingInput }) => api.updateShipping(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order'] })
    },
  })
}

export const useCreateVariant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, input }: { productId: string; input: VariantInput }) => api.createVariant(productId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useUpdateVariant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, variantId, input }: { productId: string; variantId: string; input: VariantInput }) =>
      api.updateVariant(productId, variantId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useDeleteVariant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId: string }) => api.deleteVariant(productId, variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export const useReturns = (status?: ReturnStatus | 'All') =>
  useQuery({ queryKey: ['returns', status], queryFn: () => api.returns(status) })

export const useCreateReturn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ReturnInput) => api.createReturn(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['returns'] }),
  })
}

export const useUpdateReturnStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReturnStatusInput }) => api.updateReturnStatus(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useCustomers = () => useQuery({ queryKey: ['customers'], queryFn: api.customers })

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { name?: string; phone?: string; banned?: boolean } }) =>
      api.updateCustomer(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })
}

export const useNotifications = (read?: boolean) =>
  useQuery({ queryKey: ['notifications', read], queryFn: () => api.notifications(read), refetchInterval: 30000 })

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useAuditLog = (params?: { entity?: string; action?: string }) =>
  useQuery({ queryKey: ['auditLog', params], queryFn: () => api.auditLog(params) })
