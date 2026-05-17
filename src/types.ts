export type PinCategory =
  | 'travel_note'
  | 'camping'
  | 'rest_area'
  | 'restaurant'
  | 'cafe'
  | 'warung'

export type VehicleType = 'motor' | 'mobil'

export type DetailTab = 'ringkasan' | 'budaya' | 'rute' | 'tentang'

export interface LocationPin {
  id: string
  title: string
  description: string
  lat: number
  lng: number
  category: PinCategory
  youtubeUrl?: string
  photoUrl?: string
  address?: string
  region?: string
  openingHours?: string
  priceRange?: string
  services?: string[]
  eventNote?: string
  /** Spot dengan kunjungan relatif rendah / belum mainstream */
  hiddenGem?: boolean
  createdAt: string
}

export interface LatLng {
  lat: number
  lng: number
}

export interface PlaceResult {
  id: string
  name: string
  displayName: string
  lat: number
  lng: number
  kind: string
  source: 'photon' | 'nominatim'
  bounds?: {
    west: number
    south: number
    east: number
    north: number
  }
}

export interface SearchFocus {
  lat: number
  lng: number
  name: string
  displayName: string
  bounds?: PlaceResult['bounds']
}

export interface PlaceContext {
  id: string
  title: string
  subtitle?: string
  description?: string
  lat: number
  lng: number
  address?: string
  region?: string
  youtubeUrl?: string
  openingHours?: string
  priceRange?: string
  services?: string[]
  eventNote?: string
  pinId?: string
  category?: PinCategory
}

export interface CultureEvent {
  title: string
  schedule: string
  body: string
  type: 'annual' | 'monthly' | 'warning'
}

export interface RegionalCulture {
  region: string
  tagline: string
  highlights: string[]
  customs: { title: string; body: string }[]
  events: CultureEvent[]
}

export interface RouteStep {
  instruction: string
  distance: number
  duration: number
  name?: string
  /** Titik manuver di akhir langkah (untuk navigasi suara) */
  location?: LatLng
}

export interface RouteResult {
  vehicle: VehicleType
  distanceMeters: number
  durationSeconds: number
  geometry: [number, number][]
  steps: RouteStep[]
}

export type JournalMediaType = 'photo' | 'video' | 'note'

export interface TravelJournalEntry {
  id: string
  type: JournalMediaType
  title: string
  caption: string
  location?: string
  createdAt: string
  /** URL gambar (remote atau data URL dari upload) */
  photoUrl?: string
  /** URL video (YouTube, CloudFront, dll.) */
  videoUrl?: string
}
