import { api } from '@/lib/axios'

export interface OrderItemsCategory {
  category: 'pastery' | 'beverage' | 'savory snack'
}
export interface OrderItems {
  productId: string
  quantity: number
  category: OrderItemsCategory['category']
}
export interface OrdersRequest {
  customerId: string
  items: OrderItems[]
}
export async function createOrder({ customerId, items }: OrdersRequest) {
  const response = await api.post(
    '/restaurants/nbrl9ld3xavcb60xcoa618p7/orders',
    {
      customerId,
      items,
    },
  )
  return response.data
}
