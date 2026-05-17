import { useEffect, useId, useRef, useState } from 'react'
import { Globe, Loader2, MapPin, Search } from 'lucide-react'
import { usePlaceSearch } from '../../hooks/usePlaceSearch'
import { CATEGORY_CONFIG } from '../../lib/categories'
import type { LocationPin, PlaceResult, SearchFocus } from '../../types'

interface LocationSearchProps {
  pins: LocationPin[]
  onSelectPin: (id: string) => void
  onSelectPlace: (place: SearchFocus) => void
  pinFilter: string
  onPinFilterChange: (v: string) => void
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

export function LocationSearch({
  pins,
  onSelectPin,
  onSelectPlace,
  pinFilter,
  onPinFilterChange,
}: LocationSearchProps) {
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const { results: places, loading, error } = usePlaceSearch(pinFilter)

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

  const items: Array<
    | { type: 'pin'; pin: LocationPin }
    | { type: 'place'; place: PlaceResult }
  > = [
    ...matchingPins.map((pin) => ({ type: 'pin' as const, pin })),
    ...places.map((place) => ({ type: 'place' as const, place })),
  ]

  const showDropdown = open && pinFilter.trim().length >= 2

  useEffect(() => {
    setHighlight(0)
  }, [pinFilter, places.length, matchingPins.length])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const pickItem = (item: (typeof items)[number]) => {
    if (item.type === 'pin') {
      onSelectPin(item.pin.id)
    } else {
      onSelectPlace(placeToFocus(item.place))
    }
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || items.length === 0) {
      if (e.key === 'Enter' && pinFilter.trim().length >= 2 && places[0]) {
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
      pickItem(items[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  let itemIndex = -1

  return (
    <div ref={wrapRef} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        value={pinFilter}
        onChange={(e) => {
          onPinFilterChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Cari kota, alamat, tempat wisata..."
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listId}
        aria-autocomplete="list"
        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-cyan-500" />
      )}

      {showDropdown && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-slate-900/5"
        >
          {error && <li className="px-3 py-2 text-xs text-rose-600">{error}</li>}

          {items.length === 0 && !loading && (
            <li className="px-3 py-4 text-center text-xs text-slate-400">
              Tidak ada hasil untuk &ldquo;{pinFilter}&rdquo;
            </li>
          )}

          {loading && items.length === 0 && (
            <li className="px-3 py-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Mencari lokasi...
            </li>
          )}

          {matchingPins.length > 0 && (
            <li className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Pin tersimpan
            </li>
          )}
          {matchingPins.map((pin) => {
            itemIndex += 1
            const idx = itemIndex
            const cfg = CATEGORY_CONFIG[pin.category]
            const active = idx === highlight
            return (
              <li key={`pin-${pin.id}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => pickItem({ type: 'pin', pin })}
                  className={`w-full flex items-start gap-2 px-3 py-2 text-left text-sm ${
                    active ? 'bg-cyan-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                    style={{ backgroundColor: `${cfg.color}22` }}
                  >
                    {cfg.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">{pin.title}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">
                      {pin.address || pin.description}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}

          {places.length > 0 && (
            <li
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 ${
                matchingPins.length > 0 ? 'border-t border-slate-100 mt-1' : ''
              }`}
            >
              Tempat di peta (OpenStreetMap)
            </li>
          )}
          {places.map((place) => {
            itemIndex += 1
            const idx = itemIndex
            const active = idx === highlight
            return (
              <li key={place.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => pickItem({ type: 'place', place })}
                  className={`w-full flex items-start gap-2 px-3 py-2 text-left text-sm ${
                    active ? 'bg-cyan-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Globe className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">{place.name}</span>
                    <span className="text-xs text-slate-500 line-clamp-2">{place.displayName}</span>
                  </span>
                </button>
              </li>
            )
          })}

          <li className="border-t border-slate-100 px-3 py-2 flex items-center gap-1.5 text-[10px] text-slate-400">
            <MapPin className="h-3 w-3 shrink-0" />
            Enter untuk pilih · ↑↓ navigasi
          </li>
        </ul>
      )}
    </div>
  )
}
