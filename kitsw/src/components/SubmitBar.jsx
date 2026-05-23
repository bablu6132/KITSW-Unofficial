export default function SubmitBar({
  isSubmitting,
  missingCount,
  savedLabel,
  isDirty,
  onReset,
}) {
  const statusMessage = missingCount
    ? `${missingCount} required field${missingCount === 1 ? '' : 's'} remaining`
    : 'All required fields complete'

  return (
    <div className="sticky bottom-0 z-40 -mx-4 mt-8 rounded-t-3xl border border-slate-200/70 bg-white/90 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 lg:static lg:mx-0 lg:rounded-3xl lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Ready to publish
          </p>
          <p className="text-xs text-slate-500 dark:text-white/60">{statusMessage}</p>
          <p className="text-xs text-slate-400 dark:text-white/40">
            {savedLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isDirty ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-slate-200/70 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-primary/40 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
            >
              Reset draft
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Saving...
              </span>
            ) : (
              'Submit event'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  )
}
