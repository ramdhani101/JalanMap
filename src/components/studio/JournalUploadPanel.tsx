import { useRef, useState } from 'react'
import { FileText, ImagePlus, Loader2, Plus, Video } from 'lucide-react'
import type { JournalMediaType } from '../../types'

interface JournalUploadPanelProps {
  onAdd: (entry: {
    type: JournalMediaType
    title: string
    caption: string
    location?: string
    photoUrl?: string
    videoUrl?: string
  }) => void
}

export function JournalUploadPanel({ onAdd }: JournalUploadPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<JournalMediaType>('photo')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setTitle('')
    setCaption('')
    setLocation('')
    setVideoUrl('')
    setPhotoPreview(null)
    setType('photo')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran foto maksimal 4 MB')
      return
    }
    setLoading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoPreview(reader.result as string)
      setLoading(false)
    }
    reader.onerror = () => setLoading(false)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !caption.trim()) return

    if (type === 'photo' && !photoPreview) {
      alert('Unggah foto terlebih dahulu')
      return
    }
    if (type === 'video' && !videoUrl.trim()) {
      alert('Masukkan URL video (YouTube, dll.)')
      return
    }

    onAdd({
      type,
      title: title.trim(),
      caption: caption.trim(),
      location: location.trim() || undefined,
      photoUrl: type === 'photo' ? photoPreview ?? undefined : undefined,
      videoUrl: type === 'video' ? videoUrl.trim() : undefined,
    })
    reset()
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
      >
        <Plus className="h-4 w-4" />
        Unggah catatan
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="liquid-glass-strong w-full max-w-2xl rounded-2xl p-6 text-left"
    >
      <h3 className="text-lg font-medium text-white">Tambah ke jurnal</h3>
      <p className="mt-1 text-sm text-white/50">Foto, video, atau catatan perjalanan Anda</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { id: 'photo' as const, label: 'Foto', Icon: ImagePlus },
            { id: 'video' as const, label: 'Video', Icon: Video },
            { id: 'note' as const, label: 'Catatan', Icon: FileText },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setType(id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              type === id ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul perjalanan"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
        />
        <textarea
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Cerita singkat, tips, atau rangkuman..."
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Lokasi (opsional)"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
        />

        {type === 'photo' && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-8 text-sm text-white/60 hover:bg-white/10"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : photoPreview ? (
                <img src={photoPreview} alt="" className="max-h-40 rounded-lg object-cover" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" />
                  Pilih foto dari perangkat
                </>
              )}
            </button>
          </div>
        )}

        {type === 'video' && (
          <input
            required
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="URL video (YouTube, CloudFront, ...)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
          />
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={() => {
            reset()
            setOpen(false)
          }}
          className="rounded-full px-5 py-2 text-sm text-white/60 hover:text-white"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
