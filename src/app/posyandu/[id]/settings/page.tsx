import Link from 'next/link'
import { logout } from '@/actions/auth'
import Navbar from '@/components/navbar'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'

export default async function KaderSettingsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar user={{ ...session, posyanduId: id } as any} />
      <div className="flex flex-col items-center justify-center p-4 mt-20">
         <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
              <span className="material-symbols-outlined text-3xl">settings</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan Akun</h1>
            <p className="text-gray-500 mb-8">Kelola akun kader Anda.</p>
            
            <div className="flex flex-col gap-3">
                 <form action={logout}>
                     <button 
                        type="submit"
                        className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Keluar / Logout
                    </button>
                 </form>
                <Link href={`/posyandu/${id}`} className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition block">
                  Kembali ke Dashboard
                </Link>
            </div>
         </div>
      </div>
    </div>
  )
}
