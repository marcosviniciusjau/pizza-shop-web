import { api } from '@/lib/axios'

interface CustomerRequest {
  name: string
  phone?: string
}
export async function registerCustomer({ name, phone }: CustomerRequest) {
  const response = await api.post('/customers', {
    name,
    phone,
  })
  return response.data
}
