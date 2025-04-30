"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@platter/ui/components/dialog";
import { Button } from "@platter/ui/components/button";
import { formatDate } from "utils";
import { Review } from "./review-table";


interface ReviewDetailsModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDetailsModal({
  review,
  isOpen,
  onClose,
}: ReviewDetailsModalProps) {
  // Get the source information
  const getSourceInfo = () => {
    if (review.order) {
      return `Order #${review.order.orderNumber}`;
    } else if (review.qrCode) {
      return `QR Code: ${review.qrCode.code}`;
    } else if (review.table) {
      return `Table #${review.table.number}`;
    }
    return "Unknown source";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            Full details of the customer review
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Date:</div>
            <div className="col-span-2">{formatDate(review.createdAt)}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Rating:</div>
            <div className="col-span-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    {i < review.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Source:</div>
            <div className="col-span-2">{getSourceInfo()}</div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Comment:</div>
            <div className="p-3 bg-gray-50 rounded-md min-h-24 max-h-64 overflow-y-auto">
              {review.comment ? (
                review.comment
              ) : (
                <span className="text-gray-400 italic">No comment provided</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}