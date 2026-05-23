import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import FormHeader from '../components/FormHeader'
import SectionCard from '../components/SectionCard'
import FormInput from '../components/FormInput'
import FormTextarea from '../components/FormTextarea'
import FormSelect from '../components/FormSelect'
import SubmitBar from '../components/SubmitBar'
import Toast from '../components/Toast'
import { insertEvent } from '../supabase'

const DRAFT_KEY = 'kitsw-event-draft'

const CATEGORY_OPTIONS = [
  { value: 'internship', label: 'Internship' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'talk', label: 'Guest Talk' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'club', label: 'Club' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'bootcamp', label: 'Bootcamp' },
]

const THEME_OPTIONS = [
  { value: 'purple', label: 'Purple (Primary)' },
  { value: 'teal', label: 'Teal (Events)' },
  { value: 'amber', label: 'Amber (Highlights)' },
  { value: 'coral', label: 'Coral (Social)' },
]

const CERTIFICATE_OPTIONS = [
  { value: 'Provided', label: 'Provided' },
  { value: 'Not provided', label: 'Not provided' },
]

const initialFormData = {
  category: '',
  title: '',
  description: '',
  venue: '',
  date_range: '',
  timings: '',
  fee: '',
  certificate: '',
  technologies: '',
  host: '',
  industry_expert: '',
  coordinator: '',
  contact_phone: '',
  registration_url: '',
  seat_note: '',
  theme: 'purple',
}

const requiredFields = [
  'category',
  'title',
  'description',
  'venue',
  'date_range',
  'timings',
  'registration_url',
  'host',
]

