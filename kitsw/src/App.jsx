import { useEffect, useState } from 'react'
import Home from './pages/Home'
import EventCreate from './pages/EventCreate'

const getViewFromHash = () =>
  typeof window !== 'undefined' && window.location.hash === '#create'
    ? 'create'
    : 'home'

export default function App() {
  const [view, setView] = useState(() => getViewFromHash())

  useEffect(() => {
    const handleHashChange = () => setView(getViewFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleAddEvent = () => {
    window.location.hash = '#create'
  }

  return view === 'create' ? (
    <EventCreate />
  ) : (
    <Home onAddEvent={handleAddEvent} />
  )
}