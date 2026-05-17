import { Link, Outlet, useLocation } from 'react-router-dom'
import { Map, Compass } from 'lucide-react'

export function Layout() {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 shadow-lg shadow-cyan-500/25">
              <Compass className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              Jalan<span className="text-cyan-400">Map</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            {!isDashboard && (
              <Link
                to="/"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Beranda
              </Link>
            )}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-teal-400 transition-all"
            >
              <Map className="h-4 w-4" />
              Buka Peta
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
