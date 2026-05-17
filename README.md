# JalanMap

Website travel untuk hobbyis jalan-jalan — landing page + dashboard peta Indonesia dengan **Mapillary API** (street-level imagery) dan peta dasar OpenStreetMap.

## Fitur

- **Landing page** — untuk traveler & penjelajah Nusantara
- **Dashboard peta** — MapLibre + layer coverage Mapillary (garis/b titik foto jalan)
- **Street view** — viewer Mapillary otomatis cari foto terdekat (radius 50 m) saat pin dipilih
- **Pin lokasi** — catatan perjalanan + YouTube, camping, rest area, restoran, cafe, warung
- **Penyimpanan lokal** — data di `localStorage`

## Setup

### 1. Mapillary Access Token

1. Buka [Mapillary Developers](https://www.mapillary.com/dashboard/developers)
2. Buat app (misalnya "JalanMap")
3. Salin **Access Token** (format `MLY|...`)

### 2. Environment

```bash
npm install
cp .env.example .env
```

Isi `.env`:

```env
VITE_MAPILLARY_ACCESS_TOKEN=MLY|27009235252076584|your_secret_here
```

> Jangan commit file `.env` ke git. Token dari screenshot chat sebaiknya di-rotate jika pernah terpapar publik.

### 3. Jalankan

```bash
npm run dev
```

Buka http://localhost:5173 → **Buka Peta**

## Penggunaan dashboard

| Aksi | Cara |
|------|------|
| **Cari lokasi apa saja** | Ketik di kotak pencarian (kota, gunung, alamat, negara) → pilih dari dropdown |
| Lihat street view | Klik pin atau hasil pencarian → panel Mapillary di bawah |
| Layer coverage | Toggle **Layer Mapillary** (garis cyan = jalur foto) |
| Tambah lokasi | **Tambah Lokasi** → klik peta, atau cari tempat → **Tambah pin di lokasi ini** |

Pencarian memakai **Photon** + **Nominatim** (OpenStreetMap) — mendukung tempat di seluruh dunia, dengan prioritas wilayah Indonesia.

## Tech stack

- React + TypeScript + Vite + Tailwind CSS v4
- [MapLibre GL JS](https://maplibre.org/) + OpenFreeMap
- [Mapillary API](https://www.mapillary.com/developer/api-documentation) (vector tiles + Graph API)
- [mapillary-js](https://github.com/mapillary/mapillary-js) viewer
