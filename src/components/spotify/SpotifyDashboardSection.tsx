import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { SpotifyTravelPanel } from './SpotifyTravelPanel'
import { SpotifyIcon } from './SpotifyIcon'

const pillClass =
  'font-schibsted flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-medium text-[#000000] shadow-sm backdrop-blur-sm transition-transform hover:scale-105'

interface SpotifyDashboardContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const SpotifyDashboardContext = createContext<SpotifyDashboardContextValue | null>(
  null,
)

function useSpotifyDashboard() {
  const ctx = useContext(SpotifyDashboardContext)
  if (!ctx) {
    throw new Error('SpotifyDashboard components must be used inside SpotifyDashboardRoot')
  }
  return ctx
}

export function SpotifyDashboardRoot({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('spotify') === 'connected') {
      setOpen(true)
    }
  }, [searchParams])

  const toggle = () => setOpen((prev) => !prev)

  return (
    <SpotifyDashboardContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </SpotifyDashboardContext.Provider>
  )
}

export function SpotifyDashboardPanel() {
  const { open, setOpen } = useSpotifyDashboard()
  if (!open) return null
  return <SpotifyTravelPanel onClose={() => setOpen(false)} />
}

export function SpotifyDashboardButton() {
  const { open, toggle } = useSpotifyDashboard()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls="spotify-travel-panel"
      className={cn(pillClass, open && 'ring-2 ring-[#1DB954]/40')}
    >
      <SpotifyIcon className="h-4 w-4 text-[#1DB954]" />
      Spotify
    </button>
  )
}
