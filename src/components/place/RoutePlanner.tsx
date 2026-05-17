import { useEffect, useRef, useState } from 'react'
import { Car, Loader2, MapPin, Motorbike, Navigation } from 'lucide-react'
import {
  fetchRoute,
  formatDistance,
  formatDuration,
  googleMapsDirectionsUrl,
  vehicleConfig,
} from '../../lib/routing'
import { useVoiceNavigation } from '../../hooks/useVoiceNavigation'
import type { LatLng, LocationPin, RouteResult, VehicleType } from '../../types'
import { VoiceNavigationBar } from './VoiceNavigationBar'

interface RoutePlannerProps {
  destination: LatLng & { title: string }
  pins: LocationPin[]
  onRouteReady: (route: RouteResult | null) => void
  onNavigatingChange?: (active: boolean, userPosition: LatLng | null) => void
}

export function RoutePlanner({
  destination,
  pins,
  onRouteReady,
  onNavigatingChange,
}: RoutePlannerProps) {
  const [vehicle, setVehicle] = useState<VehicleType>('motor')
  const [originMode, setOriginMode] = useState<'gps' | 'pin'>('gps')
  const [originPinId, setOriginPinId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const lastOrigin = useRef<LatLng | null>(null)

  const voice = useVoiceNavigation({
    route,
    destination,
    onPositionUpdate: (pos) => {
      onNavigatingChange?.(true, pos)
    },
  })

  useEffect(() => {
    onNavigatingChange?.(voice.isNavigating, voice.userPosition)
  }, [voice.isNavigating, voice.userPosition, onNavigatingChange])

  const resolveOrigin = (): Promise<LatLng> =>
    new Promise((resolve, reject) => {
      if (originMode === 'pin') {
        const pin = pins.find((p) => p.id === originPinId)
        if (!pin) {
          reject(new Error('Pilih titik awal dari daftar pin'))
          return
        }
        resolve({ lat: pin.lat, lng: pin.lng })
        return
      }
      if (!navigator.geolocation) {
        reject(new Error('Browser tidak mendukung GPS'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject(new Error('Izinkan akses lokasi atau pilih pin sebagai titik awal')),
        { enableHighAccuracy: true, timeout: 12000 },
      )
    })

  const calculate = async () => {
    voice.stopNavigation()
    setLoading(true)
    setError(null)
    try {
      const from = await resolveOrigin()
      lastOrigin.current = from
      const result = await fetchRoute(from, destination, vehicle)
      setRoute(result)
      onRouteReady(result)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal menghitung rute'
      setError(msg)
      setRoute(null)
      onRouteReady(null)
    } finally {
      setLoading(false)
    }
  }

  const cfg = vehicleConfig(vehicle)

  const handleStop = () => {
    voice.stopNavigation()
    onNavigatingChange?.(false, null)
  }

  const handleStart = () => {
    voice.startNavigation()
  }

  const handleVehicleChange = (v: VehicleType) => {
    setVehicle(v)
    setRoute(null)
    voice.stopNavigation()
    onRouteReady(null)
    onNavigatingChange?.(false, null)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['motor', 'mobil'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => handleVehicleChange(v)}
            disabled={voice.isNavigating}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold border-2 transition-all disabled:opacity-50 ${
              vehicle === v
                ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {v === 'motor' ? <Motorbike className="h-4 w-4" /> : <Car className="h-4 w-4" />}
            {vehicleConfig(v).label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500">{cfg.hint}</p>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600">Titik awal</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOriginMode('gps')}
            disabled={voice.isNavigating}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium border ${
              originMode === 'gps'
                ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            Lokasi saya
          </button>
          <button
            type="button"
            onClick={() => setOriginMode('pin')}
            disabled={voice.isNavigating}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium border ${
              originMode === 'pin'
                ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            Dari pin
          </button>
        </div>
        {originMode === 'pin' && (
          <select
            value={originPinId}
            onChange={(e) => setOriginPinId(e.target.value)}
            disabled={voice.isNavigating}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">— Pilih pin —</option>
            {pins.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="rounded-xl bg-slate-50 p-3 text-sm">
        <p className="text-xs text-slate-500 mb-1">Tujuan</p>
        <p className="font-semibold text-slate-900 flex items-start gap-2">
          <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
          {destination.title}
        </p>
      </div>

      <button
        type="button"
        onClick={calculate}
        disabled={loading || voice.isNavigating}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
        Hitung rute {cfg.label.toLowerCase()}
      </button>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {route && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-cyan-600 px-4 py-3 text-white">
            <p className="text-lg font-bold">
              {formatDuration(route.durationSeconds)} · {formatDistance(route.distanceMeters)}
            </p>
            <p className="text-xs opacity-90 mt-0.5">via {cfg.label} · OpenStreetMap</p>
          </div>
          <ol className="max-h-40 overflow-y-auto divide-y divide-slate-100">
            {route.steps.map((step, i) => (
              <li
                key={i}
                className={`px-4 py-2.5 text-sm ${
                  voice.isNavigating && i === voice.currentStepIndex
                    ? 'bg-emerald-50 ring-1 ring-inset ring-emerald-200'
                    : ''
                }`}
              >
                <span className="font-medium text-slate-800">{step.instruction}</span>
                {step.name && (
                  <span className="block text-xs text-slate-500 truncate">{step.name}</span>
                )}
                <span className="text-xs text-cyan-600">{formatDistance(step.distance)}</span>
              </li>
            ))}
          </ol>
          {lastOrigin.current && !voice.isNavigating && (
            <div className="p-3 border-t border-slate-100">
              <a
                href={googleMapsDirectionsUrl(lastOrigin.current, destination, vehicle)}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-cyan-600 hover:underline"
              >
                Buka navigasi di Google Maps →
              </a>
            </div>
          )}
          <VoiceNavigationBar
            route={route}
            destinationTitle={destination.title}
            isNavigating={voice.isNavigating}
            muted={voice.muted}
            currentStepIndex={voice.currentStepIndex}
            lastSpoken={voice.lastSpoken}
            onStart={handleStart}
            onStop={handleStop}
            onToggleMute={() => voice.setMuted((m) => !m)}
          />
        </div>
      )}
    </div>
  )
}
