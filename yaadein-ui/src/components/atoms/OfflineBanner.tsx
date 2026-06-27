"use client"

import * as React from "react"
import { WifiOff } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()

  React.useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    // Check initial state
    setIsOffline(!navigator.onLine)

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)
    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  const duration = prefersReducedMotion ? 0 : 0.25

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          role="alert"
          aria-live="polite"
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration }}
          className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 bg-error text-white py-3 px-4 text-sm font-semibold shadow-elevated"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>You&apos;re offline. Please check your connection.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
