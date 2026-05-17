import type { LatLng } from '../types'

const R = 6371000

export function distanceMeters(a: LatLng, b: LatLng): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

/** Jarak tegak lurus titik ke segmen garis (approximate, cukup untuk navigasi) */
export function distanceToSegmentMeters(
  point: LatLng,
  segStart: LatLng,
  segEnd: LatLng,
): number {
  const dx = segEnd.lng - segStart.lng
  const dy = segEnd.lat - segStart.lat
  if (dx === 0 && dy === 0) return distanceMeters(point, segStart)

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.lng - segStart.lng) * dx + (point.lat - segStart.lat) * dy) /
        (dx * dx + dy * dy),
    ),
  )
  const proj = {
    lng: segStart.lng + t * dx,
    lat: segStart.lat + t * dy,
  }
  return distanceMeters(point, proj)
}
