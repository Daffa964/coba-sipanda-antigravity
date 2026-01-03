
import { prisma } from '@/lib/db'
import { getMeasurementHistory } from '@/actions/measurement'
import MeasurementHistory from '@/components/measurement-history'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/back-button'
import ParentRecommendation from '@/components/parent-recommendation'

export default async function PublicChildPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const anak = await prisma.anak.findUnique({
    where: { id },
    include: { posyandu: true }
  })

  if (!anak) return notFound()

  const historyRes = await getMeasurementHistory(id)
  const historyData = historyRes.data || []

  // Pre-calculate Age
  const today = new Date()
  const birth = new Date(anak.dateOfBirth)
  let age = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
       {/* Public Header */}
       <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-8 mb-6 shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                <span className="font-bold text-gray-900 tracking-tight">SI-PANDA Public</span>
             </div>
             <BackButton href="/" label="Kembali ke Utama" className="text-xs bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100" />
          </div>
       </header>

       <div className="max-w-4xl mx-auto px-4 md:px-6">
           {/* Card Profile */}
           <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-100/50 mb-8 border border-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
               
               <div className="relative z-10 flex flex-col items-center mt-8">
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl border-[6px] border-white shadow-lg ${anak.gender === 'LAKI_LAKI' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'}`}>
                     {anak.gender === 'LAKI_LAKI' ? '♂' : '♀'}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mt-4">{anak.name}</h1>
                  <span className="text-gray-500 font-medium mb-6">Putra/Putri dari Ibu {anak.parentName}</span>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
                     <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                        <div className="text-xs text-uppercase text-gray-400 font-bold tracking-wider mb-1">USIA</div>
                        <div className="font-bold text-gray-800 text-lg">{age} Bln</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                         <div className="text-xs text-uppercase text-gray-400 font-bold tracking-wider mb-1">GENDER</div>
                         <div className="font-bold text-gray-800 text-lg">{anak.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100 col-span-2 md:col-span-2">
                         <div className="text-xs text-uppercase text-gray-400 font-bold tracking-wider mb-1">LOKASI</div>
                         <div className="font-bold text-gray-800 text-lg truncate px-2">{anak.posyandu.name}</div>
                     </div>
                  </div>

               </div>
           </div>

           {/* Recommendation Card */}
           {historyData.length > 0 && (
             <div className="mb-8 shadow-xl shadow-indigo-50/50">
               <ParentRecommendation 
                 statuses={[
                   historyData[0].zScoreBBU, 
                   historyData[0].zScoreTBU, 
                   historyData[0].zScoreBBTB
                 ].filter(Boolean) as string[]} 
               />
             </div>
           )}

           {/* History */}
           <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                   <div>
                       <h2 className="text-xl font-bold text-gray-900">Riwayat Kesehatan</h2>
                       <p className="text-sm text-gray-500">Data penimbangan dan pengukuran terkini</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                </div>

                <MeasurementHistory data={historyData as any} />
           </div>
           
           <div className="mt-8 text-center text-gray-400 text-sm pb-8">
              &copy; 2025 SI-PANDA. Data bersifat rahasia.
           </div>
       </div>
    </div>
  )
}
