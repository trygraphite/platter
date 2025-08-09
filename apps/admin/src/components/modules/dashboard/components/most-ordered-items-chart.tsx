"use client";

import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import { formatCurrency } from "@platter/ui/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/custom/data-table";

interface MenuItemWithOrderCount {
  id: string;
  name: string;
  totalOrdered: number;
  price: number;
  category: string;
  revenue: number;
}

interface MostOrderedItemsProps {
  className?: string;
  orders: {
    id: string;
    items: {
      quantity: number;
      price: number;
      menuItem: {
        id: string;
        name: string;
        price: number;
        category: {
          id: string;
          name: string;
        };
      };
    }[];
  }[];
  showPagination?: boolean;
  maxItems?: number;
}

export function MostOrderedItems({
  className,
  orders,
  showPagination = false,
  maxItems = 5,
}: MostOrderedItemsProps) {
  // Process orders to calculate most ordered items
  const mostOrderedItems = useMemo(() => {
    const itemMap = new Map<string, MenuItemWithOrderCount>();

    // Process all orders and their items
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const { menuItem, quantity, price } = item;

        if (!itemMap.has(menuItem.id)) {
          itemMap.set(menuItem.id, {
            id: menuItem.id,
            name: menuItem.name,
            totalOrdered: 0,
            price: menuItem.price,
            category: menuItem.category.name,
            revenue: 0,
          });
        }

        const currentItem = itemMap.get(menuItem.id)!;
        currentItem.totalOrdered += quantity;
        currentItem.revenue += price * quantity;
        itemMap.set(menuItem.id, currentItem);
      });
    });

    // Convert to array and sort by totalOrdered
    return Array.from(itemMap.values()).sort(
      (a, b) => b.totalOrdered - a.totalOrdered,
    );
  }, [orders]);

  // Define columns for the table
  const columns: ColumnDef<MenuItemWithOrderCount>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "totalOrdered",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium">{row.getValue("totalOrdered")}</div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return <div className="font-medium">{formatCurrency(price)}</div>;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="capitalize">
            {row.getValue("category")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "revenue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const revenue = parseFloat(row.getValue("revenue"));
        return <div className="font-medium">{formatCurrency(revenue)}</div>;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={mostOrderedItems}
      title="Most Ordered Items"
      description="Top menu items by order frequency"
      className={className}
      showPagination={showPagination}
      showPageSizeSelector={showPagination}
      maxItems={maxItems}
    />
  );
}
