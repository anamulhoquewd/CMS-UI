import React from "react";
import { StatsCard } from "../dashboard/stats-card";

function OrderCarts({ totalLunch, totalDinner, ordersCount }: any) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Today's Orders"
        value={String(ordersCount.todayOrders)}
        description={`${ordersCount.dailyChange} from yesterday`}
        icon="shopping-cart"
      />
      <StatsCard
        title="Today's Quantity"
        value={String(totalLunch + totalDinner)}
        description={`Lunches: ${totalLunch}, Dinners: ${totalDinner} | Only on this page`}
        icon="shopping-cart"
        plaintext={true}
        className="text-green-500"
      />
      <StatsCard
        title="Current Month Orders"
        value={String(ordersCount.currentMonthOrders)}
        description={`${ordersCount.monthlyChange} from last month`}
        icon="shopping-cart"
      />
      <StatsCard
        title="Total Orders"
        value={String(ordersCount.totalOrders)}
        description={`${ordersCount.yearlyChange} from last year`}
        icon="credit-card"
      />
    </div>
  );
}

export default OrderCarts;
