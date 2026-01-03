import { prisma } from '@/lib/db'
import { verifySession } from '@/lib/auth'
import { cookies } from 'next/headers'
import Navbar from '@/components/navbar'
import AnakList from '@/components/anak-list'
import { redirect } from 'next/navigation'

export default async function KaderDataAnakPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null

  if (!session || session.role !== 'KADER') {
    // redirect('/login') // Optional security enforcement
  }

  // Fetch Kader's specific Posyandu data
  // Logic: Only children from this Posyandu
  const anakList = await prisma.anak.findMany({
    where: { posyanduId: id },
    include: {
      posyandu: true,
      measurements: {
        orderBy: { date: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Get current posyandu details for the "Posyandu List" prop (single item for Kader)
  const currentPosyandu = await prisma.posyandu.findUnique({
      where: { id },
      select: { id: true, name: true }
  })
  
  const posyanduList = currentPosyandu ? [currentPosyandu] : []

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <Navbar user={{ ...session, posyanduId: id } as any} />
       
       <div className="flex-1 flex flex-col p-6 md:px-8 max-w-[1440px] mx-auto w-full">
           <AnakList 
              data={anakList as any} 
              posyanduList={posyanduList}
              isKader={true} // Enable Kader-specific features (e.g. Restricted Links)
              userPosyanduId={id}
           />
       </div>
    </div>
  )
}
