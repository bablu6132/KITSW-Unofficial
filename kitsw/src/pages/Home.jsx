import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import EventCard from '../components/EventCard'
import NotesCard from '../components/NotesCard'
import PeopleCard from '../components/PeopleCard'
import Sidebar from '../components/Sidebar'
import { fetchEvents } from '../supabase'

const notes = [
  {
    id: 1,
    title: 'Data Structures Unit 4',
    subject: 'CSE 3rd Year',
    meta: 'Stacks, queues, and hashing cheat sheet.',
    downloads: '1.4k',
  },
  {
    id: 2,
    title: 'Signals and Systems',
    subject: 'ECE 2nd Year',
    meta: 'Laplace transforms and frequency response notes.',
    downloads: '980',
  },
  {
    id: 3,
    title: 'Thermodynamics',
    subject: 'ME 2nd Year',
    meta: 'Solved numericals and exam prep summaries.',
    downloads: '760',
  },
  {
    id: 4,
    title: 'Human Computer Interaction',
    subject: 'Design Elective',
    meta: 'UX heuristics, testing templates, and case notes.',
    downloads: '620',
  },
]

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

export default function Home({ onAddEvent }) {
  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [eventsError, setEventsError] = useState('')

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
                <motion.div
                  key="notes"
                  {...contentMotion}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {notes.length ? (
                    notes.map((note) => <NotesCard key={note.id} {...note} />)
                  ) : (
                    <EmptyState
                      title="No notes yet"
                      description="Upload a summary to kickstart the library."
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
