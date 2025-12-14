import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

// --- WHO STANDARDS (0-12 MONTHS HIGH RES + YEARLY) ---
// 1. Weight-for-Age (WAZ) - 0 to 5 years (Months)
const WAZ_BOYS: Record<number, { L: number; M: number; S: number }> = {
  0: { L: 0.0322, M: 3.346, S: 0.13847 },
  1: { L: 0.0322, M: 4.471, S: 0.128 },
  2: { L: 0.0322, M: 5.600, S: 0.121 },
  3: { L: 0.0322, M: 6.400, S: 0.116 },
  4: { L: 0.0322, M: 7.000, S: 0.113 },
  5: { L: 0.0322, M: 7.500, S: 0.111 },
  6: { L: 0.0322, M: 7.900, S: 0.110 },
  7: { L: 0.0322, M: 8.300, S: 0.108 },
  8: { L: 0.0322, M: 8.600, S: 0.107 },
  9: { L: 0.0322, M: 8.900, S: 0.106 },
  10: { L: 0.0322, M: 9.200, S: 0.105 },
  11: { L: 0.0322, M: 9.400, S: 0.105 },
  12: { L: 0.0322, M: 9.600, S: 0.104 },
  18: { L: 0.0322, M: 10.9, S: 0.104 },
  24: { L: 0.0322, M: 12.2, S: 0.105 },
  36: { L: 0.0322, M: 14.3, S: 0.110 },
  48: { L: 0.0322, M: 16.3, S: 0.113 },
  60: { L: 0.0322, M: 18.3, S: 0.116 },
}
const WAZ_GIRLS: Record<number, { L: number; M: number; S: number }> = {
  0: { L: 0.0454, M: 3.232, S: 0.14171 },
  1: { L: 0.0454, M: 4.187, S: 0.132 },
  2: { L: 0.0454, M: 5.128, S: 0.124 },
  3: { L: 0.0454, M: 5.845, S: 0.119 },
  4: { L: 0.0454, M: 6.400, S: 0.116 },
  5: { L: 0.0454, M: 6.900, S: 0.113 },
  6: { L: 0.0454, M: 7.300, S: 0.111 },
  7: { L: 0.0454, M: 7.600, S: 0.110 },
  8: { L: 0.0454, M: 7.900, S: 0.109 },
  9: { L: 0.0454, M: 8.200, S: 0.108 },
  10: { L: 0.0454, M: 8.500, S: 0.107 },
  11: { L: 0.0454, M: 8.700, S: 0.107 },
  12: { L: 0.0454, M: 8.900, S: 0.106 },
  18: { L: 0.0454, M: 10.2, S: 0.106 },
  24: { L: 0.0454, M: 11.5, S: 0.108 },
  36: { L: 0.0454, M: 13.9, S: 0.113 },
  48: { L: 0.0454, M: 16.1, S: 0.116 },
  60: { L: 0.0454, M: 18.2, S: 0.119 },
}

