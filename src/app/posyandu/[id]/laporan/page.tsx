'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Navbar from '@/components/navbar'
import { getMonthlyReport, getReportByNik } from '@/actions/report'
import MonthYearPicker from '@/components/month-year-picker'
import ReportSummaryCards from '@/components/report-summary-cards'
import ReportTable from '@/components/report-table'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

type TabType = 'monthly' | 'nik'

export default function KaderLaporanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const [activeTab, setActiveTab] = useState<TabType>('monthly')
  
  // Monthly report state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  // NIK report state
  const [nikInput, setNikInput] = useState('')
  const [nikLoading, setNikLoading] = useState(false)
  const [nikError, setNikError] = useState('')
  const [nikReportData, setNikReportData] = useState<any>(null)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMonthlyReport(selectedMonth, selectedYear, id)
      if (res.success) {
        setReportData(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch report', error)
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, selectedYear, id])

  useEffect(() => {
    if (activeTab === 'monthly') {
      fetchReport()
    }
  }, [fetchReport, activeTab])

  const handleSearchNik = async () => {
    if (!nikInput.trim()) {
      setNikError('Masukkan NIK anak')
      return
    }
    
    setNikLoading(true)
    setNikError('')
    setNikReportData(null)
    
    try {
      const res = await getReportByNik(nikInput.trim(), id)
      if (res.success) {
        setNikReportData(res.data)
      } else {
        setNikError(res.error || 'Anak tidak ditemukan')
      }
    } catch (error) {
      console.error('Failed to fetch NIK report', error)
      setNikError('Terjadi kesalahan saat mencari data')
    } finally {
      setNikLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    
    if (months < 0) {
      years--
      months += 12
    }
    
    if (years > 0) {
      return `${years} tahun ${months} bulan`
    }
    return `${months} bulan`
  }

  // Session mock for Navbar - in real app would come from layout/context
  const session = { name: 'Kader Posyandu', role: 'KADER', posyanduId: id }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-display">
      <div className="print:hidden">
        <Navbar user={session as any} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-500">Rekapitulasi pengukuran Posyandu</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 print:hidden">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            Laporan Bulanan
          </button>
          <button
            onClick={() => setActiveTab('nik')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'nik'
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person_search</span>
            Laporan per NIK
          </button>
        </div>

        {/* Monthly Report Tab */}
        {activeTab === 'monthly' && (
          <>
            {/* Header Control */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
               <div>
                  <h2 className="text-lg font-bold text-gray-900">Laporan Bulanan</h2>
                  <p className="text-gray-500 text-sm">Pilih bulan dan tahun untuk melihat laporan</p>
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
                <p className="text-black">Periode: {selectedMonth}/{selectedYear}</p>
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
          </>
        )}

        {/* NIK Report Tab */}
        {activeTab === 'nik' && (
          <>
            {/* Search Input - Hidden when printing */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 print:hidden">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Cari Laporan Berdasarkan NIK</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIK Anak</label>
                  <input
                    type="text"
                    value={nikInput}
                    onChange={(e) => setNikInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchNik()}
                    placeholder="Masukkan 16 digit NIK anak"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearchNik}
                    disabled={nikLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm transition-colors font-medium disabled:opacity-50"
                  >
                    {nikLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    )}
                    Cari
                  </button>
                </div>
              </div>
              {nikError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  {nikError}
                </div>
              )}
            </div>

            {/* NIK Report Results */}
            {nikReportData && (
              <div className="space-y-6 print:space-y-2">
                {/* Print Header - Only visible when printing */}
                <div className="hidden print:block mb-4 text-center">
                  <h1 className="text-xl font-bold text-black uppercase">Laporan Data Anak</h1>
                  <p className="text-black text-sm">Posyandu Desa Kramat, Kudus</p>
                  <div className="border-b-2 border-black mt-2"></div>
                </div>

                {/* Child Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 print:p-3 print:shadow-none print:border print:rounded-none">
                  <div className="flex items-start gap-4 print:gap-2">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary print:hidden">
                      <span className="material-symbols-outlined text-3xl">child_care</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 print:text-base">{nikReportData.anak.name}</h3>
                      <p className="text-gray-500 print:text-xs">NIK: {nikReportData.anak.nik}</p>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm print:mt-1 print:gap-2 print:text-xs">
                        <div>
                          <span className="text-gray-500">Tanggal Lahir</span>
                          <p className="font-medium text-gray-900">
                            {format(new Date(nikReportData.anak.dateOfBirth), 'd MMMM yyyy', { locale: localeId })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Usia</span>
                          <p className="font-medium text-gray-900">
                            {calculateAge(nikReportData.anak.dateOfBirth)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Jenis Kelamin</span>
                          <p className="font-medium text-gray-900">
                            {nikReportData.anak.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Orang Tua</span>
                          <p className="font-medium text-gray-900">{nikReportData.anak.parentName}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold print:px-2 print:py-1 print:text-xs ${
                      nikReportData.stats.currentStatus === 'Normal' ? 'bg-green-100 text-green-700' :
                      nikReportData.stats.currentStatus === 'Stunting' ? 'bg-red-100 text-red-700' :
                      nikReportData.stats.currentStatus === 'Wasting' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      Status: {nikReportData.stats.currentStatus}
                    </div>
                  </div>
                </div>

                {/* Stats Cards - Compact for print */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:grid-cols-5 print:gap-1">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 print:p-2 print:rounded-none print:shadow-none">
                    <p className="text-sm text-gray-500 print:text-xs">Total Pengukuran</p>
                    <p className="text-2xl font-bold text-gray-900 print:text-base">{nikReportData.stats.totalMeasurements}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 print:p-2 print:rounded-none print:shadow-none">
                    <p className="text-sm text-gray-500 print:text-xs">Normal</p>
                    <p className="text-2xl font-bold text-green-600 print:text-base">{nikReportData.stats.normalCount}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 print:p-2 print:rounded-none print:shadow-none">
                    <p className="text-sm text-gray-500 print:text-xs">Stunting</p>
                    <p className="text-2xl font-bold text-red-600 print:text-base">{nikReportData.stats.stuntingCount}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 print:p-2 print:rounded-none print:shadow-none">
                    <p className="text-sm text-gray-500 print:text-xs">Wasting</p>
                    <p className="text-2xl font-bold text-orange-600 print:text-base">{nikReportData.stats.wastingCount}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 print:p-2 print:rounded-none print:shadow-none">
                    <p className="text-sm text-gray-500 print:text-xs">Underweight</p>
                    <p className="text-2xl font-bold text-yellow-600 print:text-base">{nikReportData.stats.underweightCount}</p>
                  </div>
                </div>

                {/* Measurement History Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:rounded-none">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
                    <h3 className="font-bold text-gray-900">Riwayat Pengukuran</h3>
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-[20px]">print</span>
                      Cetak
                    </button>
                  </div>
                  <div className="hidden print:block p-2 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 text-sm">Riwayat Pengukuran</h3>
                  </div>
                  <ReportTable measurements={nikReportData.measurements || []} />
                </div>
              </div>
            )}

            {/* Empty State */}
            {!nikReportData && !nikLoading && !nikError && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl">person_search</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cari Data Anak</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Masukkan NIK anak untuk melihat riwayat pengukuran dan status gizi secara lengkap.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
