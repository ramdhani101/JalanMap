import { useEffect, useRef, type ReactNode } from 'react'

interface MapHeroNavDropdownProps {
  open: boolean
  onClose: () => void
  align?: 'left' | 'center'
  children: ReactNode
  className?: string
}

export function MapHeroNavDropdown({
  open,
  onClose,
  align = 'left',
  children,
  className = '',
}: MapHeroNavDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={`absolute top-[calc(100%+8px)] z-50 min-w-[280px] overflow-hidden rounded-xl border border-white/70 bg-white/75 py-1 shadow-xl backdrop-blur-xl ${align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} ${className}`}
      style={{ color: '#000000' }}
    >
      {children}
    </div>
  )
}
