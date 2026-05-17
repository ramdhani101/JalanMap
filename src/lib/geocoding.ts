import type { PlaceResult } from '../types'

const PHOTON = 'https://photon.komoot.io/api'
const NOMINATIM = 'https://nominatim.openstreetmap.org/search'

const INDONESIA_BIAS = { lat: -2.5, lon: 118 }

function formatPhotonAddress(props: Record<string, string | undefined>): string {
  const parts = [
    props.name,
    props.street,
    props.district,
    props.city,
    props.state,
    props.country,
  ].filter(Boolean)
  return [...new Set(parts)].join(', ')
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] }
  properties: Record<string, string | undefined> & { extent?: number[] }
}

function photonToResult(f: PhotonFeature, index: number): PlaceResult {
  const [lng, lat] = f.geometry.coordinates
  const p = f.properties
  const name = p.name || p.city || p.street || p.country || 'Lokasi'
  const extent = p.extent
  return {
    id: `photon-${index}-${lng}-${lat}`,
    name,
    displayName: formatPhotonAddress(p) || name,
    lat,
    lng,
    kind: p.osm_value || p.type || 'place',
    source: 'photon',
    bounds: extent
      ? { west: extent[0], south: extent[1], east: extent[2], north: extent[3] }
      : undefined,
  }
}

async function searchPhoton(query: string, signal: AbortSignal): Promise<PlaceResult[]> {
  const url = new URL(PHOTON)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '10')
  url.searchParams.set('lang', 'id')
  url.searchParams.set('lat', String(INDONESIA_BIAS.lat))
  url.searchParams.set('lon', String(INDONESIA_BIAS.lon))

  const res = await fetch(url, { signal })
  if (!res.ok) return []
  const json = (await res.json()) as { features: PhotonFeature[] }
  return (json.features ?? []).map((f, i) => photonToResult(f, i))
}

async function searchNominatim(query: string, signal: AbortSignal): Promise<PlaceResult[]> {
  const url = new URL(NOMINATIM)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '8')
  url.searchParams.set('accept-language', 'id')
  // Prioritas Indonesia, tetap boleh hasil di luar
  url.searchParams.set('viewbox', '94,6,141.5,-11')
  url.searchParams.set('bounded', '0')

  const res = await fetch(url, {
    signal,
    headers: { 'Accept-Language': 'id' },
  })
  if (!res.ok) return []

  const json = (await res.json()) as Array<{
    place_id: number
    display_name: string
    lat: string
    lon: string
    boundingbox?: [string, string, string, string]
    type?: string
    name?: string
  }>

  return json.map((item) => {
    const minLat = parseFloat(item.boundingbox?.[0] ?? item.lat)
    const maxLat = parseFloat(item.boundingbox?.[1] ?? item.lat)
    const minLon = parseFloat(item.boundingbox?.[2] ?? item.lon)
    const maxLon = parseFloat(item.boundingbox?.[3] ?? item.lon)
    return {
      id: `nominatim-${item.place_id}`,
      name: item.name || item.display_name.split(',')[0],
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      kind: item.type || 'place',
      source: 'nominatim' as const,
      bounds: item.boundingbox
        ? { west: minLon, south: minLat, east: maxLon, north: maxLat }
        : undefined,
    }
  })
}

function dedupePlaces(results: PlaceResult[]): PlaceResult[] {
  const seen = new Set<string>()
  return results.filter((r) => {
    const key = `${r.lat.toFixed(4)},${r.lng.toFixed(4)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Cari tempat di seluruh dunia (prioritas Indonesia) via Photon + Nominatim */
export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<PlaceResult[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const ctrl = signal ?? new AbortController().signal

  const [photon, nominatim] = await Promise.all([
    searchPhoton(q, ctrl).catch(() => []),
    searchNominatim(q, ctrl).catch(() => []),
  ])

  return dedupePlaces([...photon, ...nominatim]).slice(0, 12)
}
