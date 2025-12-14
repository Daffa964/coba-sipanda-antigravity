import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database connection...')
  try {
    await prisma.$connect()
    console.log('Database connection successful!')
    
    const count = await prisma.user.count()
    console.log(`User count: ${count}`)
    
    // Check if the user exists
    const users = await prisma.user.findMany()
    console.log('Users found:', users.map(u => ({ email: u.email, role: u.role })))

  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
