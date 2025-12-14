import { getAnakList, getPosyanduList } from '@/actions/anak'
import AnakForm from '@/components/anak-form'
import AnakList from '@/components/anak-list'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'

export default async function AnakManagementPage(props: { searchParams: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams
  const [anakRes, posyanduList] = await Promise.all([
    getAnakList(),
    getPosyanduList()
  ])

  const anakData = anakRes.success ? (anakRes.data || []) : []

  // Check Session
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null
  const isKader = session?.role === 'KADER'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-8 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
             <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
               <Link href="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>
               <span>/</span>
               <span className="text-gray-900 font-medium">Data Anak</span>
             </div>
             <h1 className="text-3xl font-bold text-gray-900">
               {searchParams.filter === 'attention' ? 'Anak Perlu Perhatian' : 'Data Anak Desa'}
             </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Col: Form (Sticky) - ONLY KADER */}
          {isKader && (
            <div className="lg:col-span-1 lg:sticky lg:top-8">
              <AnakForm posyanduList={posyanduList} />
            </div>
          )}

          {/* Right Col: List (Expand if no form) */}
          <div className={isKader ? "lg:col-span-2" : "lg:col-span-3"}>
            <AnakList data={anakData as any} filter={searchParams.filter} /> 
          </div>
        </div>
      </div>
    </div>
  )
}
