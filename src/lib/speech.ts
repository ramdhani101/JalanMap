let preferredVoice: SpeechSynthesisVoice | null = null

function pickIndonesianVoice(): SpeechSynthesisVoice | null {
  if (preferredVoice) return preferredVoice
  const voices = window.speechSynthesis?.getVoices() ?? []
  preferredVoice =
    voices.find((v) => v.lang.startsWith('id')) ??
    voices.find((v) => v.lang.startsWith('ms')) ??
    voices.find((v) => v.default) ??
    voices[0] ??
    null
  return preferredVoice
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredVoice = null
    pickIndonesianVoice()
  }
}

export function speak(text: string, muted: boolean): void {
  if (muted || typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'id-ID'
  utterance.rate = 0.95
  utterance.pitch = 1
  const voice = pickIndonesianVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
