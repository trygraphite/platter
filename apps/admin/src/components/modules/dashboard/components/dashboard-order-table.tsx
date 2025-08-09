"use client";

import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import { formatCurrency } from "@platter/ui/lib/utils";
import type { Order } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/custom/data-table";

interface EnhancedOrder extends Order {
  tableNumber: string;
  items: {
    quantity: number;
    menuItem: {
      name: string;
      price: number;
    };
  }[];
}

interface OrdersTableProps {
  orders: EnhancedOrder[];
  className?: string;
  showPagination?: boolean;
  maxItems?: number;
}

export default function DashboardOrdersTable({
  orders,
  className,
  showPagination = false,
  maxItems = 5,
}: OrdersTableProps) {
  // Format date/time for display
  const formatDateTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Define columns for the table
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const columns: ColumnDef<EnhancedOrder>[] = useMemo(
    () => [
      {
        accessorKey: "orderNumber",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order #
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium ml-2">{row.getValue("orderNumber")}</div>
        ),
      },
      {
        accessorKey: "tableNumber",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Table
            <ArrowUpDown className=" h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const tableNumber = row.getValue("tableNumber") as string;
          return <div className="ml-2">{tableNumber}</div>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge
              variant={
                status === "CONFIRMED"
                  ? "secondary"
                  : status === "PENDING"
                    ? "outline"
                    : status === "DELIVERED"
                      ? "default"
                      : "outline"
              }
              className="capitalize"
            >
              {status.toLowerCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date/Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const dateValue = row.original.createdAt;
          return <div className="ml-2">{formatDateTime(dateValue)}</div>;
        },
      },
      {
        accessorKey: "totalAmount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("totalAmount"));
          return <div className="font-medium">{formatCurrency(amount)}</div>;
        },
      },
    ],
    [],
  );

  // Sort orders by createdAt (newest first) before display
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders]);

  return (
    <DataTable
      columns={columns}
      data={sortedOrders}
      title="Recent Orders"
      description="Latest customer orders"
      className={className}
      showPagination={showPagination}
      showPageSizeSelector={showPagination}
      maxItems={maxItems}
    />
  );
}
