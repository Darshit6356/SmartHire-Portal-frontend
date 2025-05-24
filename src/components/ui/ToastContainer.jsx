"use client"

import { useState, useCallback } from "react"
import Toast from "./Toast"

let toastId = 0

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++toastId
    const newToast = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Make addToast available globally
  if (typeof window !== "undefined") {
    window.showToast = addToast
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ToastContainer