export default function EventCreate() {
  const [formData, setFormData] = useState(() => {
    const draft = loadDraft()
    return draft?.data ?? initialFormData
  })
  const [lastSavedAt, setLastSavedAt] = useState(() => {
    const draft = loadDraft()
    return draft?.savedAt ? new Date(draft.savedAt) : null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialFormData),
    [formData],
  )

  const missingCount = requiredFields.filter((field) =>
    isEmptyValue(formData[field]),
  ).length

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  }, [isDark])

  useEffect(() => {
    if (typeof window === 'undefined' || !isDirty) {
      return
    }
    const handle = window.setTimeout(() => {
      const payload = {
        data: formData,
        savedAt: new Date().toISOString(),
      }
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
      setLastSavedAt(new Date(payload.savedAt))
    }, 650)

    return () => window.clearTimeout(handle)
  }, [formData, isDirty])

  useEffect(() => {
    if (!toast) {
      return
    }
    const handle = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(handle)
  }, [toast])

  const savedLabel = lastSavedAt
    ? `Draft saved at ${formatTime(lastSavedAt)}`
    : 'Draft autosave enabled'

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setErrors({})
    setLastSavedAt(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_KEY)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { isValid, nextErrors } = validateForm(formData)

    if (!isValid) {
      setErrors(nextErrors)
      setToast({
        type: 'error',
        title: 'Missing details',
        message: 'Please complete the required fields before submitting.',
      })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const payload = buildPayload(formData)

    try {
      const { error } = await insertEvent(payload)
      if (error) {
        throw error
      }
      setToast({
        type: 'success',
        title: 'Event submitted',
        message: 'Your event has been added to the KITSW feed.',
      })
      handleReset()
    } catch (submitError) {
      setToast({
        type: 'error',
        title: 'Submission failed',
        message:
          submitError?.message || 'Unable to save the event. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(83,74,183,0.2),_transparent_45%),radial-gradient(circle_at_80%_10%,_rgba(45,212,191,0.12),_transparent_35%),radial-gradient(circle_at_20%_80%,_rgba(245,158,11,0.12),_transparent_40%)]" />

      <main className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-24 pt-10 lg:px-8">
        <FormHeader
          badge="KITSW Unofficial"
          title="Create a campus event"
          subtitle="Share internships, workshops, and meetups with a polished announcement that feels ready for production."
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Event basics"
              description="Core details that appear at the top of the event card."
              className="lg:col-span-2"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormSelect
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={(event) =>
                    handleFieldChange('category', event.target.value)
                  }
                  options={CATEGORY_OPTIONS}
                  icon={TagIcon}
                  required
                  error={errors.category}
                  helper="Choose how it appears in the feed."
                />
                <FormInput
                  label="Event title"
                  name="title"
                  value={formData.title}
                  onChange={(event) =>
                    handleFieldChange('title', event.target.value)
                  }
                  icon={TitleIcon}
                  required
                  maxLength={80}
                  error={errors.title}
                  helper="Keep it clear and scan friendly."
                />
                <div className="md:col-span-2">
                  <FormTextarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={(event) =>
                      handleFieldChange('description', event.target.value)
                    }
                    icon={DescriptionIcon}
                    required
                    maxLength={480}
                    error={errors.description}
                    helper="Short overview to set expectations."
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Schedule and venue"
              description="Make sure students know where and when to join."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Venue"
                  name="venue"
                  value={formData.venue}
                  onChange={(event) =>
                    handleFieldChange('venue', event.target.value)
                  }
                  icon={LocationIcon}
                  required
                  error={errors.venue}
                  helper="Include campus block and lab."
                />
                <FormInput
                  label="Date range"
                  name="date_range"
                  value={formData.date_range}
                  onChange={(event) =>
                    handleFieldChange('date_range', event.target.value)
                  }
                  icon={CalendarIcon}
                  required
                  error={errors.date_range}
                  helper="Example: 15 Jun 2026 - 04 Jul 2026"
                />
                <FormInput
                  label="Timings"
                  name="timings"
                  value={formData.timings}
                  onChange={(event) =>
                    handleFieldChange('timings', event.target.value)
                  }
                  icon={ClockIcon}
                  required
                  error={errors.timings}
                  helper="Example: 8:00 AM - 1:00 PM"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Pricing and certification"
              description="Highlight fees, certificates, and seat availability."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Fee"
                  name="fee"
                  value={formData.fee}
                  onChange={(event) => handleFieldChange('fee', event.target.value)}
                  icon={FeeIcon}
                  helper="Example: Rs 1500"
                />
                <FormSelect
                  label="Certificate"
                  name="certificate"
                  value={formData.certificate}
                  onChange={(event) =>
                    handleFieldChange('certificate', event.target.value)
                  }
                  options={CERTIFICATE_OPTIONS}
                  icon={CertificateIcon}
                  helper="Select certificate availability."
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="Seat note"
                    name="seat_note"
                    value={formData.seat_note}
                    onChange={(event) =>
                      handleFieldChange('seat_note', event.target.value)
                    }
                    icon={SeatIcon}
                    maxLength={120}
                    helper="Example: Limited seats available."
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Technical details"
              description="Add the stack or track so students know the scope."
            >
              <div className="grid gap-4">
                <FormInput
                  label="Technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={(event) =>
                    handleFieldChange('technologies', event.target.value)
                  }
                  icon={StackIcon}
                  helper="Comma-separated list (HTML, JavaScript, PHP)."
                />
                <FormSelect
                  label="Theme"
                  name="theme"
                  value={formData.theme}
                  onChange={(event) => handleFieldChange('theme', event.target.value)}
                  options={THEME_OPTIONS}
                  icon={PaletteIcon}
                  helper="Matches the event card color."
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Organizers"
              description="Add key contacts for credibility and questions."
              className="lg:col-span-2"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Host department"
                  name="host"
                  value={formData.host}
                  onChange={(event) => handleFieldChange('host', event.target.value)}
                  icon={HostIcon}
                  required
                  error={errors.host}
                  helper="Example: Dept. of CSE (AI&ML)"
                />
                <FormInput
                  label="Industry expert"
                  name="industry_expert"
                  value={formData.industry_expert}
                  onChange={(event) =>
                    handleFieldChange('industry_expert', event.target.value)
                  }
                  icon={ExpertIcon}
                  helper="Optional guest or industry speaker."
                />
                <FormInput
                  label="Coordinator"
                  name="coordinator"
                  value={formData.coordinator}
                  onChange={(event) =>
                    handleFieldChange('coordinator', event.target.value)
                  }
                  icon={CoordinatorIcon}
                  helper="Primary point of contact."
                />
                <FormInput
                  label="Contact phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={(event) =>
                    handleFieldChange('contact_phone', event.target.value)
                  }
                  icon={PhoneIcon}
                  inputMode="tel"
                  error={errors.contact_phone}
                  helper="Include country code if needed."
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Registration"
              description="Link to the registration or RSVP form."
            >
              <FormInput
                label="Registration URL"
                name="registration_url"
                value={formData.registration_url}
                onChange={(event) =>
                  handleFieldChange('registration_url', event.target.value)
                }
                icon={LinkIcon}
                type="url"
                required
                error={errors.registration_url}
                helper="Paste a valid HTTPS link."
              />
            </SectionCard>
          </div>

          <SubmitBar
            isSubmitting={isSubmitting}
            missingCount={missingCount}
            savedLabel={savedLabel}
            isDirty={isDirty}
            onReset={handleReset}
          />
        </form>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <AnimatePresence>
          {toast ? (
            <Toast
              key={toast.title}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function loadDraft() {
  if (typeof window === 'undefined') {
    return null
  }
  const raw = window.localStorage.getItem(DRAFT_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function buildPayload(data) {
  const trimmed = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  )

  return {
    ...trimmed,
    technologies: splitList(trimmed.technologies),
  }
}

function splitList(value) {
  if (!value) {
    return []
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function validateForm(data) {
  const nextErrors = {}

  requiredFields.forEach((field) => {
    if (isEmptyValue(data[field])) {
      nextErrors[field] = 'This field is required.'
    }
  })

  if (data.registration_url && !isValidUrl(data.registration_url)) {
    nextErrors.registration_url = 'Enter a valid URL.'
  }

  if (data.contact_phone && !isValidPhone(data.contact_phone)) {
    nextErrors.contact_phone = 'Enter a valid phone number.'
  }

  return { isValid: Object.keys(nextErrors).length === 0, nextErrors }
}

function isEmptyValue(value) {
  return !value || String(value).trim().length === 0
}

function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isValidPhone(value) {
  return /^\+?[0-9][0-9\s()-]{7,}$/.test(value)
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function TagIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M20 12l-8 8-8-8V4h8l8 8z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  )
}

function TitleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h10" />
      <path d="M4 17h7" />
    </svg>
  )
}

function DescriptionIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h8" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  )
}

function LocationIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 22s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

function CalendarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 11h18" />
    </svg>
  )
}

function ClockIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function FeeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

function CertificateIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8 13v8l4-2 4 2v-8" />
    </svg>
  )
}

function SeatIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 10h14" />
      <path d="M6 10v6" />
      <path d="M18 10v6" />
      <path d="M4 16h16" />
    </svg>
  )
}

function StackIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 2l9 5-9 5-9-5 9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </svg>
  )
}

function PaletteIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 2a9 9 0 0 0-9 9c0 5 4 9 9 9 1.7 0 3-1.3 3-3 0-1-.4-2-1-2h-2a2 2 0 1 1 0-4h4a4 4 0 0 0 0-8h-4Z" />
      <circle cx="7" cy="10" r="1" />
      <circle cx="9.5" cy="6.5" r="1" />
      <circle cx="16" cy="7" r="1" />
    </svg>
  )
}

function HostIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 21h18" />
      <path d="M6 21v-8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v8" />
      <path d="M9 9V3h6v6" />
    </svg>
  )
}

function ExpertIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" />
    </svg>
  )
}

function CoordinatorIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  )
}

function PhoneIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.6 19.6 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.8.3 1.5.6 2.2a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.9-1.9a2 2 0 0 1 2.1-.5c.7.3 1.4.5 2.2.6a2 2 0 0 1 1.7 1.9Z" />
    </svg>
  )
}

function LinkIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-2 2" />
      <path d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l2-2" />
    </svg>
  )
}