// 2. Height-for-Age (HAZ) - 0 to 5 years (Months)
const HAZ_BOYS: Record<number, { L: number; M: number; S: number }> = {
  0: { L: 1, M: 49.9, S: 0.038 },
  1: { L: 1, M: 54.7, S: 0.038 },
  2: { L: 1, M: 58.4, S: 0.038 },
  3: { L: 1, M: 61.4, S: 0.038 },
  4: { L: 1, M: 63.9, S: 0.037 },
  5: { L: 1, M: 65.9, S: 0.037 },
  6: { L: 1, M: 67.6, S: 0.037 },
  7: { L: 1, M: 69.2, S: 0.037 },
  8: { L: 1, M: 70.6, S: 0.037 },
  9: { L: 1, M: 72.0, S: 0.037 },
  10: { L: 1, M: 73.3, S: 0.037 },
  11: { L: 1, M: 74.5, S: 0.037 },
  12: { L: 1, M: 75.7, S: 0.037 },
  18: { L: 1, M: 82.3, S: 0.037 },
  24: { L: 1, M: 87.8, S: 0.037 },
  36: { L: 1, M: 96.1, S: 0.037 },
  48: { L: 1, M: 103.3, S: 0.037 },
  60: { L: 1, M: 110.0, S: 0.037 },
}
const HAZ_GIRLS: Record<number, { L: number; M: number; S: number }> = {
  0: { L: 1, M: 49.1, S: 0.038 },
  1: { L: 1, M: 53.7, S: 0.038 },
  2: { L: 1, M: 57.1, S: 0.038 },
  3: { L: 1, M: 59.8, S: 0.038 },
  4: { L: 1, M: 62.1, S: 0.037 },
  5: { L: 1, M: 64.0, S: 0.037 },
  6: { L: 1, M: 65.7, S: 0.037 },
  7: { L: 1, M: 67.3, S: 0.037 },
  8: { L: 1, M: 68.7, S: 0.037 },
  9: { L: 1, M: 70.1, S: 0.037 },
  10: { L: 1, M: 71.5, S: 0.037 },
  11: { L: 1, M: 72.8, S: 0.037 },
  12: { L: 1, M: 74.0, S: 0.037 },
  18: { L: 1, M: 80.7, S: 0.037 },
  24: { L: 1, M: 86.4, S: 0.037 },
  36: { L: 1, M: 95.1, S: 0.037 },
  48: { L: 1, M: 102.7, S: 0.037 },
  60: { L: 1, M: 109.4, S: 0.037 },
}

function getStandard(age: number, gender: 'LAKI_LAKI' | 'PEREMPUAN', type: 'WAZ' | 'HAZ') {
    let standards: Record<number, any>;
    if (type === 'WAZ') standards = gender === 'LAKI_LAKI' ? WAZ_BOYS : WAZ_GIRLS;
    else standards = gender === 'LAKI_LAKI' ? HAZ_BOYS : HAZ_GIRLS;

    const keys = Object.keys(standards).map(Number).sort((a, b) => a - b)
    const nearest = keys.reduce((prev, curr) => (Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev))
    return standards[nearest]
}

function calculateValueFromZScore(z: number, L: number, M: number, S: number): number {
    return M * Math.pow((1 + L * S * z), 1 / L)
}

function calculateZScore(value: number, age: number, gender: 'LAKI_LAKI' | 'PEREMPUAN', type: 'WAZ' | 'HAZ'): number {
    const std = getStandard(age, gender, type)
    if (!std) return 0
    const { L, M, S } = std
    return parseFloat(((Math.pow(value / M, L) - 1) / (L * S)).toFixed(2))
}

const POSYANDUS = [
  { name: 'Posyandu Mawar' },
  { name: 'Posyandu Melati' },
  { name: 'Posyandu Anggrek' },
  { name: 'Posyandu Kenanga' },
]

