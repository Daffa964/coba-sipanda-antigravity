'use client'

import Link from 'next/link'
import { useState } from 'react'

type AnakWithPosyandu = {
  id: string
  name: string
  nik: string
  dateOfBirth: Date
  gender: string
  parentName: string
  posyandu: { name: string }
  measurements: {
    zScoreBBU: string
    zScoreTBU: string
  }[]
}

export default function AnakList({ data, filter }: { data: AnakWithPosyandu[], filter?: string }) {
  const [searchTerm, setSearchTerm] = useState('')

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm text-center">
        <div className="bg-indigo-50 p-4 rounded-full mb-4">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Belum ada data anak</h3>
        <p className="text-gray-500 text-sm mt-1">Silakan tambahkan data anak baru melalui formulir.</p>
      </div>
    )
  }

  function calculateAgeInMonths(dob: Date) {
    const today = new Date()
    const birthDate = new Date(dob)
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12
    months -= birthDate.getMonth()
    months += today.getMonth()
    return months <= 0 ? 0 : months
  }

  // Filter Logic
  const filteredData = data.filter(item => {
    // 1. Search Filter
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.nik.includes(searchTerm)
    
    // 2. Status Filter
    let matchFilter = true
    if (filter === 'attention') {
       const lastMeasure = item.measurements[0]
       if (!lastMeasure) {
          // If no data, we usually don't flag them as "Attention Needed" unless we want to flag missing data.
          // For now, only show those CONFIRMED to have issues.
          matchFilter = false 
       } else {
          // Check all keys
          const statusText = (lastMeasure.zScoreBBU + ' ' + lastMeasure.zScoreTBU).toLowerCase()
          // Keywords: kurang, buruk, pendek, stunting, stunted, sangat pendek
          const isRisk = /kurang|buruk|pendek|stunt/.test(statusText)
          
          matchFilter = isRisk
       }
    }

    return matchSearch && matchFilter
  })

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Daftar Anak</h2>
          <p className="text-sm text-gray-500">Total {data.length} anak terdaftar</p>
        </div>
        <input 
          type="text" 
          placeholder="Cari nama atau NIK..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition w-full sm:w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4 pl-6">Data Anak</th>
              <th className="p-4">Usia</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Orang Tua</th>
              <th className="p-4">Posyandu</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.map((anak) => (
              <tr key={anak.id} className="hover:bg-gray-50/80 transition group">
                <td className="p-4 pl-6">
                  <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{anak.name}</div>
                  <div className="text-gray-400 text-xs font-mono tracking-wide">{anak.nik}</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                    {calculateAgeInMonths(anak.dateOfBirth)} Bulan
                  </span>
                </td>
                <td className="p-4">
                  {anak.gender === 'LAKI_LAKI' ? (
                     <span className="text-blue-600 bg-blue-50 py-1 px-2 rounded-lg inline-flex items-center gap-1.5 border border-blue-100" title="Laki-laki">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2a9 9 0 1 0 9 9c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9zm0 2a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm0 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5z" opacity="0.5"/> 
                           <path fillRule="evenodd" d="M20.25 15.75L15.75 20.25H18V22H11V15H12.75V17.25L17.25 12.75C16.5 11.6 15.2 11 13.8 11C11.15 11 9 13.15 9 15.8C9 18.45 11.15 20.6 13.8 20.6C15.65 20.6 17.25 19.55 18 18L19 19C17.95 21 16 22.3 13.8 22.3C10.2 22.3 7.3 19.4 7.3 15.8C7.3 12.2 10.2 9.3 13.8 9.3C15.75 9.3 17.5 10.2 18.65 11.65L22 8.3V14H20.25V15.75Z" clipRule="evenodd" transform="translate(-6 -6) scale(1.5)"/>
                        </svg>
                        <span className="text-xs font-semibold">Laki-laki</span>
                     </span>
                  ) : (
                     <span className="text-pink-600 bg-pink-50 py-1 px-2 rounded-lg inline-flex items-center gap-1.5 border border-pink-100" title="Perempuan">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                           <path fillRule="evenodd" d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 10.5C10.07 10.5 8.5 8.93 8.5 7C8.5 5.07 10.07 3.5 12 3.5C13.93 3.5 15.5 5.07 15.5 7C15.5 8.93 13.93 10.5 12 10.5ZM12 13C12.55 13 13 13.45 13 14V16H15V17.5H13V22H11V17.5H9V16H11V14C11 13.45 11.45 13 12 13Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold">Perempuan</span>
                     </span>
                  )}
                </td>
                <td className="p-4 text-gray-600 font-medium">
                  {anak.parentName}
                </td>
                <td className="p-4 text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    {anak.posyandu.name}
                  </div>
                </td>
                <td className="p-4">
                  {(() => {
                    const last = anak.measurements[0]
                    if (!last) return <span className="text-xs text-gray-400 italic">Belum ada data</span>
                    
                    const issues = []
                    const statusBBU = last.zScoreBBU
                    const statusTBU = last.zScoreTBU

                    // Check issues
                    if (/kurang|buruk/i.test(statusBBU)) issues.push(statusBBU)
                    if (/pendek|stunt/i.test(statusTBU)) issues.push(statusTBU)

                    if (issues.length > 0) {
                       return (
                         <div className="flex flex-col gap-1 items-start">
                           {issues.map((issue, idx) => (
                             <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                               {issue}
                             </span>
                           ))}
                         </div>
                       )
                    }

                    return (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Sehat
                      </span>
                    )
                  })()}
                </td>
                <td className="p-4 pr-6">
                  <Link href={`/dashboard/anak/${anak.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium transition p-2 hover:bg-indigo-50 rounded-lg inline-block">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
