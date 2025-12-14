import { verifySession } from '@/lib/auth'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function BackButton() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await verifySession(cookie) : null
  
  let href = '/dashboard/anak'
  if (session?.role === 'KADER') {
     href = `/posyandu/${session.posyanduId}`
  }

  return (
    <Link href={href} className="hover:text-indigo-600 transition">
       Data Anak
    </Link>
  )
}
