'use client'

import QRCode from 'react-qr-code'
import { useEffect, useState, useRef } from 'react'

interface QRCodeGeneratorProps {
  text: string
  childName?: string
  posyanduName?: string
  gender?: 'LAKI_LAKI' | 'PEREMPUAN'
  dateOfBirth?: Date | string
  parentName?: string
}

export default function QRCodeGenerator({ 
  text, 
  childName, 
  posyanduName, 
  gender, 
  dateOfBirth,
  parentName 
}: QRCodeGeneratorProps) {
  const [mounted, setMounted] = useState(false)
  const [url, setUrl] = useState('')
  const [isDownloadingFront, setIsDownloadingFront] = useState(false)
  const [isDownloadingBack, setIsDownloadingBack] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const origin = window.location.origin
    setUrl(`${origin}/public/anak/${text}`)
  }, [text])

  const formatDate = (date: string | Date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getThemeColors = () => {
    if (gender === 'LAKI_LAKI') {
      return {
        primary: '#1565C0', // Blue 800
        secondary: '#E3F2FD', // Blue 50
        accent: '#2196F3', // Blue 500
        gradientStart: '#E3F2FD',
        gradientEnd: '#BBDEFB',
      }
    } else {
      return {
        primary: '#AD1457', // Pink 800
        secondary: '#FCE4EC', // Pink 50
        accent: '#E91E63', // Pink 500
        gradientStart: '#FCE4EC',
        gradientEnd: '#F8BBD0',
      }
    }
  }

  const drawBaseCard = (ctx: CanvasRenderingContext2D, width: number, height: number, theme: any) => {
     // Background gradient
     const gradient = ctx.createLinearGradient(0, 0, width, height)
     gradient.addColorStop(0, theme.gradientStart)
     gradient.addColorStop(1, theme.gradientEnd)
     ctx.fillStyle = gradient
     ctx.fillRect(0, 0, width, height)

     // Decorative circles
     const circleColor = gender === 'LAKI_LAKI' ? 'rgba(33, 150, 243, 0.05)' : 'rgba(233, 30, 99, 0.05)'
     ctx.fillStyle = circleColor
     ctx.beginPath()
     ctx.arc(-50, -50, 150, 0, Math.PI * 2)
     ctx.fill()
     ctx.beginPath()
     ctx.arc(width + 50, height + 50, 180, 0, Math.PI * 2)
     ctx.fill()

     // Card Border/Frame
     const cardX = 16
     const cardY = 16
     const cardWidth = width - 32
     const cardHeight = height - 32
     const radius = 16

     ctx.fillStyle = '#ffffff'
     ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
     ctx.shadowBlur = 10
     ctx.shadowOffsetY = 4
     ctx.beginPath()
     ctx.roundRect(cardX, cardY, cardWidth, cardHeight, radius)
     ctx.fill()
     ctx.shadowColor = 'transparent'
     
     return { cardX, cardY, cardWidth, cardHeight }
  }

  const handleDownloadFront = async () => {
    setIsDownloadingFront(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scale = 2
      const baseWidth = 500 // Standard ID Card ratio equivalent
      const baseHeight = 315
      canvas.width = baseWidth * scale
      canvas.height = baseHeight * scale
      ctx.scale(scale, scale)

      const theme = getThemeColors()
      const { cardX, cardY, cardWidth, cardHeight } = drawBaseCard(ctx, baseWidth, baseHeight, theme)

      // === HEADER ===
      // Colored Header Bar
      ctx.fillStyle = theme.primary
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardWidth, 60, [16, 16, 0, 0])
      ctx.fill()

      // Header Text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('KARTU IDENTITAS ANAK', baseWidth / 2, cardY + 28)
      
      ctx.font = '12px Inter, sans-serif'
      ctx.fillText(`POSYANDU ${posyanduName?.toUpperCase() || '-'}`, baseWidth / 2, cardY + 48)

      // === CONTENT ===
      const contentY = cardY + 85
      
      // Avatar Placeholder (Left)
      const avatarX = cardX + 40
      const avatarY = contentY + 40
      const avatarRadius = 45

      ctx.save()
      ctx.beginPath()
      ctx.arc(avatarX + avatarRadius, avatarY, avatarRadius, 0, Math.PI * 2)
      ctx.fillStyle = theme.secondary
      ctx.fill()
      ctx.clip()

      // Initial if no image
      ctx.fillStyle = theme.accent
      ctx.font = 'bold 40px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(childName?.charAt(0).toUpperCase() || 'A', avatarX + avatarRadius, avatarY)
      ctx.restore()

      // Info Fields (Right)
      const labelX = cardX + 130
      const valueX = labelX
      let currentY = contentY + 10
      const lineHeight = 38

      // Name
      ctx.fillStyle = '#757575'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('NAMA LENGKAP', labelX, currentY)
      
      ctx.fillStyle = '#212121'
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.fillText(childName || '-', valueX, currentY + 18)

      currentY += lineHeight

      // TTL
      ctx.fillStyle = '#757575'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('TANGGAL LAHIR', labelX, currentY)

      ctx.fillStyle = '#212121'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillText(dateOfBirth ? formatDate(dateOfBirth) : '-', valueX, currentY + 18)

      currentY += lineHeight

      // Parent
      ctx.fillStyle = '#757575'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('NAMA ORANG TUA', labelX, currentY)

      ctx.fillStyle = '#212121'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillText(parentName || '-', valueX, currentY + 18)

      // Gender Icon/Badge on bottom right
      ctx.fillStyle = theme.secondary
      ctx.beginPath()
      ctx.roundRect(cardX + cardWidth - 90, cardY + cardHeight - 30, 80, 24, 12)
      ctx.fill()

      ctx.fillStyle = theme.primary
      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(gender === 'LAKI_LAKI' ? 'LAKI-LAKI' : 'PEREMPUAN', cardX + cardWidth - 50, cardY + cardHeight - 14)


      // Download
      const link = document.createElement('a')
      link.download = `Kartu_Depan_${childName?.replace(/\s+/g, '_') || 'anak'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

    } catch (e) {
      console.error(e)
    } finally {
      setIsDownloadingFront(false)
    }
  }

  const handleDownloadBack = async () => {
    if (!qrRef.current) return
    setIsDownloadingBack(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scale = 2
      const baseWidth = 500
      const baseHeight = 315
      canvas.width = baseWidth * scale
      canvas.height = baseHeight * scale
      ctx.scale(scale, scale)

      const theme = getThemeColors()
      const { cardX, cardY, cardWidth, cardHeight } = drawBaseCard(ctx, baseWidth, baseHeight, theme)

      // QR Code Section
      // Center the QR code
      const qrSize = 140
      const qrX = cardX + (cardWidth - qrSize) / 2
      const qrY = cardY + (cardHeight - qrSize) / 2 - 20

      // White box for QR
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0,0,0,0.05)'
      ctx.shadowBlur = 4
      ctx.beginPath()
      ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12)
      ctx.fill()
      ctx.shadowColor = 'transparent'

      // Render QR SVG
      const svgElement = qrRef.current.querySelector('svg')
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const img = new Image()
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = svgUrl
        })
        
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize)
        URL.revokeObjectURL(svgUrl)
      }

      // Title
      ctx.fillStyle = theme.primary
      ctx.font = 'bold 20px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SI-PANDA', baseWidth / 2, cardY + 35)

      ctx.fillStyle = '#757575'
      ctx.font = '12px Inter, sans-serif'
      ctx.fillText('Sistem Informasi Pemantauan Anak Daerah', baseWidth / 2, cardY + 55)

      // Instructions bottom
      ctx.fillStyle = '#424242'
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Scan QR Code ini untuk melihat', baseWidth / 2, cardY + cardHeight - 45)
      ctx.fillText('riwayat kesehatan dan pertumbuhan anak', baseWidth / 2, cardY + cardHeight - 30)

      // Copyright
      ctx.fillStyle = '#9E9E9E'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('© SI-PANDA Desa Kramat', baseWidth / 2, cardY + cardHeight - 10)


      // Download
      const link = document.createElement('a')
      link.download = `Kartu_Belakang_${childName?.replace(/\s+/g, '_') || 'anak'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

    } catch (e) {
      console.error(e)
    } finally {
      setIsDownloadingBack(false)
    }
  }

  if (!mounted) return <div className="w-32 h-32 bg-gray-100 animate-pulse rounded-xl"></div>

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={qrRef} className="bg-white p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
        <QRCode value={url} size={128} />
        <p className="text-center text-xs text-gray-400 mt-2 font-mono">Scan untuk melihat</p>
      </div>
      
      <div className="flex gap-2 w-full">
        <button
          onClick={handleDownloadFront}
          disabled={isDownloadingFront}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
        >
          {isDownloadingFront ? (
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">badge</span>
          )}
          <span>Depan</span>
        </button>

        <button
          onClick={handleDownloadBack}
          disabled={isDownloadingBack}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isDownloadingBack ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
             <span className="material-symbols-outlined text-[18px]">qr_code</span>
          )}
          <span>Belakang</span>
        </button>
      </div>
    </div>
  )
}
