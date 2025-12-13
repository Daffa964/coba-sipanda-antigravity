import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcrypt' // Note: need to install bcrypt and @types/bcrypt

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Seed Posyandu RW 01 - RW 04
  const posyanduData = [
    { name: 'Posyandu RW 01' },
    { name: 'Posyandu RW 02' },
    { name: 'Posyandu RW 03' },
    { name: 'Posyandu RW 04' },
  ]

  for (const p of posyanduData) {
    const posyandu = await prisma.posyandu.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
      },
    })
    console.log(`Created/Ensured Posyandu: ${posyandu.name} (${posyandu.id})`)
  }

  // 2. Seed Admin (Bidan)
  const bidanEmail = 'bidan@kramat.desa.id'
  const hashedPassword = await hash('123456', 10) // Default password
  
  const bidan = await prisma.user.upsert({
    where: { email: bidanEmail },
    update: {},
    create: {
      email: bidanEmail,
      name: 'Bidan Desa Kramat',
      password: hashedPassword,
      role: Role.BIDAN,
    },
  })
  console.log(`Created Bidan User: ${bidan.email}`)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
