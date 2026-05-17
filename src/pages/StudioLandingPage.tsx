import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, RotateCcw } from 'lucide-react'
import { JournalEntryCard } from '../components/studio/JournalEntryCard'
import { JournalUploadPanel } from '../components/studio/JournalUploadPanel'
import { useTravelJournal } from '../hooks/useTravelJournal'
import type { JournalMediaType } from '../types'
import './studio/studio.css'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

const displayFont = { fontFamily: "'Instrument Serif', serif" }

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Peta', href: '/peta' },
  { label: 'Travel Jurnal', href: '/studio', active: true },
] as const

const filters: { id: JournalMediaType | 'all'; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'photo', label: 'Foto' },
  { id: 'video', label: 'Video' },
  { id: 'note', label: 'Catatan' },
]

export function StudioLandingPage() {
  const { entries, addEntry, deleteEntry, resetToSample } = useTravelJournal()
  const [filter, setFilter] = useState<JournalMediaType | 'all'>('all')

  const visible = useMemo(() => {
    if (filter === 'all') return entries
    return entries.filter((e) => e.type === filter)
  }, [entries, filter])

  const counts = useMemo(
    () => ({
      photo: entries.filter((e) => e.type === 'photo').length,
      video: entries.filter((e) => e.type === 'video').length,
      note: entries.filter((e) => e.type === 'note').length,
    }),
    [entries],
  )

  return (
    <div className="studio-page journal-page relative min-h-screen w-full overflow-hidden bg-[hsl(201_100%_13%)] text-white">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-80"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-[1] bg-[hsl(201_100%_13%)]/60" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 lg:px-10">
        <header className="relative flex min-h-12 items-center justify-center">
          <Link
            to="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl tracking-tight text-white"
            style={displayFont}
          >
            JalanMap<sup className="text-[10px] align-super">®</sup>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 px-28 sm:gap-8 sm:px-32">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`whitespace-nowrap text-sm transition-colors ${
                  'active' in link && link.active
                    ? 'text-white'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <section className="mt-12 text-center lg:mt-16">
          <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
            <BookOpen className="h-3.5 w-3.5" />
            Arsip perjalanan
          </p>
          <h1 className="mt-4 text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={displayFont}>
            Rangkuman{' '}
            <em className="italic-accent text-white/75">perjalananmu</em>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            Kumpulkan foto, video, dan catatan dari setiap petualangan — disimpan di perangkat Anda
            dan siap dibagikan ke peta.
          </p>
        </section>

        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                {f.label}
                {f.id !== 'all' && (
                  <span className="ml-1 opacity-60">
                    ({counts[f.id as keyof typeof counts]})
                  </span>
                )}
              </button>
            ))}
          </div>
          <JournalUploadPanel onAdd={addEntry} />
        </div>

        {visible.length === 0 ? (
          <div className="liquid-glass mt-12 rounded-2xl px-8 py-16 text-center">
            <p className="text-white/50">Belum ada entri di kategori ini.</p>
            <p className="mt-2 text-sm text-white/35">Unggah foto, video, atau catatan pertama Anda.</p>
          </div>
        ) : (
          <div className="journal-grid mt-10 pb-12">
            {visible.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onDelete={(id) => {
                  if (confirm('Hapus entri jurnal ini?')) deleteEntry(id)
                }}
              />
            ))}
          </div>
        )}

        <footer className="mt-auto border-t border-white/10 pt-6 pb-4">
          <button
            type="button"
            onClick={() => {
              if (confirm('Muat ulang contoh jurnal? Entri Anda akan diganti.')) resetToSample()
            }}
            className="mx-auto flex items-center gap-2 text-xs text-white/40 hover:text-white/70"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Muat contoh jurnal
          </button>
        </footer>
      </div>
    </div>
  )
}
