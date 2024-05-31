import { Helmet } from 'react-helmet-async'

import { DayOrders } from './day-orders'
import { MonthCancelled } from './month-cancelled'
import { OrdersAmount } from './month-orders-amount'
import { MonthRevenue } from './month-revenue'
import { PopularProductChart } from './popular-product-chart'
import { RevenueChart } from './revenue-chart'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <MonthRevenue />
          <OrdersAmount />
          <DayOrders />
          <MonthCancelled />
        </div>

        <div className="grid grid-cols-9 gap-4">
          <RevenueChart />
          <PopularProductChart />
        </div>
      </div>
    </>
  )
}
