import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowUp,
  Globe,
  Loader2,
  Paperclip,
  Mic,
  Search,
  Sparkles,
} from 'lucide-react'
import { usePlaceSearch } from '../../../hooks/usePlaceSearch'
import { useVoiceSearch } from '../../../hooks/useVoiceSearch'
import { cn } from '../../../lib/utils'
import { CATEGORY_CONFIG } from '../../../lib/categories'
import type { LocationPin, PlaceResult, SearchFocus } from '../../../types'

interface MapHeroSearchBoxProps {
  pins: LocationPin[]
  pinFilter: string
  onPinFilterChange: (v: string) => void
  onSelectPin: (id: string) => void
  onSelectPlace: (place: SearchFocus) => void
  onSubmit?: () => void
  compact?: boolean
}

function placeToFocus(p: PlaceResult): SearchFocus {
  return {
    lat: p.lat,
    lng: p.lng,
    name: p.name,
    displayName: p.displayName,
    bounds: p.bounds,
  }
}

export function MapHeroSearchBox({
  pins,
  pinFilter,
  onPinFilterChange,
  onSelectPin,
  onSelectPlace,
  onSubmit,
  compact = false,
}: MapHeroSearchBoxProps) {
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const { results: places, loading, error } = usePlaceSearch(pinFilter)

  const voice = useVoiceSearch({
    onTranscript: (text, isFinal) => {
      onPinFilterChange(text)
      setOpen(true)
      if (isFinal) setHighlight(0)
    },
  })

  const matchingPins = pinFilter.trim()
    ? pins
        .filter((p) => {
          const q = pinFilter.toLowerCase()
          return (
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.address?.toLowerCase().includes(q)
          )
        })
        .slice(0, 6)
    : []

  const items: Array<{ type: 'pin'; pin: LocationPin } | { type: 'place'; place: PlaceResult }> =
    [
      ...matchingPins.map((pin) => ({ type: 'pin' as const, pin })),
      ...places.map((place) => ({ type: 'place' as const, place })),
    ]

  const showDropdown = open && pinFilter.trim().length >= 2

  useEffect(() => {
    setHighlight(0)
  }, [pinFilter, places.length, matchingPins.length])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const pick = (item: (typeof items)[number]) => {
    if (item.type === 'pin') onSelectPin(item.pin.id)
    else onSelectPlace(placeToFocus(item.place))
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showDropdown && pinFilter.trim()) {
      onSubmit?.()
      return
    }
    if (!showDropdown || items.length === 0) {
      if (e.key === 'Enter' && places[0]) {
        onSelectPlace(placeToFocus(places[0]))
        setOpen(false)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(items[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`relative z-20 mx-auto w-full max-w-[728px] shrink-0 ${compact ? 'px-0' : 'px-6 lg:px-0'}`}
      style={{ minHeight: compact ? undefined : 200 }}
    >
      <div
        className={`map-hero-glass-panel flex flex-col rounded-[18px] p-3 ${compact ? '' : 'h-full min-h-[200px]'}`}
      >
        {!compact && (
          <div className="map-hero-glass-panel__header font-schibsted mb-3 flex items-center justify-between px-3 py-2 text-xs font-medium">
            <span className="flex items-center gap-2">
              <span>{pins.length}/∞ lokasi</span>
              <button
                type="button"
                className="rounded px-2 py-0.5 font-medium text-black"
                style={{ backgroundColor: 'rgba(90,225,76,0.89)' }}
              >
                Upgrade
              </button>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Mapillary
            </span>
          </div>
        )}

        <div className="relative flex flex-1 flex-col">
          <div className="map-hero-search-input-wrap flex flex-1 items-center gap-2 rounded-xl p-2">
            <input
              type="text"
              value={pinFilter}
              onChange={(e) => {
                onPinFilterChange(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Cari kota, alamat, tempat wisata..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-[#000000] outline-none placeholder:text-[#505050]"
              role="combobox"
              aria-expanded={showDropdown}
              aria-controls={listId}
            />
            <button
              type="button"
              onClick={() => {
                if (items[highlight]) pick(items[highlight])
                else onSubmit?.()
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white hover:scale-105 active:scale-95 transition-transform"
              aria-label="Cari"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {showDropdown && (
            <ul
              id={listId}
              className="map-hero-search-results absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-56 overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-xl"
            >
              {error && <li className="px-3 py-2 text-xs text-red-600">{error}</li>}
              {items.length === 0 && !loading && (
                <li className="px-3 py-3 text-center text-xs text-[#505050]">Tidak ada hasil</li>
              )}
              {loading && items.length === 0 && (
                <li className="flex items-center justify-center gap-2 py-4 text-xs text-[#505050]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#505050]" />
                  Mencari...
                </li>
              )}
              {items.map((item, i) => {
                const active = i === highlight
                if (item.type === 'pin') {
                  const cfg = CATEGORY_CONFIG[item.pin.category]
                  return (
                    <li key={item.pin.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlight(i)}
                        onClick={() => pick(item)}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#000000] ${
                          active ? 'bg-[#f8f8f8]' : 'hover:bg-[#f8f8f8]'
                        }`}
                      >
                        <span>{cfg.emoji}</span>
                        <span className="truncate font-medium text-[#000000]">{item.pin.title}</span>
                      </button>
                    </li>
                  )
                }
                return (
                  <li key={item.place.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => pick(item)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#000000] ${
                        active ? 'bg-[#f8f8f8]' : 'hover:bg-[#f8f8f8]'
                      }`}
                    >
                      <Globe className="h-4 w-4 shrink-0 text-[#505050]" />
                      <span className="min-w-0 flex-1 truncate font-medium text-[#000000]">
                        {item.place.name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {!compact && (
          <div className="font-schibsted mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#505050]">
            <div className="flex gap-2">
              {[
                { label: 'Lampirkan', Icon: Paperclip },
                { label: 'Suara', Icon: Mic },
                { label: 'Filter', Icon: Search },
              ].map(({ label, Icon }) => {
                const isVoice = label === 'Suara'
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={
                      isVoice
                        ? voice.toggleListening
                        : label === 'Filter'
                          ? () => setOpen(true)
                          : undefined
                    }
                    disabled={isVoice && !voice.isSupported}
                    title={
                      isVoice
                        ? voice.error ??
                          (voice.listening
                            ? 'Klik untuk berhenti'
                            : 'Ucapkan kota atau tempat wisata')
                        : undefined
                    }
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-transform hover:scale-105',
                      isVoice && voice.listening
                        ? 'bg-red-500/15 text-red-700 ring-2 ring-red-400/60'
                        : 'bg-black/[0.06] text-[#000000] hover:bg-black/[0.1]',
                      isVoice && !voice.isSupported && 'cursor-not-allowed opacity-50',
                    )}
                  >
                    <Icon className={cn('h-3.5 w-3.5', isVoice && voice.listening && 'animate-pulse')} />
                    {isVoice && voice.listening ? 'Mendengarkan…' : label}
                  </button>
                )
              })}
            </div>
            <span className="text-[#505050]">{pinFilter.length}/3,000</span>
            </div>
            {(voice.listening || voice.error) && (
              <p
                className={cn(
                  'text-center text-[11px]',
                  voice.error ? 'text-red-600' : 'text-[#505050]',
                )}
              >
                {voice.error ??
                  'Ucapkan lokasi, misalnya: Solo, Bali, atau Bromo…'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
