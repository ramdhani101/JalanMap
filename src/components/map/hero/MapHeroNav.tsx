import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { CULTURE_SPOT_SUGGESTIONS, FEATURE_MENU_ITEMS } from '../../../data/mapHeroMenu'
import type { MapFeatureAction } from '../../../data/mapHeroMenu'
import { MapHeroNavDropdown } from './MapHeroNavDropdown'

interface MapHeroNavProps {
  onFeatureAction: (action: MapFeatureAction) => void
  onCultureSelect: (pinId: string) => void
}

export function MapHeroNav({ onFeatureAction, onCultureSelect }: MapHeroNavProps) {
  const [openMenu, setOpenMenu] = useState<'fitur' | 'budaya' | null>(null)

  const close = () => setOpenMenu(null)

  return (
    <header className="relative z-20 flex min-h-14 shrink-0 items-center justify-center px-6 py-4 lg:px-[120px] lg:py-4">
      <Link
        to="/"
        className="font-schibsted absolute left-6 top-1/2 z-10 -translate-y-1/2 text-2xl font-semibold tracking-[-1.44px] text-[#000000] lg:left-[120px]"
      >
        JalanMap
      </Link>

      <nav className="hidden items-center justify-center gap-6 px-28 sm:gap-8 md:flex lg:px-40">
        <Link
          to="/"
          className="font-schibsted text-base font-medium tracking-[-0.2px] text-[#000000] hover:opacity-70"
        >
          Beranda
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu((m) => (m === 'fitur' ? null : 'fitur'))}
            className="font-schibsted flex items-center gap-1 text-base font-medium tracking-[-0.2px] text-[#000000] hover:opacity-70"
          >
            Fitur
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openMenu === 'fitur' ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>
          <MapHeroNavDropdown open={openMenu === 'fitur'} onClose={close}>
            {FEATURE_MENU_ITEMS.map((item) => (
              <button
                key={item.action}
                type="button"
                onClick={() => {
                  onFeatureAction(item.action)
                  close()
                }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-black/[0.04]"
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>
                  <span className="block text-sm font-semibold text-[#000000]">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-[#505050]">{item.description}</span>
                </span>
              </button>
            ))}
          </MapHeroNavDropdown>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu((m) => (m === 'budaya' ? null : 'budaya'))}
            className="font-schibsted flex items-center gap-1 text-base font-medium tracking-[-0.2px] text-[#000000] hover:opacity-70"
          >
            Budaya
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openMenu === 'budaya' ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>
          <MapHeroNavDropdown open={openMenu === 'budaya'} onClose={close} className="min-w-[320px]">
            <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-[#505050]">
              Aktivitas budaya aktif
            </p>
            {CULTURE_SPOT_SUGGESTIONS.map((spot) => (
              <button
                key={spot.pinId}
                type="button"
                onClick={() => {
                  onCultureSelect(spot.pinId)
                  close()
                }}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-black/[0.04]"
              >
                <span className="text-lg leading-none">{spot.emoji}</span>
                <span>
                  <span className="block text-sm font-semibold text-[#000000]">{spot.title}</span>
                  <span className="mt-0.5 block text-xs text-[#505050]">{spot.subtitle}</span>
                </span>
              </button>
            ))}
          </MapHeroNavDropdown>
        </div>

        <Link
          to="/peta"
          className="font-schibsted text-base font-medium tracking-[-0.2px] text-[#000000] hover:opacity-70"
        >
          Peta
        </Link>

        <Link
          to="/studio"
          className="font-schibsted text-base font-medium tracking-[-0.2px] text-[#000000] hover:opacity-70"
        >
          Travel Jurnal
        </Link>
      </nav>
    </header>
  )
}
