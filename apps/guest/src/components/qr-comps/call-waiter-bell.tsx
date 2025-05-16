"use client"

import { useState, useEffect } from "react"
import { Button } from "@platter/ui/components/button"
import { Bell } from "@platter/ui/lib/icons"
import useSocketIO from "@platter/ui/hooks/useSocketIO"
import { toast } from "@platter/ui/components/sonner"


interface CallWaiterBellProps {
  tableId: string
  restaurantName: string
  userId: string 
tableNumber: string
}

const LoadingDots = () => (
  <span className="flex items-center justify-center space-x-1">
    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
  </span>
)

export function CallWaiterBell({ tableId, userId, restaurantName, tableNumber }: CallWaiterBellProps) {
    const [isCalling, setIsCalling] = useState(false)
    const [cooldown, setCooldown] = useState(false)
    const [cooldownTime, setCooldownTime] = useState(0)
  
    // Connect to socket server
    const { socket, isConnected, error } = useSocketIO({
      serverUrl: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3002",
      autoConnect: true,
    })
  
    useEffect(() => {
      // Handle cooldown timer
      if (cooldown && cooldownTime > 0) {
        const timer = setTimeout(() => {
          setCooldownTime(cooldownTime - 1)
        }, 1000)
  
        return () => clearTimeout(timer)
      } else if (cooldownTime === 0 && cooldown) {
        setCooldown(false)
      }
    }, [cooldown, cooldownTime])
  
    const callWaiter = () => {
      if (!isConnected || cooldown) return
  
      setIsCalling(true)
  
      // Emit waiterAlert event to notify backend using your existing implementation
      socket?.emit("waiterAlert", {
        userId: userId, // Required field for your backend
        tableId: tableId,
        tableNumber,
        restaurantName: restaurantName,
        message: "Customer needs assistance",
        timestamp: new Date().toISOString(),
      })
  
      // Show success toast
      toast("A staff member will be with you shortly.", {
        duration: 3000,
      })
  
      // Add animation and cooldown
      setTimeout(() => {
        setIsCalling(false)
        setCooldown(true)
        setCooldownTime(30) // 30 second cooldown
      }, 2000)
    }
  
    return (
      <div className="mt-6 text-center w-full">
        <Button
          onClick={callWaiter}
          disabled={!isConnected || cooldown}
          variant="outline"
          size="lg"
          className={`w-full relative transition-all duration-300 ${
            isCalling ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          {/* <Bell className={`w-5 h-5 mr-2 ${isCalling ? "animate-ping absolute" : ""}`} /> */}
          <Bell className="w-5 h-5 mr-2" />
          {cooldown ? `Please wait (${cooldownTime}s)` : "Call Waiter"}
        </Button>
  
        {/* {error && <p className="text-sm text-red-500 mt-1">Connection error. Please try again later.</p>} */}
  
        {!isConnected && !error && <LoadingDots/>}
      </div>
    )
  }
