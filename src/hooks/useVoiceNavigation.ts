import { useCallback, useEffect, useRef, useState } from 'react'
import { distanceMeters } from '../lib/geo'
import { speak, stopSpeech } from '../lib/speech'
import { announceDistancePrefix, instructionToIndonesian } from '../lib/voiceInstructions'
import type { LatLng, RouteResult } from '../types'

const ANNOUNCE_DISTANCES = [500, 200, 100, 50] as const
const ARRIVE_RADIUS_M = 35
const STEP_PASS_RADIUS_M = 40

interface UseVoiceNavigationOptions {
  route: RouteResult | null
  destination: LatLng & { title: string }
  onPositionUpdate?: (pos: LatLng | null) => void
}

export function useVoiceNavigation({
  route,
  destination,
  onPositionUpdate,
}: UseVoiceNavigationOptions) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userPosition, setUserPosition] = useState<LatLng | null>(null)
  const [lastSpoken, setLastSpoken] = useState('')

  const watchIdRef = useRef<number | null>(null)
  const announcedRef = useRef<Set<string>>(new Set())
  const stepIndexRef = useRef(0)
  const mutedRef = useRef(muted)
  const arrivedRef = useRef(false)
  const navigatingRef = useRef(false)
  const onPositionUpdateRef = useRef(onPositionUpdate)
  onPositionUpdateRef.current = onPositionUpdate

  mutedRef.current = muted

  const say = useCallback((text: string, key?: string) => {
    if (key && announcedRef.current.has(key)) return
    if (key) announcedRef.current.add(key)
    setLastSpoken(text)
    speak(text, mutedRef.current)
  }, [])

  const stopNavigation = useCallback(() => {
    setIsNavigating(false)
    navigatingRef.current = false
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    stopSpeech()
    setUserPosition(null)
    onPositionUpdate?.(null)
    stepIndexRef.current = 0
    setCurrentStepIndex(0)
    announcedRef.current.clear()
    arrivedRef.current = false
  }, [onPositionUpdate])

  const startNavigation = useCallback(() => {
    if (!route?.steps.length) return
    if (!navigator.geolocation) {
      alert('GPS tidak tersedia di perangkat ini')
      return
    }

    announcedRef.current.clear()
    arrivedRef.current = false
    stepIndexRef.current = 0
    setCurrentStepIndex(0)
    setIsNavigating(true)
    navigatingRef.current = true

    const first = route.steps[0]
    const firstText = instructionToIndonesian(first)
    say(
      `Navigasi dimulai menuju ${destination.title}. ${firstText}`,
      'start',
    )

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const loc: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        setUserPosition(loc)
        onPositionUpdateRef.current?.(loc)

        if (!route || arrivedRef.current) return

        const distToDest = distanceMeters(loc, destination)
        if (distToDest < ARRIVE_RADIUS_M) {
          arrivedRef.current = true
          say('Anda telah tiba di tujuan. Perjalanan selesai.', 'arrived')
          setTimeout(() => stopNavigation(), 3000)
          return
        }

        const idx = stepIndexRef.current
        const steps = route.steps
        const nextStep = steps[idx]
        if (!nextStep?.location) return

        const distToManeuver = distanceMeters(loc, nextStep.location)

        if (distToManeuver < STEP_PASS_RADIUS_M && idx < steps.length - 1) {
          stepIndexRef.current = idx + 1
          setCurrentStepIndex(idx + 1)
          const upcoming = steps[idx + 1]
          if (upcoming) {
            const text = instructionToIndonesian(upcoming)
            say(text, `step-${idx + 1}-now`)
          }
          return
        }

        for (const threshold of ANNOUNCE_DISTANCES) {
          if (distToManeuver <= threshold + 15 && distToManeuver >= threshold - 15) {
            const text = instructionToIndonesian(nextStep)
            say(
              `${announceDistancePrefix(threshold)}, ${text}`,
              `step-${idx}-dist-${threshold}`,
            )
            break
          }
        }
      },
      () => {
        say('Sinyal GPS lemah. Periksa izin lokasi.', 'gps-error')
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    )
  }, [route, destination, say, stopNavigation, onPositionUpdate])

  useEffect(() => {
    return () => {
      stopNavigation()
    }
  }, [stopNavigation])

  useEffect(() => {
    if (!route) stopNavigation()
  }, [route, stopNavigation])

  return {
    isNavigating,
    muted,
    setMuted,
    currentStepIndex,
    userPosition,
    lastSpoken,
    startNavigation,
    stopNavigation,
  }
}
