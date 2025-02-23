"use client";
import { Button } from "@platter/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@platter/ui/components/card";
import { toast } from "@platter/ui/components/sonner";
import { approveRequest, getPendingRequests, rejectRequest } from "@/lib/actions/location-actions";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@platter/ui/components/badge"; // Add this import

export function JoinRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  const loadRequests = useCallback(async () => {
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load requests");
    }
  }, []);

  const handleApprove = async (requestId: string) => {
    const result = await approveRequest(requestId);
    if (result?.success) {
      toast.success(result.success);
      loadRequests();
    } else if (result?.error) {
      toast.error(result.error);
    }
  };

  const handleReject = async (requestId: string) => {
    const result = await rejectRequest(requestId);
    if (result?.success) {
      toast.success(result.success); // Changed to use result message
      loadRequests();
    } else if (result?.error) {
      toast.error(result.error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="border p-4 rounded-lg flex items-center justify-between"
          >
            <div className="space-y-1">
              <h4 className="font-medium">{request.user.name}</h4>
              <p className="text-sm text-muted-foreground">
                Requesting to join {request.location.name}
              </p>
              {/* Add status badge */}
              {request.status !== 'PENDING' && (
                <Badge 
                  variant={request.status === 'APPROVED' ? 'secondary' : 'destructive'}
                  className="mt-1"
                >
                  {request.status}
                </Badge>
              )}
            </div>
            
            {request.status === 'PENDING' ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </Button>
                <Button onClick={() => handleApprove(request.id)}>
                  Approve
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => handleReject(request.id)}
                disabled
              >
                {request.status}
              </Button>
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No pending requests
          </p>
        )}
      </CardContent>
    </Card>
  );
}