import { useEffect, useState } from 'react'
import Home from './pages/Home'
import EventCreate from './pages/EventCreate'
import AdminVerificationModal from './components/AdminVerificationModal'

const getViewFromHash = () =>
  typeof window !== 'undefined' && window.location.hash === '#create'
    ? 'create'
    : 'home'

const getSafeView = (isAdmin) => {
  const next = getViewFromHash()
  if (next === 'create' && !isAdmin) {
    return 'home'
  }
  return next
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isVerificationOpen, setIsVerificationOpen] = useState(false)
  const [view, setView] = useState(() => getSafeView(false))

  useEffect(() => {
    const handleHashChange = () => {
      const nextView = getViewFromHash()
      if (nextView === 'create' && !isAdmin) {
        setView('home')
        return
      }
      setView(nextView)
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [isAdmin])

  const handleAddEvent = () => {
    if (isAdmin) {
      window.location.hash = '#create'
      return
    }
    setIsVerificationOpen(true)
  }

  const handleVerified = () => {
    setIsAdmin(true)
    setIsVerificationOpen(false)
    window.location.hash = '#create'
  }

  const showCreate = view === 'create' && isAdmin

  return (
    <>
      {showCreate ? <EventCreate /> : <Home onAddEvent={handleAddEvent} />}
      <AdminVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerified={handleVerified}
      />
    </>
  )
}