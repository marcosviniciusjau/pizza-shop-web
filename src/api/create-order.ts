import { api } from '@/lib/axios'

export interface OrderItemsCategory {
  category: 'pizzas' | 'beverage' | 'savory snack'
}
export interface OrderItems {
  productId: string
  quantity: number
  category: OrderItemsCategory['category']
}
export interface OrdersRequest {
  customerName: string
  customerId: string
  customerEmail: string,
  items: OrderItems[]
}
export async function createOrder({
  customerId,
  items,
}: OrdersRequest) {
  const restaurantId = "qtuGPb28wSpdHj3h_BRJ7"
  const response = await api.post(
    `/restaurants/${restaurantId}/orders`,
    {
      customerId,
      items,
    },
  )
  return response.data
}
