'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AnakForm from './anak-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { deleteAnak } from '@/actions/anak'

type AnakWithPosyandu = {
  id: string
  name: string
  nik: string
  placeOfBirth?: string
  dateOfBirth: Date
  gender: string
  parentName: string
  posyanduId: string
  posyandu: { id: string; name: string }
  measurements: {
    zScoreBBU: string
    zScoreTBU: string
    zScoreBBTB: string
  }[]
}

type Posyandu = {
  id: string
  name: string
}

interface AnakListProps {
  data: AnakWithPosyandu[]
  posyanduList: Posyandu[]
  isKader: boolean
  userPosyanduId?: string
}

export default function AnakList({ data, posyanduList, isKader, userPosyanduId }: AnakListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [rwFilter, setRwFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<AnakWithPosyandu | null>(null)
  const [deletingChild, setDeletingChild] = useState<AnakWithPosyandu | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Calculate Age Helpers
  function calculateAge(dob: Date) {
    const today = new Date()
    const birthDate = new Date(dob)
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12
    months -= birthDate.getMonth()
    months += today.getMonth()
    
    // Calculate years and remaining months
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return { years, months: remainingMonths }
  }

  function getNutritionalStatus(measurements: any[]) {
      if (!measurements || measurements.length === 0) return { label: 'Belum Ada Data', color: 'gray' }
      
      const last = measurements[0]
      // Priority: Stunting (TBU) -> Underweight (BBU) -> Wasting (BBTB) -> Normal
      // Logic based on keywords in Z-Score strings (assuming strings like "Normal", "Pendek", etc.)
      
      const combined = (last.zScoreTBU + ' ' + last.zScoreBBU + ' ' + last.zScoreBBTB).toLowerCase()
      
      if (combined.includes('sangat pendek') || combined.includes('stunted')) 
          return { label: 'Stunting', color: 'danger' }
      if (combined.includes('pendek')) 
          return { label: 'Stunting', color: 'danger' }
      if (combined.includes('gizi buruk') || combined.includes('severely underweight')) 
          return { label: 'Gizi Buruk', color: 'danger' }
      if (combined.includes('gizi kurang') || combined.includes('underweight')) 
          return { label: 'Kurang Gizi', color: 'warning' }
      if (combined.includes('kurus') || combined.includes('wasted'))
          return { label: 'Kurus', color: 'warning' }
      
      return { label: 'Normal', color: 'success' }
  }

  // Filter Data
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status')

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.nik.includes(searchTerm)
      
      const matchPosyandu = rwFilter ? item.posyandu.id === rwFilter : true
      
      // Status Filter Logic
      let matchStatus = true
      if (statusFilter) {
          const status = getNutritionalStatus(item.measurements)
          if (statusFilter === 'stunting') {
              matchStatus = status.label === 'Stunting' || status.label === 'Sangat Pendek' || status.label === 'Pendek'
          } else if (statusFilter === 'kurang') {
              matchStatus = status.label === 'Kurang Gizi' || status.label === 'Gizi Buruk' || status.label === 'Kurus'
          } else if (statusFilter === 'warning') {
              // Matches ANY issue (Stunting OR Underweight/Wasting)
              matchStatus = status.label !== 'Normal' && status.label !== 'Belum Ada Data'
          } else if (statusFilter === 'normal') {
              matchStatus = status.label === 'Normal'
          }
      }
      
      return matchSearch && matchPosyandu && matchStatus
    })
  }, [data, searchTerm, rwFilter, statusFilter])

  // Pagination Logic
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage
      return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page)
      }
  }

  const handleSuccess = () => {
      setIsModalOpen(false)
      setEditingChild(null)
      router.refresh()
  }

  const handleEdit = (child: AnakWithPosyandu) => {
      setEditingChild(child)
      setIsModalOpen(true)
  }

  const handleCloseModal = () => {
      setIsModalOpen(false)
      setEditingChild(null)
  }

  const handleDelete = async () => {
      if (!deletingChild) return
      setIsDeleting(true)
      const result = await deleteAnak(deletingChild.id)
      setIsDeleting(false)
      if (result.success) {
          setDeletingChild(null)
          router.refresh()
      } else {
          alert(result.error || 'Gagal menghapus data')
      }
  }

  return (
    <div className="flex-1 flex flex-col gap-6">
       {/* New "Page Header" Section (Title + Export) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111714] tracking-tight">Data Anak</h1>
          <p className="text-[#648772] mt-1">Manajemen data balita dan pemantauan gizi Desa Kramat</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-[#dce5df] text-[#111714] px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Data
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#f0f4f2] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#648772]">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input 
              type="text"
              placeholder="Cari Nama atau NIK..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f6f8f7] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#20df6c]/50 text-[#111714] placeholder:text-[#648772] outline-none transition"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative min-w-[180px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#648772] z-10 pointer-events-none">
              <span className="material-symbols-outlined text-lg">filter_alt</span>
            </span>
            <select 
              value={rwFilter}
              onChange={(e) => { setRwFilter(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-8 py-2.5 bg-[#f6f8f7] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#20df6c]/50 text-[#111714] appearance-none cursor-pointer outline-none transition"
            >
              <option value="">Semua Posyandu/RW</option>
              {posyanduList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option> 
                  // Assuming Name implies RW like "Posyandu Mawar (RW 01)" or just filtering by Posyandu
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#648772] pointer-events-none">
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </span>
          </div>
        </div>

        {/* Add Button */}
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#20df6c] hover:bg-[#18af55] text-[#112117] font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Anak
        </button>
      </div>

       {/* Data Table */}
       <div className="bg-white rounded-xl border border-[#dce5df] overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-[#f6f8f7] border-b border-[#dce5df]">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#648772] whitespace-nowrap w-16">#</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#648772] whitespace-nowrap min-w-[200px]">Nama Anak</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#648772] whitespace-nowrap min-w-[160px]">NIK</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#648772] whitespace-nowrap">Umur</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#648772] whitespace-nowrap">Posyandu</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#648772] whitespace-nowrap min-w-[140px]">Status Gizi</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#648772] text-right whitespace-nowrap w-[120px]">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#dce5df] text-[#111714]">
                   {paginatedData.length === 0 ? (
                       <tr>
                           <td colSpan={7} className="py-8 text-center text-gray-500">
                               Tidak ada data ditemukan.
                           </td>
                       </tr>
                   ) : (
                       paginatedData.map((child, index) => {
                           const status = getNutritionalStatus(child.measurements)
                           const age = calculateAge(child.dateOfBirth)
                           const realIndex = (currentPage - 1) * itemsPerPage + index + 1
                           const initials = child.name.split(' ').map((n:string) => n[0]).join('').substring(0,2).toUpperCase()
                           
                           // Random pastel color for avatar based on index/char
                           const avatarColors = [
                               { bg: 'bg-blue-100', text: 'text-blue-600' },
                               { bg: 'bg-pink-100', text: 'text-pink-600' },
                               { bg: 'bg-orange-100', text: 'text-orange-600' },
                               { bg: 'bg-purple-100', text: 'text-purple-600' },
                               { bg: 'bg-teal-100', text: 'text-teal-600' },
                           ]
                           const color = avatarColors[realIndex % avatarColors.length]

                           return (
                               <tr key={child.id} className="group hover:bg-slate-50 transition-colors">
                                  <td className="py-4 px-6 text-sm text-[#648772]">{realIndex}</td>
                                  <td className="py-4 px-6">
                                      <div className="flex items-center gap-3">
                                          <div className={`size-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-xs font-bold`}>
                                              {initials}
                                          </div>
                                          <div className="font-medium">{child.name}</div>
                                      </div>
                                  </td>
                                  <td className="py-4 px-6 text-sm font-mono text-[#648772]">{child.nik}</td>
                                  <td className="py-4 px-6 text-sm">
                                      {age.years > 0 ? `${age.years} Thn ` : ''}{age.months} Bln
                                  </td>
                                  <td className="py-4 px-6 text-sm">{child.posyandu.name}</td>
                                  <td className="py-4 px-6">
                                     {status.color === 'success' && (
                                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                             <span className="material-symbols-outlined text-sm">check_circle</span>
                                             {status.label}
                                         </span>
                                     )}
                                     {status.color === 'warning' && (
                                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                             <span className="material-symbols-outlined text-sm">trending_down</span>
                                             {status.label}
                                         </span>
                                     )}
                                     {status.color === 'danger' && (
                                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                             <span className="material-symbols-outlined text-sm">warning</span>
                                             {status.label}
                                         </span>
                                     )}
                                      {status.color === 'gray' && (
                                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                             {status.label}
                                         </span>
                                     )}
                                  </td>
                                  <td className="py-4 px-6 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                          <Link 
                                            href={isKader ? `/posyandu/${userPosyanduId}/anak/${child.id}` : `/dashboard/anak/${child.id}`}
                                            className="size-8 flex items-center justify-center text-[#648772] hover:text-[#20df6c] hover:bg-green-50 rounded-md transition-colors" 
                                            title="Lihat Detail"
                                          >
                                              <span className="material-symbols-outlined text-[20px]">visibility</span>
                                          </Link>
                                          {!isKader && (
                                              <button 
                                                onClick={() => {
                                                    const origin = window.location.origin
                                                    const url = `${origin}/public/anak/${child.id}`
                                                    const text = `Halo Ibu/Wali dari *${child.name}*,\n\nBerikut adalah laporan terkini dari SI-PANDA Posyandu Desa Kramat:\n\nNama: ${child.name}\nStatus Gizi Terakhir: *${status.label}*\n\nLihat detail kartu digital disini:\n${url}\n\nTerima kasih.`
                                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                                                }}
                                                className="size-8 flex items-center justify-center text-[#648772] hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" 
                                                title="Hubungi Orang Tua via WA"
                                              >
                                                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.683-2.031-9.672-.272-.099-.47-.149-.669-.149-.198 0-.42.001-.643.001-.223 0-.583.084-.89.421-.307.337-1.178 1.152-1.178 2.809 0 1.657 1.207 3.259 1.378 3.487.173.227 2.375 3.628 5.756 5.087.804.347 1.432.553 1.93.711.831.264 1.588.227 2.184.137.669-.1 2.055-.841 2.352-1.653.297-.812.297-1.509.208-1.653z"/></svg>
                                              </button>
                                          )}
                                          <button 
                                            onClick={() => handleEdit(child)}
                                            className="size-8 flex items-center justify-center text-[#648772] hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                                            title="Edit Data"
                                          >
                                              <span className="material-symbols-outlined text-[20px]">edit</span>
                                          </button>
                                          <button 
                                            onClick={() => setDeletingChild(child)}
                                            className="size-8 flex items-center justify-center text-[#648772] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                                            title="Hapus Data"
                                          >
                                              <span className="material-symbols-outlined text-[20px]">delete</span>
                                          </button>
                                      </div>
                                  </td>
                               </tr>
                           )
                       })
                   )}
                </tbody>
             </table>
          </div>

          {/* Pagination */}
          <div className="bg-white border-t border-[#dce5df] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#648772]">
                Showing <span className="font-semibold text-[#111714]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-[#111714]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold text-[#111714]">{totalItems}</span> results
            </p>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded border border-[#dce5df] text-[#648772] hover:bg-slate-50 disabled:opacity-50 text-sm font-medium"
                >
                    Previous
                </button>
                <div className="flex items-center gap-1">
                   {/* Simple Page Numbers */}
                   {Array.from({ length: totalPages }, (_, i) => i + 1)
                     .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                     .map((p, i, arr) => {
                         // Add ellipsis
                         const showEllipsis = i > 0 && p - arr[i-1] > 1
                         return (
                             <div key={p} className="flex items-center">
                                 {showEllipsis && <span className="text-[#648772] px-1">...</span>}
                                 <button 
                                    onClick={() => handlePageChange(p)}
                                    className={`size-8 rounded font-medium text-sm flex items-center justify-center ${p === currentPage ? 'bg-[#20df6c] text-[#112117] font-bold' : 'text-[#111714] hover:bg-slate-50'}`}
                                 >
                                    {p}
                                 </button>
                             </div>
                         )
                     })
                   }
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded border border-[#dce5df] text-[#111714] hover:bg-slate-50 text-sm font-medium disabled:opacity-50"
                >
                    Next
                </button>
            </div>
          </div>
       </div>

       {/* Modal */}
       {isModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                   <button 
                      onClick={handleCloseModal}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition z-10"
                   >
                     <span className="material-symbols-outlined">close</span>
                   </button>
                   <AnakForm 
                      posyanduList={posyanduList} 
                      isModal={true}
                      onSuccess={handleSuccess}
                      defaultPosyanduId={isKader ? userPosyanduId : undefined}
                      editData={editingChild ? {
                        id: editingChild.id,
                        name: editingChild.name,
                        nik: editingChild.nik,
                        placeOfBirth: editingChild.placeOfBirth,
                        dateOfBirth: editingChild.dateOfBirth,
                        gender: editingChild.gender,
                        parentName: editingChild.parentName,
                        posyanduId: editingChild.posyanduId
                      } : undefined}
                   />
              </div>
           </div>
       )}

       {/* Delete Confirmation Modal */}
       {deletingChild && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeletingChild(null)}></div>
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                   <div className="text-center">
                       <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                           <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Data Anak?</h3>
                       <p className="text-gray-500 mb-6">
                           Anda yakin ingin menghapus data <strong>{deletingChild.name}</strong>? 
                           Semua data pengukuran anak ini juga akan terhapus. Tindakan ini tidak dapat dibatalkan.
                       </p>
                       <div className="flex gap-3">
                           <button 
                               onClick={() => setDeletingChild(null)}
                               className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                           >
                               Batal
                           </button>
                           <button 
                               onClick={handleDelete}
                               disabled={isDeleting}
                               className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
                           >
                               {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                           </button>
                       </div>
                   </div>
              </div>
           </div>
       )}
    </div>
  )
}
