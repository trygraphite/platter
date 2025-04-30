"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import { formatDate, getStatusBadgeVariant } from "utils";
import { DataTable } from "@/components/custom/data-table";
import { ComplaintDetailsModal } from "./complaint-detail-modal";
import { Complaint } from "@/types";


interface ComplaintsTableProps {
  complaints: Complaint[];
}

export function ComplaintsTable({ complaints }: ComplaintsTableProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal with selected complaint
  const openComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };



  // Define the columns for the table
  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return (
          <span className="capitalize">
            {row.original.category.toLowerCase()}
          </span>
        );
      },
    },
    {
      accessorKey: "content",
      header: "Complaint",
      cell: ({ row }) => {
        return (
          <span className="line-clamp-2">{row.original.content}</span>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        if (row.original.table) {
          return `Table #${row.original.table.number}`;
        } else if (row.original.qrCode) {
          return `QR Code: ${row.original.qrCode.code}`;
        }
        return "Unknown";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={getStatusBadgeVariant(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openComplaintDetails(row.original)}
            aria-label="View complaint details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={complaints}
        title="Customer Complaints"
        description="View and manage customer complaints"
        pageSize={10}
        showPagination={true}
        showPageSizeSelector={true}
      />
      
      {/* Render the modal component */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}