"use client";

import { Button } from "@platter/ui/components/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useState } from "react";
import { formatDate } from "utils";
import { DataTable } from "@/components/custom/data-table";
import { ReviewDetailsModal } from "./review-detail-modal";

// Review type definition based on your data structure
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  order: { orderNumber: string } | null;
  qrCode: { code: string } | null;
  table: { number: number } | null;
}

interface ReviewsTableProps {
  reviews: Review[];
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal with selected review
  const openReviewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Define the columns for the table
  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        // Display stars based on rating (1-5)
        const rating = row.original.rating;
        return (
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        const comment = row.original.comment;
        // Truncate long comments
        return comment ? (
          <span className="line-clamp-2">{comment}</span>
        ) : (
          <span className="text-gray-400 italic">No comment</span>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        // console.log(row.original)
        if (row.original.table) {
          return `Table #${row.original.table.number}`;
        } else if (row.original.qrCode) {
          return `QR Code: ${row.original.qrCode.code}`;
        } else if (row.original.order) {
          return `Order #${row.original.order.orderNumber}`;
        }
        return "Unknown";
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
            onClick={() => openReviewDetails(row.original)}
            aria-label="View review details"
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
        data={reviews}
        title="Customer Reviews"
        description="View and manage customer feedback"
        pageSize={10}
        showPagination={true}
        showPageSizeSelector={true}
      />

      {/* Render the modal component */}
      {selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
