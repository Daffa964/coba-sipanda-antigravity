import Link from 'next/link'
import Navbar from '@/components/navbar'
import DashboardInterventions from '@/components/dashboard-interventions'
import StuntingAlertDialog from '@/components/stunting-alert-dialog'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  // If Kader tries to access main dashboard, redirect to their posyandu
  if (session?.role === 'KADER' && session.posyanduId) {
    redirect(`/posyandu/${session.posyanduId}`)
  }

  // Initialize default values
  let kaders: any[] = []
  let totalBalita = 0
  let giziBaikCount = 0
  let kurangGiziCount = 0
  let stuntingCount = 0
  const posyanduStats: Record<string, { total: number, normal: number, kurang: number, stunting: number }> = {}
  let interventionList: any[] = []

  try {
    // 1. Get Total Balita Efficiently
    totalBalita = await prisma.anak.count()

    // 2. Get Stats per Posyandu using Raw SQL for performance
    // This avoids fetching all 1000+ records to Node.js
    const statsQuery = await prisma.$queryRaw`
      SELECT 
        p.nama as posyandu_name,
        COUNT(a.anak_id) as total,
        COUNT(CASE WHEN m.z_score_bbu = 'Normal' THEN 1 END) as normal,
        COUNT(CASE WHEN m.z_score_bbu IN ('Kurang Gizi', 'Gizi Buruk') THEN 1 END) as kurang,
        COUNT(CASE WHEN m.z_score_tbu IN ('Pendek', 'Pendek (Stunted)', 'Sangat Pendek') THEN 1 END) as stunting
      FROM anak a
      JOIN posyandu p ON a.posyandu_id = p.posyandu_id
      LEFT JOIN (
          SELECT DISTINCT ON (anak_id) *
          FROM pengukuran
          ORDER BY anak_id, tanggal DESC
      ) m ON a.anak_id = m.anak_id
      GROUP BY p.nama
    ` as any[]

    // Process stats
    statsQuery.forEach(stat => {
      const name = stat.posyandu_name
      const total = Number(stat.total)
      const normal = Number(stat.normal)
      const kurang = Number(stat.kurang)
      const stunting = Number(stat.stunting)

      posyanduStats[name] = { total, normal, kurang, stunting }
      
      // Accumulate global stats
      giziBaikCount += normal
      kurangGiziCount += kurang
      stuntingCount += stunting
    })

    // 3. Get Intervention List (Stunting OR Kurang Gizi)
    // Fetch top 50 to avoid huge payload
    const interventionQuery = await prisma.$queryRaw`
      WITH LatestMeasure AS (
          SELECT DISTINCT ON (anak_id) *
          FROM pengukuran
          ORDER BY anak_id, tanggal DESC
      )
      SELECT 
        a.anak_id as id,
        a.nama as name,
        a.nama_orangtua as "parentName",
        p.nama as "posyanduName",
        m.usia_bulan as age,
        CASE 
            WHEN m.z_score_tbu IN ('Pendek', 'Pendek (Stunted)', 'Sangat Pendek') THEN 'Stunting'
            ELSE 'Kurang Gizi'
        END as status
      FROM LatestMeasure m
      JOIN anak a ON m.anak_id = a.anak_id
      JOIN posyandu p ON a.posyandu_id = p.posyandu_id
      WHERE 
        m.z_score_bbu IN ('Kurang Gizi', 'Gizi Buruk') 
        OR m.z_score_tbu IN ('Pendek', 'Pendek (Stunted)', 'Sangat Pendek')
      LIMIT 50
    ` as any[]

    interventionList = interventionQuery.map(item => ({
      id: item.id,
      name: item.name,
      parentName: item.parentName,
      posyandu: { name: item.posyanduName }, // Match expected structure
      status: item.status,
      age: item.age
    }))

    // Fetch Kaders for "Active Kader" list with activity data
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Get kader activity stats - count measurements done by each kader this month
    try {
      const kaderActivityQuery = await prisma.$queryRaw`
        SELECT 
          u.user_id,
          u.nama as name,
          u.email,
          p.nama as posyandu_name,
          p.posyandu_id,
          (
            SELECT COUNT(*)
            FROM pengukuran m
            JOIN anak a ON m.anak_id = a.anak_id
            WHERE a.posyandu_id = p.posyandu_id
            AND m.tanggal >= ${startOfMonth}
            AND m.tanggal <= ${endOfMonth}
          ) as measurements_this_month,
          (
            SELECT COUNT(*)
            FROM anak a
            WHERE a.posyandu_id = p.posyandu_id
          ) as total_children
        FROM "user" u
        JOIN posyandu p ON u.posyandu_id = p.posyandu_id
        WHERE u.role = 'KADER'
        ORDER BY measurements_this_month DESC, p.nama ASC
        LIMIT 20
      ` as any[]

      kaders = kaderActivityQuery.map(k => ({
        id: k.user_id,
        name: k.name,
        email: k.email,
        posyandu: { name: k.posyandu_name, id: k.posyandu_id },
        measurementsThisMonth: Number(k.measurements_this_month),
        totalChildren: Number(k.total_children)
      }))
    } catch (kaderError) {
      console.error('Kader query error:', kaderError)
      // Fallback to simpler query using Prisma ORM
      const kaderList = await prisma.user.findMany({
        where: { role: 'KADER', posyanduId: { not: null } },
        include: { 
          posyandu: {
            include: {
              anak: {
                include: {
                  measurements: {
                    where: {
                      date: { gte: startOfMonth, lte: endOfMonth }
                    }
                  }
                }
              }
            }
          }
        },
        take: 20
      })
      
      kaders = kaderList.map(k => ({
        id: k.id,
        name: k.name,
        email: k.email,
        posyandu: { name: k.posyandu?.name || '-', id: k.posyanduId },
        measurementsThisMonth: k.posyandu?.anak.reduce((acc, a) => acc + a.measurements.length, 0) || 0,
        totalChildren: k.posyandu?.anak.length || 0
      }))
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
  }

  // Format Chart Data
  const labels = Object.keys(posyanduStats).sort()
  
  // Date Formatter
  const currentDate = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  // Prepare stunting children data for the alert dialog
  const stuntingChildren = interventionList
    .filter(a => a.status === 'Stunting')
    .map(a => ({
      id: a.id,
      name: a.name,
      parentName: a.parentName,
      posyanduName: a.posyandu.name,
      age: a.age
    }))

  return (
    <div className="min-h-screen bg-gray-50 font-display pb-20">
        
       <Navbar user={session as any} />

       {/* Stunting Alert Popup */}
       <StuntingAlertDialog 
         stuntingCount={stuntingCount} 
         stuntingChildren={stuntingChildren} 
       />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Monitoring Gizi</h1>
            <p className="text-gray-500 mt-2 text-lg">Overview status gizi balita di Desa Kramat</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
            <span>{currentDate}</span>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Balita */}
            <Link href="/dashboard/anak" className="bg-white p-6 rounded-xl border border-[#dce5df] shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Total Balita</p>
                    <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-xl">child_care</span>
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalBalita}</p>
                <p className="text-xs text-gray-500 mt-1">Terdata di {Object.keys(posyanduStats).length} RW</p>
            </Link>
            {/* Gizi Baik */}
            <Link href="/dashboard/anak?status=normal" className="bg-white p-6 rounded-xl border border-l-4 border-[#dce5df] border-l-primary shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium group-hover:text-primary transition-colors">Gizi Baik</p>
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                    <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
                    </div>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-900">{giziBaikCount}</p>
                    <span className="text-sm font-bold text-primary mb-1.5">{totalBalita > 0 ? ((giziBaikCount/totalBalita)*100).toFixed(1) : 0}%</span>
                </div>
                 <p className="text-xs text-gray-500 mt-1">dari total balita</p>
            </Link>
             {/* Kurang Gizi */}
            <Link href="/dashboard/anak?status=kurang" className="bg-white p-6 rounded-xl border border-l-4 border-[#dce5df] border-l-orange-500 shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium group-hover:text-orange-600 transition-colors">Kurang Gizi</p>
                    <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors">
                    <span className="material-symbols-outlined text-xl">warning</span>
                    </div>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-900">{kurangGiziCount}</p>
                    <span className="text-sm font-bold text-orange-500 mb-1.5">{totalBalita > 0 ? ((kurangGiziCount/totalBalita)*100).toFixed(1) : 0}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Perlu pemantauan rutin</p>
            </Link>
             {/* Stunting */}
            <Link href="/dashboard/anak?status=stunting" className="bg-white p-6 rounded-xl border border-l-4 border-[#dce5df] border-l-red-600 shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 font-medium group-hover:text-red-600 transition-colors">Stunting</p>
                <div className="size-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                <span className="material-symbols-outlined text-xl">medical_services</span>
                </div>
                </div>
                <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-gray-900">{stuntingCount}</p>
                <span className="text-sm font-bold text-red-600 mb-1.5">{totalBalita > 0 ? ((stuntingCount/totalBalita)*100).toFixed(1) : 0}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Intervensi prioritas</p>
            </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Chart Section */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-[#dce5df] shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                    <h3 className="text-lg font-bold text-gray-900">Sebaran Status Gizi per RW</h3>
                    <p className="text-sm text-gray-500">Distribusi Gizi Baik, Kurang Gizi, dan Stunting</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-primary"></div><span>Normal</span></div>
                    <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-orange-400"></div><span>Kurang</span></div>
                    <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-red-500"></div><span>Stunting</span></div>
                    </div>
                </div>
                
                {/* Stacked Bar Chart */}
                <div className="flex flex-col gap-6">
                   {labels.length > 0 ? labels.map((rw, index) => {
                       const stats = posyanduStats[rw]
                       const normalPct = (stats.normal / stats.total) * 100
                       const kurangPct = (stats.kurang / stats.total) * 100
                       const stuntingPct = (stats.stunting / stats.total) * 100
                       
                       return (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-24 text-sm font-bold text-gray-500 truncate" title={rw}>{rw.replace('Posyandu ', '')}</div>
                            <div className="flex-1 h-8 flex rounded-md overflow-hidden bg-gray-100 relative">
                                {stats.normal > 0 && <div className="bg-primary h-full hover:opacity-90 transition-opacity" style={{ width: `${normalPct}%` }} title={`${stats.normal} Normal`}></div>}
                                {stats.kurang > 0 && <div className="bg-orange-400 h-full hover:opacity-90 transition-opacity" style={{ width: `${kurangPct}%` }} title={`${stats.kurang} Kurang`}></div>}
                                {stats.stunting > 0 && <div className="bg-red-500 h-full hover:opacity-90 transition-opacity" style={{ width: `${stuntingPct}%` }} title={`${stats.stunting} Stunting`}></div>}
                            </div>
                            <div className="w-10 text-right text-sm font-medium">{stats.total}</div>
                        </div>
                       )
                   }) : (
                       <div className="text-center py-10 text-gray-500">Belum ada data pengukuran</div>
                   )}
                </div>
            </div>

            {/* Kader Status List */}
            <div className="bg-white rounded-xl border border-[#dce5df] shadow-sm p-0 flex flex-col overflow-hidden max-h-[500px]">
                <div className="p-6 pb-2 border-b border-[#f0f4f2]">
                    <h3 className="text-lg font-bold text-gray-900">Keaktifan Kader</h3>
                    <p className="text-sm text-gray-500 mb-4">Aktivitas pengukuran bulan ini</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {kaders.map((kader: any, i: number) => {
                        // Determine activity status based on measurements
                        const measurements = kader.measurementsThisMonth || 0
                        const totalChildren = kader.totalChildren || 0
                        const coveragePercent = totalChildren > 0 ? Math.round((measurements / totalChildren) * 100) : 0
                        
                        let statusColor = 'bg-gray-100 text-gray-600'
                        let statusText = 'Belum Ada'
                        let dotColor = 'bg-gray-400'
                        
                        if (measurements > 0) {
                            if (coveragePercent >= 80) {
                                statusColor = 'bg-green-100 text-green-800'
                                statusText = 'Sangat Aktif'
                                dotColor = 'bg-green-600'
                            } else if (coveragePercent >= 50) {
                                statusColor = 'bg-blue-100 text-blue-800'
                                statusText = 'Aktif'
                                dotColor = 'bg-blue-600'
                            } else if (coveragePercent >= 20) {
                                statusColor = 'bg-yellow-100 text-yellow-800'
                                statusText = 'Kurang Aktif'
                                dotColor = 'bg-yellow-600'
                            } else {
                                statusColor = 'bg-orange-100 text-orange-800'
                                statusText = 'Perlu Perhatian'
                                dotColor = 'bg-orange-600'
                            }
                        }

                        return (
                            <div key={kader.id} className="flex items-center justify-between p-4 border-b border-[#f0f4f2] hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{(i + 1).toString().padStart(2, '0')}</div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 truncate max-w-[100px]">{kader.posyandu?.name?.replace('Posyandu ', '') || '-'}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{kader.name}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                        <span className={`size-1.5 rounded-full ${dotColor}`}></span>
                                        {statusText}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{measurements}/{totalChildren} ukur</span>
                                </div>
                            </div>
                        )
                    })}
                    {kaders.length === 0 && <div className="p-4 text-center text-sm text-gray-500">Belum ada data kader</div>}
                </div>
            </div>
        </div>

        {/* Attention Table */}
        <DashboardInterventions childrenData={interventionList.map(a => ({
          id: a.id,
          name: a.name,
          age: a.age,
          parentName: a.parentName,
          posyanduName: a.posyandu.name,
          status: a.status
        }))} />
      </main>
    </div>
  )
}
