import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountApi, type RegisterInput, type LoginInput, type AddressInput } from './customerClient'

export const useCustomerMe = () =>
  useQuery({ queryKey: ['customerMe'], queryFn: accountApi.me, retry: false })

export const useCustomerOrders = () =>
  useQuery({ queryKey: ['customerOrders'], queryFn: accountApi.orders })

export const useCustomerAddresses = () =>
  useQuery({ queryKey: ['customerAddresses'], queryFn: accountApi.addresses })

export const useRegister = () => useMutation({ mutationFn: (input: RegisterInput) => accountApi.register(input) })

export const useLogin = () => useMutation({ mutationFn: (input: LoginInput) => accountApi.login(input) })

export const useCreateAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AddressInput) => accountApi.createAddress(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerAddresses'] }),
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AddressInput> }) => accountApi.updateAddress(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerAddresses'] }),
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => accountApi.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerAddresses'] }),
  })
}
