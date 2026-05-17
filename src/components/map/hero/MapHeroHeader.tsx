import { Star } from 'lucide-react'

interface MapHeroHeaderProps {
  collapsed?: boolean
}

export function MapHeroHeader({ collapsed }: MapHeroHeaderProps) {
  if (collapsed) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-2 px-6 pb-2 lg:px-[120px]">
        <h1 className="font-fustat text-center text-2xl font-bold leading-none tracking-[-1.44px] text-[#000000]">
          Jelajahi Indonesia
        </h1>
      </div>
    )
  }

  return (
    <div className="-mt-[50px] flex shrink-0 flex-col items-center gap-[34px] px-6 lg:px-[120px]">
      <div
        className="flex items-center overflow-hidden rounded-lg shadow-sm"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      >
        <span
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-white"
          style={{ backgroundColor: '#0e1311' }}
        >
          <Star className="h-3.5 w-3.5 fill-white" />
          <span className="font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Baru
          </span>
        </span>
        <span
          className="px-3 py-2 text-sm text-[#000000]"
          style={{ backgroundColor: '#f8f8f8', fontFamily: 'Inter, sans-serif' }}
        >
          Temukan kemungkinan perjalanan
        </span>
      </div>

      <div className="flex max-w-[736px] flex-col items-center gap-[34px] text-center">
        <h1 className="font-fustat text-5xl font-bold leading-none tracking-[-4.8px] text-[#000000] sm:text-7xl lg:text-[80px]">
          Jelajahi Indonesia
          <br />
          dengan Cepat
        </h1>
        <p
          className="font-fustat max-w-[542px] text-lg font-medium tracking-[-0.4px] text-[#505050] sm:text-xl"
          style={{ width: 'min(100%, 542px)' }}
        >
          Unggah catatan perjalanan dan dapatkan insight lokasi langsung. Kerja lebih pintar,
          capai tujuan tanpa ribet.
        </p>
      </div>
    </div>
  )
}
