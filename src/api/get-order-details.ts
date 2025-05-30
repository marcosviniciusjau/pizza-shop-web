import { api } from '@/lib/axios'

export interface GetOrdersDetailsParams {
  orderId: string
}
export interface GetOrderDetailsResponse {
  id: string
  createdAt: string
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
  totalInCents: number
  customer: {
    name: string
    email: string
    phone: string | null
  }
  orderItems: {
    id: string
    priceInCents: number
    quantity: number
    product: {
      name: string
    }
  }[]
}
export async function getOrdersDetails({ orderId }: GetOrdersDetailsParams) {
  const response = await api.get<GetOrderDetailsResponse>(`/orders/${orderId}`)
  console.log("para de dar erro idiota", response.data)
  return response.data
}
