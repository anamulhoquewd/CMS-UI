import React from 'react'
import { StatsCard } from '../dashboard/stats-card'

function PaymentCarts({ paymentsCount }: any) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Transactions"
          value={String(paymentsCount.totalTransactions)}
          description={`${paymentsCount.monthlyTransaction} from last month`}
          icon="credit-card"
        />
        <StatsCard
          title="This Month's Revenue"
          value={String(paymentsCount.thisMonthAmounts)}
          description={`${paymentsCount.yearlyTransaction} from last year`}
          icon="credit-card"
        />
        <StatsCard
          title="This Year's Revenue"
          value={String(paymentsCount.thisYearAmounts)}
          description="This Year's Revenue"
          icon="credit-card"
          plaintext={true}
        />
        <StatsCard
          title="Total Revenue"
          value={String(paymentsCount.totalAmounts)}
          description="Total Revenue"
          icon="credit-card"
          plaintext={true}
        />
      </div>
  )
}

export default PaymentCarts
