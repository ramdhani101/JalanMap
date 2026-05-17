import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Map } from 'lucide-react'
import { HeroImageBackground } from './HeroImageBackground'
import type { MapFeatureAction } from '../../../data/mapHeroMenu'
import { MapHeroNav } from './MapHeroNav'
import { MapHeroHeader } from './MapHeroHeader'
import { MapHeroSearchBox } from './MapHeroSearchBox'
import {
  SpotifyDashboardButton,
  SpotifyDashboardPanel,
  SpotifyDashboardRoot,
} from '../../spotify/SpotifyDashboardSection'
import type { LocationPin, SearchFocus } from '../../../types'
import './map-hero.css'

interface MapDashboardShellProps {
  layout?: 'search' | 'embedded'
  heroCollapsed?: boolean
  pins: LocationPin[]
  pinFilter: string
  onPinFilterChange: (v: string) => void
  onSelectPin: (id: string) => void
  onSelectPlace: (place: SearchFocus) => void
  onFeatureAction: (action: MapFeatureAction) => void
  onCultureSelect: (pinId: string) => void
  onOpenMap?: () => void
  children?: ReactNode
}

export function MapDashboardShell({
  layout = 'embedded',
  heroCollapsed = false,
  pins,
  pinFilter,
  onPinFilterChange,
  onSelectPin,
  onSelectPlace,
  onFeatureAction,
  onCultureSelect,
  onOpenMap,
  children,
}: MapDashboardShellProps) {
  const isSearchOnly = layout === 'search'

  return (
    <div className="map-hero-root relative flex h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <HeroImageBackground />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <MapHeroNav onFeatureAction={onFeatureAction} onCultureSelect={onCultureSelect} />

        <div
          className={`flex flex-col items-center transition-all duration-300 ${
            isSearchOnly
              ? 'flex-1 justify-center gap-[44px] px-6 pb-12 pt-[60px]'
              : heroCollapsed
                ? 'shrink-0 gap-3 pt-4'
                : 'shrink-0 gap-[44px] pt-[60px]'
          }`}
        >
          <MapHeroHeader collapsed={isSearchOnly ? false : heroCollapsed} />
          {(!heroCollapsed || isSearchOnly) && (
            <MapHeroSearchBox
              pins={pins}
              pinFilter={pinFilter}
              onPinFilterChange={onPinFilterChange}
              onSelectPin={onSelectPin}
              onSelectPlace={onSelectPlace}
              onSubmit={isSearchOnly ? onOpenMap : undefined}
            />
          )}
          {isSearchOnly && (
            <SpotifyDashboardRoot>
              <div className="flex w-full max-w-xl flex-col items-center gap-4">
                <SpotifyDashboardPanel />
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {onOpenMap && (
                    <button
                      type="button"
                      onClick={onOpenMap}
                      className="font-schibsted flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-medium text-[#000000] shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                    >
                      <Map className="h-4 w-4" />
                      Peta
                    </button>
                  )}
                  <Link
                    to="/studio"
                    className="font-schibsted flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-medium text-[#000000] shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                  >
                    <BookOpen className="h-4 w-4" />
                    Travel Jurnal
                  </Link>
                  <SpotifyDashboardButton />
                </div>
              </div>
            </SpotifyDashboardRoot>
          )}
        </div>

        {!isSearchOnly && children && (
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3 lg:px-[120px]">
            <div className="map-hero-map-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl shadow-2xl">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
