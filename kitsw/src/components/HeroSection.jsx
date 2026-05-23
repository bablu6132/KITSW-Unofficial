import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'

const stats = [
  { label: 'Active clubs', value: 42, suffix: '+', icon: SparkIcon },
  { label: 'Notes shared', value: 1200, suffix: '+', icon: FolderIcon },
  { label: 'Live events', value: 18, suffix: '', icon: CalendarIcon },
]

export default function HeroSection({ onAddEvent }) {
  const handleAddEvent = () => {
    if (onAddEvent) {
      onAddEvent()
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl lg:p-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-coral/20" />
      <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-primary/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl animate-float-slow" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="pill">College only</span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Your campus pulse, beautifully organized.
          </motion.h1>
          <p className="max-w-xl text-base text-white/70 md:text-lg">
            Discover events, share notes, and build your circle with a single
            student-first hub designed for KITSW life.
          </p>
          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={handleAddEvent}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <PlusIcon className="h-4 w-4" />
              </span>
              Add event
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-ghost"
            >
              Explore events
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-ghost"
            >
              Share notes
            </motion.button>
          </div>
          <StatsRow />
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Campus spotlight
              </p>
              <span className="rounded-full border border-coral/30 bg-coral/20 px-3 py-1 text-xs font-semibold text-coral">
                Live now
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Spring Fest Night Market
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Food stalls, student bands, and a sky lantern launch at the main
              ground.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-10 w-10 rounded-full border border-slate-950 bg-gradient-to-br from-primary/60 to-teal-400/60"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">342 going</p>
                <p className="text-xs text-white/60">Opens in 2 hours</p>
              </div>
            </div>
            <button className="mt-5 w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20">
              Join the fest
            </button>
          </div>

          <div className="pointer-events-none absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-soft backdrop-blur-xl lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Campus feed
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              32 new posts in the last hour
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsRow() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } },
      }}
      className="grid gap-4 pt-4 sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <stat.icon className="h-5 w-5 text-white/80" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              <AnimatedCounter value={stat.value} />
              {stat.suffix}
            </p>
            <p className="text-xs text-white/60">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [value])

  return new Intl.NumberFormat().format(display)
}

function SparkIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" />
    </svg>
  )
}

function FolderIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
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

function PlusIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}
