import { FileText, MapPin, Play, Trash2 } from 'lucide-react'
import type { TravelJournalEntry } from '../../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function youtubeThumb(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null
}

interface JournalEntryCardProps {
  entry: TravelJournalEntry
  onDelete?: (id: string) => void
}

export function JournalEntryCard({ entry, onDelete }: JournalEntryCardProps) {
  const thumb =
    entry.type === 'photo' && entry.photoUrl
      ? entry.photoUrl
      : entry.type === 'video' && entry.videoUrl
        ? youtubeThumb(entry.videoUrl)
        : null

  return (
    <article className="journal-card liquid-glass group overflow-hidden rounded-2xl transition-transform hover:scale-[1.02]">
      {entry.type === 'note' ? (
        <div className="flex aspect-[4/3] items-center justify-center bg-white/5">
          <FileText className="h-12 w-12 text-white/30" />
        </div>
      ) : thumb ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={thumb} alt="" className="h-full w-full object-cover" />
          {entry.type === 'video' && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Play className="h-5 w-5 fill-white text-white" />
              </span>
            </span>
          )}
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-white/5 text-white/40">
          Tanpa media
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/70">
            {entry.type === 'photo' ? 'Foto' : entry.type === 'video' ? 'Video' : 'Catatan'}
          </span>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              className="rounded-lg p-1 text-white/40 opacity-0 transition-opacity hover:bg-white/10 hover:text-red-300 group-hover:opacity-100"
              aria-label="Hapus"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <h3 className="text-base font-medium text-white">{entry.title}</h3>
        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-white/60">{entry.caption}</p>
        {entry.location && (
          <p className="mt-2 flex items-center gap-1 text-xs text-white/45">
            <MapPin className="h-3 w-3 shrink-0" />
            {entry.location}
          </p>
        )}
        <p className="mt-2 text-[11px] text-white/35">{formatDate(entry.createdAt)}</p>
        {entry.type === 'video' && entry.videoUrl && (
          <a
            href={entry.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs font-medium text-cyan-300/90 hover:text-cyan-200"
          >
            Tonton video →
          </a>
        )}
      </div>
    </article>
  )
}
