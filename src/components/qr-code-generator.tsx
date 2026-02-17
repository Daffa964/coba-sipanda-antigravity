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

  const handleDownloadFront = async () => {
    setIsDownloadingFront(true)
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
      drawBaseCard(ctx, baseWidth, baseHeight, theme)

      // === HEADER ===
      const headerY = 45
      
      // Title
      ctx.fillStyle = theme.text
      ctx.font = 'bold 24px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('KARTU ANAK', baseWidth - 30, headerY)

      // Subtitle (Posyandu Name)
      const cleanPosyanduName = posyanduName?.replace(/posyandu/gi, '').trim() || '-'
      ctx.fillStyle = theme.textSecondary
      ctx.font = '14px Inter, sans-serif'
      ctx.fillText(`Posyandu ${cleanPosyanduName}`, baseWidth - 30, headerY + 20)

      // Divider Line
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(30, headerY + 35)
      ctx.lineTo(baseWidth - 30, headerY + 35)
      ctx.stroke()

      // === CONTENT ===
      const contentY = 130
      const contentX = 170 // Start of text area (after avatar)

      // Avatar Circle (Left Side)
      const avatarX = 85
      const avatarY = 165
      const avatarRadius = 55

      // Avatar Border Ring
      ctx.beginPath()
      ctx.arc(avatarX, avatarY, avatarRadius + 4, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = 3
      ctx.stroke()

      // Avatar Background
      ctx.beginPath()
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2)
      ctx.fillStyle = theme.accent
      ctx.fill()
      
      // Avatar Text (Initial)
      ctx.fillStyle = theme.background[1]
      ctx.font = 'bold 48px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(childName?.charAt(0).toUpperCase() || 'A', avatarX, avatarY + 2)
      
      // Reset Text Alignment
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'

      // Info Labels & Values
      const labelSize = '11px'
      const valueSize = '18px'
      const gap = 48
      
      let cursorY = contentY

      // Child Name
      ctx.fillStyle = theme.textSecondary
      ctx.font = `${labelSize} Inter, sans-serif`
      ctx.fillText('NAMA LENGKAP', contentX, cursorY)
      
      ctx.fillStyle = theme.text
      ctx.font = `bold ${valueSize} Inter, sans-serif`
      ctx.fillText(childName || '-', contentX, cursorY + 20)
      
      cursorY += gap

      // Birth Date
      ctx.fillStyle = theme.textSecondary
      ctx.font = `${labelSize} Inter, sans-serif`
      ctx.fillText('TANGGAL LAHIR', contentX, cursorY)
      
      ctx.fillStyle = theme.text
      ctx.font = `bold ${valueSize} Inter, sans-serif`
      ctx.fillText(dateOfBirth ? formatDate(dateOfBirth) : '-', contentX, cursorY + 20)
      
      cursorY += gap

      // Parent Name
      ctx.fillStyle = theme.textSecondary
      ctx.font = `${labelSize} Inter, sans-serif`
      ctx.fillText('ORANG TUA', contentX, cursorY)
      
      ctx.fillStyle = theme.text
      ctx.font = `bold ${valueSize} Inter, sans-serif`
      ctx.fillText(parentName || '-', contentX, cursorY + 20)

      // Footer / Chip
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
      drawBaseCard(ctx, baseWidth, baseHeight, theme)

      // === CONTENT ===
      // White Card for QR
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

      // QR Code
      const qrSize = 160
      const qrX = (baseWidth - qrSize) / 2
      const qrY = (baseHeight - qrSize) / 2

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

      // Instruction Text (Inside White Card)
      ctx.fillStyle = theme.background[1]
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SCAN UNTUK MELIHAT DATA', baseWidth / 2, cardY + cardSize - 35)

      ctx.fillStyle = '#9E9E9E'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('SI-PANDA Desa Kramat', baseWidth / 2, cardY + cardSize - 20)

      // Header on Top
      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.fillText('KARTU PEMANTAUAN GIZI', baseWidth / 2, 45)

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
