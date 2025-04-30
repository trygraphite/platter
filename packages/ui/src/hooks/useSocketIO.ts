"use client"

// hooks/useSocketIO.ts
import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"

interface UseSocketIOOptions {
  serverUrl: string
  path?: string
  reconnectionAttempts?: number
  reconnectionDelay?: number
  timeout?: number
  autoConnect?: boolean
}

interface UseSocketIOResult {
  socket: Socket | null
  isConnected: boolean
  error: string | null
  connect: () => void
  disconnect: () => void
}

export default function useSocketIO({
  serverUrl,
  path = "/socket.io",
  reconnectionAttempts = 5,
  reconnectionDelay = 1000,
  timeout = 20000, // Increased timeout
  autoConnect = true,
}: UseSocketIOOptions): UseSocketIOResult {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reconnectCountRef = useRef(0)

  const connect = () => {
    if (socketRef.current?.connected) {
      console.log("Socket already connected")
      return
    }

    try {
      // Create new socket connection with improved configuration
      const socket = io(serverUrl, {
        path,
        reconnection: true,
        reconnectionAttempts,
        reconnectionDelay,
        reconnectionDelayMax: 5000,
        timeout,
        autoConnect,
        transports: ["websocket", "polling"], // Try WebSocket first, then fall back to polling
        extraHeaders: {
          "Cache-Control": "no-cache",
        },
        forceNew: true, // Force a new connection
      })

      socketRef.current = socket

      // Set up event listeners
      socket.on("connect", () => {
        console.log("Socket.IO connected successfully")
        setIsConnected(true)
        setError(null)
        reconnectCountRef.current = 0 // Reset reconnect counter on successful connection
      })

      socket.on("connect_error", (err) => {
        console.error("Socket.IO connection error:", err)
        setIsConnected(false)
        setError(`Connection error: ${err.message}`)
      })

      socket.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected:", reason)
        setIsConnected(false)

        if (reason === "io server disconnect") {
          setError("Server disconnected. Please refresh the page.")
        } else if (reason === "transport error") {
          // Handle transport errors specifically (including xhr poll error)
          console.warn("Transport error occurred. Attempting to reconnect...")
          setError("Connection transport error. Attempting to reconnect...")

          // Force reconnect after a short delay for transport errors
          setTimeout(() => {
            if (socketRef.current && !socketRef.current.connected) {
              console.log("Forcing reconnection after transport error")
              socketRef.current.connect()
            }
          }, 2000)
        } else {
          setError("Connection lost. Attempting to reconnect...")
        }
      })

      socket.on("error", (err) => {
        console.error("Socket.IO error:", err)
        setError(`Socket error: ${err instanceof Error ? err.message : String(err)}`)
      })

      // Add more specific event listeners for reconnection
      socket.io.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Socket.IO reconnect attempt ${attemptNumber}`)
        reconnectCountRef.current = attemptNumber
      })

      socket.io.on("reconnect", (attemptNumber) => {
        console.log(`Socket.IO reconnected after ${attemptNumber} attempts`)
        setIsConnected(true)
        setError(null)
      })

      socket.io.on("reconnect_error", (err) => {
        console.error("Socket.IO reconnection error:", err)
        setError(`Reconnection error: ${err instanceof Error ? err.message : String(err)}`)
      })

      socket.io.on("reconnect_failed", () => {
        console.error("Socket.IO reconnection failed after all attempts")
        setError("Failed to reconnect after multiple attempts. Please refresh the page.")
      })

      // Handle polling errors specifically
      socket.io.engine?.on("error", (err: string | Error) => {
        const transport = socket.io.engine?.transport?.name
        console.error(`Socket.IO transport error on ${transport}:`, err)
        if (transport === "polling" && socketRef.current) {
          console.log("XHR polling error detected, attempting to switch to WebSocket")
          // Try to force WebSocket transport on next reconnect
          socketRef.current.io.opts.transports = ["websocket"]
        }
      })
    } catch (err) {
      console.error("Failed to initialize socket:", err)
      setError(`Socket initialization failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }

  useEffect(() => {
    // Only connect if autoConnect is true
    if (autoConnect) {
      connect()
    }

    // Clean up on unmount
    return () => {
      disconnect()
    }
  }, [serverUrl, path]) // Reconnect if server URL or path changes

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
  }
}
