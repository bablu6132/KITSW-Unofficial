import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import EventCard from '../components/EventCard'
import NotesCard from '../components/NotesCard'
import PeopleCard from '../components/PeopleCard'
import Sidebar from '../components/Sidebar'
import NoteModal from '../components/NoteModal'
import Toast from '../components/Toast'
import { fetchEvents, fetchNotes, insertNote, setNoteActive } from '../supabase'

const people = [
  {
    id: 'people-1',
    name: 'Aanya Kapoor',
    branch: 'ECE, 2nd Year',
    common: 'Common interests',
    interests: ['Robotics', 'UI/UX', 'Hackathons'],
  },
  {
    id: 'people-2',
    name: 'Rohan Menon',
    branch: 'CSE, 3rd Year',
    common: 'Common interests',
    interests: ['AI/ML', 'Startups', 'Design systems'],
  },
]

const suggestedPeople = [
  { id: 'sp-1', name: 'Meera Pillai', detail: 'EEE, 2nd Year', initials: 'MP' },
  { id: 'sp-2', name: 'Dev Patel', detail: 'ME, 3rd Year', initials: 'DP' },
  { id: 'sp-3', name: 'Sana Yusuf', detail: 'CSE, 1st Year', initials: 'SY' },
]

const campusFeed = []

const contentMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
}

