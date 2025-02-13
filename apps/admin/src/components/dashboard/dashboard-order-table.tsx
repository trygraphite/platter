import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@platter/ui/components/table";
import type { Order } from "@prisma/client";

interface OrdersTableProps {
  orders: (Order & {
    tableNumber: string;
    items: {
      quantity: number;
      menuItem: {
        name: string;
        price: number;
      };
    }[];
  })[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

export default function DashboardOrdersTable({
  orders,
  onEditOrder,
  onDeleteOrder,
}: OrdersTableProps) {
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.slice(0, 5).map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.tableNumber}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{formatNaira(order.totalAmount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
