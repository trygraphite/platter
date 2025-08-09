"use client";

import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import useSocketIO from "@platter/ui/hooks/useSocketIO";
import { Bell, Check, Clock } from "@platter/ui/lib/icons";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface WaiterNotification {
  id: string;
  tableId: string;
  timestamp: string;
  status: "pending" | "completed";
  type: string;
}

export function AdminNotifications({ restaurantId }: { restaurantId: string }) {
  const [notifications, setNotifications] = useState<WaiterNotification[]>([]);
  const { socket, isConnected } = useSocketIO({
    serverUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    autoConnect: true,
  });

  useEffect(() => {
    if (socket && isConnected && restaurantId) {
      // Join the restaurant room to receive notifications
      socket.emit("joinRestaurantRoom", restaurantId);

      // Listen for waiter notifications
      socket.on("waiterNotification", (notification: WaiterNotification) => {
        // Play notification sound
        const audio = new Audio("/notification-sound.mp3");
        audio.play().catch((e) => console.log("Audio play failed:", e));

        // Add notification to the list
        setNotifications((prev) => [notification, ...prev]);
      });

      // Clean up
      return () => {
        socket.off("waiterNotification");
        socket.emit("leaveRestaurantRoom", restaurantId);
      };
    }
  }, [socket, isConnected, restaurantId]);

  const markAsCompleted = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: "completed" }
          : notification,
      ),
    );

    // Optionally inform the server about the status change
    if (socket) {
      socket.emit("updateNotification", {
        id: notificationId,
        status: "completed",
      });
    }
  };

  // Display only notifications from the last 4 hours
  const recentNotifications = notifications.filter(
    (n) => new Date(n.timestamp) > new Date(Date.now() - 4 * 60 * 60 * 1000),
  );

  const pendingNotifications = recentNotifications.filter(
    (n) => n.status === "pending",
  );
  const completedNotifications = recentNotifications.filter(
    (n) => n.status === "completed",
  );

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          <span>Waiter Requests</span>
          {pendingNotifications.length > 0 && (
            <span className="ml-auto bg-amber-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {pendingNotifications.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {recentNotifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No recent waiter requests
          </div>
        ) : (
          <div className="space-y-4">
            {pendingNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-amber-600">Pending</h3>
                {pendingNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg animate-pulse"
                  >
                    <div>
                      <p className="font-medium">
                        Table: {notification.tableId}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-200 dark:border-amber-800"
                      onClick={() => markAsCompleted(notification.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {completedNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-green-600">Completed</h3>
                {completedNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        Table: {notification.tableId}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                      Completed
                    </span>
                  </div>
                ))}
                {completedNotifications.length > 5 && (
                  <p className="text-center text-sm text-gray-500">
                    +{completedNotifications.length - 5} more completed
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
