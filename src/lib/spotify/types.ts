export interface SpotifyTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface SpotifyProfile {
  id: string
  display_name: string | null
  images: { url: string; height: number | null; width: number | null }[]
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string; height: number | null; width: number | null }[]
  }
  duration_ms: number
  external_urls: { spotify: string }
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string | null
  images: { url: string; height: number | null; width: number | null }[]
  external_urls: { spotify: string }
}

export interface SpotifyCurrentlyPlaying {
  is_playing: boolean
  item: SpotifyTrack | null
  progress_ms: number | null
}

export interface SpotifyPlayerState {
  is_playing: boolean
  item: SpotifyTrack | null
}
