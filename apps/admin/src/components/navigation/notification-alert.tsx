"use client"

import React, { useEffect, useState } from "react"
import { toast, Toaster } from "@platter/ui/components/sonner"
import { Bell, Check } from "lucide-react"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@platter/ui/components/popover"
import { Button } from "@platter/ui/components/button"
import { Badge } from "@platter/ui/components/badge"
import { ScrollArea } from "@platter/ui/components/scroll-area"
import { cn } from "@platter/ui/lib/utils"
import useSocketIO from "@platter/ui/hooks/useSocketIO"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: 'success' | 'info' | 'warning' | 'error'
}

interface NotificationCenterProps {
  serverUrl: string
  userId?: string
}

// Custom persistent toast for waiter alerts that lasts 60 seconds by default
const showWaiterAlertToast = (tableNumber: string | number, message?: string) => {
  // Create a unique ID for this toast
  const toastId = toast.custom(
    (id) => (
      <div className="relative overflow-hidden rounded-lg border border-amber-500 bg-amber-50 p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="font-medium text-amber-900">
              Waiter Requested: Table {tableNumber}
            </div>
            <div className="text-sm text-amber-700">
              {message || "Assistance requested"}
            </div>
          </div>
          <button 
            onClick={() => toast.dismiss(id)}
            className="rounded-full p-1 text-amber-700 hover:bg-amber-200 hover:text-amber-900"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-200">
          <div 
            className="h-full bg-amber-500"
            style={{ 
              width: "100%", 
              animation: "progress 60s linear forwards"
            }}
          />
        </div>
        <style jsx>{`
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    ),
    { 
      duration: 60000, // 60 seconds
      position: "top-right",
    }
  );
  
  // Create a manual timeout as a backup to ensure the toast is dismissed
  setTimeout(() => {
    toast.dismiss(toastId);
  }, 60000);
  
  return toastId;
};

export function NotificationCenter({ serverUrl, userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [activeWaiterCalls, setActiveWaiterCalls] = useState<{tableNumber: string | number, message: string}[]>([])
  
  const { socket, isConnected } = useSocketIO({
    serverUrl,
    path: "/socket.io",
  })

  // Calculate unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  // Handle socket events
  useEffect(() => {
    if (!socket || !isConnected) return

    // Join restaurant room if userId is provided
    if (userId) {
      const roomName = `restaurant:${userId}`
      socket.emit("joinRestaurantRoom", userId)
      console.log(`NotificationCenter: Joined restaurant room: ${roomName} for user: ${userId}`)
    }

    // Listen for new order
    socket.on("newOrder", (orderData) => {
      // Access table number from the nested table object
      const tableNumber = orderData.table?.number || 'Unknown'
      const tableInfo = `Table ${tableNumber}`
      
      const notification: Notification = {
        id: `new-order-${orderData.id}-${Date.now()}`,
        title: `New Order #${orderData.orderNumber || 'Unknown'} - ${tableInfo}`,
        message: `Order #${orderData.orderNumber || 'Unknown'} received from ${tableInfo}`,
        timestamp: new Date(),
        read: false,
        type: 'success'
      }
      
      setNotifications(prev => [notification, ...prev])
      toast.success(notification.message)
    })

    // Listen for order updates
    socket.on("orderUpdate", (orderData) => {
      // Only create notifications for status changes
      if (orderData.status) {
        let type: 'success' | 'info' | 'warning' | 'error' = 'info'
        // Access table number from the nested table object
        const tableNumber = orderData.table?.number || 'Unknown'
        const tableInfo = `Table ${tableNumber}`
        
        let title = `Order #${orderData.orderNumber || 'Unknown'} Update - ${tableInfo}`
        let message = `Order #${orderData.orderNumber || 'Unknown'} status changed to ${orderData.status.toLowerCase()}`
        
        // Create more descriptive titles based on status
        switch(orderData.status.toUpperCase()) {
          case 'CREATED':
            title = `Order #${orderData.orderNumber || 'Unknown'} Created - ${tableInfo}`
            break
          case 'PREPARING':
            title = `Order #${orderData.orderNumber || 'Unknown'} Preparing - ${tableInfo}`
            break
          case 'READY':
            title = `Order #${orderData.orderNumber || 'Unknown'} Ready - ${tableInfo}`
            type = 'success'
            break
          case 'SERVED':
            title = `Order #${orderData.orderNumber || 'Unknown'} Served - ${tableInfo}`
            type = 'success'
            break
          case 'COMPLETED':
            title = `Order #${orderData.orderNumber || 'Unknown'} Completed - ${tableInfo}`
            type = 'success'
            break
          case 'CANCELLED':
            title = `Order #${orderData.orderNumber || 'Unknown'} Cancelled - ${tableInfo}`
            type = 'warning'
            message = `Order #${orderData.orderNumber || 'Unknown'} has been cancelled by the customer`
            break
          default:
            title = `Order #${orderData.orderNumber || 'Unknown'} ${orderData.status} - ${tableInfo}`
        }
        
        const notification: Notification = {
          id: `order-update-${orderData.id}-${Date.now()}`,
          title,
          message,
          timestamp: new Date(),
          read: false,
          type
        }
        
        setNotifications(prev => [notification, ...prev])
        
        if (type === 'warning') {
          toast.warning(notification.message)
        } else if (type === 'success') {
          toast.success(notification.message)
        } else {
          toast.info(notification.message)
        }
      }
    })

    // Listen for order deletion
    socket.on("orderDeleted", (data) => {
      // Access table number from the nested table object
      const tableNumber = data.table?.number || 'Unknown'
      const tableInfo = `Table ${tableNumber}`
      
      const notification: Notification = {
        id: `order-deleted-${data.id}-${Date.now()}`,
        title: `Order #${data.orderNumber || 'Unknown'} Deleted - ${tableInfo}`,
        message: `Order #${data.orderNumber || 'Unknown'} for ${tableInfo} has been deleted`,
        timestamp: new Date(),
        read: false,
        type: 'error'
      }
      
      setNotifications(prev => [notification, ...prev])
      toast.error(notification.message)
    })

    // Listen for waiter alert
    socket.on("waiterAlert", (data) => {
      // Access table number directly from the Table model structure
      const tableNumber = data.tableNumber || 'Unknown'
      const tableInfo = `Table ${tableNumber}`
      const message = `${tableInfo} has requested assistance`
      
      const notification: Notification = {
        id: `waiter-alert-${data.id || 'unknown'}-${Date.now()}`,
        title: `Table ${tableNumber} Needs Assistance`,
        message,
        timestamp: new Date(),
        read: false,
        type: 'warning'
      }
      
      setNotifications(prev => [notification, ...prev])
      
      // Add to active waiter calls
      setActiveWaiterCalls(prev => [...prev, {tableNumber, message}])
      
      // Show the special persistent waiter alert toast (60 seconds)
      // const toastId = showWaiterAlertToast(tableNumber, message);
      
      // Remove from active waiter calls after 60s
      setTimeout(() => {
        setActiveWaiterCalls(prev => 
          prev.filter(call => !(call.tableNumber === tableNumber && call.message === message))
        )
      }, 60000);
      
      // Play notification sound for waiter calls
      try {
        const audio = new Audio("/sounds/waiter-alert.mp3");
        audio.volume = 0.7;
        audio.play().catch(error => console.warn("Failed to play notification sound:", error));
      } catch (error) {
        console.warn("Browser doesn't support audio playback:", error);
      }
    })

    // Additional handler for "notify/call-waiter" event
    socket.on("notify/call-waiter", (data) => {
      const tableNumber = data.tableNumber || 'Unknown';
      const message = data.message || 'Assistance requested';
      
      const notification: Notification = {
        id: `waiter-call-${Date.now()}`,
        title: `Table ${tableNumber} Needs Assistance`,
        message: message,
        timestamp: new Date(),
        read: false,
        type: 'warning'
      }
      
      setNotifications(prev => [notification, ...prev])
      
      // Add to active waiter calls
      setActiveWaiterCalls(prev => [...prev, {tableNumber, message}])
      
      // Show the special persistent waiter alert toast (60 seconds)
      const toastId = showWaiterAlertToast(tableNumber, message);
      
      // Remove from active waiter calls after 60s
      setTimeout(() => {
        setActiveWaiterCalls(prev => 
          prev.filter(call => !(call.tableNumber === tableNumber && call.message === message))
        )
      }, 60000);
      
      // Play notification sound for waiter calls
      try {
        const audio = new Audio("/sounds/waiter-alert.mp3");
        audio.volume = 0.7;
        audio.play().catch(error => console.warn("Failed to play notification sound:", error));
      } catch (error) {
        console.warn("Browser doesn't support audio playback:", error);
      }
    })

    return () => {
      socket.off("newOrder")
      socket.off("orderUpdate")
      socket.off("orderDeleted")
      socket.off("waiterAlert")
      socket.off("notify/call-waiter")
      
      if (userId) {
        socket.emit("leaveRestaurantRoom", userId)
      }
    }
  }, [socket, isConnected, userId])

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Mark single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  // Get notification badge color based on type
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-amber-100 text-amber-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  // Handle waiter call acknowledgment
  const acknowledgeWaiterCall = (tableNumber: string | number, message: string) => {
    setActiveWaiterCalls(prev => 
      prev.filter(call => !(call.tableNumber === tableNumber && call.message === message))
    )
  }

  return (
    <>
 
      
      <div className="flex items-center gap-3">
        {/* Waiter calls indicator - LEFT of the bell */}
        {activeWaiterCalls.length > 0 && (
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 hover:text-amber-950 animate-pulse"
            >
              <span className="mr-1 font-medium">Table {activeWaiterCalls[0]?.tableNumber}</span>
              <Badge variant="outline" className="bg-amber-500">
                {activeWaiterCalls.length > 1 ? `+${activeWaiterCalls.length - 1}` : ''}
              </Badge>
            </Button>
          </div>
        )}
        
        {/* Regular notification bell - stays the same */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-10 w-10" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            
            {/* Active waiter calls section at the top of notification panel */}
            {activeWaiterCalls.length > 0 && (
              <div className="border-b bg-amber-50 p-2">
                <h4 className="text-xs font-semibold text-amber-900 mb-2">Active Waiter Calls</h4>
                <div className="flex flex-col gap-2">
                  {activeWaiterCalls.map((call, index) => (
                    <div key={`waiter-call-${index}`} className="flex items-center justify-between bg-amber-100 rounded p-2">
                      <div>
                        <p className="text-sm font-medium text-amber-900">Table {call.tableNumber}</p>
                        <p className="text-xs text-amber-700">{call.message}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-6 text-xs bg-amber-200 hover:bg-amber-300 text-amber-900"
                        onClick={() => acknowledgeWaiterCall(call.tableNumber, call.message)}
                      >
                        Mark As Read
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center h-16 text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-2 p-3 border-b last:border-0 hover:bg-accent/50 transition-colors",
                        !notification.read && "bg-accent/20"
                      )}
                    >
                      <div 
                        className={cn(
                          "w-2 h-2 mt-2 rounded-full",
                          notification.read ? "bg-gray-300" : "bg-blue-500"
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full"
                            disabled={notification.read}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        </div>
                        <p className="text-xs">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span 
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              getNotificationColor(notification.type)
                            )}
                          >
                            {notification.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}