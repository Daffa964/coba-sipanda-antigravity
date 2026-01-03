import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardStats() {
  const [totalAnak, measurements] = await Promise.all([
    prisma.anak.count(),
    prisma.measurement.findMany({
      orderBy: { date: 'desc' },
      distinct: ['anakId'], // Get only latest measurement per child (Postgres specific)
      select: { 
         zScoreBBU: true, 
         zScoreTBU: true,
         zScoreBBTB: true 
      }
    })
  ])

  // 1. Stunting (TB/U) - Pendek / Sangat Pendek
  const stuntingCount = measurements.filter((m: { zScoreTBU: string | null }) => {
     if (!m.zScoreTBU) return false
     const status = m.zScoreTBU.toLowerCase()
     return status === 'pendek' || status === 'sangat pendek'
  }).length

  // 2. Wasting (BB/TB) - Gizi Kurang / Gizi Buruk
  const wastingCount = measurements.filter((m: { zScoreBBTB: string | null }) => {
     if (!m.zScoreBBTB) return false
     const status = m.zScoreBBTB.toLowerCase()
     return status === 'gizi kurang' || status === 'gizi buruk'
  }).length

  // 3. Underweight (BB/U) - BB Kurang / BB Sangat Kurang
  const underweightCount = measurements.filter((m: { zScoreBBU: string | null }) => {
     if (!m.zScoreBBU) return false
     const status = m.zScoreBBU.toLowerCase()
     return status === 'bb kurang' || status === 'bb sangat kurang'
  }).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
       {/* Total Anak */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Anak</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-800">{totalAnak}</span>
            <span className="text-sm text-gray-500 mb-1">Terdaftar</span>
          </div>
       </div>

       {/* Stunting (TB/U) */}
       <Link href="/dashboard/anak?filter=stunting" className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-32 hover:shadow-md transition cursor-pointer ${stuntingCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
          <span className={`${stuntingCount > 0 ? 'text-red-500' : 'text-gray-400'} text-sm font-medium uppercase tracking-wider flex items-center gap-2`}>
             Stunting
             {stuntingCount > 0 && <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>}
          </span>
          <div className="flex items-end gap-2">
             <span className={`text-4xl font-bold ${stuntingCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{stuntingCount}</span>
             <span className="text-sm text-gray-500 mb-1">Anak</span>
          </div>
       </Link>

       {/* Wasting (BB/TB) */}
       <Link href="/dashboard/anak?filter=wasting" className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-32 hover:shadow-md transition cursor-pointer ${wastingCount > 0 ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'}`}>
          <span className={`${wastingCount > 0 ? 'text-orange-500' : 'text-gray-400'} text-sm font-medium uppercase tracking-wider flex items-center gap-2`}>
             Wasting (Gizi)
             {wastingCount > 0 && <span className="animate-pulse w-2 h-2 bg-orange-500 rounded-full"></span>}
          </span>
          <div className="flex items-end gap-2">
             <span className={`text-4xl font-bold ${wastingCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>{wastingCount}</span>
             <span className="text-sm text-gray-500 mb-1">Anak</span>
          </div>
       </Link>
       
       {/* Underweight (BB/U) */}
       <Link href="/dashboard/anak?filter=underweight" className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-32 hover:shadow-md transition cursor-pointer ${underweightCount > 0 ? 'bg-yellow-50 border-yellow-100' : 'bg-white border-gray-100'}`}>
          <span className={`${underweightCount > 0 ? 'text-yellow-600' : 'text-gray-400'} text-sm font-medium uppercase tracking-wider flex items-center gap-2`}>
             Underweight
             {underweightCount > 0 && <span className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full"></span>}
          </span>
          <div className="flex items-end gap-2">
             <span className={`text-4xl font-bold ${underweightCount > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{underweightCount}</span>
             <span className="text-sm text-gray-500 mb-1">Anak</span>
          </div>
       </Link>
    </div>
  )
}
