'use client'

import { useState } from 'react'
import { createMeasurement } from '@/actions/measurement'
import { useRouter } from 'next/navigation'

export default function MeasurementForm({ anakId }: { anakId: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    formData.append('anakId', anakId)

    const res = await createMeasurement(null, formData)
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Data pengukuran berhasil disimpan!' })
      // Reset form handled by native form reset or reload
      // window.location.reload() // Reload to refresh history
    } else {
      setMessage({ type: 'error', text: res.error || 'Terjadi kesalahan' })
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
         </div>
         Input Pengukuran Baru
      </h3>
      
      {message && (
        <div className={`p-3 rounded-xl mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
           {message.text}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Tanggal Ukur</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} 
                 className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition" 
              />
           </div>
           <div>
              {/* Spacer for alignment or Age Display in future */}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Berat (Kg)</label>
            <div className="relative">
               <input name="weight" type="number" step="0.1" min="0" placeholder="0.0" required 
                 className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition" 
               />
               <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">kg</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Tinggi (cm)</label>
            <div className="relative">
                <input name="height" type="number" step="0.1" min="0" placeholder="0.0" required 
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition" 
                />
                <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">cm</span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition transform active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-indigo-200 mt-2">
          {loading ? 'Menyimpan...' : 'Simpan Pengukuran'}
        </button>
      </form>
    </div>
  )
}
