import { useCallback, useEffect, useState } from 'react'
import { SAMPLE_PINS } from '../data/samplePins'
import type { LocationPin } from '../types'

const STORAGE_KEY = 'travelmap-pins'

function loadPins(): LocationPin[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as LocationPin[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    /* ignore */
  }
  return SAMPLE_PINS
}

function savePins(pins: LocationPin[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pins))
}

export function usePins() {
  const [pins, setPins] = useState<LocationPin[]>(loadPins)

  useEffect(() => {
    savePins(pins)
  }, [pins])

  const addPin = useCallback((pin: Omit<LocationPin, 'id' | 'createdAt'>) => {
    const newPin: LocationPin = {
      ...pin,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setPins((prev) => [...prev, newPin])
    return newPin
  }, [])

  const updatePin = useCallback((id: string, updates: Partial<LocationPin>) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deletePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const resetToSample = useCallback(() => {
    setPins(SAMPLE_PINS)
  }, [])

  return { pins, addPin, updatePin, deletePin, resetToSample }
}
