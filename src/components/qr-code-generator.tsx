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
      // Create canvas for download - ATM Card Format (Landscape)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // ATM Card Size: 85.6mm x 53.98mm ratio ≈ 1.586
      // Using 600x378 for good resolution
      const width = 600
      const height = 340
      canvas.width = width
      canvas.height = height

      // Background gradient (soft green)
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#e8f5e9')
      gradient.addColorStop(1, '#c8e6c9')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Decorative circles
      ctx.fillStyle = 'rgba(76, 175, 80, 0.08)'
      ctx.beginPath()
      ctx.arc(-50, -50, 150, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(width + 50, height + 50, 180, 0, Math.PI * 2)
      ctx.fill()

      // White card background
      const cardX = 16
      const cardY = 16
      const cardWidth = width - 32
      const cardHeight = height - 32
      const radius = 16

      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)'
      ctx.shadowBlur = 16
      ctx.shadowOffsetY = 4
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, radius)
      ctx.fill()
      ctx.shadowColor = 'transparent'

      // Left side: Header bar (vertical strip)
      const headerWidth = 180
      const headerGradient = ctx.createLinearGradient(cardX, cardY, cardX + headerWidth, cardY)
      headerGradient.addColorStop(0, '#1B5E20')
      headerGradient.addColorStop(1, '#2E7D32')
      ctx.fillStyle = headerGradient
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, headerWidth, cardHeight, [radius, 0, 0, radius])
      ctx.fill()

      // SI-PANDA Logo Text (vertical left side)
      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.translate(cardX + 24, cardY + cardHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('SI-PANDA', 0, 0)
      ctx.restore()

      // QR Code Section (left center)
      const qrSize = 140
      const qrX = cardX + 40
      const qrY = cardY + (cardHeight - qrSize) / 2

      // QR Background
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10)
      ctx.fill()

      // Right side content
      const rightX = cardX + headerWidth + 24
      const contentWidth = cardWidth - headerWidth - 48

      // Title
      ctx.fillStyle = '#1B5E20'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('Kartu Pemantauan Gizi', rightX, cardY + 40)

      // Subtitle
      ctx.fillStyle = '#66BB6A'
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText('Sistem Informasi Pemantau Gizi Anak Desa', rightX, cardY + 58)

      // Divider line
      ctx.strokeStyle = '#E8F5E9'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(rightX, cardY + 72)
      ctx.lineTo(rightX + contentWidth, cardY + 72)
      ctx.stroke()

      // Child Name Label
      ctx.fillStyle = '#9E9E9E'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('NAMA ANAK', rightX, cardY + 95)

      // Child Name Value
      ctx.fillStyle = '#212121'
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.fillText(childName || '-', rightX, cardY + 115)

      // Posyandu Label
      ctx.fillStyle = '#9E9E9E'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('POSYANDU', rightX, cardY + 145)

      // Posyandu Value
      ctx.fillStyle = '#212121'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillText(posyanduName || '-', rightX, cardY + 163)

      // Instruction box
      ctx.fillStyle = '#FFF8E1'
      ctx.beginPath()
      ctx.roundRect(rightX, cardY + 185, contentWidth, 50, 8)
      ctx.fill()

      ctx.fillStyle = '#F57C00'
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('📱 Scan QR Code untuk melihat', rightX + contentWidth / 2, cardY + 207)
      ctx.fillText('data kesehatan anak', rightX + contentWidth / 2, cardY + 223)

      // Footer
      ctx.fillStyle = '#BDBDBD'
      ctx.font = '9px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('© SI-PANDA Desa Kramat • ' + new Date().toLocaleDateString('id-ID'), rightX, cardY + cardHeight - 20)

      // QR Code - render from SVG
      const svgElement = qrRef.current.querySelector('svg')
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const img = new Image()
        img.onload = () => {
          // Draw QR code
          ctx.drawImage(img, qrX, qrY, qrSize, qrSize)

          // Download
          const link = document.createElement('a')
          link.download = `Kartu_Gizi_${childName?.replace(/\s+/g, '_') || 'anak'}.png`
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
