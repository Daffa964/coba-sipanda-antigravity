import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import BackButton from '@/components/back-button'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: (session as any).email },
    include: { posyandu: true }
  })

  if (!user) {
    // Should verify session logic handling too but fallback
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 w-full max-w-md p-8 border border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-teal-400 to-emerald-500"></div>
         
         <div className="relative z-10">
             <div className="mb-4">
                 <BackButton className="bg-white/20 text-white border-white/20 hover:bg-white/30 backdrop-blur-md" />
             </div>
             
             <div className="flex flex-col items-center mt-4">
                 <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg mb-4">
                    <div className="w-full h-full rounded-full bg-teal-50 flex items-center justify-center text-4xl font-bold text-teal-600">
                        {user.name.charAt(0)}
                    </div>
                 </div>
                 
                 <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                 <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold mt-2 uppercase tracking-wide">
                    {user.role.replace('_', ' ')}
                 </span>
             </div>

             <div className="mt-8 space-y-4">
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     </div>
                     <div>
                         <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                         <p className="font-medium text-gray-800">{user.email}</p>
                     </div>
                 </div>

                 {(user as any).posyandu && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Posyandu</p>
                            <p className="font-medium text-gray-800">{(user as any).posyandu.name}</p>
                        </div>
                    </div>
                 )}

                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                     </div>
                     <div>
                         <p className="text-xs text-gray-400 font-bold uppercase">Keamanan</p>
                         <p className="font-medium text-gray-800">Password telah dienkripsi</p>
                     </div>
                 </div>
             </div>
             
             <div className="mt-8 text-center text-xs text-gray-400">
                Terdaftar sejak 2025
             </div>
         </div>
      </div>
    </div>
  )
}
