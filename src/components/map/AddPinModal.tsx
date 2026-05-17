import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ALL_CATEGORIES, CATEGORY_CONFIG } from '../../lib/categories'
import type { LatLng, LocationPin, PinCategory } from '../../types'

interface AddPinModalProps {
  open: boolean
  position: LatLng | null
  onClose: () => void
  onSave: (pin: Omit<LocationPin, 'id' | 'createdAt'>) => void
}

const emptyForm = {
  title: '',
  description: '',
  category: 'travel_note' as PinCategory,
  youtubeUrl: '',
  photoUrl: '',
  address: '',
}

export function AddPinModal({ open, position, onClose, onSave }: AddPinModalProps) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) setForm(emptyForm)
  }, [open, position])

  if (!open || !position) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      lat: position.lat,
      lng: position.lng,
      youtubeUrl: form.youtubeUrl.trim() || undefined,
      photoUrl: form.photoUrl.trim() || undefined,
      address: form.address.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in"
        role="dialog"
        aria-labelledby="add-pin-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="add-pin-title" className="text-lg font-bold text-slate-900">
              Tambah Lokasi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Judul *</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
              placeholder="Misal: Camp di Pantai Parangtritis"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Kategori</span>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as PinCategory }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Catatan / Tips</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none resize-none"
              placeholder="Cerita singkat, harga, jam buka..."
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Link YouTube (video jalan-jalan)</span>
            <input
              type="url"
              value={form.youtubeUrl}
              onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
              placeholder="https://youtube.com/watch?v=..."
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">URL Foto (opsional)</span>
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Alamat</span>
            <input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
              placeholder="Kota, provinsi"
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-teal-400"
            >
              Simpan Pin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
