import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

const displayFont = { fontFamily: "'Instrument Serif', serif" }

function LiquidGlassButton({
  children,
  className,
  asChild,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      asChild={asChild}
      className={cn(
        'liquid-glass rounded-full text-foreground hover:bg-transparent hover:scale-[1.03]',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <header className="relative z-10 mx-auto flex max-w-7xl flex-row items-center justify-between px-8 py-6">
        <Link
          to="/"
          className="text-3xl tracking-tight text-foreground"
          style={displayFont}
        >
          JalanMap<sup className="text-xs align-super">®</sup>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <LiquidGlassButton size="nav" asChild>
            <Link to="/dashboard">Daftar</Link>
          </LiquidGlassButton>
          <Link
            to="/dashboard"
            className="liquid-glass inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]"
          >
            Masuk
          </Link>
        </div>
      </header>

      <section className="relative z-10 flex flex-col items-center px-6 py-[90px] pt-32 pb-40 text-center">
        <h1
          className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] sm:text-7xl md:text-8xl"
          style={displayFont}
        >
          Di mana{' '}
          <em className="not-italic text-muted-foreground">mimpi</em> menembus{' '}
          <em className="not-italic text-muted-foreground">keheningan jalan.</em>
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Kami merancang ruang digital untuk penjelajah Nusantara — simpan catatan, video
          perjalanan, spot camping, dan rute di satu peta yang tenang dan fokus.
        </p>

        <LiquidGlassButton
          size="hero"
          className="animate-fade-rise-delay-2 mt-12 cursor-pointer"
          asChild
        >
          <Link to="/dashboard">Mulai Perjalanan</Link>
        </LiquidGlassButton>
      </section>
    </main>
  )
}
