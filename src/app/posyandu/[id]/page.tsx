import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Navbar from '@/components/navbar'

export default async function KaderPosyanduPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  // Verify Session & Role
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  // Simplify session typing or fallback
  const sessionName = (session?.name as string) || 'Kader Posyandu'
  if (!session) redirect('/login')

  // Fetch Posyandu Name
  const posyandu = await prisma.posyandu.findUnique({
    where: { id },
    select: { name: true }
  })

  if (!posyandu) {
    return <div>Posyandu not found</div>
  }

  // Fetch Anak & Measurements
  const anakList = await prisma.anak.findMany({
    where: { posyanduId: id },
    include: {
      measurements: {
        orderBy: { date: 'desc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  // Calculate Stats
  const totalAnak = anakList.length
  let giziBaikCount = 0
  let perluTindakLanjutCount = 0

  anakList.forEach(anak => {
    const measure = anak.measurements[0]
    if (measure) {
      if (measure.zScoreBBU === 'Normal') {
        giziBaikCount++
      } else if (measure.zScoreBBU === 'Kurang Gizi' || measure.zScoreBBU === 'Gizi Buruk' || measure.zScoreTBU === 'Pendek (Stunted)' || measure.zScoreTBU === 'Sangat Pendek') {
        perluTindakLanjutCount++
      }
    }
  })

  const giziBaikPct = totalAnak > 0 ? Math.round((giziBaikCount / totalAnak) * 100) : 0

  // Recent Measurements List (Flattened)
  const recentMeasurements = anakList
    .filter(a => a.measurements.length > 0)
    .sort((a, b) => new Date(b.measurements[0].date).getTime() - new Date(a.measurements[0].date).getTime())
    .slice(0, 5) // Top 5 recent
  
  return (
    <div className="min-h-screen bg-gray-50 font-display pb-20">
      <Navbar user={{ ...session, posyanduId: id } as any} />

      {/* Main Content */}
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col gap-6">
           {/* Breadcrumbs */}
           <div className="flex flex-wrap gap-2 items-center text-sm">
              <Link className="text-text-secondary hover:text-primary transition-colors" href={`/posyandu/${id}`}>Home</Link>
              <span className="text-text-secondary">/</span>
              <span className="text-text-main font-medium">Dashboard</span>
           </div>

           {/* PageHeading */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                 <h1 className="text-text-main text-3xl font-bold leading-tight">Selamat Datang, {sessionName}</h1>
                 <p className="text-text-secondary text-base font-normal flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    Wilayah: {posyandu.name}, Desa Kramat
                 </p>
              </div>
              <Link href={`/posyandu/${id}/anak/new`} className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-[#1bc660] text-black text-sm font-bold leading-normal transition-colors shadow-lg shadow-primary/20">
                 <span className="material-symbols-outlined">add</span>
                 <span>Input Pengukuran Baru</span>
              </Link>
           </div>

           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Total Anak */}
              <Link href={`/posyandu/${id}/anak`} className="bg-white rounded-xl p-6 border border-[#dce5df] shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-pointer group">
                 <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider group-hover:text-text-main transition-colors">Total Anak</p>
                    <span className="material-symbols-outlined text-text-secondary bg-gray-100 p-1.5 rounded-lg group-hover:bg-gray-200 transition-colors">groups</span>
                 </div>
                 <p className="text-text-main text-3xl font-bold mt-2">{totalAnak}</p>
                 <p className="text-xs text-text-secondary mt-1">Terdata di {posyandu.name}</p>
              </Link>

               {/* Card 2: Normal (Gizi Baik) */}
              <Link href={`/posyandu/${id}/anak?status=normal`} className="bg-white rounded-xl p-6 border border-[#dce5df] shadow-sm flex flex-col gap-1 relative overflow-hidden hover:shadow-md transition cursor-pointer group">
                 <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-9xl text-primary">sentiment_satisfied</span>
                 </div>
                 <div className="flex items-center justify-between relative z-10">
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider group-hover:text-primary transition-colors">Gizi Baik</p>
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">check_circle</span>
                 </div>
                 <p className="text-text-main text-3xl font-bold mt-2 relative z-10">{giziBaikCount}</p>
                 <p className="text-xs text-green-600 mt-1 relative z-10 font-medium">{giziBaikPct}% dari total anak</p>
              </Link>

              {/* Card 3: Perlu Tindak Lanjut */}
              <Link href={`/posyandu/${id}/anak?status=warning`} className="bg-white rounded-xl p-6 border-l-4 border-l-orange-500 border-y border-r border-[#dce5df] shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-pointer group">
                 <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider group-hover:text-orange-600 transition-colors">Perlu Tindak Lanjut</p>
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">priority_high</span>
                 </div>
                 <p className="text-text-main text-3xl font-bold mt-2">{perluTindakLanjutCount}</p>
                 <p className="text-xs text-orange-600 mt-1 font-medium">Butuh monitoring segera</p>
              </Link>
           </div>

           {/* Table Section */}
           <div className="flex flex-col gap-4 bg-white rounded-xl border border-[#dce5df] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-[#dce5df]">
                 <h3 className="text-text-main text-lg font-bold leading-tight">Pengukuran Terbaru</h3>
                 <Link className="text-primary text-sm font-medium hover:underline" href={`/posyandu/${id}/anak`}>Lihat Semua</Link>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50">
                          <th className="p-4 text-xs font-semibold tracking-wide text-text-secondary uppercase">Nama Anak</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-text-secondary uppercase">Usia</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-text-secondary uppercase">Berat (kg)</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-text-secondary uppercase">Tinggi (cm)</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-text-secondary uppercase">Status Gizi</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-text-secondary uppercase">Tanggal</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-text-secondary uppercase text-right">Aksi</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dce5df]">
                       {recentMeasurements.length > 0 ? recentMeasurements.map((anak) => {
                          const m = anak.measurements[0]
                          const isStunt = m.zScoreTBU?.includes('Stunt') || m.zScoreTBU?.includes('Pendek')
                          const isKurang = m.zScoreBBU?.includes('Kurang') || m.zScoreBBU?.includes('Buruk')
                          const isNormal = !isStunt && !isKurang
                          
                          return (
                             <tr key={anak.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                   <div className="flex items-center gap-3">
                                      <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{anak.name.substring(0,2).toUpperCase()}</div>
                                      <p className="text-sm font-medium text-text-main">{anak.name}</p>
                                   </div>
                                </td>
                                <td className="p-4 text-sm text-text-secondary">{m.ageInMonths} Bulan</td>
                                <td className="p-4 text-sm text-text-main font-medium">{m.weight}</td>
                                <td className="p-4 text-sm text-text-main font-medium">{m.height}</td>
                                <td className="p-4">
                                   {isNormal && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Normal
                                   </span>}
                                   {isKurang && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                                      <span className="material-symbols-outlined text-[14px]">warning</span> Kurang Gizi
                                   </span>}
                                   {isStunt && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                      <span className="material-symbols-outlined text-[14px]">medical_services</span> Stunting
                                   </span>}
                                </td>
                                <td className="p-4 text-sm text-text-secondary">{new Date(m.date).toLocaleDateString('id-ID')}</td>
                                <td className="p-4 text-right">
                                   <Link href={`/posyandu/${id}/anak/${anak.id}`} className="text-text-secondary hover:text-primary transition-colors p-1 rounded-md hover:bg-white">
                                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                                   </Link>
                                </td>
                             </tr>
                          )
                       }) : (
                          <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada data pengukuran. <Link href={`/posyandu/${id}/anak/new`} className="text-primary hover:underline">Tambah baru?</Link></td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Footer (Simple) */}
           <div className="py-4 text-center text-xs text-text-secondary">
              © 2024 SI-PANDA Desa Kramat. All rights reserved.
           </div>
        </div>
      </main>
    </div>
  )
}
