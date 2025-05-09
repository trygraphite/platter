"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

// Define notification storage key
const NOTIFICATION_STORAGE_KEY = "restaurant-notifications"

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: 'success' | 'info' | 'warning' | 'error'
}

export function useNotifications(maxNotifications = 50) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  
  // Load notifications from localStorage on component mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications)
        // Ensure timestamp is a Date object
        const formattedNotifications = parsedNotifications.map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp)
        }))
        setNotifications(formattedNotifications)
      }
    } catch (error) {
      console.error("Failed to load notifications from localStorage:", error)
    }
  }, [])
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      if (notifications.length > 0) {
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications))
      }
    } catch (error) {
      console.error("Failed to save notifications to localStorage:", error)
    }
  }, [notifications])
  
  // Calculate unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${notification.type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => {
      // Add to beginning and limit to maxNotifications
      const updated = [newNotification, ...prev].slice(0, maxNotifications)
      return updated
    })
    
    return newNotification.id
  }, [maxNotifications])
  
  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])
  
  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])
  
  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    localStorage.removeItem(NOTIFICATION_STORAGE_KEY)
  }, [])
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  }
}