import { api } from '@/lib/axios'

export type GetCustomersResponse = {
  id: string
  name: string
  phone: string
}[]
export async function getCustomers() {
  const response = await api.get<GetCustomersResponse>('/get-customers')
  return response.data
}
