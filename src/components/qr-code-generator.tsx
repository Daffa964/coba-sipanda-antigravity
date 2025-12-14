'use client'

import QRCode from 'react-qr-code'
import { useEffect, useState } from 'react'

export default function QRCodeGenerator({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setMounted(true)
    // Use window location to get host
    const origin = window.location.origin
    setUrl(`${origin}/public/anak/${text}`)
  }, [text])

  if (!mounted) return <div className="w-32 h-32 bg-gray-100 animate-pulse rounded-xl"></div>

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
      <QRCode value={url} size={128} />
      <p className="text-center text-xs text-gray-400 mt-2 font-mono">Scan untuk melihat</p>
    </div>
  )
}
