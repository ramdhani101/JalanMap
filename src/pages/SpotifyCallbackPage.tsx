import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { completeSpotifyLogin } from '../lib/spotify/auth'

export function SpotifyCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = params.get('code')
    const state = params.get('state')
    const spotifyError = params.get('error')

    if (spotifyError) {
      setError('Login Spotify dibatalkan.')
      return
    }

    if (!code || !state) {
      setError('Respons login tidak lengkap.')
      return
    }

    void completeSpotifyLogin(code, state)
      .then(() => {
        navigate('/dashboard?spotify=connected', { replace: true })
      })
      .catch(() => {
        setError('Gagal menghubungkan Spotify. Coba lagi dari dashboard.')
      })
  }, [params, navigate])

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8f8f8] px-6 text-center">
        <p className="text-lg font-medium text-black">{error}</p>
        <Link
          to="/dashboard"
          className="rounded-full bg-[#1DB954] px-6 py-2.5 text-sm font-semibold text-white"
        >
          Kembali ke Dashboard
        </Link>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f8f8f8] px-6 text-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[#1DB954] border-t-transparent"
        aria-hidden
      />
      <p className="text-lg font-medium text-black">Menghubungkan Spotify…</p>
    </main>
  )
}
