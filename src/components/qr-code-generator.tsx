'use client'

import QRCode from 'react-qr-code'
import { useEffect, useState, useRef } from 'react'

interface QRCodeGeneratorProps {
  text: string
  childName?: string
  posyanduName?: string
}

export default function QRCodeGenerator({ text, childName, posyanduName }: QRCodeGeneratorProps) {
  const [mounted, setMounted] = useState(false)
  const [url, setUrl] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const origin = window.location.origin
    setUrl(`${origin}/public/anak/${text}`)
  }, [text])

  const handleDownload = async () => {
    if (!qrRef.current) return
    setIsDownloading(true)

    try {
      // Create canvas for download
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size for high quality
      const width = 400
      const height = 520
      canvas.width = width
      canvas.height = height

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#e8f5e9')
      gradient.addColorStop(1, '#c8e6c9')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add decorative circles
      ctx.fillStyle = 'rgba(76, 175, 80, 0.1)'
      ctx.beginPath()
      ctx.arc(-30, -30, 120, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(width + 30, height + 30, 150, 0, Math.PI * 2)
      ctx.fill()

      // White card background
      const cardX = 20
      const cardY = 20
      const cardWidth = width - 40
      const cardHeight = height - 40
      const radius = 16

      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetY = 4
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, radius)
      ctx.fill()
      ctx.shadowColor = 'transparent'

      // Header bar with gradient
      const headerGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY)
      headerGradient.addColorStop(0, '#2E7D32')
      headerGradient.addColorStop(1, '#43A047')
      ctx.fillStyle = headerGradient
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardWidth, 60, [radius, radius, 0, 0])
      ctx.fill()

      // Header text - SI-PANDA
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SI-PANDA', width / 2, cardY + 28)
      
      ctx.font = '11px Inter, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillText('Sistem Informasi Pemantau Gizi Anak Desa', width / 2, cardY + 46)

      // Posyandu name badge
      if (posyanduName) {
        ctx.fillStyle = '#FFF3E0'
        const badgeWidth = 160
        const badgeX = (width - badgeWidth) / 2
        ctx.beginPath()
        ctx.roundRect(badgeX, cardY + 75, badgeWidth, 28, 14)
        ctx.fill()
        
        ctx.fillStyle = '#E65100'
        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.fillText(posyanduName, width / 2, cardY + 94)
      }

      // Child name
      if (childName) {
        ctx.fillStyle = '#1B5E20'
        ctx.font = 'bold 16px Inter, sans-serif'
        ctx.fillText(childName, width / 2, cardY + 130)
      }

      // QR Code - render from SVG
      const svgElement = qrRef.current.querySelector('svg')
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const img = new Image()
        img.onload = () => {
          // QR Code border
          ctx.fillStyle = '#f5f5f5'
          ctx.beginPath()
          ctx.roundRect((width - 180) / 2, cardY + 145, 180, 180, 12)
          ctx.fill()
          
          // Draw QR code
          ctx.drawImage(img, (width - 160) / 2, cardY + 155, 160, 160)
          
          // Instruction text
          ctx.fillStyle = '#757575'
          ctx.font = '12px Inter, sans-serif'
          ctx.fillText('Scan QR Code untuk melihat', width / 2, cardY + 355)
          ctx.fillText('data kesehatan anak', width / 2, cardY + 372)

          // Footer
          ctx.fillStyle = '#BDBDBD'
          ctx.font = '10px Inter, sans-serif'
          ctx.fillText('© SI-PANDA Desa Kramat', width / 2, cardY + 420)
          ctx.fillText(new Date().toLocaleDateString('id-ID'), width / 2, cardY + 435)

          // Download
          const link = document.createElement('a')
          link.download = `QR_${childName?.replace(/\s+/g, '_') || 'anak'}_${posyanduName?.replace(/\s+/g, '_') || 'posyandu'}.png`
          link.href = canvas.toDataURL('image/png')
          link.click()
          
          URL.revokeObjectURL(svgUrl)
          setIsDownloading(false)
        }
        img.src = svgUrl
      }
    } catch (error) {
      console.error('Download error:', error)
      setIsDownloading(false)
    }
  }

  if (!mounted) return <div className="w-32 h-32 bg-gray-100 animate-pulse rounded-xl"></div>

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={qrRef} className="bg-white p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
        <QRCode value={url} size={128} />
        <p className="text-center text-xs text-gray-400 mt-2 font-mono">Scan untuk melihat</p>
      </div>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        {isDownloading ? 'Mengunduh...' : 'Unduh QR Code'}
      </button>
    </div>
  )
}
