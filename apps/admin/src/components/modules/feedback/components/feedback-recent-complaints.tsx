"use client";

import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getStatusBadgeVariant } from "utils";
import { DataTable } from "@/components/custom/data-table";
import type { Complaint } from "@/types";

interface CustomerComplaintsTableProps {
  complaints: Complaint[];
  limit?: number;
}

export function CustomerComplaintsTable({
  complaints,
  limit = 5,
}: CustomerComplaintsTableProps) {
  // Define columns for the complaints table
  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "title",
      header: "Issue",
      cell: ({ row }) => {
        const title = row.original.title || "Customer Complaint";
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>{title}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.content;
        // Truncate long descriptions
        return description.length > 80
          ? `${description.substring(0, 80)}...`
          : description;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return format(date, "MMM d, yyyy");
      },
    },
  ];

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between mx-6">
        <h3 className="text-lg font-medium">Recent Complaints</h3>
        <Button asChild variant="outline">
          <Link href="/complaints">View All Complaints</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={complaints}
        pageSize={limit}
        showPagination={false}
        showPageSizeSelector={false}
        maxItems={limit}
        description={
          complaints.length === 0 ? "No customer complaints yet." : undefined
        }
        className="border-none"
      />
    </div>
  );
}
