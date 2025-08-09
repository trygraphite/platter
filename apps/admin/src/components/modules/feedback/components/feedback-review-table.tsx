"use client";

import { Button } from "@platter/ui/components/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Star } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/custom/data-table";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  order: {
    orderNumber: string;
  } | null;
}

interface CustomerReviewsTableProps {
  reviews: Review[];
  limit?: number;
}

export function FeedBackCustomerReviewsTable({
  reviews,
  limit = 5,
}: CustomerReviewsTableProps) {
  // Function to render star ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  // Define columns for the reviews table
  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => renderRating(row.original.rating),
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        const comment = row.original.comment;
        // Truncate long comments
        return comment.length > 80 ? `${comment.substring(0, 80)}...` : comment;
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
    <div className="space-y-4 border p-4 rounded-md">
      <div className="flex items-center justify-between mx-6">
        <h3 className="text-lg font-medium">Recent Reviews</h3>
        <Button asChild variant="outline">
          <Link href="/reviews">View All Reviews</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        pageSize={limit}
        showPageSizeSelector={false}
        maxItems={limit}
        showPagination={false}
        description={
          reviews.length === 0 ? "No customer reviews yet." : undefined
        }
        className="border-none"
      />
    </div>
  );
}
