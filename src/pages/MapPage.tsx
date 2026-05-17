import { useCallback, useMemo, useState } from 'react'
import { Layers } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ALL_CATEGORIES } from '../lib/categories'
import { pinToPlaceContext, searchToPlaceContext } from '../lib/placeContext'
import { usePins } from '../hooks/usePins'
import { useFavoritePins } from '../hooks/useFavoritePins'
import type { DetailTab, LatLng, PinCategory, RouteResult, SearchFocus } from '../types'
import { IndonesiaMap } from '../components/map/IndonesiaMap'
import { MapSidebar } from '../components/map/MapSidebar'
import { AddPinModal } from '../components/map/AddPinModal'
import { MapillaryViewer } from '../components/map/MapillaryViewer'
import { PlaceDetailPanel } from '../components/place/PlaceDetailPanel'
import type { MapListMode, MapPageLocationState } from '../lib/mapPageState'
import '../components/map/hero/map-hero.css'

export function MapPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initial = (location.state as MapPageLocationState | null) ?? {}

  const { pins, addPin, deletePin, resetToSample } = usePins()
  const { favoriteIds, toggleFavorite, isFavorite } = useFavoritePins()

  const [listMode, setListMode] = useState<MapListMode>(initial.listMode ?? 'all')
  const [selectedId, setSelectedId] = useState<string | null>(initial.selectedId ?? null)
  const [searchFocus, setSearchFocus] = useState<SearchFocus | null>(initial.searchFocus ?? null)
  const [activeCategories, setActiveCategories] = useState<Set<PinCategory>>(
    () => new Set(ALL_CATEGORIES),
  )
  const [pinFilter, setPinFilter] = useState(initial.pinFilter ?? '')
  const [addMode, setAddMode] = useState(initial.addMode ?? false)
  const [showMapillaryLayer, setShowMapillaryLayer] = useState(true)
  const [pendingPosition, setPendingPosition] = useState<LatLng | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [detailTab, setDetailTab] = useState<DetailTab>(initial.detailTab ?? 'ringkasan')
  const [isNavigating, setIsNavigating] = useState(false)
  const [navUserPosition, setNavUserPosition] = useState<LatLng | null>(null)

  const selectedPin = pins.find((p) => p.id === selectedId) ?? null

  const activePlace = useMemo(() => {
    if (selectedPin) return pinToPlaceContext(selectedPin)
    if (searchFocus) return searchToPlaceContext(searchFocus)
    return null
  }, [selectedPin, searchFocus])

  const displayedPins = useMemo(() => {
    if (listMode === 'hidden-camping') {
      return pins.filter((p) => p.category === 'camping' && p.hiddenGem)
    }
    if (listMode === 'hidden-cafe') {
      return pins.filter((p) => p.category === 'cafe' && p.hiddenGem)
    }
    if (listMode === 'favorites') {
      return pins.filter((p) => favoriteIds.includes(p.id))
    }
    return pins
  }, [pins, listMode, favoriteIds])

  const goSearch = useCallback(
    (state?: MapPageLocationState) => {
      navigate('/dashboard', { state })
    },
    [navigate],
  )

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
    setListMode('all')
  }, [])

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
        <Link
          to="/"
          className="font-schibsted text-xl font-semibold tracking-tight text-[#000000]"
        >
          JalanMap
        </Link>
        <p className="hidden text-sm font-medium text-slate-600 sm:block">Peta Indonesia</p>
        <button
          type="button"
          onClick={() => goSearch({ pinFilter })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cari lokasi
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <MapSidebar
          pins={displayedPins}
          selectedId={selectedId}
          activeCategories={activeCategories}
          pinFilter={pinFilter}
          addMode={addMode}
          listMode={listMode}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onClearListMode={() => setListMode('all')}
          onPinFilterChange={setPinFilter}
          onSelectPin={handleSelectPin}
          onSelectPlace={handleSelectPlace}
          onToggleCategory={toggleCategory}
          onToggleAddMode={handleToggleAddMode}
          onResetSample={resetToSample}
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
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
            <span className="hidden text-[11px] text-slate-400 sm:inline">
              Navigasi suara · Budaya & acara · Rute motor/mobil
            </span>
          </div>

          <div className="relative flex min-h-0 flex-1">
            <IndonesiaMap
              pins={displayedPins}
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
            <div className="grid max-h-[48vh] min-h-[280px] shrink-0 border-t border-slate-200 lg:grid-cols-2">
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
