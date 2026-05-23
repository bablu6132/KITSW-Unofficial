import { motion } from 'framer-motion'

const styles = {
  success: {
    container: 'border-teal-400/40 bg-teal-400/15 text-teal-100',
    icon: 'bg-teal-400/30 text-teal-100',
  },
  error: {
    container: 'border-rose-400/40 bg-rose-400/15 text-rose-100',
    icon: 'bg-rose-400/30 text-rose-100',
  },
}

export default function Toast({ type = 'success', title, message, onClose }) {
  const style = styles[type] || styles.success

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-3 shadow-soft ${style.container}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full ${style.icon}`}>
          {type === 'error' ? <ErrorIcon /> : <CheckIcon />}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs text-white/80">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/70 transition hover:text-white"
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      </div>
    </motion.div>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M5 12l4 4 10-10" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    </svg>
  )
}
