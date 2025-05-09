"use client"

import React, { useEffect, useState } from "react"
import { toast } from "@platter/ui/components/sonner"
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

export function NotificationCenter({ serverUrl, userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  
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

    // Listen for waiter alert (to be implemented)
    socket.on("waiterAlert", (data) => {
      // Access table number directly from the Table model structure
      const tableNumber = data.number || 'Unknown'
      const tableInfo = `Table ${tableNumber}`
      
      const notification: Notification = {
        id: `waiter-alert-${data.id || 'unknown'}-${Date.now()}`,
        title: `Table ${tableNumber} Needs Assistance`,
        message: `${tableInfo} has requested assistance`,
        timestamp: new Date(),
        read: false,
        type: 'warning'
      }
      
      setNotifications(prev => [notification, ...prev])
      toast.warning(notification.message)
    })

    return () => {
      socket.off("newOrder")
      socket.off("orderUpdate")
      socket.off("orderDeleted")
      socket.off("waiterAlert")
      
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
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
  )
}