import Link from 'next/link'
import DashboardStats from '@/components/dashboard-stats'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  // If Kader tries to access main dashboard, redirect to their posyandu
  if (session?.role === 'KADER' && session.posyanduId) {
    redirect(`/posyandu/${session.posyanduId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang, Bidan!</h1>
          <p className="text-gray-500">Pantau kesehatan anak di seluruh Desa Kramat dari satu tempat.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-8">
        {/* Stats Grid */}
        <DashboardStats />

        {/* Menu Section */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/anak" className="group">
             <div className="bg-white p-8 rounded-3xl border border-teal-50 shadow-sm hover:shadow-xl hover:border-teal-200 transition duration-300 relative overflow-hidden h-full group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                   <svg className="w-24 h-24 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                </div>
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                   <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition">Data Anak</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Kelola master data anak, tambah anak baru, dan lihat riwayat.</p>
             </div>
          </Link>

          {/* Placeholders for future modules */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-dashed border-gray-200 flex flex-col justify-center items-center text-center opacity-60">
             <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
               <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <h3 className="font-bold text-gray-400">Laporan Bulanan</h3>
             <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
