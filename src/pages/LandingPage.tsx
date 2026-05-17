import { Link } from 'react-router-dom'
import {
  Map,
  Tent,
  Coffee,
  UtensilsCrossed,
  Route,
  PlayCircle,
  ArrowRight,
  Mountain,
  Star,
} from 'lucide-react'

const features = [
  {
    icon: Map,
    title: 'Peta Indonesia + Mapillary',
    desc: 'Peta interaktif Nusantara dengan layer foto jalan Mapillary dan street view di setiap lokasi.',
  },
  {
    icon: PlayCircle,
    title: 'Catatan + Video YouTube',
    desc: 'Sematkan link vlog jalan-jalan atau dokumentasi foto di setiap titik lokasi favoritmu.',
  },
  {
    icon: Tent,
    title: 'Spot Camping',
    desc: 'Tandai base camp, area tenda, dan lokasi berkemah yang sudah kamu coba atau rekomendasikan.',
  },
  {
    icon: Route,
    title: 'Rest Area',
    desc: 'Simpan rest area tol, SPBU, dan tempat istirahat penting untuk perjalanan darat.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Kuliner & Warung',
    desc: 'Warung makan legendaris, restoran, dan hidden gem kuliner lokal — semua terpin di peta.',
  },
  {
    icon: Coffee,
    title: 'Cafe & Ngopi',
    desc: 'Temukan cafe untuk remote work atau sekadar recharge sebelum lanjut perjalanan.',
  },
]

const steps = [
  { n: '01', title: 'Buka Dashboard', text: 'Masuk ke peta Indonesia dengan coverage Mapillary & OpenStreetMap.' },
  { n: '02', title: 'Jelajahi Pin', text: 'Filter camping, rest area, warung, cafe, atau catatan perjalanan.' },
  { n: '03', title: 'Tambah Lokasimu', text: 'Klik peta, isi detail, sematkan link YouTube — simpan otomatis di browser.' },
]

export function LandingPage() {
  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.35),transparent)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300 mb-6">
              <Mountain className="h-4 w-4" />
              Untuk para penjelajah Nusantara
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Petakan{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                setiap perjalanan
              </span>{' '}
              di Indonesia
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl">
              JalanMap membantu traveler dan hobbyis jalan-jalan menyimpan catatan lokasi, video
              YouTube, spot camping, rest area, warung makan, cafe — semuanya di satu peta
              interaktif.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-cyan-500/30 hover:from-cyan-400 hover:to-teal-400 transition-all"
              >
                Mulai Jelajahi Peta
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#fitur"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-8 py-4 text-base font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition-all"
              >
                Lihat Fitur
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                10+ lokasi contoh
              </span>
              <span>•</span>
              <span>Mapillary API</span>
              <span>•</span>
              <span>Gratis di browser</span>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"
          aria-hidden
        />
      </section>

      {/* Features */}
      <section id="fitur" className="py-24 bg-slate-950 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Semua yang traveler butuhkan</h2>
            <p className="mt-4 text-slate-400">
              Dari catatan pribadi sampai rekomendasi tempat makan — terorganisir per kategori di
              peta.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-cyan-500/40 hover:bg-slate-900 transition-all"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Cara pakai</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative text-center md:text-left">
                <span className="text-5xl font-black text-cyan-500/20">{s.n}</span>
                <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-700 p-10 sm:p-14 text-center shadow-2xl shadow-cyan-900/40">
            <h2 className="text-2xl sm:text-3xl font-bold">Siap menandai jejak perjalananmu?</h2>
            <p className="mt-3 text-cyan-100 max-w-lg mx-auto">
              Buka dashboard, tambahkan pin pertama, dan bagikan cerita perjalanan lewat video
              YouTube.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-teal-800 hover:bg-cyan-50 transition-colors"
            >
              Buka Dashboard Peta
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>JalanMap — Peta perjalanan Indonesia untuk para penjelajah</p>
      </footer>
    </div>
  )
}
