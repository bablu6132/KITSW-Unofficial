const highlights = [
  'Vite-powered React starter',
  'Ready for routing, data fetching, and component work',
  'Minimal structure that is easy to extend',
]

export default function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">KITSW</p>
        <h1>Build the KITSW app from a clean React foundation.</h1>
        <p className="lede">
          This scaffold gives you a modern Vite setup with fast dev feedback and
          a focused starting point for product work.
        </p>
        <div className="actions">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            Vite docs
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            React docs
          </a>
        </div>
      </section>

      <section className="panel" aria-label="Project highlights">
        {highlights.map((item) => (
          <article key={item} className="card">
            <span className="dot" aria-hidden="true" />
            <p>{item}</p>
          </article>
        ))}
      </section>
    </main>
  )
}