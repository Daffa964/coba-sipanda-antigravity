'use client'

import { useState } from 'react'
import Link from 'next/link'

interface InterventionChild {
  id: string
  name: string
  age: number
  parentName: string
  posyanduName: string
  status: string
}

export default function InterventionTable({ childrenData }: { childrenData: InterventionChild[] }) {
  const [filter, setFilter] = useState<'ALL' | 'Stunting' | 'Kurang Gizi'>('ALL')

  const filteredData = filter === 'ALL' 
    ? childrenData 
    : childrenData.filter(c => c.status === filter)

  const handleExport = () => {
    // Basic CSV Export
    const headers = ['Nama Anak', 'Umur (Bulan)', 'Orang Tua', 'Posyandu', 'Status Gizi']
    const rows = filteredData.map(c => [
        c.name, 
        c.age.toString(), 
        c.parentName, 
        c.posyanduName, 
        c.status
    ])

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `data_intervensi_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-xl border border-[#dce5df] shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f4f2]">
            <div>
                <h3 className="text-lg font-bold text-text-main">Daftar Anak Perlu Intervensi</h3>
                <p className="text-sm text-text-secondary">Prioritas penanganan gizi kurang dan stunting</p>
            </div>
            <div className="flex gap-2">
                <div className="relative">
                    <button 
                        onClick={() => setFilter(filter === 'ALL' ? 'Stunting' : filter === 'Stunting' ? 'Kurang Gizi' : 'ALL')}
                        className="px-4 py-2 rounded-lg border border-[#dce5df] text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">filter_list</span> 
                        {filter === 'ALL' ? 'Semua Status' : filter}
                    </button>
                </div>
                <button 
                    onClick={handleExport}
                    className="px-4 py-2 rounded-lg bg-primary text-text-main text-sm font-bold hover:bg-primary-dark transition flex items-center gap-2 shadow-sm shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-[18px]">download</span> Export Data
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-secondary uppercase bg-[#f6f8f7]">
                    <tr>
                        <th className="px-6 py-4 font-bold" scope="col">Nama Anak</th>
                        <th className="px-6 py-4 font-bold" scope="col">Umur</th>
                        <th className="px-6 py-4 font-bold" scope="col">Orang Tua</th>
                        <th className="px-6 py-4 font-bold" scope="col">Posyandu</th>
                        <th className="px-6 py-4 font-bold" scope="col">Status Gizi</th>
                        <th className="px-6 py-4 font-bold text-right" scope="col">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4f2]">
                    {filteredData.length > 0 ? filteredData.map((anak) => (
                        <tr key={anak.id} className="bg-white hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 font-medium text-text-main">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${anak.status === 'Stunting' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {anak.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    {anak.name}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-text-secondary">{anak.age} Bulan</td>
                            <td className="px-6 py-4 text-text-main">{anak.parentName}</td>
                            <td className="px-6 py-4 text-text-secondary">{anak.posyanduName}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${anak.status === 'Stunting' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                    <span className="material-symbols-outlined text-[14px]">{anak.status === 'Stunting' ? 'medical_services' : 'warning'}</span>
                                    {anak.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link href={`/dashboard/anak/${anak.id}`} className="text-primary hover:text-primary-dark font-medium text-sm">Lihat Detail</Link>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-text-secondary">Tidak ada data intervensi yang sesuai filter.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <div className="p-4 border-t border-[#f0f4f2] flex justify-center">
            <Link href="/dashboard/anak" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                Lihat Semua Data <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
        </div>
    </div>
  )
}
