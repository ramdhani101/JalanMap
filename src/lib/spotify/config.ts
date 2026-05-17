export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
].join(' ')

export function getSpotifyClientId(): string | undefined {
  const id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  return id && id !== 'your_spotify_client_id_here' ? id : undefined
}

export function getSpotifyRedirectUri(): string {
  return `${window.location.origin}/dashboard/spotify/callback`
}

export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

export const TRAVEL_PLAYLIST_QUERIES = [
  'road trip indonesia',
  'travel chill acoustic',
  'driving playlist',
  'adventure indie',
] as const
