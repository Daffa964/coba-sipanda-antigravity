'use client'

import { useState } from 'react'
import { updateMeasurement } from '@/actions/measurement'
import { useRouter } from 'next/navigation'

type Measurement = {
  id: string
  anakId: string
  date: Date
  weight: number
  height: number
}

interface MeasurementEditDialogProps {
  isOpen: boolean
  onClose: () => void
  measurement: Measurement
}

export default function MeasurementEditDialog({ isOpen, onClose, measurement }: MeasurementEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Format tanggal ke YYYY-MM-DD untuk input
  const defaultDate = new Date(measurement.date).toISOString().split('T')[0]

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const res = await updateMeasurement(measurement.id, measurement.anakId, formData)
    
    if (res.success) {
      onClose()
      window.location.reload()
    } else {
      setError(res.error || 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scaleIn overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">edit</span>
              Edit Pengukuran
            </h3>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Ukur</label>
                <input 
                  name="date" 
                  type="date" 
                  required 
                  defaultValue={defaultDate}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
                  <input 
                    name="weight" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    defaultValue={measurement.weight}
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi (cm)</label>
                  <input 
                    name="height" 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    required 
                    defaultValue={measurement.height}
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-70"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </>
  )
}
