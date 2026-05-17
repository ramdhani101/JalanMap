import type { LatLng, RouteResult, RouteStep, VehicleType } from '../types'

const OSRM = 'https://router.project-osrm.org/route/v1'

/** Motor di Indonesia: rute OSRM driving + estimasi waktu disesuaikan */
const VEHICLE_CONFIG: Record<
  VehicleType,
  { profile: string; durationFactor: number; label: string; hint: string }
> = {
  mobil: {
    profile: 'driving',
    durationFactor: 1,
    label: 'Mobil',
    hint: 'Rute jalan mobil & tol (data OpenStreetMap)',
  },
  motor: {
    profile: 'driving',
    durationFactor: 0.82,
    label: 'Motor',
    hint: 'Rute jalan umum yang bisa dilalui motor; estimasi waktu lebih cepat di perkotaan',
  },
}

interface OsrmRoute {
  distance: number
  duration: number
  geometry: { coordinates: [number, number][] }
  legs: Array<{
    steps: Array<{
      distance: number
      duration: number
      name: string
      maneuver: {
        instruction?: string
        type: string
        modifier?: string
        location: [number, number]
      }
    }>
  }>
}

function maneuverText(m: OsrmRoute['legs'][0]['steps'][0]['maneuver']): string {
  if (m.instruction) return m.instruction
  const mod = m.modifier ? ` ${m.modifier}` : ''
  return `${m.type}${mod}`
}

export async function fetchRoute(
  from: LatLng,
  to: LatLng,
  vehicle: VehicleType,
): Promise<RouteResult> {
  const cfg = VEHICLE_CONFIG[vehicle]
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`
  const url = `${OSRM}/${cfg.profile}/${coords}?overview=full&geometries=geojson&steps=true&annotations=false`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Gagal menghitung rute')

  const json = (await res.json()) as { code: string; routes?: OsrmRoute[]; message?: string }
  if (json.code !== 'Ok' || !json.routes?.[0]) {
    throw new Error(json.message || 'Rute tidak ditemukan')
  }

  const route = json.routes[0]
  const steps: RouteStep[] = []
  for (const leg of route.legs) {
    for (const step of leg.steps) {
      if (step.distance < 3) continue
      const [lng, lat] = step.maneuver.location
      steps.push({
        instruction: maneuverText(step.maneuver),
        distance: step.distance,
        duration: step.duration * cfg.durationFactor,
        name: step.name || undefined,
        location: { lat, lng },
      })
    }
  }

  return {
    vehicle,
    distanceMeters: route.distance,
    durationSeconds: route.duration * cfg.durationFactor,
    geometry: route.geometry.coordinates,
    steps,
  }
}

export function formatDistance(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`
  return `${Math.round(m)} m`
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.round((sec % 3600) / 60)
  if (h > 0) return `${h} j ${m} mnt`
  return `${m} mnt`
}

export function vehicleConfig(vehicle: VehicleType) {
  return VEHICLE_CONFIG[vehicle]
}

export function googleMapsDirectionsUrl(
  from: LatLng,
  to: LatLng,
  vehicle: VehicleType,
): string {
  const travel = vehicle === 'motor' ? 'driving' : 'driving'
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=${travel}`
}
