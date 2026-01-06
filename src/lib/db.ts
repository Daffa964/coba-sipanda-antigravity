import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Optimize for serverless
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Reuse connection in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Also reuse in production for Vercel Edge caching
if (process.env.NODE_ENV === 'production') globalForPrisma.prisma = prisma
