import type { PinCategory } from '../types'

export const CATEGORY_CONFIG: Record<
  PinCategory,
  { label: string; color: string; emoji: string; description: string }
> = {
  travel_note: {
    label: 'Catatan Perjalanan',
    color: '#8b5cf6',
    emoji: '📍',
    description: 'Video & cerita jalan-jalan',
  },
  camping: {
    label: 'Camping',
    color: '#22c55e',
    emoji: '⛺',
    description: 'Spot tenda & berkemah',
  },
  rest_area: {
    label: 'Rest Area',
    color: '#3b82f6',
    emoji: '🛣️',
    description: 'Istirahat di perjalanan',
  },
  restaurant: {
    label: 'Restoran',
    color: '#ef4444',
    emoji: '🍽️',
    description: 'Makan enak & rame',
  },
  cafe: {
    label: 'Cafe',
    color: '#a16207',
    emoji: '☕',
    description: 'Ngopi sambil nge-charge',
  },
  warung: {
    label: 'Warung Makan',
    color: '#f97316',
    emoji: '🍜',
    description: 'Kuliner lokal & murah',
  },
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as PinCategory[]
