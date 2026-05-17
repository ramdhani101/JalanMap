import type { TravelJournalEntry } from '../types'

export const SAMPLE_JOURNAL: TravelJournalEntry[] = [
  {
    id: 'journal-bromo',
    type: 'photo',
    title: 'Sunrise Bromo',
    caption: 'Kabut pagi di Penanjakan — jaket tebal wajib, kamera basah oleh embun.',
    location: 'Bromo, Jawa Timur',
    photoUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    createdAt: '2025-03-12T04:30:00Z',
  },
  {
    id: 'journal-raja',
    type: 'video',
    title: 'Snorkel Piaynemo',
    caption: 'Rekaman drone dan snorkeling — air jernih, pulau karst dari atas.',
    location: 'Raja Ampat, Papua Barat',
    videoUrl: 'https://www.youtube.com/watch?v=6v2L2UGZJAM',
    createdAt: '2025-02-18T10:00:00Z',
  },
  {
    id: 'journal-nyepi',
    type: 'note',
    title: 'Catatan Nyepi',
    caption:
      'H-2 stok makanan di hotel. Ogoh-ogoh malam sebelum sunyi — seluruh pulau berhenti 24 jam. Bandara tutup, rencanakan transport jauh hari.',
    location: 'Denpasar, Bali',
    createdAt: '2025-03-14T08:00:00Z',
  },
  {
    id: 'journal-ubud',
    type: 'photo',
    title: 'Senja di Ubud',
    caption: 'Remote work di cafe — WiFi stabil, hujan sore turun perlahan.',
    location: 'Ubud, Bali',
    photoUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    createdAt: '2025-03-20T15:45:00Z',
  },
  {
    id: 'journal-toba',
    type: 'note',
    title: 'Api unggun Samosir',
    caption: 'Malam minggu di tepi Danau Toba. Sewa tenda Rp 75rb, suhu dingin setelah jam 9.',
    location: 'Samosir, Sumatera Utara',
    createdAt: '2025-05-02T20:00:00Z',
  },
]
