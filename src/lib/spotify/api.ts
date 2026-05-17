import { SPOTIFY_API_BASE, TRAVEL_PLAYLIST_QUERIES } from './config'
import { refreshSpotifyToken } from './auth'
import { clearTokens, loadTokens } from './storage'
import type {
  SpotifyCurrentlyPlaying,
  SpotifyPlayerState,
  SpotifyPlaylist,
  SpotifyProfile,
  SpotifyTokens,
} from './types'

async function getValidTokens(): Promise<SpotifyTokens | null> {
  const tokens = loadTokens()
  if (!tokens?.accessToken) return null

  if (Date.now() < tokens.expiresAt) return tokens

  if (!tokens.refreshToken) {
    clearTokens()
    return null
  }

  try {
    return await refreshSpotifyToken(tokens.refreshToken)
  } catch {
    clearTokens()
    return null
  }
}

async function spotifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const tokens = await getValidTokens()
  if (!tokens) throw new Error('NOT_AUTHENTICATED')

  const res = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (res.status === 401) {
    clearTokens()
    throw new Error('NOT_AUTHENTICATED')
  }

  if (res.status === 204) {
    return undefined as T
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message =
      (err as { error?: { message?: string } }).error?.message ?? 'SPOTIFY_API_ERROR'
    if (/no active device/i.test(message)) {
      throw new Error('NO_ACTIVE_DEVICE')
    }
    throw new Error(message)
  }

  return res.json() as Promise<T>
}

export async function fetchSpotifyProfile(): Promise<SpotifyProfile> {
  return spotifyFetch<SpotifyProfile>('/me')
}

export async function fetchCurrentlyPlaying(): Promise<SpotifyCurrentlyPlaying | null> {
  try {
    return await spotifyFetch<SpotifyCurrentlyPlaying>('/me/player/currently-playing')
  } catch {
    return null
  }
}

export async function fetchPlayerState(): Promise<SpotifyPlayerState | null> {
  try {
    return await spotifyFetch<SpotifyPlayerState>('/me/player')
  } catch {
    return null
  }
}

export async function playPlaylist(playlistUri: string): Promise<void> {
  await spotifyFetch('/me/player/play', {
    method: 'PUT',
    body: JSON.stringify({ context_uri: playlistUri }),
  })
}

export async function togglePlayback(): Promise<void> {
  const state = await fetchPlayerState()
  if (state?.is_playing) {
    await spotifyFetch('/me/player/pause', { method: 'PUT' })
  } else {
    await spotifyFetch('/me/player/play', { method: 'PUT' })
  }
}

export async function skipNext(): Promise<void> {
  await spotifyFetch('/me/player/next', { method: 'POST' })
}

export async function skipPrevious(): Promise<void> {
  await spotifyFetch('/me/player/previous', { method: 'POST' })
}

export async function fetchTravelPlaylists(): Promise<SpotifyPlaylist[]> {
  const seen = new Set<string>()
  const playlists: SpotifyPlaylist[] = []

  for (const query of TRAVEL_PLAYLIST_QUERIES) {
    const data = await spotifyFetch<{
      playlists: { items: (SpotifyPlaylist | null)[] }
    }>(`/search?q=${encodeURIComponent(query)}&type=playlist&limit=4`)

    for (const item of data.playlists.items) {
      if (!item || seen.has(item.id)) continue
      seen.add(item.id)
      playlists.push(item)
      if (playlists.length >= 8) return playlists
    }
  }

  return playlists
}

export function disconnectSpotify(): void {
  clearTokens()
}

export async function isSpotifyConnected(): Promise<boolean> {
  const tokens = await getValidTokens()
  return Boolean(tokens)
}
