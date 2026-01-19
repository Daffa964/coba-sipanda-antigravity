'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export interface ReportStats {
  totalMeasurements: number
  totalChildrenMeasured?: number
  stuntingCount: number
  wastingCount: number
  underweightCount: number
  normalCount: number
  currentStatus?: string
}

export interface Measurement {
  id: string
  date: Date | string
  weight: number
  height: number
  ageInMonths: number
  zScoreBBU?: string
  zScoreTBU?: string
  zScoreBBTB?: string
  notes?: string
  anak: {
    name: string
    nik: string
    parentName: string
    posyandu: { name: string }
  }
}

export interface ReportData {
  meta?: {
    month: number
    year: number
    posyanduId?: string
    generatedAt: Date
  }
  stats: ReportStats
  measurements: Measurement[]
  anak?: {
    name: string
    nik: string
    dateOfBirth: Date
    gender: string
    parentName: string
    posyandu: { name: string }
  }
}

// Helper to get month name in Indonesian
function getMonthName(month: number): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return months[month - 1] || ''
}

// Export Monthly Report to PDF
export function exportMonthlyReportToPDF(
  data: ReportData,
  month: number,
  year: number,
  posyanduName?: string
) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('LAPORAN BULANAN POSYANDU', pageWidth / 2, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(posyanduName || 'Desa Kramat', pageWidth / 2, 28, { align: 'center' })
  
  doc.setFontSize(11)
  doc.text(`Periode: ${getMonthName(month)} ${year}`, pageWidth / 2, 35, { align: 'center' })
  
  // Line separator
  doc.setLineWidth(0.5)
  doc.line(14, 40, pageWidth - 14, 40)
  
  // Summary Stats Table
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Ringkasan Status Gizi', 14, 50)
  
  const statsData = [
    ['Total Anak Diukur', String(data.stats.totalChildrenMeasured || data.stats.totalMeasurements)],
    ['Normal', String(data.stats.normalCount)],
    ['Stunting (Pendek)', String(data.stats.stuntingCount)],
    ['Wasting (Kurus)', String(data.stats.wastingCount)],
    ['Underweight (BB Kurang)', String(data.stats.underweightCount)]
  ]
  
  autoTable(doc, {
    startY: 55,
    head: [['Kategori', 'Jumlah']],
    body: statsData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40, halign: 'center' } }
  })
  
  // Detail Table
  const finalY = (doc as any).lastAutoTable.finalY || 100
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Detail Pengukuran', 14, finalY + 15)
  
  const tableData = data.measurements.map((m, i) => [
    String(i + 1),
    m.anak.name,
    m.anak.nik,
    format(new Date(m.date), 'd MMM yyyy', { locale: localeId }),
    `${m.weight} kg`,
    `${m.height} cm`,
    m.zScoreBBU || '-',
    m.zScoreTBU || '-'
  ])
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['#', 'Nama', 'NIK', 'Tanggal', 'BB', 'TB', 'Status BB/U', 'Status TB/U']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 30 },
      2: { cellWidth: 32 },
      3: { cellWidth: 22 },
      4: { cellWidth: 15 },
      5: { cellWidth: 15 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 }
    }
  })
  
  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Dicetak: ${format(new Date(), 'd MMMM yyyy HH:mm', { locale: localeId })} | Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }
  
  doc.save(`Laporan_Bulanan_${getMonthName(month)}_${year}.pdf`)
}

