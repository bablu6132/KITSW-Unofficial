import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FormInput from './FormInput'
import { getAdminUserByEmail } from '../supabase'

const initialForm = {
  email: '',
  password: '',
}

export default function AdminVerificationModal({ isOpen, onClose, onVerified }) {
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      return
    }
    setFormData(initialForm)
    setError('')
    setIsSubmitting(false)
  }, [isOpen])

  const handleChange = (field) => (event) => {
    const { value } = event.target
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) {
      setError('')
    }
  }

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget || isSubmitting) {
      return
    }
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Enter your admin email and password.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { admin, error: adminError } = await getAdminUserByEmail(
        formData.email,
      )

      if (adminError) {
        throw adminError
      }

      if (!admin || admin.is_active === false) {
        setError('This account is not authorized to add events.')
        return
      }

      if (admin.password_hash !== formData.password) {
        setError('Invalid email or password.')
        return
      }

      if (onVerified) {
        onVerified()
      }
    } catch (verifyError) {
      setError(verifyError?.message || 'Unable to verify admin access.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-soft backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Verification
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Admin access required
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Sign in with an approved admin account to add events.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed"
                aria-label="Close verification"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormInput
                label="Admin email"
                name="adminEmail"
                value={formData.email}
                onChange={handleChange('email')}
                type="email"
                autoComplete="email"
                required
              />
              <FormInput
                label="Password"
                name="adminPassword"
                value={formData.password}
                onChange={handleChange('password')}
                type="password"
                autoComplete="current-password"
                required
              />

              {error ? (
                <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify access'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
