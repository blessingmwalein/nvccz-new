"use client"

import { toast } from "sonner"
import { useAppDispatch } from "@/lib/store"
import { addNotification } from "@/lib/store/slices/uiSlice"

export function useToast() {
  const dispatch = useAppDispatch()

  const showToast = (type: "success" | "error" | "warning" | "info", title: string, message?: string) => {
    // Show Sonner toast
    toast[type](title, {
      description: message,
    })

    // Add to Redux store for persistence
    dispatch(
      addNotification({
        type,
        title,
        message: message || "",
      }),
    )
  }

  return {
    success: (title: string, message?: string) => showToast("success", title, message),
    error: (title: string, message?: string) => showToast("error", title, message),
    warning: (title: string, message?: string) => showToast("warning", title, message),
    info: (title: string, message?: string) => showToast("info", title, message),
  }
}
