import { useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ExternalLink,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Unplug,
  X,
} from 'lucide-react'
import { useSpotify } from '../../hooks/useSpotify'
import { getSpotifyRedirectUri } from '../../lib/spotify/config'
import { SpotifyIcon } from './SpotifyIcon'

function formatArtists(artists: { name: string }[]): string {
  return artists.map((a) => a.name).join(', ')
}

function PanelShell({
  onClose,
  children,
}: {
  onClose?: () => void
  children: ReactNode
}) {
  return (
    <section
      id="spotify-travel-panel"
      className="map-hero-glass-panel w-full max-w-xl rounded-2xl p-5 text-left"
    >
      {onClose && (
        <div className="-mt-1 mb-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#505050] transition-colors hover:bg-black/5 hover:text-[#000000]"
            aria-label="Tutup panel Spotify"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {children}
    </section>
  )
}

interface SpotifyTravelPanelProps {
  onClose?: () => void
}

export function SpotifyTravelPanel({ onClose }: SpotifyTravelPanelProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const spotify = useSpotify()

  const { markConnected, loadSession } = spotify

  useEffect(() => {
    if (searchParams.get('spotify') !== 'connected') return
    markConnected()
    void loadSession()
    const next = new URLSearchParams(searchParams)
    next.delete('spotify')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams, markConnected, loadSession])

  if (!spotify.configured) {
    return (
      <PanelShell onClose={onClose}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1DB954] text-white">
            <SpotifyIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-schibsted text-base font-semibold text-[#000000]">
              Musik perjalanan dengan Spotify
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#505050]">
              Hubungkan akun Spotify untuk mendengarkan playlist sambil merencanakan rute.
              Tambahkan{' '}
              <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">VITE_SPOTIFY_CLIENT_ID</code>{' '}
              di file <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">.env</code>, lalu
              daftarkan redirect URI di Spotify Developer Dashboard.
            </p>
            <p className="mt-2 font-mono text-xs text-[#505050] break-all">
              {getSpotifyRedirectUri()}
            </p>
          </div>
        </div>
      </PanelShell>
    )
  }

  if (!spotify.connected) {
    return (
      <PanelShell onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1DB954] text-white shadow-md">
            <SpotifyIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-schibsted text-base font-semibold text-[#000000]">
              Dengarkan sambil jalan-jalan
            </h2>
            <p className="mt-0.5 text-sm text-[#505050]">
              Playlist perjalanan, kontrol play/pause — lagu diputar di aplikasi Spotify Anda.
            </p>
          </div>
        </div>
        {spotify.error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{spotify.error}</p>
        )}
        <button
          type="button"
          onClick={() => void spotify.connect()}
          className="font-schibsted mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1DB954] px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          <SpotifyIcon className="h-5 w-5" />
          Hubungkan Spotify
        </button>
      </PanelShell>
    )
  }

  const avatar = spotify.profile?.images?.[0]?.url
  const trackImage = spotify.nowPlaying?.track.album.images?.[0]?.url

  return (
    <PanelShell onClose={onClose}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#1DB954]/40"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1DB954] text-white">
              <SpotifyIcon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-schibsted truncate text-sm font-semibold text-[#000000]">
              {spotify.profile?.display_name ?? 'Akun Spotify'}
            </p>
            <p className="text-xs text-[#505050]">Terhubung · siap untuk perjalanan</p>
          </div>
        </div>
        <button
          type="button"
          onClick={spotify.disconnect}
          className="shrink-0 rounded-full p-2 text-[#505050] transition-colors hover:bg-black/5 hover:text-[#000000]"
          title="Putuskan Spotify"
          aria-label="Putuskan Spotify"
        >
          <Unplug className="h-4 w-4" />
        </button>
      </div>

      {spotify.loading ? (
        <div className="mt-4 flex items-center justify-center gap-2 py-6 text-sm text-[#505050]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat musik…
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-xl bg-white/80 p-3 shadow-sm">
            {spotify.nowPlaying ? (
              <div className="flex gap-3">
                {trackImage ? (
                  <img
                    src={trackImage}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#1DB954]/15">
                    <SpotifyIcon className="h-6 w-6 text-[#1DB954]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#000000]">
                    {spotify.nowPlaying.track.name}
                  </p>
                  <p className="truncate text-xs text-[#505050]">
                    {formatArtists(spotify.nowPlaying.track.artists)}
                  </p>
                  <a
                    href={spotify.nowPlaying.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#1DB954] hover:underline"
                  >
                    Buka di Spotify
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#505050]">
                Belum ada lagu yang diputar. Pilih playlist di bawah atau buka Spotify di perangkat
                Anda.
              </p>
            )}

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => void spotify.previous()}
                className="rounded-full p-2 text-[#000000] transition-colors hover:bg-black/5"
                aria-label="Lagu sebelumnya"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => void spotify.toggle()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1DB954] text-white shadow-md transition-transform hover:scale-105"
                aria-label={spotify.nowPlaying?.isPlaying ? 'Jeda' : 'Putar'}
              >
                {spotify.nowPlaying?.isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 translate-x-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => void spotify.next()}
                className="rounded-full p-2 text-[#000000] transition-colors hover:bg-black/5"
                aria-label="Lagu berikutnya"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-schibsted text-xs font-semibold uppercase tracking-wide text-[#505050]">
              Playlist untuk perjalanan
            </h3>
            {spotify.playlistsLoading ? (
              <div className="mt-2 flex items-center gap-2 text-sm text-[#505050]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Mencari playlist…
              </div>
            ) : (
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {spotify.playlists.map((pl) => (
                  <li key={pl.id}>
                    <button
                      type="button"
                      onClick={() => void spotify.playTravelPlaylist(pl.id)}
                      className="flex w-full items-center gap-2 rounded-xl border border-black/5 bg-white/70 p-2 text-left transition-colors hover:border-[#1DB954]/40 hover:bg-white"
                    >
                      {pl.images[0]?.url ? (
                        <img
                          src={pl.images[0].url}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#1DB954]/15">
                          <SpotifyIcon className="h-4 w-4 text-[#1DB954]" />
                        </div>
                      )}
                      <span className="line-clamp-2 min-w-0 flex-1 text-xs font-medium text-[#000000]">
                        {pl.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {spotify.error && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {spotify.error}
        </p>
      )}
    </PanelShell>
  )
}
