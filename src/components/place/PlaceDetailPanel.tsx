import { useState } from 'react'
import {
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Share2,
  Tag,
  Trash2,
  Wallet,
  X,
  Check,
} from 'lucide-react'
import { CATEGORY_CONFIG } from '../../lib/categories'
import { mapillaryAppUrl } from '../../lib/mapillary'
import { placeContextRegion } from '../../lib/region'
import { getCultureForRegion } from '../../data/regionalCulture'
import { youtubeEmbedUrl } from '../../lib/youtube'
import type { DetailTab, LatLng, LocationPin, PlaceContext, RouteResult } from '../../types'
import { RoutePlanner } from './RoutePlanner'

interface PlaceDetailPanelProps {
  place: PlaceContext
  pins: LocationPin[]
  initialTab?: DetailTab
  onClose: () => void
  onDelete?: (pinId: string) => void
  onAddPin?: () => void
  onRouteReady: (route: RouteResult | null) => void
  onNavigatingChange?: (active: boolean, userPosition: LatLng | null) => void
  onShowRouteTab?: () => void
}

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'budaya', label: 'Budaya & Acara' },
  { id: 'rute', label: 'Rute' },
  { id: 'tentang', label: 'Tentang' },
]

function InfoRow({
  icon: Icon,
  children,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  sub?: string
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
      <Icon className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-sm text-slate-800">{children}</div>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function PlaceDetailPanel({
  place,
  pins,
  initialTab = 'ringkasan',
  onClose,
  onDelete,
  onAddPin,
  onRouteReady,
  onNavigatingChange,
  onShowRouteTab,
}: PlaceDetailPanelProps) {
  const [tab, setTab] = useState<DetailTab>(initialTab)
  const region = placeContextRegion(place)
  const culture = getCultureForRegion(region)
  const cat = place.category ? CATEGORY_CONFIG[place.category] : null
  const embed = place.youtubeUrl ? youtubeEmbedUrl(place.youtubeUrl) : null

  const share = async () => {
    const text = `${place.title} — ${place.address ?? ''}`
    const url = `${window.location.origin}/dashboard?lat=${place.lat}&lng=${place.lng}`
    if (navigator.share) {
      await navigator.share({ title: place.title, text, url })
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Link disalin ke clipboard')
    }
  }

  const openRoute = () => {
    setTab('rute')
    onShowRouteTab?.()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2 shrink-0 border-b border-slate-100">
        <div className="min-w-0">
          {cat && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white mb-1"
              style={{ backgroundColor: cat.color }}
            >
              {cat.emoji} {cat.label}
            </span>
          )}
          <h2 className="text-lg font-bold text-slate-900 leading-tight">{place.title}</h2>
          {place.subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{place.subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 shrink-0"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Action bar — gaya Google Maps */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto shrink-0 border-b border-slate-100">
        {[
          { icon: Navigation, label: 'Rute', onClick: openRoute, active: tab === 'rute' },
          { icon: Bookmark, label: 'Simpan', onClick: () => {}, disabled: true },
          { icon: MapPin, label: 'Di sekitar', onClick: () => setTab('ringkasan') },
          { icon: Share2, label: 'Bagikan', onClick: share },
        ].map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={a.onClick}
            disabled={'disabled' in a && a.disabled}
            className={`flex flex-col items-center gap-1 min-w-[4.5rem] px-2 py-1.5 rounded-xl transition-colors ${
              a.active
                ? 'bg-cyan-50 text-cyan-700'
                : 'text-slate-600 hover:bg-slate-50 disabled:opacity-40'
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                a.active ? 'bg-cyan-600 text-white' : 'bg-cyan-100 text-cyan-700'
              }`}
            >
              <a.icon className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-semibold">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === 'ringkasan' && (
          <>
            {place.eventNote && (
              <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Catatan acara / peringatan
                </p>
                <p className="text-sm text-amber-900 mt-1 leading-relaxed">{place.eventNote}</p>
              </div>
            )}

            {place.services && place.services.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {place.services.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
                  >
                    <Check className="h-3 w-3" />
                    {s}
                  </span>
                ))}
                <ChevronRight className="h-4 w-4 text-slate-300 self-center" />
              </div>
            )}

            <div className="divide-y divide-slate-100">
              {place.address && (
                <InfoRow icon={MapPin}>{place.address}</InfoRow>
              )}
              {place.openingHours && (
                <InfoRow icon={Clock} sub="Jam operasional">
                  {place.openingHours}
                </InfoRow>
              )}
              {place.priceRange && (
                <InfoRow icon={Wallet} sub="Kisaran harga">
                  {place.priceRange}
                </InfoRow>
              )}
              <InfoRow icon={Tag} sub="Koordinat">
                {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
              </InfoRow>
            </div>

            {embed && (
              <div className="mt-4 aspect-video rounded-xl overflow-hidden ring-1 ring-slate-200">
                <iframe title={place.title} src={embed} className="h-full w-full" allowFullScreen />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!place.pinId && onAddPin && (
                <button
                  type="button"
                  onClick={onAddPin}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-3 py-2 text-xs font-semibold text-white"
                >
                  Tambah pin di sini
                </button>
              )}
              <a
                href={mapillaryAppUrl(place.lat, place.lng)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-800"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Street view Mapillary
              </a>
              {place.pinId && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(place.pinId!)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ml-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus pin
                </button>
              )}
            </div>
          </>
        )}

        {tab === 'budaya' && (
          <div className="space-y-4">
            {region ? (
              <p className="text-sm font-semibold text-cyan-700">Wilayah: {region}</p>
            ) : (
              <p className="text-sm text-slate-500">
                Wilayah tidak terdeteksi otomatis. Coba tambahkan alamat yang menyebut provinsi.
              </p>
            )}

            {culture ? (
              <>
                <p className="text-sm text-slate-600 italic">{culture.tagline}</p>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Acara & peringatan
                  </h4>
                  <ul className="space-y-3">
                    {culture.events.map((ev) => (
                      <li
                        key={ev.title}
                        className={`rounded-xl p-3 border ${
                          ev.type === 'warning'
                            ? 'bg-rose-50 border-rose-200'
                            : 'bg-violet-50 border-violet-100'
                        }`}
                      >
                        <p className="font-semibold text-sm text-slate-900">{ev.title}</p>
                        <p className="text-xs text-violet-700 font-medium mt-0.5">{ev.schedule}</p>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{ev.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Budaya & etika
                  </h4>
                  <ul className="space-y-2">
                    {culture.customs.map((c) => (
                      <li key={c.title} className="rounded-lg bg-slate-50 p-3">
                        <p className="font-semibold text-sm">{c.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{c.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                  {culture.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Belum ada data budaya untuk wilayah ini. Konten tersedia: Bali, Yogyakarta, Jawa
                Timur, Sulawesi Selatan, NTT.
              </p>
            )}

            {place.eventNote && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-bold text-amber-800">Catatan lokasi ini</p>
                <p className="text-sm text-amber-900 mt-1">{place.eventNote}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'rute' && (
          <RoutePlanner
            destination={{ ...place, title: place.title }}
            pins={pins}
            onRouteReady={onRouteReady}
            onNavigatingChange={onNavigatingChange}
          />
        )}

        {tab === 'tentang' && (
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            {place.description ? (
              <p>{place.description}</p>
            ) : (
              <p className="text-slate-400">Belum ada deskripsi panjang untuk lokasi ini.</p>
            )}
            {region && culture && (
              <p className="text-slate-500 border-t border-slate-100 pt-3">{culture.tagline}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
