import { Mic, MicOff, Navigation2, Square, Volume2 } from 'lucide-react'
import { isSpeechSupported } from '../../lib/speech'
import { instructionToIndonesian } from '../../lib/voiceInstructions'
import type { RouteResult } from '../../types'

interface VoiceNavigationBarProps {
  route: RouteResult
  destinationTitle: string
  isNavigating: boolean
  muted: boolean
  currentStepIndex: number
  lastSpoken: string
  onStart: () => void
  onStop: () => void
  onToggleMute: () => void
}

export function VoiceNavigationBar({
  route,
  destinationTitle,
  isNavigating,
  muted,
  currentStepIndex,
  lastSpoken,
  onStart,
  onStop,
  onToggleMute,
}: VoiceNavigationBarProps) {
  const currentStep = route.steps[currentStepIndex]
  const speechOk = isSpeechSupported()

  return (
    <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-2 w-2 rounded-full ${isNavigating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}
        />
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          {isNavigating ? 'Navigasi suara aktif' : 'Pengarah jalan suara'}
        </p>
      </div>

      {!speechOk && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
          Browser ini tidak mendukung suara. Gunakan Chrome atau Edge terbaru.
        </p>
      )}

      {isNavigating && lastSpoken && (
        <div className="rounded-xl bg-cyan-600 text-white px-4 py-3">
          <p className="text-[10px] uppercase opacity-80 font-semibold flex items-center gap-1">
            <Volume2 className="h-3 w-3" />
            Instruksi terakhir
          </p>
          <p className="text-sm font-medium mt-1 leading-snug">{lastSpoken}</p>
        </div>
      )}

      {currentStep && isNavigating && (
        <p className="text-xs text-slate-500">
          Langkah {currentStepIndex + 1} dari {route.steps.length}:{' '}
          <span className="text-slate-700 font-medium">
            {instructionToIndonesian(currentStep)}
          </span>
        </p>
      )}

      <div className="flex gap-2">
        {!isNavigating ? (
          <button
            type="button"
            onClick={onStart}
            disabled={!speechOk}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 shadow-lg shadow-emerald-600/25"
          >
            <Navigation2 className="h-4 w-4" />
            Mulai perjalanan
          </button>
        ) : (
          <button
            type="button"
            onClick={onStop}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-500"
          >
            <Square className="h-4 w-4" />
            Akhiri navigasi
          </button>
        )}
        <button
          type="button"
          onClick={onToggleMute}
          className={`rounded-xl px-4 py-3 border-2 ${
            muted
              ? 'border-slate-300 text-slate-500 bg-slate-100'
              : 'border-cyan-500 text-cyan-700 bg-cyan-50'
          }`}
          title={muted ? 'Nyalakan suara' : 'Bisukan'}
          aria-label={muted ? 'Nyalakan suara' : 'Bisukan'}
        >
          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
      </div>

      {!isNavigating && (
        <p className="text-[11px] text-slate-400 text-center">
          Menuju <strong className="text-slate-600">{destinationTitle}</strong> · izinkan GPS
          saat diminta
        </p>
      )}
    </div>
  )
}
