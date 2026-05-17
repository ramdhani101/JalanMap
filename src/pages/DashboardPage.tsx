import { useCallback, useMemo, useState } from 'react'
import { Layers } from 'lucide-react'
import { ALL_CATEGORIES } from '../lib/categories'
import { pinToPlaceContext, searchToPlaceContext } from '../lib/placeContext'
import { usePins } from '../hooks/usePins'
import type { DetailTab, LatLng, PinCategory, RouteResult, SearchFocus } from '../types'
import { IndonesiaMap } from '../components/map/IndonesiaMap'
import { MapSidebar } from '../components/map/MapSidebar'
import { AddPinModal } from '../components/map/AddPinModal'
import { MapillaryViewer } from '../components/map/MapillaryViewer'
import { PlaceDetailPanel } from '../components/place/PlaceDetailPanel'

export function DashboardPage() {
  const { pins, addPin, deletePin, resetToSample } = usePins()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchFocus, setSearchFocus] = useState<SearchFocus | null>(null)
  const [activeCategories, setActiveCategories] = useState<Set<PinCategory>>(
    () => new Set(ALL_CATEGORIES),
  )
  const [pinFilter, setPinFilter] = useState('')
  const [addMode, setAddMode] = useState(false)
  const [showMapillaryLayer, setShowMapillaryLayer] = useState(true)
  const [pendingPosition, setPendingPosition] = useState<LatLng | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [detailTab, setDetailTab] = useState<DetailTab>('ringkasan')
  const [isNavigating, setIsNavigating] = useState(false)
  const [navUserPosition, setNavUserPosition] = useState<LatLng | null>(null)

  const selectedPin = pins.find((p) => p.id === selectedId) ?? null

  const activePlace = useMemo(() => {
    if (selectedPin) return pinToPlaceContext(selectedPin)
    if (searchFocus) return searchToPlaceContext(searchFocus)
    return null
  }, [selectedPin, searchFocus])

  const handleSelectPin = useCallback((id: string) => {
    setSelectedId(id)
    setSearchFocus(null)
    setRoute(null)
    setDetailTab('ringkasan')
    setIsNavigating(false)
    setNavUserPosition(null)
  }, [])

  const handleSelectPlace = useCallback((place: SearchFocus) => {
    setSearchFocus(place)
    setSelectedId(null)
    setPinFilter(place.name)
    setRoute(null)
    setDetailTab('ringkasan')
    setIsNavigating(false)
    setNavUserPosition(null)
  }, [])

  const handleNavigatingChange = useCallback((active: boolean, pos: LatLng | null) => {
    setIsNavigating(active)
    setNavUserPosition(pos)
  }, [])

  const toggleCategory = useCallback((c: PinCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }, [])

  const handleMapClick = useCallback((pos: LatLng) => {
    setPendingPosition(pos)
    setModalOpen(true)
    setAddMode(false)
  }, [])

  const handleToggleAddMode = useCallback(() => {
    setAddMode((v) => !v)
    setModalOpen(false)
    setPendingPosition(null)
  }, [])

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm('Hapus lokasi ini dari peta?')) {
        deletePin(id)
        if (selectedId === id) setSelectedId(null)
      }
    },
    [deletePin, selectedId],
  )

  const closeDetail = useCallback(() => {
    setSelectedId(null)
    setSearchFocus(null)
    setRoute(null)
    setIsNavigating(false)
    setNavUserPosition(null)
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-100">
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        <MapSidebar
          pins={pins}
          selectedId={selectedId}
          activeCategories={activeCategories}
          pinFilter={pinFilter}
          addMode={addMode}
          onPinFilterChange={setPinFilter}
          onSelectPin={handleSelectPin}
          onSelectPlace={handleSelectPlace}
          onToggleCategory={toggleCategory}
          onToggleAddMode={handleToggleAddMode}
          onResetSample={resetToSample}
        />

        <div className="flex flex-1 min-h-0 flex-col">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowMapillaryLayer((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                showMapillaryLayer
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Layer Mapillary {showMapillaryLayer ? 'ON' : 'OFF'}
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Navigasi suara · Budaya & acara · Rute motor/mobil
            </span>
          </div>

          <div className="relative flex flex-1 min-h-[35vh] lg:min-h-0">
            <IndonesiaMap
              pins={pins}
              selectedId={selectedId}
              activeCategories={activeCategories}
              addMode={addMode}
              showMapillaryLayer={showMapillaryLayer}
              searchFocus={searchFocus}
              routeGeometry={route?.geometry ?? null}
              routeVehicle={route?.vehicle ?? null}
              userPosition={navUserPosition}
              followUser={isNavigating}
              onSelectPin={(id) => (id ? handleSelectPin(id) : closeDetail())}
              onMapClick={handleMapClick}
            />
          </div>

          {activePlace && (
            <div className="grid lg:grid-cols-2 border-t border-slate-200 shrink-0 max-h-[50vh] lg:max-h-[48vh] min-h-[280px]">
              <MapillaryViewer
                lat={activePlace.lat}
                lng={activePlace.lng}
                title={activePlace.title}
              />
              <PlaceDetailPanel
                place={activePlace}
                pins={pins}
                initialTab={detailTab}
                onClose={closeDetail}
                onDelete={selectedPin ? handleDelete : undefined}
                onAddPin={
                  !selectedPin
                    ? () => {
                        setPendingPosition({ lat: activePlace.lat, lng: activePlace.lng })
                        setModalOpen(true)
                      }
                    : undefined
                }
                onRouteReady={setRoute}
                onNavigatingChange={handleNavigatingChange}
                onShowRouteTab={() => setDetailTab('rute')}
              />
            </div>
          )}
        </div>
      </div>

      <AddPinModal
        open={modalOpen}
        position={pendingPosition}
        onClose={() => {
          setModalOpen(false)
          setPendingPosition(null)
        }}
        onSave={(pin) => {
          const created = addPin(pin)
          setSelectedId(created.id)
          setSearchFocus(null)
          setRoute(null)
        }}
      />
    </div>
  )
}
