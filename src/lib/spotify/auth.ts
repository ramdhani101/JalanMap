import {
  getSpotifyClientId,
  getSpotifyRedirectUri,
  SPOTIFY_AUTH_URL,
  SPOTIFY_SCOPES,
  SPOTIFY_TOKEN_URL,
} from './config'
import { generateCodeChallenge, generateCodeVerifier, generateState } from './pkce'
import {
  clearOAuthState,
  clearPkceVerifier,
  loadOAuthState,
  loadPkceVerifier,
  saveOAuthState,
  savePkceVerifier,
  saveTokens,
} from './storage'
import type { SpotifyTokens } from './types'

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

function toTokens(data: TokenResponse, existingRefresh?: string): SpotifyTokens {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? existingRefresh ?? '',
    expiresAt: Date.now() + data.expires_in * 1000 - 60_000,
  }
}

export function isSpotifyConfigured(): boolean {
  return Boolean(getSpotifyClientId())
}

export async function startSpotifyLogin(): Promise<void> {
  const clientId = getSpotifyClientId()
  if (!clientId) {
    throw new Error('SPOTIFY_NOT_CONFIGURED')
  }

  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  const state = generateState()

  savePkceVerifier(verifier)
  saveOAuthState(state)

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: getSpotifyRedirectUri(),
    scope: SPOTIFY_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
  })

  window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`
}

export async function completeSpotifyLogin(code: string, state: string): Promise<SpotifyTokens> {
  const clientId = getSpotifyClientId()
  if (!clientId) throw new Error('SPOTIFY_NOT_CONFIGURED')

  const expectedState = loadOAuthState()
  const verifier = loadPkceVerifier()
  clearOAuthState()
  clearPkceVerifier()

  if (!expectedState || state !== expectedState) {
    throw new Error('STATE_MISMATCH')
  }
  if (!verifier) {
    throw new Error('MISSING_VERIFIER')
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: getSpotifyRedirectUri(),
    client_id: clientId,
    code_verifier: verifier,
  })

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    throw new Error('TOKEN_EXCHANGE_FAILED')
  }

  const data = (await res.json()) as TokenResponse
  const tokens = toTokens(data)
  saveTokens(tokens)
  return tokens
}

export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyTokens> {
  const clientId = getSpotifyClientId()
  if (!clientId) throw new Error('SPOTIFY_NOT_CONFIGURED')

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  })

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    throw new Error('REFRESH_FAILED')
  }

  const data = (await res.json()) as TokenResponse
  const tokens = toTokens(data, refreshToken)
  saveTokens(tokens)
  return tokens
}
