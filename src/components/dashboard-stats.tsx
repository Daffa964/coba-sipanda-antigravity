import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardStats() {
  const [totalAnak, totalPosyandu, measurements] = await Promise.all([
    prisma.anak.count(),
    prisma.posyandu.count(),
    prisma.measurement.findMany({
      orderBy: { date: 'desc' },
      distinct: ['anakId'], // Get only latest measurement per child (Postgres specific)
      select: { zScoreBBU: true, zScoreTBU: true }
    })
  ])

  // Count children with ANY issues (Stunting OR Underweight)
  // Logic must match AnakList filter: /kurang|buruk|pendek|stunt/
  const issueCount = measurements.filter((m: { zScoreBBU: string, zScoreTBU: string }) => {
     const statusText = (m.zScoreBBU + ' ' + m.zScoreTBU).toLowerCase()
     return /kurang|buruk|pendek|stunt/.test(statusText)
  }).length
  
  // Calculate schedule (Mock for now)
  const jadwalNext = "Senin, 12 Des"

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Posyandu</span>
          <span className="text-4xl font-bold text-indigo-600">{totalPosyandu}</span>
       </div>
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Anak</span>
          <span className="text-4xl font-bold text-gray-800">{totalAnak}</span>
       </div>
       
       {/* Early Warning Card */}
       <Link href="/dashboard/anak?filter=attention" className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-32 hover:shadow-md transition cursor-pointer ${issueCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
          <span className={`${issueCount > 0 ? 'text-red-500' : 'text-gray-400'} text-sm font-medium uppercase tracking-wider flex items-center gap-2`}>
             Perlu Perhatian
             {issueCount > 0 && <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>}
          </span>
          <div className="flex items-end gap-2">
             <span className={`text-4xl font-bold ${issueCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{issueCount}</span>
             <span className="text-sm text-gray-500 mb-1">Anak Berisiko</span>
          </div>
       </Link>

       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Jadwal Posyandu</span>
          <span className="text-lg font-bold text-green-600">{jadwalNext}</span>
       </div>
    </div>
  )
}
