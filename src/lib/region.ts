/** Deteksi wilayah dari alamat / nama untuk konten budaya */
export function detectRegion(text: string): string | undefined {
  const t = text.toLowerCase()
  const map: [string, string][] = [
    ['bali', 'Bali'],
    ['denpasar', 'Bali'],
    ['ubud', 'Bali'],
    ['kuta', 'Bali'],
    ['yogyakarta', 'DI Yogyakarta'],
    ['jogja', 'DI Yogyakarta'],
    ['jakarta', 'DKI Jakarta'],
    ['bandung', 'Jawa Barat'],
    ['surabaya', 'Jawa Timur'],
    ['bromo', 'Jawa Timur'],
    ['probolinggo', 'Jawa Timur'],
    ['toraja', 'Sulawesi Selatan'],
    ['makassar', 'Sulawesi Selatan'],
    ['raja ampat', 'Papua Barat'],
    ['labuan bajo', 'Nusa Tenggara Timur'],
    ['lombok', 'Nusa Tenggara Barat'],
    ['sumatera', 'Sumatera'],
    ['samosir', 'Sumatera Utara'],
    ['kalimantan', 'Kalimantan'],
    ['papua', 'Papua'],
  ]
  for (const [key, region] of map) {
    if (t.includes(key)) return region
  }
  return undefined
}

export function placeContextRegion(ctx: {
  region?: string
  address?: string
  title?: string
  subtitle?: string
}): string | undefined {
  return (
    ctx.region ||
    detectRegion(ctx.address ?? '') ||
    detectRegion(ctx.subtitle ?? '') ||
    detectRegion(ctx.title ?? '')
  )
}
