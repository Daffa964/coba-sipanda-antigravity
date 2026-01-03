
import { prisma } from '@/lib/db'
import { getMeasurementHistory } from '@/actions/measurement'
import MeasurementForm from '@/components/measurement-form'
import MeasurementHistory from '@/components/measurement-history'
import BackButton from '@/components/back-button'
import QRCodeGenerator from '@/components/qr-code-generator'
import WhatsAppShare from '@/components/whatsapp-share'
import { GrowthChart } from '@/components/growth-chart'
import { notFound, redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { cookies } from 'next/headers'
import Navbar from '@/components/navbar'
import Link from 'next/link'
import ParentRecommendation from '@/components/parent-recommendation'

export default async function KaderChildDetailPage({ params }: { params: Promise<{ id: string; childId: string }> }) {
  const { id, childId } = await params
  
  // Verify Session
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  if (!session || session.role !== 'KADER') {
     // fallback or redirect?
     // If not kader, maybe redirect strictly?
     // For now just allow if session exists, but Navbar might look weird if not kader.
  }

  const anak = await prisma.anak.findUnique({
    where: { id: childId },
    include: { posyandu: true }
  })

  // Ensure anak belongs to this posyandu (security check) - optional but good
  if (!anak || anak.posyanduId !== id) return notFound()

  const historyRes = await getMeasurementHistory(childId)
  const historyData = historyRes.data || []

  // Pre-calculate Age
  const today = new Date()
  const birth = new Date(anak.dateOfBirth)
  let age = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
       <Navbar user={{ ...session, posyanduId: id } as any} />

       {/* Header */}
       <div className="bg-white border-b border-gray-200 py-6 px-8 mb-8">
         <div className="max-w-6xl mx-auto">
           <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
              <Link href={`/posyandu/${id}/anak`} className="hover:text-green-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Kembali
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{anak.name}</span>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 ${anak.gender === 'LAKI_LAKI' ? 'bg-blue-100 text-blue-600 border-blue-50' : 'bg-pink-100 text-pink-600 border-pink-50'}`}>
                    {anak.gender === 'LAKI_LAKI' ? '♂' : '♀'}
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-gray-900">{anak.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">{anak.nik}</span>
                       <span>•</span>
                       <span>{age} Bulan</span>
                       <span>•</span>
                       <span>{anak.posyandu.name}</span>
                    </div>
                 </div>
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-semibold text-sm">
                 Ibu: {anak.parentName}
              </div>
           </div>
         </div>
       </div>

       <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left: Input & Tools */}
             <div className="lg:col-span-1 space-y-8">
                <MeasurementForm anakId={childId} />
                
                {historyData.length > 0 && (
                  <ParentRecommendation 
                    statuses={[
                      historyData[0].zScoreBBU, 
                      historyData[0].zScoreTBU, 
                      historyData[0].zScoreBBTB
                    ].filter(Boolean) as string[]} 
                  />
                )}
             </div>

             {/* Right: History */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold text-gray-800">Riwayat Perkembangan</h2>
                </div>
                
                {/* Visual Chart */}
                <GrowthChart measurements={historyData as any} gender={anak.gender} />
                
                <MeasurementHistory data={historyData as any} />
             </div>
          </div>
       </div>
    </div>
  )
}
