import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Home, Menu, X } from 'lucide-react'
import { CrabIdleAnimation } from '~/components/ani'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="px-4 py-3 flex items-center bg-shell-900 border-b-2 border-shell-700 relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-crab-950/10 via-transparent to-transparent pointer-events-none" />

        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2.5 hover:bg-shell-800 rounded-lg transition-all duration-150 border border-transparent hover:border-shell-600 group"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-400 group-hover:text-crab-400 transition-colors" />
        </button>

        <Link to="/" className="ml-4 flex items-center gap-3 group">
          <div className="crab-icon-glow">
            <CrabIdleAnimation className="w-8 h-8" />
          </div>
          <span className="font-arcade text-sm text-crab-400 glow-red tracking-wider">
            CRABWALK
          </span>
        </Link>

        {/* Decorative claw brackets */}
        <div className="ml-auto flex items-center gap-2 text-shell-600 font-console text-xs">
          <span className="text-crab-700">❮</span>
          <span>v3.0</span>
          <span className="text-crab-700">❯</span>
        </div>
      </header>

      {/* Sidebar navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 bg-shell-900 border-r-2 border-shell-700 z-50 flex flex-col overflow-hidden"
            >
              {/* Scanline texture */}
              <div className="absolute inset-0 texture-scanlines pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between p-4 border-b-2 border-shell-700 bg-shell-950/50">
                <div className="flex items-center gap-3">
                  <CrabIdleAnimation className="w-7 h-7" />
                  <h2 className="font-display text-lg font-semibold text-gray-200 tracking-wide">
                    NAVIGATION
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-shell-800 rounded-lg transition-colors border border-transparent hover:border-shell-600"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="relative flex-1 p-4 overflow-y-auto">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-shell-800 transition-all duration-150 mb-2 border-2 border-transparent hover:border-shell-600 group"
                  activeProps={{
                    className: 'flex items-center gap-3 p-3 rounded-lg bg-crab-900/30 border-2 border-crab-700 mb-2 group box-glow-red',
                  }}
                >
                  <Home size={18} className="text-gray-400 group-hover:text-crab-400" />
                  <span className="font-display font-medium text-sm tracking-wide text-gray-200 group-hover:text-white">
                    HOME
                  </span>
                </Link>

                <Link
                  to="/monitor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-shell-800 transition-all duration-150 mb-2 border-2 border-transparent hover:border-shell-600 group"
                  activeProps={{
                    className: 'flex items-center gap-3 p-3 rounded-lg bg-crab-900/30 border-2 border-crab-700 mb-2 group box-glow-red',
                  }}
                >
                  <Activity size={18} className="text-gray-400 group-hover:text-crab-400" />
                  <span className="font-display font-medium text-sm tracking-wide text-gray-200 group-hover:text-white">
                    MONITOR
                  </span>
                </Link>

                {/* Decorative separator */}
                <div className="my-6 h-px bg-linear-to-r from-transparent via-shell-600 to-transparent" />

                {/* Console-style info */}
                <div className="font-console text-shell-500 text-[10px] leading-relaxed">
                  <div className="mb-1">
                    <span className="text-crab-600">&gt;</span> system: active
                  </div>
                  <div className="mb-1">
                    <span className="text-crab-600">&gt;</span> protocol: v3
                  </div>
                  <div>
                    <span className="text-crab-600">&gt;</span> gateway: ws://127.0.0.1:18789
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="relative p-4 border-t-2 border-shell-700 bg-shell-950/50">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-mint animate-pulse" />
                  <span className="font-console text-xs text-shell-500">
                    crabwalk online
                  </span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
