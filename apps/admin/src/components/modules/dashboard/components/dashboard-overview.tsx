import AnimatedStatsCard from "../../../custom/animated-stats-card";

interface Order {
  status: string;
  totalAmount: number;
}

export function Overview({ orders }: { orders: Order[] }) {
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  );

  const totalRevenue = deliveredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statsItems = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      iconName: "DollarSign" as const,
      description: "Total revenue from all orders",
      formatType: "currency",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      iconName: "ShoppingCart" as const,
      description: "Total number of orders",
      formatType: "number",
    },
    {
      title: "Average Order Value",
      value: averageOrderValue,
      iconName: "TrendingUp" as const,
      description: "Average value per order",
      formatType: "currency",
    },
    // You can add more cards as needed, e.g., for total scans
    // {
    //   title: "Total Scans",
    //   value: totalScans,
    //   icon: Search,
    //   description: "Total number of scans",
    //   formatType: "number"
    // }
  ];

  return (
    <div className="grid  grid-cols-3 gap-4 ">
      {statsItems.map((item) => (
        <AnimatedStatsCard
          key={item.title}
          title={item.title}
          value={item.value}
          iconName={item.iconName}
          description={item.description}
          formatType={item.formatType}
        />
      ))}
    </div>
  );
}

export default Overview;
