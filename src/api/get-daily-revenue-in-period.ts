import { api } from '@/lib/axios'
export type GetDailyRevenueInPeriod = {
  date: string
  receipt: number
}[]
export async function getDailyRevenueInPeriod() {
  const response = await api.get<GetDailyRevenueInPeriod>(
    'metrics/daily-receipt-in-period',
  )
  return response.data
}
