import { Filter, Plus, RotateCcw } from 'lucide-react'
import { CATEGORY_CONFIG, ALL_CATEGORIES } from '../../lib/categories'
import type { LocationPin, PinCategory, SearchFocus } from '../../types'
import { LocationSearch } from './LocationSearch'

interface MapSidebarProps {
  pins: LocationPin[]
  selectedId: string | null
  activeCategories: Set<PinCategory>
  pinFilter: string
  addMode: boolean
  onPinFilterChange: (v: string) => void
  onSelectPin: (id: string) => void
  onSelectPlace: (place: SearchFocus) => void
  onToggleCategory: (c: PinCategory) => void
  onToggleAddMode: () => void
  onResetSample: () => void
}

export function MapSidebar({
  pins,
  selectedId,
  activeCategories,
  pinFilter,
  addMode,
  onPinFilterChange,
  onSelectPin,
  onSelectPlace,
  onToggleCategory,
  onToggleAddMode,
  onResetSample,
}: MapSidebarProps) {
  const filtered = pins.filter((p) => {
    if (!activeCategories.has(p.category)) return false
    if (!pinFilter.trim()) return true
    const q = pinFilter.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q)
    )
  })

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white lg:w-80 xl:w-96 shrink-0">
      <div className="border-b border-slate-100 p-4 space-y-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Peta Indonesia</h1>
          <p className="text-xs text-slate-500">{pins.length} lokasi tersimpan</p>
        </div>

        <LocationSearch
          pins={pins}
          pinFilter={pinFilter}
          onPinFilterChange={onPinFilterChange}
          onSelectPin={onSelectPin}
          onSelectPlace={onSelectPlace}
        />

        <button
          type="button"
          onClick={onToggleAddMode}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            addMode
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-teal-400'
          }`}
        >
          <Plus className="h-4 w-4" />
          {addMode ? 'Klik peta untuk pin baru' : 'Tambah Lokasi'}
        </button>
      </div>

      <div className="border-b border-slate-100 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          <Filter className="h-3.5 w-3.5" />
          Filter Kategori
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((c) => {
            const cfg = CATEGORY_CONFIG[c]
            const on = activeCategories.has(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => onToggleCategory(c)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-all ${
                  on
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-500 opacity-60'
                }`}
                style={on ? { backgroundColor: cfg.color } : undefined}
              >
                <span>{cfg.emoji}</span>
                {cfg.label}
              </button>
            )
          })}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 && (
          <li className="p-6 text-center text-sm text-slate-400">
            {pinFilter.trim()
              ? 'Tidak ada pin cocok — coba pilih tempat dari dropdown pencarian'
              : 'Belum ada pin di kategori ini'}
          </li>
        )}
        {filtered.map((pin) => {
          const cfg = CATEGORY_CONFIG[pin.category]
          const selected = pin.id === selectedId
          return (
            <li key={pin.id}>
              <button
                type="button"
                onClick={() => onSelectPin(pin.id)}
                className={`w-full text-left rounded-xl p-3 transition-all ${
                  selected ? 'bg-cyan-50 ring-2 ring-cyan-500/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                    style={{ backgroundColor: `${cfg.color}22` }}
                  >
                    {cfg.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-900 truncate">{pin.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{pin.description}</p>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onResetSample}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Muat ulang data contoh
        </button>
      </div>
    </aside>
  )
}
