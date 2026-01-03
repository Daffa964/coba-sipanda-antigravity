import { getAnakList, getPosyanduList } from '@/actions/anak'
import AnakForm from '@/components/anak-form'
import AnakList from '@/components/anak-list'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import BackButton from '@/components/back-button'
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
  const userPosyanduId = (session?.posyanduId as string) || undefined

  return (
    <div className="min-h-screen bg-[#f6f8f7] pb-20">
      <Navbar user={session as any} />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        <AnakList 
          data={anakData as any} 
          posyanduList={posyanduList} 
          isKader={isKader} 
          userPosyanduId={userPosyanduId}
        /> 
      </div>
    </div>
  )
}
