import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const posyandu01 = await prisma.posyandu.findFirst({
    where: { name: 'Posyandu RW 01' }
  })
  
  if (!posyandu01) throw new Error('Posyandu RW 01 not found')

  const email = 'kader01@kramat.desa.id'
  const hashedPassword = await hash('123456', 10)

  const kader = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Kader RW 01',
      password: hashedPassword,
      role: Role.KADER,
      posyanduId: posyandu01.id
    },
  })

  console.log(`Created Kader: ${kader.email} for ${posyandu01.name}`)
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
