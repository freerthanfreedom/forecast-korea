'use client'

import { useEffect } from 'react'

interface AdSlotProps {
  slot?: string
  format?: 'auto' | 'rectangle' | 'banner'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdSlot({
  slot = 'auto',
  format = 'auto',
  className = '',
}: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!clientId) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [clientId])

  if (!clientId) {
    return (
      <div
        className={`bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center text-xs text-muted-foreground ${className}`}
        style={{ minHeight: 90 }}
      >
        광고 영역
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
