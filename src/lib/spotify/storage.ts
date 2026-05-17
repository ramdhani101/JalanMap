import type { SpotifyTokens } from './types'

const TOKENS_KEY = 'jalanmap_spotify_tokens'
const VERIFIER_KEY = 'jalanmap_spotify_pkce_verifier'
const STATE_KEY = 'jalanmap_spotify_oauth_state'

export function loadTokens(): SpotifyTokens | null {
  try {
    const raw = localStorage.getItem(TOKENS_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SpotifyTokens
  } catch {
    return null
  }
}

export function saveTokens(tokens: SpotifyTokens): void {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

export function clearTokens(): void {
  localStorage.removeItem(TOKENS_KEY)
}

export function savePkceVerifier(verifier: string): void {
  sessionStorage.setItem(VERIFIER_KEY, verifier)
}

export function loadPkceVerifier(): string | null {
  return sessionStorage.getItem(VERIFIER_KEY)
}

export function clearPkceVerifier(): void {
  sessionStorage.removeItem(VERIFIER_KEY)
}

export function saveOAuthState(state: string): void {
  sessionStorage.setItem(STATE_KEY, state)
}

export function loadOAuthState(): string | null {
  return sessionStorage.getItem(STATE_KEY)
}

export function clearOAuthState(): void {
  sessionStorage.removeItem(STATE_KEY)
}