async function main() {
  console.log('🌱 Starting Comprehensive Seeding (Synced with Z-Score Charts)...')

  await prisma.measurement.deleteMany()
  await prisma.anak.deleteMany()
  await prisma.user.deleteMany()
  await prisma.posyandu.deleteMany()

  // Create Posyandus
  const createdPosyandus = []
  for (const p of POSYANDUS) {
    const pos = await prisma.posyandu.create({ data: p })
    createdPosyandus.push(pos)
  }

  // Create Bidan
  const pwd = await hash('123', 10)
  await prisma.user.create({
    data: {
      email: 'bidan@kramat.desa.id',
      password: pwd,
      name: 'Bidan Ratna',
      role: 'BIDAN',
    }
  })

  // Create Kaders
  for (let i = 0; i < createdPosyandus.length; i++) {
    await prisma.user.create({
      data: {
        email: `kaderrw0${i+1}@kramat.desa.id`,
        password: pwd,
        name: `Kader ${createdPosyandus[i].name}`,
        role: 'KADER',
        posyanduId: createdPosyandus[i].id
      }
    })
  }

  // Create Children with specific trajectories
  for (let i = 0; i < createdPosyandus.length; i++) {
    const posyandu = createdPosyandus[i]
    console.log(`Generating data for ${posyandu.name}...`)

    for (let j = 0; j < 10; j++) {
      const gender: 'LAKI_LAKI' | 'PEREMPUAN' = j % 2 === 0 ? 'LAKI_LAKI' : 'PEREMPUAN'
      const ageInMonths = 6 + Math.floor(Math.random() * 30) // 6 to ~36 months
      
      const birthDate = new Date()
      birthDate.setMonth(birthDate.getMonth() - ageInMonths)

      // --- GROWTH TRAJECTORY ---
      // 0-6: Normal Growth
      // 7: Mild Stunting (-2.2 SD)
      // 8: Severe Stunting (-3.1 SD)
      // 9: Underweight (-2.5 SD WAZ)
      
      let targetZScoreWAZ = (Math.random() * 1.5) - 0.5 // Normal (-0.5 to 1.0)
      let targetZScoreHAZ = (Math.random() * 1.5) - 0.5

      if (j === 7) { 
         targetZScoreHAZ = -2.3 // Pendek
         targetZScoreWAZ = -1.2 
      }
      if (j === 8) {
         targetZScoreHAZ = -3.2 // Sangat Pendek
         targetZScoreWAZ = -1.8
      }
      if (j === 9) {
         targetZScoreWAZ = -2.6 // Kurang Gizi
         targetZScoreHAZ = -1.5
      }

      const anak = await prisma.anak.create({
        data: {
          name: `Anak ${posyandu.name.split(' ')[1]} ${j+1}`,
          nik: `320101${Math.floor(100000 + Math.random() * 900000)}`,
          gender: gender,
          dateOfBirth: birthDate,
          parentName: `Ibu ${j+1}`,
          posyanduId: posyandu.id
        }
      })

      // Generate history
      const historyCount = 4 + Math.floor(Math.random() * 4) // 4-8 records
      
      for (let k = historyCount; k >= 0; k--) {
          const currentAge = ageInMonths - k
          if (currentAge < 0) continue

          const measureDate = new Date()
          measureDate.setMonth(measureDate.getMonth() - k)

          // 1. Get Params
          const wazParams = getStandard(currentAge, gender, 'WAZ')
          const hazParams = getStandard(currentAge, gender, 'HAZ')

          // 2. Add realistic variance
          // We assume the child generally follows their target curve, but fluctuates slightly
          const noiseW = (Math.random() * 0.3) - 0.15
          const noiseH = (Math.random() * 0.3) - 0.15

          // 3. Calculate Weight/Height from Target Z-Score
          const weight = calculateValueFromZScore(targetZScoreWAZ + noiseW, wazParams.L, wazParams.M, wazParams.S)
          const height = calculateValueFromZScore(targetZScoreHAZ + noiseH, hazParams.L, hazParams.M, hazParams.S)

          // 4. Recalculate strict Status (for DB text columns)
          const zBBU = calculateZScore(weight, currentAge, gender, 'WAZ')
          const zTBU = calculateZScore(height, currentAge, gender, 'HAZ')

          let statusBBU = 'Normal'
          if (zBBU < -3) statusBBU = 'Gizi Buruk'
          else if (zBBU < -2) statusBBU = 'Kurang Gizi'
          else if (zBBU > 2) statusBBU = 'Gizi Lebih'

          let statusTBU = 'Normal'
          if (zTBU < -3) statusTBU = 'Sangat Pendek'
          else if (zTBU < -2) statusTBU = 'Pendek'
          else if (zTBU > 3) statusTBU = 'Tinggi'

          await prisma.measurement.create({
             data: {
               anakId: anak.id,
               date: measureDate,
               weight: parseFloat(weight.toFixed(2)),
               height: parseFloat(height.toFixed(1)),
               ageInMonths: currentAge,
               zScoreBBU: statusBBU,
               zScoreTBU: statusTBU, // Stunting status
               zScoreBBTB: 'Normal' // Ignored in this simulation
             }
          })
      }
    }
  }

  console.log('✅ Seeding complete! Data matches WHO Charts.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
