import { useEffect, useRef } from 'react'
import maplibregl, { type Map as MapLibreMap, Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CATEGORY_CONFIG } from '../../lib/categories'
import { getMapillaryToken, mapillaryTileUrl } from '../../lib/mapillary'
import type { LatLng, LocationPin, PinCategory, SearchFocus, VehicleType } from '../../types'

const INDONESIA_CENTER: [number, number] = [118, -2.5]
const INDONESIA_ZOOM = 4.8

/** Batas longgar — fokus Indonesia tapi boleh cari lokasi di luar negeri */
const MAX_BOUNDS: maplibregl.LngLatBoundsLike = [
  [60, -25],
  [160, 25],
]

interface IndonesiaMapProps {
  pins: LocationPin[]
  selectedId: string | null
  activeCategories: Set<PinCategory>
  addMode: boolean
  showMapillaryLayer: boolean
  searchFocus: SearchFocus | null
  routeGeometry: [number, number][] | null
  routeVehicle: VehicleType | null
  userPosition: LatLng | null
  followUser: boolean
  onSelectPin: (id: string | null) => void
  onMapClick: (pos: LatLng) => void
}

function addMapillaryLayers(map: MapLibreMap, token: string) {
  if (map.getSource('mapillary')) return

  map.addSource('mapillary', {
    type: 'vector',
    tiles: [mapillaryTileUrl('mly1_public')],
    minzoom: 0,
    maxzoom: 14,
  })

  map.addLayer({
    id: 'mapillary-sequence',
    type: 'line',
    source: 'mapillary',
    'source-layer': 'sequence',
    minzoom: 6,
    paint: {
      'line-color': '#00d4ff',
      'line-width': 2,
      'line-opacity': 0.75,
    },
  })

  map.addLayer({
    id: 'mapillary-image',
    type: 'circle',
    source: 'mapillary',
    'source-layer': 'image',
    minzoom: 14,
    paint: {
      'circle-radius': 4,
      'circle-color': '#00d4ff',
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1,
    },
  })

  map.on('click', 'mapillary-image', (e) => {
    const f = e.features?.[0]
    const id = f?.properties?.id
    if (id && token) {
      window.open(`https://www.mapillary.com/app/?pKey=${id}`, '_blank')
    }
  })
  map.on('mouseenter', 'mapillary-image', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'mapillary-image', () => {
    map.getCanvas().style.cursor = ''
  })
}

