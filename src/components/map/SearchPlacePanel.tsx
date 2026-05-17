import { MapPin, Plus, X } from 'lucide-react'
import { MapillaryViewer } from './MapillaryViewer'
import type { SearchFocus } from '../../types'

interface SearchPlacePanelProps {
  focus: SearchFocus
  onClose: () => void
  onAddPin: () => void
}

export function SearchPlacePanel({ focus, onClose, onAddPin }: SearchPlacePanelProps) {
  return (
    <div className="grid lg:grid-cols-2 border-t border-slate-200 shrink-0 max-h-[45vh] lg:max-h-[38vh]">
      <MapillaryViewer lat={focus.lat} lng={focus.lng} title={focus.name} />
      <div className="flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-slate-200 overflow-hidden">
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3 shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Hasil pencarian</p>
            <h3 className="font-bold text-slate-900 truncate">{focus.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{focus.displayName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 shrink-0"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-sm text-slate-600 flex items-start gap-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {focus.lat.toFixed(5)}, {focus.lng.toFixed(5)}
            </span>
          </p>
          <button
            type="button"
            onClick={onAddPin}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-teal-400"
          >
            <Plus className="h-4 w-4" />
            Tambah pin di lokasi ini
          </button>
        </div>
      </div>
    </div>
  )
}
