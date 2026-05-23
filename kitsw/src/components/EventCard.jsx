import { useState } from 'react'
import { motion } from 'framer-motion'

const themes = {
  teal: {
    badge: 'border-teal-300/40 bg-teal-400/15 text-teal-200',
    accent: 'from-teal-300/80 via-teal-300/20 to-transparent',
    button: 'bg-teal-400/20 text-teal-100 hover:bg-teal-400/30',
    border: 'border-teal-400/20',
  },
  amber: {
    badge: 'border-amber-300/40 bg-amber-400/20 text-amber-200',
    accent: 'from-amber-300/80 via-amber-300/20 to-transparent',
    button: 'bg-amber-400/20 text-amber-100 hover:bg-amber-400/30',
    border: 'border-amber-400/20',
  },
  coral: {
    badge: 'border-coral/40 bg-coral/20 text-coral',
    accent: 'from-coral/80 via-coral/20 to-transparent',
    button: 'bg-coral/20 text-coral hover:bg-coral/30',
    border: 'border-coral/25',
  },
  purple: {
    badge: 'border-primary/40 bg-primary/20 text-primary-light',
    accent: 'from-primary/80 via-primary/20 to-transparent',
    button: 'bg-primary/20 text-primary-light hover:bg-primary/30',
    border: 'border-primary/25',
  },
}

export default function EventCard({
  category,
  title,
  description,
  venue,
  dateTime,
  dateRange,
  timings,
  fee,
  certificate,
  technologies = [],
  highlights = [],
  importantNote,
  resourcePersons = [],
  industryExpert,
  convener,
  coordinator,
  contactPhone,
  registrationLink,
  seatNote,
  host,
  initialLikes = 0,
  initialLiked = false,
  density = 'default',
  theme = 'teal',
}) {
  const styles = themes[theme] || themes.teal
  const schedule = dateRange || dateTime
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const isCompact = density === 'compact'

  const handleLikeToggle = () => {
    setIsLiked((prev) => {
      setLikeCount((count) => count + (prev ? -1 : 1))
      return !prev
    })
  }

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl border ${styles.border} bg-white/5 shadow-soft backdrop-blur-xl ${
        isCompact ? 'p-5' : 'p-6'
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${styles.accent}`}
      />
      <div className={`relative flex flex-col ${isCompact ? 'gap-4' : 'gap-5'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles.badge}`}
          >
            {category}
          </span>
          <div className="flex items-center gap-3">
            {seatNote ? (
              <span className="text-xs text-white/50">{seatNote}</span>
            ) : null}
            <motion.button
              type="button"
              onClick={handleLikeToggle}
              whileTap={{ scale: 0.92 }}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isLiked
                  ? 'border-rose-300/40 bg-rose-400/20 text-rose-200'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              aria-pressed={isLiked}
              aria-label={isLiked ? 'Unlike event' : 'Like event'}
            >
              <HeartIcon filled={isLiked} className="h-4 w-4" />
              {likeCount}
            </motion.button>
          </div>
        </div>
        <div>
          <h3 className={`font-semibold text-white ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h3>
          {description ? (
            <p className={`text-sm text-white/70 ${isCompact ? 'mt-1' : 'mt-2'}`}>
              {description}
            </p>
          ) : null}
        </div>

        {isCompact ? (
          <div className="flex flex-wrap gap-2">
            {venue ? (
              <DetailBite icon={PinIcon} label="Venue" value={venue} />
            ) : null}
            {schedule ? (
              <DetailBite icon={CalendarIcon} label="Duration" value={schedule} />
            ) : null}
            {timings ? (
              <DetailBite icon={ClockIcon} label="Timings" value={timings} />
            ) : null}
            {fee ? <DetailBite icon={TicketIcon} label="Fee" value={fee} /> : null}
            {certificate ? (
              <DetailBite icon={BadgeIcon} label="Certificate" value={certificate} />
            ) : null}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {venue ? <InfoItem icon={PinIcon} label="Venue" value={venue} /> : null}
            {schedule ? (
              <InfoItem icon={CalendarIcon} label="Duration" value={schedule} />
            ) : null}
            {timings ? <InfoItem icon={ClockIcon} label="Timings" value={timings} /> : null}
            {fee ? <InfoItem icon={TicketIcon} label="Fee" value={fee} /> : null}
            {certificate ? (
              <InfoItem icon={BadgeIcon} label="Certificate" value={certificate} />
            ) : null}
          </div>
        )}

        {technologies.length ? (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Technologies covered
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {importantNote ? (
          <div
            className={`rounded-2xl border ${styles.border} bg-white/5 ${
              isCompact ? 'p-3' : 'p-4'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Important
            </p>
            <p className="mt-2 text-sm text-white/80">{importantNote}</p>
          </div>
        ) : null}

        {highlights.length ? (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Internship highlights
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/70">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {resourcePersons.length || industryExpert || convener || coordinator ? (
          <div
            className={`grid gap-4 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/70 ${
              isCompact ? 'p-3' : 'p-4'
            }`}
          >
            {resourcePersons.length ? (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Resource persons
                </p>
                <ul className="mt-2 space-y-1">
                  {resourcePersons.map((person) => (
                    <li key={person}>{person}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {industryExpert ? (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Industry expert
                </p>
                <p className="mt-2">{industryExpert}</p>
              </div>
            ) : null}
            {convener ? (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Convener
                </p>
                <p className="mt-2">{convener}</p>
              </div>
            ) : null}
            {coordinator ? (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Coordinator and contact
                </p>
                <p className="mt-2">{coordinator}</p>
                {contactPhone ? (
                  <p className="mt-1 text-white/60">{contactPhone}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-white/50">
            {host || 'KITSW campus event'}
          </div>
          {registrationLink ? (
            <a
              href={registrationLink}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${styles.button}`}
            >
              Register now
              <LinkIcon className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${styles.button}`}
            >
              RSVP
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
        <Icon className="h-4 w-4 text-white/80" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</p>
        <p className="mt-1 text-sm text-white/80">{value}</p>
      </div>
    </div>
  )
}

function DetailBite({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-3 w-3 text-white/80" />
      </span>
      <span className="text-white/50">{label}:</span>
      <span className="text-white/85">{value}</span>
    </div>
  )
}

function HeartIcon({ className, filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.8l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.4 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  )
}

function PinIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M12 22s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 11h18" />
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function TicketIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M4 8h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V8z" />
      <path d="M9 8v12" />
    </svg>
  )
}

function BadgeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M8 13v8l4-2 4 2v-8" />
    </svg>
  )
}

function LinkIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-2 2" />
      <path d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l2-2" />
    </svg>
  )
}
