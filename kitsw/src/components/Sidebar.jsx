export default function Sidebar({ upcomingEvents, suggestedPeople }) {
  return (
    <div className="space-y-6 lg:sticky lg:top-28">
      <section className="glass-panel p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Upcoming</h3>
          <button
            type="button"
            className="text-xs font-semibold text-white/60 transition hover:text-white"
          >
            View all
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <p className="text-xs text-white/60">{event.time}</p>
              </div>
              <span className="rounded-full border border-teal-400/30 bg-teal-400/15 px-2 py-1 text-xs text-teal-100">
                {event.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Suggested people</h3>
          <button
            type="button"
            className="text-xs font-semibold text-white/60 transition hover:text-white"
          >
            See all
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {suggestedPeople.map((person) => (
            <div key={person.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-teal-400/60 text-xs font-semibold text-white">
                {person.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{person.name}</p>
                <p className="text-xs text-white/60">{person.detail}</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      <SponsoredAdCard />
    </div>
  )
}

function SponsoredAdCard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-white/5 to-teal-400/20 p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-white/60">Sponsored</p>
      <h3 className="mt-2 text-lg font-semibold text-white">Skills Sprint Bootcamp</h3>
      <p className="mt-2 text-sm text-white/70">
        Build a portfolio-ready product with mentors and weekly studio reviews.
      </p>
      <button
        type="button"
        className="mt-4 w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
      >
        Apply now
      </button>
    </section>
  )
}
