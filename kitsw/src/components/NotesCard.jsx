import { motion } from 'framer-motion'

export default function NotesCard({ title, subject, meta, downloads }) {
  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/60">{subject}</p>
          </div>
        </div>
        <span className="text-xs text-white/50">{downloads} downloads</span>
      </div>
      <p className="mt-3 text-sm text-white/70">{meta}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-white/50">Updated 2 days ago</span>
        <button
          type="button"
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10"
        >
          Download
        </button>
      </div>
    </motion.article>
  )
}
