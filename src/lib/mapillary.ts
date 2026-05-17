const GRAPH = 'https://graph.mapillary.com'

export function getMapillaryToken(): string | undefined {
  const token = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN
  return token?.trim() || undefined
}

export function mapillaryTileUrl(path: string): string {
  const token = getMapillaryToken()
  if (!token) return ''
  return `https://tiles.mapillary.com/maps/vtp/${path}/2/{z}/{x}/{y}?access_token=${encodeURIComponent(token)}`
}

export interface MapillaryImage {
  id: string
  thumb_256_url?: string
  thumb_512_url?: string
  captured_at?: number
  is_pano?: boolean
}

export async function fetchNearestImages(
  lat: number,
  lng: number,
  limit = 1,
): Promise<MapillaryImage[]> {
  const token = getMapillaryToken()
  if (!token) return []

  const url = new URL(`${GRAPH}/images`)
  url.searchParams.set('access_token', token)
  url.searchParams.set('fields', 'id,thumb_256_url,thumb_512_url,captured_at,is_pano')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lng', String(lng))
  url.searchParams.set('radius', '50')
  url.searchParams.set('limit', String(Math.min(limit, 100)))

  const res = await fetch(url)
  if (!res.ok) return []
  const json = (await res.json()) as { data?: MapillaryImage[] }
  return json.data ?? []
}

export function mapillaryAppUrl(lat: number, lng: number, z = 17): string {
  return `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=${z}`
}
