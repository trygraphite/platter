"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@platter/ui/components/dialog";
import { Button } from "@platter/ui/components/button";
import { Badge } from "@platter/ui/components/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";

import { Loader2 } from "lucide-react";
import { enumToStatus, formatDate, getStatusBadgeVariant, statusToEnum } from "utils";
import { updateComplaintStatus } from "@/lib/actions/update-complaint-status";
import { toast } from "@platter/ui/components/sonner";
import { Complaint } from "@/types";




interface ComplaintDetailsModalProps {
  complaint: Complaint;
  isOpen: boolean;
  onClose: () => void;
}

export function ComplaintDetailsModal({
  complaint,
  isOpen,
  onClose,
}: ComplaintDetailsModalProps) {
  const [status, setStatus] = useState(
    typeof complaint.status === "string" ? 
      (complaint.status.includes("_") ? enumToStatus(complaint.status) : complaint.status) :
      "Pending"
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to update complaint status using the server action
  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    
    try {
      const result = await updateComplaintStatus({
        complaintId: complaint.id,
        status: statusToEnum(status),
      });
      
      if (result.success) {
        toast.success("Complaint status updated successfully");
        onClose();
      } else {
        toast.error("Failed to update complaint status");
      }
    } catch (error) {
      toast.error("An error occurred while updating the complaint status");
      console.error("Error updating complaint status:", error);
    } finally {
      setIsUpdating(false);
    }
  };



  // Get the source information
  const getSourceInfo = () => {
    if (complaint.table) {
      return `Table #${complaint.table.number}`;
    } else if (complaint.qrCode) {
      return `QR Code: ${complaint.qrCode.code}`;
    }
    return "Unknown source";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complaint Details</DialogTitle>
          <DialogDescription>
            Full details of the customer complaint
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Date:</div>
            <div className="col-span-2">{formatDate(complaint.createdAt)}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Category:</div>
            <div className="col-span-2 capitalize">{complaint.category?.toLowerCase() || "General"}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Source:</div>
            <div className="col-span-2">{getSourceInfo()}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Status:</div>
            <div className="col-span-2">
              <Badge variant={getStatusBadgeVariant(status)}>
                {status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Complaint:</div>
            <div className="p-3 bg-gray-50 rounded-md min-h-24 max-h-64 overflow-y-auto">
              {complaint.content}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Update Status:</div>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button onClick={onClose} variant="outline" disabled={isUpdating}>
            Close
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="default" 
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}