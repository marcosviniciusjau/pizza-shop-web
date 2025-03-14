import { api } from '@/lib/axios'

export type GetProductsResponse = {
  id: string
  name: string
  price: number
  category: 'pizzas' | 'beverages' | 'savory snacks'
}[]
export async function getProducts() {
  const response = await api.get<GetProductsResponse>('/get-products')
  return response.data
}
