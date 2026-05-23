import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Events', href: '#feed' },
  { label: 'Notes', href: '#feed' },
  { label: 'Community', href: '#people' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <NavigationLinks className="hidden items-center gap-6 lg:flex" />
        </div>
        <div className="flex items-center gap-2">
          <SearchButton />
          <NotificationButton />
          <UserAvatar />
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="lg:hidden"
          >
            <div className="mx-4 mb-4 rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-soft backdrop-blur-xl">
              <NavigationLinks
                className="flex flex-col items-start gap-4"
                onNavigate={() => setIsOpen(false)}
              />
              <div className="mt-4 flex items-center gap-2">
                <SearchButton size="sm" />
                <NotificationButton size="sm" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-coral shadow-soft">
        <span className="text-sm font-semibold">KW</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">KITSW</p>
        <p className="text-xs text-white/50">Campus Hub</p>
      </div>
    </div>
  )
}

function NavigationLinks({ className, onNavigate }) {
  return (
    <div className={`text-sm font-semibold text-white/80 ${className || ''}`}>
      {navLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={onNavigate}
          className="transition hover:text-white"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

function SearchButton({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10'
  return (
    <button
      type="button"
      className={`${sizeClass} inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10`}
      aria-label="Search"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    </button>
  )
}

function NotificationButton({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10'
  return (
    <button
      type="button"
      className={`${sizeClass} inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10`}
      aria-label="Notifications"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9a6 6 0 0 1 12 0v3c0 .8.3 1.6.9 2.1l1 1H4l1-1a3 3 0 0 0 1-2.1V9" />
        <path d="M9.5 18a2.5 2.5 0 0 0 5 0" />
      </svg>
    </button>
  )
}

function UserAvatar() {
  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-teal-400/60 to-primary/70 text-xs font-semibold text-white shadow-soft"
      aria-label="User menu"
    >
      AK
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border border-slate-950 bg-teal-400" />
    </button>
  )
}
