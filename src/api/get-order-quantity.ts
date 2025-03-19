import { api } from '@/lib/axios'

export interface GetOrdersQuantityParams {
  orderId: string
}
export interface GetOrderQuantityResponse {
  id: string
  orderItems: {
    quantity: number
    product: {
      name: string
    }
  }[]
}
export async function getOrdersQuantity({ orderId }: GetOrdersQuantityParams) {
  const response = await api.get<GetOrderQuantityResponse>(`/orders/quantity/${orderId}`)
  return response.data
}
