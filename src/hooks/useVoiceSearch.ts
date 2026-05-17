import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getSpeechRecognitionCtor,
  isSpeechRecognitionSupported,
  transcriptFromResults,
  type SpeechRecognitionLike,
} from '../lib/speechRecognition'

interface UseVoiceSearchOptions {
  lang?: string
  onTranscript: (text: string, isFinal: boolean) => void
}

export function useVoiceSearch({ lang = 'id-ID', onTranscript }: UseVoiceSearchOptions) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const onTranscriptRef = useRef(onTranscript)

  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
  }, [])

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setError('Browser tidak mendukung pencarian suara')
      return
    }

    setError(null)

    try {
      recognitionRef.current?.abort()
    } catch {
      /* ignore */
    }

    const recognition = new Ctor()
    recognitionRef.current = recognition
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      const text = transcriptFromResults(event.results)
      if (!text) return
      const lastIndex = event.results.length - 1
      const isFinal = event.results[lastIndex]?.isFinal ?? false
      onTranscriptRef.current(text, isFinal)
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return
      const messages: Record<string, string> = {
        'not-allowed': 'Izinkan akses mikrofon di browser',
        'service-not-allowed': 'Layanan suara tidak tersedia',
        'network': 'Perlu koneksi internet untuk suara',
        'audio-capture': 'Mikrofon tidak terdeteksi',
      }
      setError(messages[event.error] ?? 'Gagal mendengarkan suara')
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch {
      setError('Tidak bisa memulai mikrofon')
      setListening(false)
    }
  }, [lang])

  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }, [listening, startListening, stopListening])

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort()
      } catch {
        /* ignore */
      }
    }
  }, [])

  return {
    listening,
    error,
    isSupported: isSpeechRecognitionSupported(),
    startListening,
    stopListening,
    toggleListening,
  }
}
