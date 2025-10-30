// Preloader.jsx
import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader({ autoFinishMs = 1500, onFinish }) {
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById("preloader-root")
      if (el) el.classList.add("opacity-0", "pointer-events-none")
      if (onFinish) setTimeout(onFinish, 400)
    }, autoFinishMs)
    return () => clearTimeout(t)
  }, [autoFinishMs, onFinish])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        id="preloader-root"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white transition-opacity duration-500"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          <motion.span
            className="text-sm text-white/70 tracking-wider uppercase"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Streamr
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
