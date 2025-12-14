import { getAnakList } from '@/actions/anak'
import AnakForm from '@/components/anak-form'
import AnakList from '@/components/anak-list'

export default async function KaderPosyanduPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  // Fetch specific Posyandu Name in real app, here just mocking or using ID
  // In a real app we would fetch prisma.posyandu.findUnique({where: {id}})
  
  const anakRes = await getAnakList(id)
  const anakData = anakRes.success ? (anakRes.data || []) : []

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12 px-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <svg className="w-64 h-64 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="inline-block py-1.5 px-3 rounded-full bg-teal-50 text-teal-700 text-xs font-bold tracking-wide mb-3 border border-teal-100 uppercase">
             Kader Area
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Posyandu</h1>
          <p className="text-gray-500 max-w-xl">Selamat datang kader. Silakan kelola data anak untuk wilayah Anda di bawah ini.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar / Menu */}
           <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Navigasi</h3>
                <nav className="space-y-2">
                   <a href="#" className="flex items-center gap-3 px-4 py-3 bg-teal-50 text-teal-700 rounded-2xl font-bold transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      Data Anak
                   </a>
                   <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-2xl font-medium transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Laporan (Soon)
                   </a>
                </nav>
              </div>
           </div>

           {/* Content */}
           <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                 <h2 className="text-xl font-bold text-gray-800">Manajemen Data Anak</h2>
                 <a href={`/posyandu/${id}/anak`} className="text-sm text-teal-600 font-bold hover:text-teal-700 hover:underline">Refresh Data</a>
              </div>
              
              {/* Using a simplified layout for Kader: Cards? */}
              {/* For now reusing the same robust components but maybe different layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                 <div className="xl:col-span-1 xl:sticky xl:top-8 order-2 xl:order-1">
                    <AnakForm defaultPosyanduId={id} />
                 </div>
                 <div className="xl:col-span-2 order-1 xl:order-2">
                    <AnakList data={anakData as any} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
