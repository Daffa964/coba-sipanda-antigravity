import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret'
const key = new TextEncoder().encode(SECRET_KEY)

export async function signSession(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Session lasts 24 hours
    .sign(key)
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export function getUserFromSession(payload: any) {
   // Helper to extract type-safe user data if needed
   return payload
}
