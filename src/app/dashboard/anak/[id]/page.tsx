import { prisma } from '@/lib/db'
import { getMeasurementHistory } from '@/actions/measurement'
import MeasurementForm from '@/components/measurement-form'
import MeasurementHistory from '@/components/measurement-history'
import BackButton from '@/components/back-button'
import QRCodeGenerator from '@/components/qr-code-generator'
import WhatsAppShare from '@/components/whatsapp-share'
import { GrowthChart } from '@/components/growth-chart'
import ParentRecommendation from '@/components/parent-recommendation'
import { notFound } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { cookies } from 'next/headers'

export default async function ChildDetailPage({ params }: { params: { id: string } }) {
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

  // Check Session for Role
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null
  const isKader = session?.role === 'KADER'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
       {/* Header */}
       <div className="bg-white border-b border-gray-200 py-6 px-8 mb-8">
         <div className="max-w-6xl mx-auto">
           <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
              <BackButton />
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
                {isKader && <MeasurementForm anakId={id} />}
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Bagikan Laporan</h3>
                   <div className="flex flex-col items-center gap-6">
                      <QRCodeGenerator text={id} childName={anak.name} posyanduName={anak.posyandu.name} />
                      <WhatsAppShare 
                        name={anak.name} 
                        status={historyData[0]?.zScoreBBU || 'Belum Ada Data'} 
                        linkId={id} 
                      />
                   </div>
                </div>

                {/* Recommendation Card */}
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
