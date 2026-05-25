import { motion } from 'framer-motion'

const fileTypeStyles = {
  pdf: 'border-rose-400/40 bg-rose-400/15 text-rose-100',
  ppt: 'border-amber-400/40 bg-amber-400/15 text-amber-100',
  doc: 'border-sky-400/40 bg-sky-400/15 text-sky-100',
  other: 'border-white/15 bg-white/5 text-white/70',
}

export default function NotesCard({
  title,
  subject,
  description,
  fileType,
  onDownload,
  onHide,
  isAdmin = false,
}) {
  const normalizedFileType = (fileType || '').toLowerCase()
  const fileTypeLabel = getFileTypeLabel(normalizedFileType)
  const fileTypeStyle = fileTypeStyles[normalizedFileType] || fileTypeStyles.other

  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
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
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">{title}</h3>
            {subject ? <p className="text-xs text-white/60">{subject}</p> : null}
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${fileTypeStyle}`}
        >
          {fileTypeLabel}
        </span>
      </div>
      {description ? (
        <p
          className="mt-3 text-sm text-white/70"
          style={descriptionClamp}
        >
          {description}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDownload}
          className="btn-primary px-4 py-2 text-xs"
        >
          Download
        </button>
        {isAdmin && onHide ? (
          <button
            type="button"
            onClick={onHide}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10"
          >
            Hide
          </button>
        ) : null}
      </div>
    </motion.article>
  )
}

function getFileTypeLabel(fileType) {
  switch ((fileType || '').toLowerCase()) {
    case 'pdf':
      return 'PDF'
    case 'ppt':
      return 'PPT'
    case 'doc':
      return 'DOC'
    default:
      return 'Other'
  }
}

const descriptionClamp = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
}
