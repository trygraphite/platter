"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"

export interface ToastProps {
  id: string
  title: string
  description?: string
  type?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
}

interface ToastContextType {
  toasts: ToastProps[]
  showToast: (toast: Omit<ToastProps, "id">) => string
  hideToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = (toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastProps = {
      id,
      ...toast,
      duration: toast.duration || 60000, // Default 60 seconds
    }
    
    setToasts((prevToasts) => [...prevToasts, newToast])
    
    // Auto dismiss after duration
    if (newToast.duration !== Infinity) {
      setTimeout(() => {
        hideToast(id)
      }, newToast.duration)
    }
    
    return id
  }

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Custom hook to use toast context
export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const ToastContainer = () => {
  const { toasts, hideToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => hideToast(toast.id)} />
      ))}
    </div>
  )
}

const Toast = ({ id, title, description, type = "default", onClose }: ToastProps) => {
  const [progress, setProgress] = useState(100)
  const [isVisible, setIsVisible] = useState(false)
  
  // Animation effects
  useEffect(() => {
    // Trigger entrance animation
    const enterTimeout = setTimeout(() => setIsVisible(true), 10)
    
    return () => clearTimeout(enterTimeout)
  }, [])
  
  // Get color classes based on type
  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-500 text-green-800"
      case "error":
        return "bg-red-50 border-red-500 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-500 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-500 text-blue-800"
      default:
        return "bg-white border-gray-300 text-gray-800"
    }
  }

  return (
    <div 
      className={`${getTypeClasses()} border-l-4 rounded-md shadow-lg transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="p-4 relative overflow-hidden">
        {/* Top portion with title and close button */}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{title}</h3>
          <button 
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Description if provided */}
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
          <div 
            className={`h-full ${type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : type === 'info' ? 'bg-blue-500' : 'bg-gray-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}