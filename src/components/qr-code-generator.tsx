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
      // Create canvas for download - ATM Card Format (HD - 2x scale)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // HD Resolution - 2x scale for crisp output
      const scale = 2
      const baseWidth = 600
      const baseHeight = 320
      canvas.width = baseWidth * scale
      canvas.height = baseHeight * scale
      
      // Scale all drawing operations
      ctx.scale(scale, scale)

      // Use base dimensions for all drawing (scale handles the HD output)
      const width = baseWidth
      const height = baseHeight

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

      // Left section width (for QR code area)
      const leftSectionWidth = 200

      // Left section: Light green background
      ctx.fillStyle = '#E8F5E9'
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, leftSectionWidth, cardHeight, [radius, 0, 0, radius])
      ctx.fill()

      // SI-PANDA text above QR code
      ctx.fillStyle = '#1B5E20'
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SI-PANDA', cardX + leftSectionWidth / 2, cardY + 35)

      // Subtitle under SI-PANDA
      ctx.fillStyle = '#66BB6A'
      ctx.font = '9px Inter, sans-serif'
      ctx.fillText('Pemantau Gizi Anak', cardX + leftSectionWidth / 2, cardY + 50)

      // QR Code Section (centered in left section, below title)
      const qrSize = 130
      const qrX = cardX + (leftSectionWidth - qrSize) / 2
      const qrY = cardY + 65

      // QR Background (white)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 8)
      ctx.fill()

      // "Scan untuk melihat data" text below QR
      ctx.fillStyle = '#757575'
      ctx.font = '9px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Scan untuk lihat data', cardX + leftSectionWidth / 2, qrY + qrSize + 20)

      // Right side content
      const rightX = cardX + leftSectionWidth + 24
      const contentWidth = cardWidth - leftSectionWidth - 48

      // Title
      ctx.fillStyle = '#1B5E20'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('Kartu Pemantauan Gizi', rightX, cardY + 40)

      // Subtitle
      ctx.fillStyle = '#9E9E9E'
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText('Desa Kramat', rightX, cardY + 58)

      // Divider line
      ctx.strokeStyle = '#E0E0E0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(rightX, cardY + 72)
      ctx.lineTo(rightX + contentWidth, cardY + 72)
      ctx.stroke()

      // Child Name Label
      ctx.fillStyle = '#9E9E9E'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('NAMA BALITA', rightX, cardY + 95)

      // Child Name Value
      ctx.fillStyle = '#212121'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.fillText(childName || '-', rightX, cardY + 118)

      // Posyandu Label
      ctx.fillStyle = '#9E9E9E'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('POSYANDU', rightX, cardY + 150)

      // Posyandu Value
      ctx.fillStyle = '#212121'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillText(posyanduName || '-', rightX, cardY + 170)

      // Instruction box
      ctx.fillStyle = '#FFF8E1'
      ctx.beginPath()
      ctx.roundRect(rightX, cardY + 195, contentWidth, 45, 8)
      ctx.fill()

      ctx.fillStyle = '#F57C00'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('📱 Scan QR Code di samping untuk', rightX + contentWidth / 2, cardY + 213)
      ctx.fillText('melihat data kesehatan anak', rightX + contentWidth / 2, cardY + 227)

      // Footer - just Copyright, no date
      ctx.fillStyle = '#BDBDBD'
      ctx.font = '9px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('© SI-PANDA Desa Kramat', rightX, cardY + cardHeight - 15)

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
