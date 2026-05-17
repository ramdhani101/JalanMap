import type { RegionalCulture } from '../types'

export const REGIONAL_CULTURE: RegionalCulture[] = [
  {
    region: 'Bali',
    tagline: 'Tri Hita Karana — harmoni manusia, alam, dan Tuhan',
    highlights: [
      'Setiap desa punya pura (pura desa & pura dalem)',
      'Banyak upacara adat; wisatawan diharapkan sopan & pakai kain saat ke pura',
      'Sistem desa adat (banjar) mengatur gotong royong',
    ],
    customs: [
      {
        title: 'Adat di Pura',
        body: 'Pakai kain saput/selendang, ikat pinggang, dan baju sopan. Wanita haid tidak masuk area suci tertentu.',
      },
      {
        title: 'Sesajen & Prosesi',
        body: 'Jangan mengganggu atau memfoto dekat dengan tidak sopan saat upacara. Hormati penjor dan banten.',
      },
      {
        title: 'Bahasa & Sapaan',
        body: '“Om Swastiastu” sebagai salam. Banyak lokasi ramah wisatawan dengan penjelasan dalam Bahasa Indonesia.',
      },
    ],
    events: [
      {
        title: 'Hari Raya Nyepi (Tahun Baru Saka)',
        schedule: 'Tahunan — sekitar Maret/April (1 hari penuh)',
        type: 'annual',
        body: 'Hari sunyi: TIDAK ada aktivitas di jalan, bandara tutup, pantai & jalan dilarang dilalui. Hotel mengatur tamu tetap di area. Siang sebelumnya ada ogoh-ogoh (Ngrupuk). Rencanakan transport & stok makanan jauh hari.',
      },
      {
        title: 'Galungan & Kuningan',
        schedule: 'Tahunan — siklus 210 hari (sekitar 6 bulan sekali)',
        type: 'annual',
        body: 'Galungan: kemenangan dharma. Kuningan (10 hari setelah): penutupan. Banyak penjor di jalan, lalu lintas padat ke pura. Restoran tetap buka di area wisata, tapi pura sangat ramai.',
      },
      {
        title: 'Upacara Piodalan Pura',
        schedule: 'Bulanan/tahunan per pura (kalender Bali)',
        type: 'monthly',
        body: 'Setiap pura besar punya ulang tahun. Pura Besakih, Uluwatu, Tanah Lot ramai saat piodalan. Cek kalender pariwisata Bali sebelum berkunjung.',
      },
      {
        title: 'Melasti & Hari Raya Saraswati',
        schedule: 'Tahunan (biasanya sebelum Nyepi)',
        type: 'annual',
        body: 'Melasti: pembersihan ke pantai. Saraswati: hari pengetahuan — banyak sekolah & perpustakaan dihormati.',
      },
    ],
  },
  {
    region: 'DI Yogyakarta',
    tagline: 'Kota budaya, keraton, dan tradisi Jawa',
    highlights: ['Keraton Yogyakarta', 'Seni batik & wayang', 'Gudeg & angkringan'],
    customs: [
      {
        title: 'Etika di Keraton',
        body: 'Pakai pakaian sopan; ikuti aturan guide. Banyak area sensitif secara budaya.',
      },
    ],
    events: [
      {
        title: 'Sekaten & Grebeg Maulud',
        schedule: 'Tahunan — sekitar Maulid Nabi',
        type: 'annual',
        body: 'Pasar malam alun-alun utara & pasar sekaten. Ramai, cocok untuk kuliner tradisional.',
      },
      {
        title: 'Labuh Pantai Selatan',
        schedule: 'Tahunan',
        type: 'annual',
        body: 'Upacara keraton ke laut selatan. Pantai Parangkusumo & area sekitar bisa padat.',
      },
    ],
  },
  {
    region: 'Jawa Timur',
    tagline: 'Dari Bromo hingga kuliner pedas',
    highlights: ['Tengger & Bromo', 'Kota tua Surabaya', 'Rawon & rujak cingur'],
    customs: [
      {
        title: 'Adat Tengger',
        body: 'Masyarakat Tengger di Bromo punya ritual Yadnya Kasada. Wisatawan datang subuh untuk sunrise — bawa jaket tebal.',
      },
    ],
    events: [
      {
        title: 'Yadnya Kasada (Bromo)',
        schedule: 'Tahunan — biasanya Juni/Juli',
        type: 'annual',
        body: 'Upacara persembahan ke kawah Bromo. Area sangat ramai; booking penginapan & jeep jauh hari.',
      },
    ],
  },
  {
    region: 'Sulawesi Selatan',
    tagline: 'Tanah Toraja & ritual kematian yang unik',
    highlights: ['Rumah tongkonan', 'Pemakaman batu', 'Kopi Toraja'],
    customs: [
      {
        title: 'Rambu Solo',
        body: 'Upacara pemakaman megah bisa berlangsung berhari-hari. Hormati keluarga almarhum; foto hanya jika diizinkan.',
      },
    ],
    events: [
      {
        title: 'Rambu Solo (musim pemakaman)',
        schedule: 'Juli–September (puncak, bisa variasi)',
        type: 'annual',
        body: 'Banyak wisatawan etnografi; akomodasi Rantepao penuh. Gunakan guide lokal.',
      },
    ],
  },
  {
    region: 'Nusa Tenggara Timur',
    tagline: 'Komodo, Labuan Bajo, dan petualangan timur',
    highlights: ['Taman Komodo', 'Pantai pink', 'Sunset Labuan Bajo'],
    customs: [
      {
        title: 'Adat Flores',
        body: 'Kampung adat Wae Rebo & Caci (tari cambuk) — butuh izin komunitas untuk kunjungan.',
      },
    ],
    events: [
      {
        title: 'Festival Komodo & Sail Labuan Bajo',
        schedule: 'Tahunan (cek jadwal Kemenparekraf)',
        type: 'annual',
        body: 'Lonjakan wisatawan; booking kapal & hotel lebih awal.',
      },
    ],
  },
]

export function getCultureForRegion(region?: string): RegionalCulture | null {
  if (!region) return null
  return REGIONAL_CULTURE.find((r) => r.region === region) ?? null
}
