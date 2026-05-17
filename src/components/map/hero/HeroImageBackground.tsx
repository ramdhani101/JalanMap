export function HeroImageBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <img
        src="/hero-mountain-bg.png"
        alt=""
        className="h-full w-full object-cover object-center"
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.42) 35%, rgba(255,255,255,0.62) 70%, rgba(248,248,248,0.88) 100%)',
        }}
      />
    </div>
  )
}
