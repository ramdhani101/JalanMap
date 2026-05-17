/** Lokasi budaya dengan aktivitas adat/keagamaan yang sangat aktif */
export const CULTURE_SPOT_SUGGESTIONS = [
  {
    pinId: 'bali-besakih',
    title: 'Pura Besakih',
    subtitle: 'Piodalan & upacara besar — kalender Bali',
    emoji: '🛕',
  },
  {
    pinId: 'bali-nyepi-info',
    title: 'Hari Raya Nyepi',
    subtitle: 'Sunyi total, ogoh-ogoh, Melasti — seluruh Bali',
    emoji: '🌑',
  },
  {
    pinId: 'bali-tanah-lot',
    title: 'Pura Tanah Lot',
    subtitle: 'Upacara purnama & tilem di tepi laut',
    emoji: '🌅',
  },
  {
    pinId: 'toraja-note',
    title: 'Londa Burial Caves',
    subtitle: 'Musim Rambu Solo — pemakaman adat Toraja',
    emoji: '⚱️',
  },
] as const

export type MapFeatureAction =
  | 'pin-favorite'
  | 'plan-route'
  | 'hidden-camping'
  | 'hidden-cafe'

export const FEATURE_MENU_ITEMS: {
  action: MapFeatureAction
  label: string
  description: string
  icon: string
}[] = [
  {
    action: 'pin-favorite',
    label: 'Pin lokasi favorit',
    description: 'Simpan tempat penting di peta Anda',
    icon: '📌',
  },
  {
    action: 'plan-route',
    label: 'Atur rute perjalanan',
    description: 'Rencanakan motor atau mobil ke tujuan',
    icon: '🗺️',
  },
  {
    action: 'hidden-camping',
    label: 'Camping jarang dikunjungi',
    description: 'Spot tenda tenang & minim keramaian',
    icon: '⛺',
  },
  {
    action: 'hidden-cafe',
    label: 'Cafe jarang dikunjungi',
    description: 'Kopi & ngopi di tempat yang belum ramai',
    icon: '☕',
  },
]