// Export NIK Report to PDF
export function exportNikReportToPDF(data: ReportData) {
  if (!data.anak) return
  
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('LAPORAN DATA ANAK', pageWidth / 2, 20, { align: 'center' })
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Posyandu Desa Kramat', pageWidth / 2, 28, { align: 'center' })
  
  // Line separator
  doc.setLineWidth(0.5)
  doc.line(14, 33, pageWidth - 14, 33)
  
  // Child Info
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Identitas Anak', 14, 43)
  
  const childInfo = [
    ['Nama', data.anak.name],
    ['NIK', data.anak.nik],
    ['Tanggal Lahir', format(new Date(data.anak.dateOfBirth), 'd MMMM yyyy', { locale: localeId })],
    ['Jenis Kelamin', data.anak.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'],
    ['Nama Orang Tua', data.anak.parentName],
    ['Posyandu', data.anak.posyandu?.name || '-'],
    ['Status Terakhir', data.stats.currentStatus || 'Normal']
  ]
  
  autoTable(doc, {
    startY: 48,
    body: childInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 45, fontStyle: 'bold' }, 1: { cellWidth: 100 } }
  })
  
  // Measurement History
  const finalY = (doc as any).lastAutoTable.finalY || 100
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Riwayat Pengukuran', 14, finalY + 15)
  
  const tableData = data.measurements.map((m, i) => [
    String(i + 1),
    format(new Date(m.date), 'd MMM yyyy', { locale: localeId }),
    `${m.ageInMonths} bln`,
    `${m.weight} kg`,
    `${m.height} cm`,
    m.zScoreBBU || '-',
    m.zScoreTBU || '-',
    m.zScoreBBTB || '-'
  ])
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['#', 'Tanggal', 'Usia', 'BB', 'TB', 'BB/U', 'TB/U', 'BB/TB']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    styles: { fontSize: 8 }
  })
  
  // Footer
  doc.setFontSize(8)
  doc.text(
    `Dicetak: ${format(new Date(), 'd MMMM yyyy HH:mm', { locale: localeId })}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  )
  
  doc.save(`Laporan_Anak_${data.anak.name.replace(/\s/g, '_')}.pdf`)
}

// Export Monthly Report to Excel
export function exportMonthlyReportToExcel(
  data: ReportData,
  month: number,
  year: number,
  posyanduName?: string
) {
  const workbook = XLSX.utils.book_new()
  
  // Summary Sheet
  const summaryData = [
    ['LAPORAN BULANAN POSYANDU'],
    [posyanduName || 'Desa Kramat'],
    [`Periode: ${getMonthName(month)} ${year}`],
    [],
    ['Ringkasan Status Gizi'],
    ['Kategori', 'Jumlah'],
    ['Total Anak Diukur', data.stats.totalChildrenMeasured || data.stats.totalMeasurements],
    ['Normal', data.stats.normalCount],
    ['Stunting (Pendek)', data.stats.stuntingCount],
    ['Wasting (Kurus)', data.stats.wastingCount],
    ['Underweight (BB Kurang)', data.stats.underweightCount]
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan')
  
  // Detail Sheet
  const detailData = [
    ['No', 'Nama Anak', 'NIK', 'Orang Tua', 'Posyandu', 'Tanggal', 'Usia (bln)', 'BB (kg)', 'TB (cm)', 'Status BB/U', 'Status TB/U', 'Status BB/TB', 'Catatan'],
    ...data.measurements.map((m, i) => [
      i + 1,
      m.anak.name,
      m.anak.nik,
      m.anak.parentName,
      m.anak.posyandu?.name || '-',
      format(new Date(m.date), 'dd/MM/yyyy'),
      m.ageInMonths,
      m.weight,
      m.height,
      m.zScoreBBU || '-',
      m.zScoreTBU || '-',
      m.zScoreBBTB || '-',
      m.notes || '-'
    ])
  ]
  
  const detailSheet = XLSX.utils.aoa_to_sheet(detailData)
  detailSheet['!cols'] = [
    { wch: 5 }, { wch: 25 }, { wch: 18 }, { wch: 20 }, { wch: 15 },
    { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 },
    { wch: 15 }, { wch: 15 }, { wch: 20 }
  ]
  XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detail Pengukuran')
  
  XLSX.writeFile(workbook, `Laporan_Bulanan_${getMonthName(month)}_${year}.xlsx`)
}

// Export NIK Report to Excel
export function exportNikReportToExcel(data: ReportData) {
  if (!data.anak) return
  
  const workbook = XLSX.utils.book_new()
  
  // Info Sheet
  const infoData = [
    ['LAPORAN DATA ANAK'],
    ['Posyandu Desa Kramat'],
    [],
    ['Identitas Anak'],
    ['Nama', data.anak.name],
    ['NIK', data.anak.nik],
    ['Tanggal Lahir', format(new Date(data.anak.dateOfBirth), 'dd/MM/yyyy')],
    ['Jenis Kelamin', data.anak.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'],
    ['Nama Orang Tua', data.anak.parentName],
    ['Posyandu', data.anak.posyandu?.name || '-'],
    ['Status Terakhir', data.stats.currentStatus || 'Normal'],
    [],
    ['Statistik Pengukuran'],
    ['Total Pengukuran', data.stats.totalMeasurements],
    ['Normal', data.stats.normalCount],
    ['Stunting', data.stats.stuntingCount],
    ['Wasting', data.stats.wastingCount],
    ['Underweight', data.stats.underweightCount]
  ]
  
  const infoSheet = XLSX.utils.aoa_to_sheet(infoData)
  infoSheet['!cols'] = [{ wch: 20 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(workbook, infoSheet, 'Info Anak')
  
  // History Sheet
  const historyData = [
    ['No', 'Tanggal', 'Usia (bln)', 'BB (kg)', 'TB (cm)', 'Status BB/U', 'Status TB/U', 'Status BB/TB', 'Catatan'],
    ...data.measurements.map((m, i) => [
      i + 1,
      format(new Date(m.date), 'dd/MM/yyyy'),
      m.ageInMonths,
      m.weight,
      m.height,
      m.zScoreBBU || '-',
      m.zScoreTBU || '-',
      m.zScoreBBTB || '-',
      m.notes || '-'
    ])
  ]
  
  const historySheet = XLSX.utils.aoa_to_sheet(historyData)
  historySheet['!cols'] = [
    { wch: 5 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }
  ]
  XLSX.utils.book_append_sheet(workbook, historySheet, 'Riwayat Pengukuran')
  
  XLSX.writeFile(workbook, `Laporan_Anak_${data.anak.name.replace(/\s/g, '_')}.xlsx`)
}
