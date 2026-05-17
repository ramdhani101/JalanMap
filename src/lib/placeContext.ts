import type { LocationPin, PlaceContext, SearchFocus } from '../types'
import { detectRegion } from './region'

export function pinToPlaceContext(pin: LocationPin): PlaceContext {
  return {
    id: pin.id,
    pinId: pin.id,
    title: pin.title,
    subtitle: pin.address,
    description: pin.description,
    lat: pin.lat,
    lng: pin.lng,
    address: pin.address,
    region: pin.region || detectRegion(pin.address ?? pin.title),
    youtubeUrl: pin.youtubeUrl,
    openingHours: pin.openingHours,
    priceRange: pin.priceRange,
    services: pin.services,
    eventNote: pin.eventNote,
    category: pin.category,
  }
}

export function searchToPlaceContext(focus: SearchFocus): PlaceContext {
  return {
    id: `search-${focus.lat}-${focus.lng}`,
    title: focus.name,
    subtitle: focus.displayName,
    lat: focus.lat,
    lng: focus.lng,
    address: focus.displayName,
    region: detectRegion(focus.displayName),
  }
}
