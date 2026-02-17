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
        background: ['#2962FF', '#1565C0'], // Vivid Blue Gradient
        text: '#FFFFFF',
        textSecondary: '#BBDEFB',
        accent: '#E3F2FD',
        circle: 'rgba(255, 255, 255, 0.1)'
      }
    } else {
      return {
        background: ['#F50057', '#C2185B'], // Vivid Pink Gradient
        text: '#FFFFFF',
        textSecondary: '#F8BBD0',
        accent: '#FCE4EC',
        circle: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }

  const drawBaseCard = (ctx: CanvasRenderingContext2D, width: number, height: number, theme: any) => {
    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, theme.background[0])
    gradient.addColorStop(1, theme.background[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 2. Decorative Circles (Subtle Pattern)
    ctx.fillStyle = theme.circle
    
    // Top Right Large
    ctx.beginPath()
    ctx.arc(width - 40, -40, 200, 0, Math.PI * 2)
    ctx.fill()
    
    // Bottom Left Small
    ctx.beginPath()
    ctx.arc(40, height + 40, 150, 0, Math.PI * 2)
    ctx.fill()

    // 3. Noise/Texture (Optional simple dot pattern)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    for(let i=0; i<width; i+=20) {
      for(let j=0; j<height; j+=20) {
        if((i+j)%40 === 0) {
           ctx.beginPath()
           ctx.arc(i, j, 2, 0, Math.PI*2)
           ctx.fill()
        }
      }
    }
  }

  const handleDownloadCombined = async () => {
    if (!qrRef.current) return
    setIsDownloadingFront(true) // Reusing this state for the combined download
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scale = 2
      const baseWidth = 500
      const baseHeight = 315
      const gap = 40 // Space between front and back
      
      // Canvas size = (Front Width + Gap + Back Width) x Height
      canvas.width = (baseWidth * 2 + gap) * scale
      canvas.height = baseHeight * scale
      ctx.scale(scale, scale)

      // Fill white background for total canvas
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, baseWidth * 2 + gap, baseHeight)

      // === DRAW FRONT (LEFT SIDE) ===
      ctx.save()
      ctx.translate(0, 0) // Front logic assumes (0,0)
      const theme = getThemeColors()
      drawBaseCard(ctx, baseWidth, baseHeight, theme)

      // ... FRONT CONTENT (Copied & adapted from handleDownloadFront) ...
      const headerY = 45
      ctx.fillStyle = theme.text
      ctx.font = 'bold 24px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('KARTU ANAK', baseWidth - 30, headerY)

      const cleanPosyanduName = posyanduName?.replace(/posyandu/gi, '').trim() || '-'
      ctx.fillStyle = theme.textSecondary
      ctx.font = '14px Inter, sans-serif'
      ctx.fillText(`Posyandu ${cleanPosyanduName}`, baseWidth - 30, headerY + 20)

      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(30, headerY + 35)
      ctx.lineTo(baseWidth - 30, headerY + 35)
      ctx.stroke()

      const contentY = 130
      const contentX = 170
      const avatarX = 85
      const avatarY = 165
      const avatarRadius = 55

      // Avatar
      ctx.beginPath()
      ctx.arc(avatarX, avatarY, avatarRadius + 4, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2)
      ctx.fillStyle = theme.accent
      ctx.fill()
      ctx.fillStyle = theme.background[1]
      ctx.font = 'bold 48px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(childName?.charAt(0).toUpperCase() || 'A', avatarX, avatarY + 2)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'

      // Text Data
      const labelSize = '11px'
      const valueSize = '18px'
      const baseGap = 40
      const maxWidth = baseWidth - contentX - 20
      let cursorY = contentY

      const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ')
        let line = ''
        let currentY = y
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' '
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY)
            line = words[i] + ' '
            currentY += lineHeight
          } else {
            line = testLine
          }
        }
        ctx.fillText(line, x, currentY)
        return currentY + lineHeight
      }

      ctx.fillStyle = theme.textSecondary
      ctx.font = `${labelSize} Inter, sans-serif`
      ctx.fillText('NAMA LENGKAP', contentX, cursorY)
      ctx.fillStyle = theme.text
      ctx.font = `bold ${valueSize} Inter, sans-serif`
      const nameEndY = drawWrappedText(childName?.toUpperCase() || '-', contentX, cursorY + 20, maxWidth, 22)
      cursorY = nameEndY + 15

      ctx.fillStyle = theme.textSecondary
      ctx.font = `${labelSize} Inter, sans-serif`
      ctx.fillText('TANGGAL LAHIR', contentX, cursorY)
      ctx.fillStyle = theme.text
      ctx.font = `bold ${valueSize} Inter, sans-serif`
      ctx.fillText(dateOfBirth ? formatDate(dateOfBirth) : '-', contentX, cursorY + 20)
      cursorY += baseGap

      ctx.fillStyle = theme.textSecondary
      ctx.font = `${labelSize} Inter, sans-serif`
      ctx.fillText('ORANG TUA', contentX, cursorY)
      ctx.fillStyle = theme.text
      ctx.font = `bold ${valueSize} Inter, sans-serif`
      drawWrappedText(parentName?.toUpperCase() || '-', contentX, cursorY + 20, maxWidth, 20)

      // Chip
      const chipWidth = 90
      const chipHeight = 24
      const chipX = baseWidth - chipWidth - 30
      const chipY = baseHeight - chipHeight - 25
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.beginPath()
      ctx.roundRect(chipX, chipY, chipWidth, chipHeight, 12)
      ctx.fill()
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(gender === 'LAKI_LAKI' ? 'LAKI-LAKI' : 'PEREMPUAN', chipX + chipWidth/2, chipY + 16)
      
      ctx.restore() // End Front Draw

      // === DRAW CUT LINE (MIDDLE) ===
      ctx.save()
      ctx.translate(baseWidth, 0)
      ctx.strokeStyle = '#BDBDBD'
      ctx.lineWidth = 2
      ctx.setLineDash([10, 10]) // Dashed line
      ctx.beginPath()
      ctx.moveTo(gap / 2, 20)
      ctx.lineTo(gap / 2, baseHeight - 20)
      ctx.stroke()
      
      // Removed "Gunting / Lipat Disini" text as requested
      ctx.restore()

      // === DRAW BACK (RIGHT SIDE) ===
      ctx.save()
      ctx.translate(baseWidth + gap, 0) // Move origin to right side
      drawBaseCard(ctx, baseWidth, baseHeight, theme)

      const cardSize = 240
      const cardX = (baseWidth - cardSize) / 2
      const cardY = (baseHeight - cardSize) / 2 + 10

      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetY = 10
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardSize, cardSize, 24)
      ctx.fill()
      ctx.shadowColor = 'transparent'

      const qrSize = 160
      const qrX = (baseWidth - qrSize) / 2
      const qrY = (baseHeight - qrSize) / 2

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

      ctx.fillStyle = theme.background[1]
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SCAN UNTUK MELIHAT DATA', baseWidth / 2, cardY + cardSize - 35)

      ctx.fillStyle = '#9E9E9E'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('SI-PANDA Desa Kramat', baseWidth / 2, cardY + cardSize - 20)

      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.fillText('KARTU PEMANTAUAN GIZI', baseWidth / 2, 45)

      ctx.restore() // End Back Draw

      // === DOWNLOAD ===
      const link = document.createElement('a')
      link.download = `Kartu_Lengkap_${childName?.replace(/\s+/g, '_') || 'anak'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

    } catch (e) {
      console.error(e)
    } finally {
      setIsDownloadingFront(false)
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
        onClick={handleDownloadCombined}
        disabled={isDownloadingFront}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg hover:shadow-indigo-200/50 disabled:opacity-50"
      >
        {isDownloadingFront ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <span className="material-symbols-outlined text-[20px]">print</span>
        )}
        <span>Cetak Kartu</span>
      </button>
    </div>
  )
}