export default function Home({ onAddEvent, isAdmin = false }) {
  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [eventsError, setEventsError] = useState('')
  const [notes, setNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState('')
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadEvents = async () => {
      setIsLoading(true)
      const { data, error } = await fetchEvents()
      if (!isMounted) {
        return
      }
      if (error) {
        setEventsError(error.message)
        setEvents([])
      } else {
        setEvents((data || []).map(mapEventRow))
        setEventsError('')
      }
      setIsLoading(false)
    }

    loadEvents()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadNotes = async () => {
      setNotesLoading(true)
      const { data, error } = await fetchNotes()
      if (!isMounted) {
        return
      }
      if (error) {
        setNotesError(error.message)
        setNotes([])
      } else {
        setNotes((data || []).map(mapNoteRow))
        setNotesError('')
      }
      setNotesLoading(false)
    }

    loadNotes()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!toast) {
      return
    }
    const handle = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(handle)
  }, [toast])

  const tabs = useMemo(
    () => [
      { id: 'events', label: 'Events', count: events.length },
      { id: 'notes', label: 'Notes', count: notes.length },
      { id: 'feed', label: 'Campus Feed', count: campusFeed.length },
    ],
    [events.length],
  )

  const upcomingEvents = useMemo(
    () =>
      events.slice(0, 3).map((event) => ({
        id: event.id,
        title: event.title,
        time: event.dateRange || event.dateTime || 'Upcoming',
        badge: event.category || 'Event',
      })),
    [events],
  )

  const eventEmptyState = eventsError
    ? {
        title: 'Unable to load events',
        description: eventsError,
      }
    : {
        title: 'No events yet',
        description: 'Be the first to publish a campus event.',
      }

  const noteEmptyState = notesError
    ? {
        title: 'Unable to load notes',
        description: notesError,
      }
    : {
        title: 'No notes yet',
        description: 'Be the first to share a note with the campus.',
      }

  const handleNoteSubmit = async (noteData) => {
    const { error } = await insertNote(noteData)
    if (error) {
      throw error
    }

    setToast({
      type: 'success',
      title: 'Note submitted',
      message: 'Your note has been added to the KITSW library.',
    })
    setIsNoteModalOpen(false)
    await refreshNotes()
  }

  const handleHideNote = async (noteId) => {
    const { error } = await setNoteActive(noteId, false)
    if (error) {
      setToast({
        type: 'error',
        title: 'Unable to hide note',
        message: error.message || 'Please try again.',
      })
      return
    }

    setToast({
      type: 'success',
      title: 'Note hidden',
      message: 'The note has been removed from public view.',
    })
    await refreshNotes()
  }

  const handleDownloadNote = async (fileUrl, title) => {
    try {
      await downloadNote(fileUrl, title)
    } catch (error) {
      setToast({
        type: 'error',
        title: 'Download failed',
        message: error?.message || 'Unable to download this note right now.',
      })
    }
  }

  const refreshNotes = async () => {
    setNotesLoading(true)
    const { data, error } = await fetchNotes()
    if (error) {
      setNotesError(error.message)
      setNotes([])
    } else {
      setNotes((data || []).map(mapNoteRow))
      setNotesError('')
    }
    setNotesLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.16),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(26,207,180,0.12),_transparent_40%),radial-gradient(circle_at_20%_80%,_rgba(255,122,112,0.12),_transparent_40%)]" />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-8 lg:px-8">
        <section id="hero" className="scroll-mt-24">
          <HeroSection onAddEvent={onAddEvent} />
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section id="feed" className="space-y-6">
            <FeedTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" {...contentMotion}>
                  <LoadingGrid />
                </motion.div>
              ) : activeTab === 'events' ? (
                <motion.div
                  key="events"
                  {...contentMotion}
                  className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1 sm:max-h-[66vh] lg:max-h-[70vh]"
                >
                  {events.length ? (
                    events.map((event) => (
                      <EventCard key={event.id} density="compact" {...event} />
                    ))
                  ) : (
                    <EmptyState
                      title={eventEmptyState.title}
                      description={eventEmptyState.description}
                    />
                  )}
                </motion.div>
              ) : activeTab === 'notes' ? (
                <motion.div key="notes" {...contentMotion} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                        Notes library
                      </p>
                      <h2 className="text-2xl font-semibold text-white">
                        Share and download notes
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNoteModalOpen(true)}
                      className="btn-ghost"
                    >
                      Add Note
                    </button>
                  </div>

                  {notesLoading ? (
                    <LoadingGrid />
                  ) : notes.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {notes.map((note) => (
                        <NotesCard
                          key={note.id}
                          {...note}
                          isAdmin={isAdmin}
                          onDownload={() => handleDownloadNote(note.fileUrl, note.title)}
                          onHide={isAdmin ? () => handleHideNote(note.id) : undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title={noteEmptyState.title}
                      description={noteEmptyState.description}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div key="feed" {...contentMotion}>
                  {campusFeed.length ? (
                    campusFeed.map((item) => <div key={item.id}>{item.title}</div>)
                  ) : (
                    <EmptyState
                      title="Campus feed is quiet"
                      description="Be the first to post an update or event."
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <section id="people" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Community
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    People to connect
                  </h2>
                </div>
                <button type="button" className="btn-ghost">
                  View all
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {people.map((person) => (
                  <PeopleCard key={person.id} {...person} />
                ))}
              </div>
            </section>
          </section>

          <aside>
            <Sidebar
              upcomingEvents={upcomingEvents}
              suggestedPeople={suggestedPeople}
            />
          </aside>
        </div>
      </main>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSubmit={handleNoteSubmit}
      />

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

function mapEventRow(row, index) {
  return {
    id: row.id ?? `${row.title || 'event'}-${index}`,
    category: row.category,
    title: row.title,
    description: row.description,
    venue: row.venue,
    dateRange: row.date_range,
    timings: row.timings,
    fee: row.fee,
    certificate: row.certificate,
    technologies: normalizeTechnologies(row.technologies),
    host: row.host,
    industryExpert: row.industry_expert,
    coordinator: row.coordinator,
    contactPhone: row.contact_phone,
    registrationLink: row.registration_url,
    seatNote: row.seat_note,
    theme: row.theme || 'teal',
    initialLikes: row.likes || 0,
    initialLiked: false,
  }
}

function normalizeTechnologies(value) {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function mapNoteRow(row, index) {
  return {
    id: row.id ?? `${row.title || 'note'}-${index}`,
    title: row.title,
    subject: row.subject,
    description: row.description,
    fileUrl: row.file_url,
    fileType: (row.file_type || 'other').toLowerCase(),
    eventId: row.event_id ?? null,
    createdAt: row.created_at,
  }
}

function downloadNote(fileUrl) {
  if (typeof window === 'undefined' || !fileUrl) {
    throw new Error('Invalid file URL.')
  }
  window.open(fileUrl, '_blank', 'noopener,noreferrer')
}

function FeedTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="glass-panel p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-full bg-white/15"
                />
              ) : null}
              <span className="relative z-10">{tab.label}</span>
              <span className="relative z-10 text-xs text-white/50">
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LoadingGrid({ rows = 3 }) {
  return (
    <div className="grid gap-5">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft"
        >
          <div className="h-3 w-24 rounded-full bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.2),rgba(255,255,255,0.06))] bg-[length:200%_100%] animate-shimmer" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-3/4 rounded-full bg-white/10" />
            <div className="h-4 w-2/3 rounded-full bg-white/10" />
          </div>
          <div className="mt-5 flex gap-3">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-4 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-soft">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6 text-white/70"
        >
          <path d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/60">{description}</p>
    </div>
  )
}
