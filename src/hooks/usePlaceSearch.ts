import { useEffect, useState } from 'react'
import { searchPlaces } from '../lib/geocoding'
import type { PlaceResult } from '../types'

export function usePlaceSearch(query: string) {
  const [results, setResults] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      searchPlaces(q, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) {
            setResults(data)
            setLoading(false)
          }
        })
        .catch((err: Error) => {
          if (controller.signal.aborted) return
          if (err.name === 'AbortError') return
          setError('Gagal mencari lokasi. Coba lagi.')
          setResults([])
          setLoading(false)
        })
    }, 320)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { results, loading, error }
}
