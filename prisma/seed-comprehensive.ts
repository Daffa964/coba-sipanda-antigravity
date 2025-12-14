
import { PrismaClient, Gender } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

// Helper to get random int
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// Generic mock statuses
const STATUS_GIZI = ['Normal', 'Normal', 'Normal', 'Kurang Gizi', 'Gizi Buruk', 'Gizi Lebih']
const STATUS_STUNTING = ['Normal', 'Normal', 'Normal', 'Pendek (Stunted)', 'Sangat Pendek']
const STATUS_WASTING = ['Gizi Baik', 'Gizi Baik', 'Gizi Kurang', 'Gizi Buruk', 'Obesitas']

async function main() {
  console.log('🌱 Starting comprehensive seeding...')

  // 1. Clean up relevant tables
  console.log('Cleaning old data...')
  await prisma.measurement.deleteMany()
  await prisma.anak.deleteMany()
  await prisma.user.deleteMany()
  await prisma.posyandu.deleteMany()

  // 2. Create Bidan
  const passwordHash = await hash('123', 10)
  await prisma.user.create({
    data: {
      name: 'Bidan Desa',
      email: 'bidan@kramat.desa.id',
      password: passwordHash,
      role: 'BIDAN',
    },
  })
  console.log('✅ Created Bidan: bidan@kramat.desa.id')

  // 3. Create 4 Posyandus
  const posyandusData = ['RW 01', 'RW 02', 'RW 03', 'RW 04']
  
  for (const rw of posyandusData) {
    const posyandu = await prisma.posyandu.create({
      data: { name: `Posyandu ${rw}` }
    })
    
    // Create Kader for this Posyandu
    const kaderEmail = `kader${rw.replace(' ', '').toLowerCase()}@kramat.desa.id`
    await prisma.user.create({
      data: {
        name: `Kader ${rw}`,
        email: kaderEmail,
        password: passwordHash,
        role: 'KADER',
        posyanduId: posyandu.id
      }
    })
    console.log(`✅ Created Posyandu ${rw} & Kader: ${kaderEmail}`)

    // 4. Create 10 Children per Posyandu
    for (let i = 1; i <= 10; i++) {
      const gender: Gender = Math.random() > 0.5 ? 'LAKI_LAKI' : 'PEREMPUAN'
      const ageMonths = randomInt(1, 59) // 1 month to ~5 years
      const birthDate = new Date()
      birthDate.setMonth(birthDate.getMonth() - ageMonths)

      const anak = await prisma.anak.create({
        data: {
            name: `Anak ${rw} - ${i}`,
            nik: `330101${randomInt(100000, 999999).toString()}`, // Random NIK partial
            placeOfBirth: 'Tegal',
            dateOfBirth: birthDate,
            gender: gender,
            parentName: `Ortu Anak ${rw} ${i}`,
            posyanduId: posyandu.id
        }
      })

      // 5. Generate History for each child (3-5 measurements)
      const historyCount = randomInt(3, 12)
      let currentAge = Math.max(0, ageMonths - historyCount)
      
      for (let j = 0; j < historyCount; j++) {
        currentAge++
        if (currentAge > ageMonths) break;

        const measureDate = new Date(birthDate)
        measureDate.setMonth(measureDate.getMonth() + currentAge)

        // Generate semi-realistic measurements based on age
        // Base weight/height roughly on WHO median + random noise
        // This is MOCK data, so we don't strictly calculate Z-score here (complex), 
        // we just assign statuses to ensure we have "Red/Yellow/Green" cases.
        
        let statusBBU = 'Normal';
        let statusTBU = 'Normal';
        let statusBBTB = 'Gizi Baik';

        // Intentionally skew some data
        const skew = Math.random()
        if (skew > 0.8) {
             statusTBU = 'Pendek (Stunted)' // 20% stunt chance
        } else if (skew > 0.9) {
             statusBBU = 'Kurang Gizi'
        }

        const weight = 3 + (currentAge * 0.25) + (Math.random()) // Mock weight curve
        const height = 50 + (currentAge * 0.6) + (Math.random()) // Mock height curve

        await prisma.measurement.create({
            data: {
                anakId: anak.id,
                date: measureDate,
                ageInMonths: currentAge,
                weight: parseFloat(weight.toFixed(1)),
                height: parseFloat(height.toFixed(1)),
                zScoreBBU: statusBBU,
                zScoreTBU: statusTBU, // Stunting
                zScoreBBTB: statusBBTB // Wasting
            }
        })
      }
    }
    console.log(`   Detailed ${rw}: Created 10 children with history.`)
  }

  console.log('✅ Seeding complete! 40 Children Created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
