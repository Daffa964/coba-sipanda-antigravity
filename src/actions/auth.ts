'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { signSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: 'Email tidak ditemukan' }
    }

    // Verify Password - support both hashed and plain text for testing
    let passwordValid = false
    if (user.password.startsWith('$2')) {
      // Hashed password
      passwordValid = await bcrypt.compare(password, user.password)
    } else {
      // Plain text password (for testing only)
      passwordValid = password === user.password
    }
    if (!passwordValid) {
      return { error: 'Password salah' }
    }

    // Create Session
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      posyanduId: user.posyanduId,
    }
    const token = await signSession(sessionPayload)

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'lax',
       path: '/',
       maxAge: 60 * 60 * 24, // 1 day
    })

    // Determine redirect URL
    const redirectTo = user.role === 'BIDAN' ? '/dashboard' : `/posyandu/${user.posyanduId}`
    redirect(redirectTo)

  } catch (error) {
    if ((error as any).message === 'NEXT_REDIRECT') throw error
    console.error('Login error:', error)
    return { error: 'Terjadi kesalahan sistem' }
  }
} 

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