export function IndonesiaMap({
  pins,
  selectedId,
  activeCategories,
  addMode,
  showMapillaryLayer,
  searchFocus,
  routeGeometry,
  routeVehicle,
  userPosition,
  followUser,
  onSelectPin,
  onMapClick,
}: IndonesiaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const searchMarkerRef = useRef<Marker | null>(null)
  const userMarkerRef = useRef<Marker | null>(null)
  const addModeRef = useRef(addMode)
  const onMapClickRef = useRef(onMapClick)

  const token = getMapillaryToken()
  const selected = pins.find((p) => p.id === selectedId) ?? null
  const visible = pins.filter((p) => activeCategories.has(p.category))

  addModeRef.current = addMode
  onMapClickRef.current = onMapClick

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: INDONESIA_CENTER,
      zoom: INDONESIA_ZOOM,
      minZoom: 4,
      maxBounds: MAX_BOUNDS,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

    map.on('load', () => {
      if (token) addMapillaryLayers(map, token)
    })

    map.on('click', (e) => {
      if (!addModeRef.current) return
      onMapClickRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [token])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    const setVisibility = (layerId: string, visible: boolean) => {
      if (!map.getLayer(layerId)) return
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none')
    }

    setVisibility('mapillary-sequence', showMapillaryLayer)
    setVisibility('mapillary-image', showMapillaryLayer)
  }, [showMapillaryLayer])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.getCanvas().style.cursor = addMode ? 'crosshair' : ''
  }, [addMode])

  useEffect(() => {
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const map = mapRef.current
    if (!map) return

    visible.forEach((pin) => {
      const cfg = CATEGORY_CONFIG[pin.category]
      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'pin-marker'
      el.title = pin.title
      el.textContent = cfg.emoji
      el.style.cssText = `
        width: 36px; height: 36px; border-radius: 50%;
        border: 2px solid white; font-size: 18px; cursor: pointer;
        background: ${cfg.color}; box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.15s;
      `
      el.addEventListener('click', (ev) => {
        ev.stopPropagation()
        onSelectPin(pin.id)
      })
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.12)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
      })

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map)
      markersRef.current.push(marker)
    })
  }, [visible, onSelectPin])

  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.flyTo({
        center: [selected.lng, selected.lat],
        zoom: Math.max(mapRef.current.getZoom(), 12),
        duration: 800,
      })
    }
  }, [selected])

  useEffect(() => {
    searchMarkerRef.current?.remove()
    searchMarkerRef.current = null

    const map = mapRef.current
    if (!map || !searchFocus) return

    const el = document.createElement('div')
    el.style.cssText = `
      width: 20px; height: 20px; border-radius: 50%;
      background: #0ea5e9; border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(14,165,233,0.35), 0 2px 10px rgba(0,0,0,0.3);
    `
    searchMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([searchFocus.lng, searchFocus.lat])
      .addTo(map)

    if (searchFocus.bounds) {
      const { west, south, east, north } = searchFocus.bounds
      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        { padding: 48, maxZoom: 14, duration: 900 },
      )
    } else {
      map.flyTo({
        center: [searchFocus.lng, searchFocus.lat],
        zoom: Math.max(map.getZoom(), 13),
        duration: 900,
      })
    }
  }, [searchFocus])

  useEffect(() => {
    userMarkerRef.current?.remove()
    userMarkerRef.current = null

    const map = mapRef.current
    if (!map || !userPosition) return

    const el = document.createElement('div')
    el.style.cssText = `
      width:16px;height:16px;border-radius:50%;
      background:#22c55e;border:3px solid white;
      box-shadow:0 0 0 6px rgba(34,197,94,0.35);
    `
    userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([userPosition.lng, userPosition.lat])
      .addTo(map)

    if (followUser) {
      map.easeTo({
        center: [userPosition.lng, userPosition.lat],
        duration: 600,
      })
    }
  }, [userPosition, followUser])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const applyRoute = () => {
      if (!routeGeometry?.length) {
        if (map.getSource('route')) {
          ;(map.getSource('route') as maplibregl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features: [],
          })
        }
        return
      }

      const data = {
        type: 'Feature' as const,
        properties: {},
        geometry: { type: 'LineString' as const, coordinates: routeGeometry },
      }

      if (map.getSource('route')) {
        ;(map.getSource('route') as maplibregl.GeoJSONSource).setData(data)
        if (map.getLayer('route-line')) {
          map.setPaintProperty(
            'route-line',
            'line-color',
            routeVehicle === 'motor' ? '#f97316' : '#2563eb',
          )
        }
      } else {
        map.addSource('route', { type: 'geojson', data })
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': routeVehicle === 'motor' ? '#f97316' : '#2563eb',
            'line-width': 5,
            'line-opacity': 0.85,
          },
        })
      }

      if (routeGeometry.length > 1) {
        const lngs = routeGeometry.map((c) => c[0])
        const lats = routeGeometry.map((c) => c[1])
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 60, duration: 800 },
        )
      }
    }

    if (map.isStyleLoaded()) applyRoute()
    else map.once('load', applyRoute)
  }, [routeGeometry, routeVehicle])

  if (!token) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-100 p-8">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl text-center ring-1 ring-slate-200">
          <span className="text-4xl">📷</span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Mapillary Access Token Diperlukan</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Buat app di{' '}
            <a
              href="https://www.mapillary.com/dashboard/developers"
              className="text-cyan-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              Mapillary Developers
            </a>{' '}
            lalu tambahkan ke <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env</code>:
          </p>
          <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-left text-xs text-cyan-300 overflow-x-auto">
            VITE_MAPILLARY_ACCESS_TOKEN=MLY|...
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {addMode && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          Klik di peta untuk menambah pin
        </div>
      )}

      {showMapillaryLayer && (
        <div className="pointer-events-none absolute top-3 left-3 z-10 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs text-cyan-300 backdrop-blur">
          Layer Mapillary aktif — garis biru = jalur foto jalan
        </div>
      )}
    </div>
  )
}
