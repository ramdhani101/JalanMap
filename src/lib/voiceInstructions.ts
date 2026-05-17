import { formatDistance } from './routing'
import type { RouteStep } from '../types'

/** Ubah instruksi OSRM (EN) ke bahasa Indonesia untuk voice */
export function instructionToIndonesian(step: RouteStep): string {
  const raw = step.instruction.toLowerCase()
  const road = step.name ? ` ke ${step.name}` : ''

  if (raw.includes('arrive') || raw.includes('destination')) {
    return 'Anda telah tiba di tujuan'
  }
  if (raw.includes('uturn') || raw.includes('u-turn')) {
    return `Putar balik${road}`
  }
  if (raw.includes('roundabout') || raw.includes('rotary')) {
    return `Masuk bundaran${road}`
  }
  if (raw.includes('sharp right') || (raw.includes('turn') && raw.includes('right') && raw.includes('sharp'))) {
    return `Belok tajam ke kanan${road}`
  }
  if (raw.includes('sharp left') || (raw.includes('turn') && raw.includes('left') && raw.includes('sharp'))) {
    return `Belok tajam ke kiri${road}`
  }
  if (raw.includes('slight right') || raw.includes('bear right')) {
    return `Agak ke kanan${road}`
  }
  if (raw.includes('slight left') || raw.includes('bear left')) {
    return `Agak ke kiri${road}`
  }
  if (raw.includes('turn right') || raw.includes('right')) {
    return `Belok kanan${road}`
  }
  if (raw.includes('turn left') || raw.includes('left')) {
    return `Belok kiri${road}`
  }
  if (raw.includes('merge')) {
    return `Masuk ke jalur${road}`
  }
  if (raw.includes('fork')) {
    return `Ambil cabang jalan${road}`
  }
  if (raw.includes('continue') || raw.includes('straight') || raw.includes('head')) {
    if (step.distance >= 500) {
      return `Terus lurus sejauh ${formatDistance(step.distance)}${road}`
    }
    return `Terus lurus${road}`
  }
  if (raw.includes('depart') || raw.includes('start')) {
    return `Mulai perjalanan${road}`
  }

  return step.instruction.replace(/turn/gi, 'belok').replace(/right/gi, 'kanan').replace(/left/gi, 'kiri')
}

export function announceDistancePrefix(meters: number): string {
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1).replace('.0', '')
    return `Dalam ${km} kilometer`
  }
  if (meters >= 100) {
    const rounded = Math.round(meters / 50) * 50
    return `Dalam ${rounded} meter`
  }
  return 'Segera'
}
