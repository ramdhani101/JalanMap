import { useCallback, useEffect, useState } from 'react'
import { SAMPLE_JOURNAL } from '../data/sampleJournal'
import type { JournalMediaType, TravelJournalEntry } from '../types'

const STORAGE_KEY = 'travelmap-journal'

function loadJournal(): TravelJournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as TravelJournalEntry[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    /* ignore */
  }
  return SAMPLE_JOURNAL
}

function saveJournal(entries: TravelJournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function useTravelJournal() {
  const [entries, setEntries] = useState<TravelJournalEntry[]>(loadJournal)

  useEffect(() => {
    saveJournal(entries)
  }, [entries])

  const addEntry = useCallback(
    (entry: Omit<TravelJournalEntry, 'id' | 'createdAt'>) => {
      const newEntry: TravelJournalEntry = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setEntries((prev) => [newEntry, ...prev])
      return newEntry
    },
    [],
  )

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const resetToSample = useCallback(() => {
    setEntries(SAMPLE_JOURNAL)
  }, [])

  const filterByType = useCallback(
    (type: JournalMediaType | 'all') => {
      if (type === 'all') return entries
      return entries.filter((e) => e.type === type)
    },
    [entries],
  )

  return { entries, addEntry, deleteEntry, resetToSample, filterByType }
}
