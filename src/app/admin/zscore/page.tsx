'use client'

import { useState } from 'react'
import { recalculateAllZScores, getZScoreSummary } from '@/actions/zscore-admin'

export default function AdminZScorePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)

  const handleRecalculate = async () => {
    if (!confirm('Apakah Anda yakin ingin menghitung ulang semua Z-Score? Ini akan memperbarui semua data pengukuran.')) {
      return
    }
    
    setLoading(true)
    try {
      const res = await recalculateAllZScores()
      setResult(res)
    } catch (error) {
      setResult({ success: false, error: 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  const handleGetSummary = async () => {
    setLoading(true)
    try {
      const res = await getZScoreSummary()
      setSummary(res)
    } catch (error) {
      setSummary({ success: false, error: 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin - Z-Score Management</h1>
        
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Cek Konsistensi Data</h2>
          <p className="text-gray-500 mb-4">Periksa apakah ada inkonsistensi antara nilai BB/TB dengan status yang tersimpan.</p>
          <button 
            onClick={handleGetSummary}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Cek Summary'}
          </button>
          
          {summary && summary.success && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">BB/U (Underweight)</h3>
                  <ul className="text-sm text-gray-600">
                    <li>Normal: {summary.data.bbu.normal}</li>
                    <li>BB Kurang: {summary.data.bbu.bbKurang}</li>
                    <li>BB Sangat Kurang: {summary.data.bbu.bbSangatKurang}</li>
                    <li>Risiko BB Lebih: {summary.data.bbu.bbLebih}</li>
                    <li className="text-orange-600">Other: {summary.data.bbu.other}</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">TB/U (Stunting)</h3>
                  <ul className="text-sm text-gray-600">
                    <li>Normal: {summary.data.tbu.normal}</li>
                    <li>Pendek: {summary.data.tbu.pendek}</li>
                    <li>Sangat Pendek: {summary.data.tbu.sangatPendek}</li>
                    <li>Tinggi: {summary.data.tbu.tinggi}</li>
                    <li className="text-orange-600">Other: {summary.data.tbu.other}</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">BB/TB (Wasting)</h3>
                  <ul className="text-sm text-gray-600">
                    <li>Gizi Baik: {summary.data.bbtb.giziBaik}</li>
                    <li>Gizi Kurang: {summary.data.bbtb.giziKurang}</li>
                    <li>Gizi Buruk: {summary.data.bbtb.giziBuruk}</li>
                    <li>Gizi Lebih: {summary.data.bbtb.giziLebih}</li>
                    <li className="text-orange-600">Other: {summary.data.bbtb.other}</li>
                  </ul>
                </div>
              </div>
              
              {summary.data.inconsistencies.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-bold text-red-600 mb-2">
                    Inkonsistensi Ditemukan: {summary.data.inconsistencies.length}
                  </h3>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Nama Anak</th>
                          <th className="text-left p-2">Issue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.data.inconsistencies.slice(0, 20).map((inc: any) => (
                          <tr key={inc.id} className="border-b">
                            <td className="p-2">{inc.name}</td>
                            <td className="p-2 text-xs text-gray-500">{inc.issue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4">Recalculate Semua Z-Score</h2>
          <p className="text-gray-500 mb-4">
            Hitung ulang semua status gizi berdasarkan BB dan TB yang tersimpan. 
            Ini akan memperbarui status BBU, TBU, dan BBTB untuk semua data pengukuran.
          </p>
          <button 
            onClick={handleRecalculate}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Recalculate All Z-Scores'}
          </button>
          
          {result && (
            <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {result.success ? (
                <>
                  <p className="font-bold">Berhasil!</p>
                  <p>{result.message}</p>
                </>
              ) : (
                <p>{result.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
