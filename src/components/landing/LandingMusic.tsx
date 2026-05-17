import { useCallback, useEffect, useRef, useState } from 'react'
import { Music2, Volume2 } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Letakkan file MP3 Anda di: public/audio/beranda-ambient.mp3 */
export const LANDING_MUSIC_PATH = '/audio/beranda-ambient.mp3'

const DEFAULT_VOLUME = 0.35

export function LandingMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoplayTriedRef = useRef(false)
  const userPausedRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [hasFile, setHasFile] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const startAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false
    try {
      audio.volume = DEFAULT_VOLUME
      await audio.play()
      userPausedRef.current = false
      setPlaying(true)
      return true
    } catch {
      setPlaying(false)
      return false
    }
  }, [])

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    userPausedRef.current = true
    audio.pause()
    setPlaying(false)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = DEFAULT_VOLUME

    const onReady = () => {
      setHasFile(true)
      setLoadError(null)
    }
    const onError = () => {
      setHasFile(false)
      setLoadError(
        `File tidak ditemukan. Pastikan nama file: beranda-ambient.mp3 (bukan beranda-ambien) di folder public/audio/`,
      )
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    audio.addEventListener('loadeddata', onReady)
    audio.addEventListener('canplay', onReady)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.load()

    return () => {
      audio.removeEventListener('loadeddata', onReady)
      audio.removeEventListener('canplay', onReady)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
    }
  }, [])

  useEffect(() => {
    if (!hasFile || autoplayTriedRef.current || userPausedRef.current) return
    autoplayTriedRef.current = true
    void startAudio()
  }, [hasFile, startAudio])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!hasFile) {
      alert(
        loadError ??
          'Belum ada file musik.\n\nSalin lagu MP3 ke:\npublic/audio/beranda-ambient.mp3\n\nNama harus persis (ambient dengan huruf t). Refresh halaman setelah menyimpan.',
      )
      return
    }

    if (!audio.paused) {
      pauseAudio()
      return
    }

    void startAudio()
  }, [hasFile, loadError, pauseAudio, startAudio])

  return (
    <>
      <audio
        ref={audioRef}
        src={LANDING_MUSIC_PATH}
        loop
        autoPlay
        playsInline
        preload="auto"
        className="hidden"
        aria-hidden
      />
      <button
        type="button"
        data-music-toggle
        onClick={toggle}
        className={cn(
          'relative z-20 liquid-glass flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]',
          playing && 'ring-1 ring-white/30',
          !hasFile && 'opacity-70',
        )}
        aria-label={playing ? 'Matikan musik' : 'Putar musik latar'}
        aria-pressed={playing}
        title={
          hasFile
            ? playing
              ? 'Klik untuk matikan musik'
              : 'Klik untuk putar musik'
            : 'Tambahkan public/audio/beranda-ambient.mp3'
        }
      >
        {playing ? (
          <>
            <Volume2 className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Matikan musik</span>
          </>
        ) : (
          <>
            <Music2 className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Putar musik</span>
          </>
        )}
      </button>
    </>
  )
}
