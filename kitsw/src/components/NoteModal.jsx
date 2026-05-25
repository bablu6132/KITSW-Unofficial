import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FormInput from './FormInput'
import FormTextarea from './FormTextarea'
import FormSelect from './FormSelect'

const initialForm = {
  title: '',
  subject: '',
  description: '',
  file_url: '',
  file_type: '',
}

const FILE_TYPE_OPTIONS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'ppt', label: 'PPT' },
  { value: 'doc', label: 'DOC' },
  { value: 'other', label: 'Other' },
]

export default function NoteModal({ isOpen, onClose, onSubmit }) {
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

    const nextError = validateForm(formData)
    if (nextError) {
      setError(nextError)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit?.({
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        file_url: formData.file_url.trim(),
        file_type: formData.file_type,
        is_active: true,
      })
    } catch (submitError) {
      setError(submitError?.message || 'Unable to save the note.')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
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
            className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-soft backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Notes
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Add a note
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Share a direct Google Drive download link so students can grab it instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed"
                aria-label="Close note form"
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

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Title"
                  name="noteTitle"
                  value={formData.title}
                  onChange={handleChange('title')}
                  required
                  autoComplete="off"
                />
                <FormInput
                  label="Subject"
                  name="noteSubject"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  autoComplete="off"
                />
              </div>

              <FormTextarea
                label="Description"
                name="noteDescription"
                value={formData.description}
                onChange={handleChange('description')}
                autoComplete="off"
                helper="Optional short description for the note preview."
              />

              <FormInput
                label="Google Drive download URL"
                name="noteFileUrl"
                value={formData.file_url}
                onChange={handleChange('file_url')}
                type="url"
                required
                autoComplete="off"
                helper="Paste the direct download link from Google Drive"
              />

              <FormSelect
                label="File type"
                name="noteFileType"
                value={formData.file_type}
                onChange={handleChange('file_type')}
                options={FILE_TYPE_OPTIONS}
                required
                helper="Choose the file format for the note card."
              />

              {error ? (
                <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
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
                  {isSubmitting ? 'Saving...' : 'Submit note'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function validateForm(formData) {
  if (!formData.title.trim()) {
    return 'Title is required.'
  }
  if (!formData.file_url.trim()) {
    return 'Google Drive download URL is required.'
  }
  if (!formData.file_type) {
    return 'File type is required.'
  }
  return ''
}
