'use client'

import { useState } from 'react'
import { createAnak, updateAnak } from '@/actions/anak'

type Posyandu = {
  id: string
  name: string
}

type AnakData = {
  id: string
  name: string
  nik: string
  placeOfBirth?: string
  dateOfBirth: Date | string
  gender: string
  parentName: string
  posyanduId: string
}

interface AnakFormProps {
  posyanduList?: Posyandu[]
  defaultPosyanduId?: string
  onSuccess?: () => void
  isModal?: boolean
  editData?: AnakData
}

export default function AnakForm({ posyanduList, defaultPosyanduId, onSuccess, isModal = false, editData }: AnakFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isEditMode = !!editData

  // Format date for input
  const formatDateForInput = (date: Date | string | undefined) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (defaultPosyanduId) {
      formData.append('posyanduId', defaultPosyanduId)
    }

    const action = isEditMode ? updateAnak : createAnak
    const res = await action(null, formData)
    
    if (res.success) {
      setSuccess(res.message || 'Berhasil')
      if (onSuccess) {
        setTimeout(() => {
             onSuccess()
             setSuccess(null)
        }, 1500)
      } else {
        window.location.reload() 
      }
    } else {
      setError(res.error || 'Gagal')
    }
    setLoading(false)
  }

  const containerClasses = isModal 
    ? "p-6" 
    : "bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-8"

  return (
    <div className={containerClasses}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {isEditMode ? 'Edit Data Anak' : 'Tambah Data Anak'}
        </h3>
        <p className="text-sm text-gray-500">Lengkapi formulir di bawah ini.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 border border-green-100">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
           {success}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        {/* Hidden ID for edit mode */}
        {isEditMode && <input type="hidden" name="id" value={editData.id} />}
        
        {/* Primary Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Identitas Anak</label>
            <input 
              name="name" 
              type="text" 
              placeholder="Nama Lengkap Anak" 
              required 
              defaultValue={editData?.name || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition" 
            />
          </div>
          <div>
            <input 
              name="nik" 
              type="text" 
              maxLength={16} 
              placeholder="Nomor Induk Kependudukan (NIK)" 
              required 
              defaultValue={editData?.nik || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition font-mono text-sm" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Kelahiran</label>
            <input 
              name="placeOfBirth" 
              type="text" 
              placeholder="Tempat Lahir" 
              defaultValue={editData?.placeOfBirth || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">&nbsp;</label>
            <input 
              name="dateOfBirth" 
              type="date" 
              required 
              defaultValue={formatDateForInput(editData?.dateOfBirth)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition" 
            />
          </div>
        </div>

        {/* Secondary Info */}
        <div className="space-y-4">
           <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Jenis Kelamin</label>
            <select 
              name="gender" 
              required 
              defaultValue={editData?.gender || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition appearance-none"
            >
              <option value="" disabled>Pilih Jenis Kelamin</option>
              <option value="LAKI_LAKI">Laki-laki</option>
              <option value="PEREMPUAN">Perempuan</option>
            </select>
          </div>

          <div>
            <input 
              name="parentName" 
              type="text" 
              placeholder="Nama Ibu Kandung / Wali" 
              required 
              defaultValue={editData?.parentName || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition" 
            />
          </div>

          {!defaultPosyanduId && posyanduList && (
             <div>
              <select 
                name="posyanduId" 
                required 
                defaultValue={editData?.posyanduId || ''}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition appearance-none"
              >
                <option value="">Pilih Lokasi Posyandu</option>
                {posyanduList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 mt-4">
          {loading ? (
             <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
             </span>
          ) : isEditMode ? 'Simpan Perubahan' : 'Simpan Data Anak'}
        </button>
      </form>
    </div>
  )
}
