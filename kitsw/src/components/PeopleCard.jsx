import { motion } from 'framer-motion'

export default function PeopleCard({ name, branch, common, interests }) {
  const initials = getInitials(name)

  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-coral/40 to-primary/60 text-sm font-semibold text-white">
          {initials}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{name}</h3>
          <p className="text-xs text-white/60">{branch}</p>
        </div>
      </div>
      <div className="mt-3 inline-flex items-center rounded-full border border-teal-400/30 bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-100">
        {common}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
          >
            {interest}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
      >
        Connect
      </button>
    </motion.article>
  )
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}
