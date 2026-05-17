import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePins } from '../hooks/usePins'
import type { MapFeatureAction } from '../data/mapHeroMenu'
import type { MapPageLocationState } from '../lib/mapPageState'
import type { SearchFocus } from '../types'
import { MapDashboardShell } from '../components/map/hero/MapDashboardShell'

export function DashboardPage() {
  const navigate = useNavigate()
  const { pins } = usePins()
  const [pinFilter, setPinFilter] = useState('')

  const goToMap = useCallback(
    (state: MapPageLocationState = {}) => {
      navigate('/peta', { state: { ...state, pinFilter: state.pinFilter ?? pinFilter } })
    },
    [navigate, pinFilter],
  )

  const handleSelectPin = useCallback(
    (id: string) => {
      goToMap({ selectedId: id, searchFocus: null, detailTab: 'ringkasan' })
    },
    [goToMap],
  )

  const handleSelectPlace = useCallback(
    (place: SearchFocus) => {
      goToMap({
        searchFocus: place,
        selectedId: null,
        pinFilter: place.name,
        detailTab: 'ringkasan',
      })
    },
    [goToMap],
  )

  const handleFeatureAction = useCallback(
    (action: MapFeatureAction) => {
      if (action === 'pin-favorite') {
        goToMap({ listMode: 'favorites', addMode: true })
        return
      }
      if (action === 'plan-route') {
        goToMap({ detailTab: 'rute' })
        return
      }
      if (action === 'hidden-camping') {
        const first = pins.find((p) => p.category === 'camping' && p.hiddenGem)
        goToMap({
          listMode: 'hidden-camping',
          selectedId: first?.id ?? null,
          detailTab: 'ringkasan',
        })
        return
      }
      if (action === 'hidden-cafe') {
        const first = pins.find((p) => p.category === 'cafe' && p.hiddenGem)
        goToMap({
          listMode: 'hidden-cafe',
          selectedId: first?.id ?? null,
          detailTab: 'ringkasan',
        })
      }
    },
    [goToMap, pins],
  )

  const handleCultureSelect = useCallback(
    (pinId: string) => {
      goToMap({ selectedId: pinId, searchFocus: null, detailTab: 'budaya' })
    },
    [goToMap],
  )

  return (
    <MapDashboardShell
      layout="search"
      pins={pins}
      pinFilter={pinFilter}
      onPinFilterChange={setPinFilter}
      onSelectPin={handleSelectPin}
      onSelectPlace={handleSelectPlace}
      onFeatureAction={handleFeatureAction}
      onCultureSelect={handleCultureSelect}
      onOpenMap={() => goToMap()}
    />
  )
}
