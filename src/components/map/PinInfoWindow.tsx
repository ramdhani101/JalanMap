import { ExternalLink, Trash2, X } from 'lucide-react'
import { CATEGORY_CONFIG } from '../../lib/categories'
import { mapillaryAppUrl } from '../../lib/mapillary'
import { youtubeEmbedUrl, youtubeThumbnail } from '../../lib/youtube'
import type { LocationPin } from '../../types'

interface PinInfoWindowProps {
  pin: LocationPin
  onClose: () => void
  onDelete?: (id: string) => void
}

export function PinInfoWindow({ pin, onClose, onDelete }: PinInfoWindowProps) {
  const cat = CATEGORY_CONFIG[pin.category]
  const embed = pin.youtubeUrl ? youtubeEmbedUrl(pin.youtubeUrl) : null
  const thumb = pin.youtubeUrl ? youtubeThumbnail(pin.youtubeUrl) : null

  return (
    <div className="w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        style={{ backgroundColor: cat.color }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{cat.emoji}</span>
          <div className="min-w-0">
            <p className="text-xs font-medium opacity-90">{cat.label}</p>
            <h3 className="font-bold truncate">{pin.title}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-white/20 transition-colors shrink-0"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {embed && (
          <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
            <iframe
              title={pin.title}
              src={embed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {!embed && thumb && pin.photoUrl && (
          <img src={pin.photoUrl} alt={pin.title} className="w-full rounded-xl object-cover max-h-40" />
        )}
        {!embed && thumb && !pin.photoUrl && (
          <a
            href={pin.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-xl overflow-hidden ring-1 ring-slate-200 group"
          >
            <img src={thumb} alt="" className="w-full aspect-video object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                ▶ Tonton di YouTube
              </span>
            </span>
          </a>
        )}

        <p className="text-sm text-slate-600 leading-relaxed">{pin.description}</p>

        {pin.address && (
          <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">{pin.address}</p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {pin.youtubeUrl && (
            <a
              href={pin.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              YouTube
            </a>
          )}
          <a
            href={mapillaryAppUrl(pin.lat, pin.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 hover:bg-cyan-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Mapillary
          </a>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(pin.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
