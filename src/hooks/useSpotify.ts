import { useCallback, useEffect, useRef, useState } from 'react'
import { isSpotifyConfigured, startSpotifyLogin } from '../lib/spotify/auth'
import {
  disconnectSpotify,
  fetchCurrentlyPlaying,
  fetchPlayerState,
  fetchSpotifyProfile,
  fetchTravelPlaylists,
  playPlaylist,
  skipNext,
  skipPrevious,
  togglePlayback,
} from '../lib/spotify/api'
import { loadTokens } from '../lib/spotify/storage'
import type { SpotifyPlaylist, SpotifyProfile, SpotifyTrack } from '../lib/spotify/types'

export interface NowPlaying {
  track: SpotifyTrack
  isPlaying: boolean
  progressMs: number | null
}

export function useSpotify() {
  const configured = isSpotifyConfigured()
  const [connected, setConnected] = useState(() => Boolean(loadTokens()?.accessToken))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<SpotifyProfile | null>(null)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
  const [playlistsLoading, setPlaylistsLoading] = useState(false)
  const mountedRef = useRef(true)

  const setErr = useCallback((message: string | null) => {
    if (mountedRef.current) setError(message)
  }, [])

  const refreshNowPlaying = useCallback(async () => {
    if (!loadTokens()) return
    try {
      const data = await fetchCurrentlyPlaying()
      if (!mountedRef.current) return
      if (data?.item) {
        setNowPlaying({
          track: data.item,
          isPlaying: data.is_playing,
          progressMs: data.progress_ms,
        })
      } else {
        const state = await fetchPlayerState()
        if (state?.item) {
          setNowPlaying({
            track: state.item,
            isPlaying: state.is_playing,
            progressMs: null,
          })
        } else {
          setNowPlaying(null)
        }
      }
    } catch {
      if (mountedRef.current) setNowPlaying(null)
    }
  }, [])

  const loadSession = useCallback(async () => {
    if (!loadTokens()) {
      setConnected(false)
      setProfile(null)
      setNowPlaying(null)
      setPlaylists([])
      return
    }

    setLoading(true)
    setErr(null)
    try {
      const me = await fetchSpotifyProfile()
      if (!mountedRef.current) return
      setConnected(true)
      setProfile(me)
      await refreshNowPlaying()

      setPlaylistsLoading(true)
      const travel = await fetchTravelPlaylists()
      if (mountedRef.current) setPlaylists(travel)
    } catch (e) {
      if (!mountedRef.current) return
      setConnected(false)
      setProfile(null)
      setErr(e instanceof Error ? e.message : 'Gagal memuat Spotify')
    } finally {
      if (mountedRef.current) {
        setLoading(false)
        setPlaylistsLoading(false)
      }
    }
  }, [refreshNowPlaying, setErr])

  useEffect(() => {
    mountedRef.current = true
    if (configured && connected) void loadSession()
    return () => {
      mountedRef.current = false
    }
  }, [configured, connected, loadSession])

  useEffect(() => {
    if (!connected) return
    const id = window.setInterval(() => void refreshNowPlaying(), 5000)
    return () => clearInterval(id)
  }, [connected, refreshNowPlaying])

  const connect = useCallback(async () => {
    setErr(null)
    try {
      await startSpotifyLogin()
    } catch (e) {
      if ((e as Error).message === 'SPOTIFY_NOT_CONFIGURED') {
        setErr('Tambahkan VITE_SPOTIFY_CLIENT_ID di file .env')
      } else {
        setErr('Tidak bisa membuka login Spotify')
      }
    }
  }, [setErr])

  const disconnect = useCallback(() => {
    disconnectSpotify()
    setConnected(false)
    setProfile(null)
    setNowPlaying(null)
    setPlaylists([])
    setErr(null)
  }, [setErr])

  const playTravelPlaylist = useCallback(
    async (playlistId: string) => {
      setErr(null)
      try {
        await playPlaylist(`spotify:playlist:${playlistId}`)
        await refreshNowPlaying()
      } catch (e) {
        const msg = e instanceof Error ? e.message : ''
        if (msg === 'NO_ACTIVE_DEVICE' || /no active device/i.test(msg)) {
          setErr('Buka aplikasi Spotify di HP atau komputer, lalu coba lagi.')
        } else {
          setErr('Gagal memutar playlist. Buka Spotify di perangkat Anda terlebih dahulu.')
        }
      }
    },
    [refreshNowPlaying, setErr],
  )

  const toggle = useCallback(async () => {
    setErr(null)
    try {
      await togglePlayback()
      await refreshNowPlaying()
    } catch {
      setErr('Tidak bisa mengontrol pemutaran. Buka Spotify di perangkat Anda.')
    }
  }, [refreshNowPlaying, setErr])

  const next = useCallback(async () => {
    setErr(null)
    try {
      await skipNext()
      await refreshNowPlaying()
    } catch {
      setErr('Tidak bisa loncat ke lagu berikutnya.')
    }
  }, [refreshNowPlaying, setErr])

  const previous = useCallback(async () => {
    setErr(null)
    try {
      await skipPrevious()
      await refreshNowPlaying()
    } catch {
      setErr('Tidak bisa kembali ke lagu sebelumnya.')
    }
  }, [refreshNowPlaying, setErr])

  const markConnected = useCallback(() => {
    setConnected(true)
  }, [])

  return {
    configured,
    connected,
    loading,
    error,
    profile,
    nowPlaying,
    playlists,
    playlistsLoading,
    connect,
    disconnect,
    playTravelPlaylist,
    toggle,
    next,
    previous,
    refreshNowPlaying,
    markConnected,
    loadSession,
  }
}
