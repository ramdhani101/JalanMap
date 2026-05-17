import { useEffect, useRef } from 'react'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4'

const FADE_MS = 250
const FADE_BEFORE_END_SEC = 0.55

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadingOutRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const cancelFade = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const animateOpacity = (from: number, to: number, onComplete?: () => void) => {
    cancelFade()
    const video = videoRef.current
    if (!video) return

    const startOpacity = from
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / FADE_MS, 1)
      const current = startOpacity + (to - startOpacity) * t
      video.style.opacity = String(current)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const fadeIn = () => {
      const from = parseFloat(video.style.opacity || '0')
      animateOpacity(from, 1)
    }

    const onLoadedData = () => {
      video.style.opacity = '0'
      video.play().catch(() => {})
      fadeIn()
    }

    const onTimeUpdate = () => {
      if (!video.duration || Number.isNaN(video.duration)) return
      if (fadingOutRef.current) return

      const remaining = video.duration - video.currentTime
      if (remaining <= FADE_BEFORE_END_SEC) {
        fadingOutRef.current = true
        const from = parseFloat(video.style.opacity || '1')
        animateOpacity(from, 0)
      }
    }

    const onEnded = () => {
      cancelFade()
      video.style.opacity = '0'
      fadingOutRef.current = false

      window.setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
        const from = parseFloat(video.style.opacity || '0')
        animateOpacity(from, 1)
      }, 100)
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)

    if (video.readyState >= 2) {
      onLoadedData()
    }

    return () => {
      cancelFade()
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 object-top"
      style={{ width: '115%', height: '115%', opacity: 0 }}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      aria-hidden
    />
  )
}
