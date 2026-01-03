'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/navbar'
import { getMonthlyReport } from '@/actions/report'
import MonthYearPicker from '@/components/month-year-picker'
import ReportSummaryCards from '@/components/report-summary-cards'
import ReportTable from '@/components/report-table'

export default function LaporanPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMonthlyReport(selectedMonth, selectedYear)
      if (res.success) {
        setReportData(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch report', error)
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-display">
      <div className="print:hidden">
        <Navbar user={{ name: 'Bidan Desa', role: 'BIDAN' } as any} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Header Control */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
           <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Bulanan</h1>
              <p className="text-gray-500">Rekapitulasi pengukuran dan status gizi anak</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
              <MonthYearPicker 
                selectedMonth={selectedMonth} 
                selectedYear={selectedYear} 
                onChange={(m, y) => {
                  setSelectedMonth(m)
                  setSelectedYear(y)
                }} 
              />
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors text-sm font-medium"
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                Cetak Laporan
              </button>
           </div>
        </div>

        {/* Printable Header - Only visible when printing */}
        <div className="hidden print:block mb-8 text-center">
            <h1 className="text-2xl font-bold text-black uppercase">Laporan Bulanan Posyandu</h1>
            <p className="text-black">Desa Kramat, Periode: {selectedMonth}/{selectedYear}</p>
            <div className="border-b-2 border-black mt-4"></div>
        </div>

        <div className="space-y-8">
           {loading ? (
             <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
             </div>
           ) : (
             <>
               <ReportSummaryCards stats={reportData?.stats} />
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border-none">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
                     <h3 className="font-bold text-gray-900">Detail Pengukuran</h3>
                     <span className="text-sm text-gray-500">Total: {reportData?.stats?.totalMeasurements || 0} Data</span>
                  </div>
                  <ReportTable measurements={reportData?.measurements || []} />
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  )
}
