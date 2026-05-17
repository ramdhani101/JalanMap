import { useEffect, useRef, useState } from 'react'
import { Camera, ExternalLink, Loader2 } from 'lucide-react'
import { Viewer } from 'mapillary-js'
import { fetchNearestImages, getMapillaryToken, mapillaryAppUrl } from '../../lib/mapillary'
import 'mapillary-js/dist/mapillary.css'

interface MapillaryViewerProps {
  lat: number
  lng: number
  title?: string
}

export function MapillaryViewer({ lat, lng, title }: MapillaryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageId, setImageId] = useState<string | null>(null)

  useEffect(() => {
    const token = getMapillaryToken()
    if (!token) {
      setError('Token Mapillary belum diatur di .env')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setImageId(null)

    fetchNearestImages(lat, lng, 1).then((images) => {
      if (cancelled) return
      if (images.length === 0) {
        setError('Belum ada foto street-level Mapillary di lokasi ini (radius 50 m).')
        setLoading(false)
        return
      }
      setImageId(images[0].id)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [lat, lng])

  useEffect(() => {
    if (!imageId || !containerRef.current) return

    const token = getMapillaryToken()
    if (!token) return

    viewerRef.current?.remove()
    const viewer = new Viewer({
      container: containerRef.current,
      accessToken: token,
      imageId,
      component: {
        cover: false,
        direction: true,
        sequence: true,
        zoom: true,
      },
    })
    viewerRef.current = viewer

    return () => {
      viewer.remove()
      viewerRef.current = null
    }
  }, [imageId])

  return (
    <div className="flex flex-col h-full min-h-[200px] bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-700 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Camera className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-cyan-300">Mapillary Street View</p>
            {title && <p className="text-[11px] text-slate-400 truncate">{title}</p>}
          </div>
        </div>
        <a
          href={mapillaryAppUrl(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:text-white hover:bg-slate-700"
          title="Buka di Mapillary"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="relative flex-1 min-h-[180px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 z-10 bg-slate-900">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            <span className="text-xs">Mencari foto terdekat...</span>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center z-10 bg-slate-900">
            <span className="text-2xl">📷</span>
            <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            <a
              href={mapillaryAppUrl(lat, lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Cek di mapillary.com →
            </a>
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    </div>
  )
}
