import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { signSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Email tidak ditemukan' }, { status: 401 })
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
      return NextResponse.json({ error: 'Password salah' }, { status: 401 })
    }

    // Create Session
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      posyanduId: user.posyanduId, // Important for middleware check
    }
    const token = await signSession(sessionPayload)

    // Set Cookie
    const response = NextResponse.json({ success: true, redirectTo: user.role === 'BIDAN' ? '/dashboard' : `/posyandu/${user.posyanduId}` })
    
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
