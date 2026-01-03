import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

// --- WHO STANDARDS (0-12 MONTHS HIGH RES + YEARLY) ---
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

// Posyandu dengan jumlah anak yang spesifik
const POSYANDUS = [
  { name: 'Posyandu RW 01', childCount: 247 },
  { name: 'Posyandu RW 02', childCount: 156 },
  { name: 'Posyandu RW 03', childCount: 505 },
  { name: 'Posyandu RW 04', childCount: 379 },
]

// Nama-nama anak Indonesia yang realistis (diperluas untuk 1287 anak)
const NAMA_DEPAN_LAKI = [
  'Muhammad', 'Ahmad', 'Dimas', 'Budi', 'Andi', 'Rafi', 'Fajar', 'Galih', 'Bagus', 'Arya',
  'Daffa', 'Raffi', 'Rangga', 'Bayu', 'Hendra', 'Yoga', 'Farhan', 'Rizal', 'Ilham', 'Naufal',
  'Alif', 'Danang', 'Fikri', 'Gilang', 'Kevin', 'Aditya', 'Rizky', 'Fauzan', 'Pratama', 'Santoso',
  'Wijaya', 'Hidayat', 'Nugroho', 'Prasetyo', 'Saputra', 'Putra', 'Ramadhan', 'Setiawan', 'Kurniawan',
  'Maulana', 'Firmansyah', 'Akbar', 'Hadi', 'Rahman', 'Surya', 'Hakim', 'Susanto', 'Wahyu', 'Eko',
  'Joko', 'Agus', 'Taufik', 'Irfan', 'Fadli', 'Faisal', 'Hafiz', 'Zaki', 'Raihan', 'Azka'
]

const NAMA_BELAKANG_LAKI = [
  'Pratama', 'Saputra', 'Wijaya', 'Hidayat', 'Nugroho', 'Prasetyo', 'Setiawan', 'Kurniawan',
  'Ramadhan', 'Maulana', 'Firmansyah', 'Akbar', 'Rahman', 'Hakim', 'Putra', 'Santoso',
  'Wibowo', 'Utomo', 'Suryanto', 'Hartono', 'Susilo', 'Gunawan', 'Budiman', 'Halim'
]

const NAMA_DEPAN_PEREMPUAN = [
  'Siti', 'Putri', 'Dewi', 'Aisyah', 'Nabila', 'Bunga', 'Anisa', 'Intan', 'Cantika', 'Dinda',
  'Keisha', 'Aulia', 'Rizka', 'Salsabila', 'Naura', 'Tiara', 'Nazwa', 'Aqila', 'Zara', 'Alya',
  'Maudy', 'Raisa', 'Isyana', 'Gita', 'Feby', 'Citra', 'Rahma', 'Permata', 'Sari', 'Maharani',
  'Azzahra', 'Khansa', 'Safitri', 'Andini', 'Shihab', 'Bilqis', 'Adhisty', 'Rohali', 'Ayunda',
  'Zahra', 'Syifa', 'Ayu', 'Lestari', 'Wulandari', 'Kusuma', 'Anggraini', 'Puspita', 'Rahayu',
  'Septiani', 'Purwanti', 'Wahyuningsih', 'Susanti', 'Alawiyah', 'Sulistyowati', 'Kuswanti'
]

const NAMA_BELAKANG_PEREMPUAN = [
  'Nurhaliza', 'Ayu', 'Lestari', 'Zahra', 'Syifa', 'Citra', 'Rahma', 'Permata', 'Sari', 'Maharani',
  'Azzahra', 'Khansa', 'Safitri', 'Andini', 'Bilqis', 'Adhisty', 'Ayunda', 'Putri', 'Wulandari',
  'Anggraini', 'Puspita', 'Rahayu', 'Septiani', 'Handayani', 'Kusuma', 'Dewi'
]

const NAMA_DEPAN_IBU = [
  'Sri', 'Siti', 'Dewi', 'Ratna', 'Yuni', 'Endang', 'Tutik', 'Rina', 'Ani', 'Lestari',
  'Wati', 'Nur', 'Sari', 'Dian', 'Maya', 'Fitri', 'Indah', 'Lina', 'Nina', 'Eka',
  'Tri', 'Rini', 'Tuti', 'Yanti', 'Heni', 'Sulastri', 'Sumiati', 'Kartini', 'Murni', 'Wiwik',
  'Ningsih', 'Rahayu', 'Suci', 'Puji', 'Hartati', 'Suryani', 'Yulianti', 'Ida', 'Nani', 'Susilowati'
]

const NAMA_BELAKANG_IBU = [
  'Wahyuni', 'Aminah', 'Kartini', 'Sari', 'Astuti', 'Susilowati', 'Handayani', 'Wulandari',
  'Suryani', 'Ningrum', 'Kusuma', 'Hidayah', 'Rahayu', 'Puspita', 'Anggraini', 'Permata',
  'Marlina', 'Septiani', 'Purwanti', 'Lestari', 'Ningsih', 'Hartati', 'Mulyani', 'Yulianti'
]

const TEMPAT_LAHIR = [
  'Kramat', 'Tegal', 'Brebes', 'Pemalang', 'Pekalongan', 'Slawi', 'Adiwerna', 'Talang', 
  'Pangkah', 'Tarub', 'Suradadi', 'Warurejo', 'Warureja', 'Kedungbanteng', 'Dukuhturi',
  'Lebaksiu', 'Jatinegara', 'Margasari', 'Bumijawa', 'Bojong', 'Balapulang', 'Pagerbarang'
]

// Helper untuk generate nama unik
function generateNamaAnak(gender: 'LAKI_LAKI' | 'PEREMPUAN', index: number): string {
  if (gender === 'LAKI_LAKI') {
    const depan = NAMA_DEPAN_LAKI[index % NAMA_DEPAN_LAKI.length]
    const belakang = NAMA_BELAKANG_LAKI[(index + Math.floor(index / NAMA_DEPAN_LAKI.length)) % NAMA_BELAKANG_LAKI.length]
    return `${depan} ${belakang}`
  } else {
    const depan = NAMA_DEPAN_PEREMPUAN[index % NAMA_DEPAN_PEREMPUAN.length]
    const belakang = NAMA_BELAKANG_PEREMPUAN[(index + Math.floor(index / NAMA_DEPAN_PEREMPUAN.length)) % NAMA_BELAKANG_PEREMPUAN.length]
    return `${depan} ${belakang}`
  }
}

function generateNamaIbu(index: number): string {
  const depan = NAMA_DEPAN_IBU[index % NAMA_DEPAN_IBU.length]
  const belakang = NAMA_BELAKANG_IBU[(index + Math.floor(index / NAMA_DEPAN_IBU.length)) % NAMA_BELAKANG_IBU.length]
  return `${depan} ${belakang}`
}

async function main() {
  console.log('🌱 Starting Large-Scale Seeding...')
  console.log('Total children to create: 1287 (247 + 156 + 505 + 379)')

  await prisma.measurement.deleteMany()
  await prisma.anak.deleteMany()
  await prisma.user.deleteMany()
  await prisma.posyandu.deleteMany()

  // Create Posyandus
  const createdPosyandus = []
  for (const p of POSYANDUS) {
    const pos = await prisma.posyandu.create({ data: { name: p.name } })
    createdPosyandus.push({ ...pos, childCount: p.childCount })
  }

  // Create Bidan
  const pwd = await hash('123', 10)
  await prisma.user.create({
    data: {
      email: 'bidan@kramat.desa.id',
      password: pwd,
      name: 'Bidan Ratna Dewi',
      role: 'BIDAN',
    }
  })

  // Create Kaders
  const NAMA_KADER = ['Ibu Sumarni', 'Ibu Darmi', 'Ibu Tumini', 'Ibu Lastri']
  for (let i = 0; i < createdPosyandus.length; i++) {
    await prisma.user.create({
      data: {
        email: `kaderrw0${i+1}@kramat.desa.id`,
        password: pwd,
        name: NAMA_KADER[i],
        role: 'KADER',
        posyanduId: createdPosyandus[i].id
      }
    })
  }

  let globalLakiIndex = 0
  let globalPerempuanIndex = 0
  let globalIbuIndex = 0
  let totalCreated = 0

  // Create Children with specific counts per Posyandu
  for (const posyandu of createdPosyandus) {
    console.log(`\nGenerating ${posyandu.childCount} children for ${posyandu.name}...`)
    
    const batchSize = 50
    const batches = Math.ceil(posyandu.childCount / batchSize)

    for (let batch = 0; batch < batches; batch++) {
      const startIdx = batch * batchSize
      const endIdx = Math.min(startIdx + batchSize, posyandu.childCount)
      
      for (let j = startIdx; j < endIdx; j++) {
        const gender: 'LAKI_LAKI' | 'PEREMPUAN' = j % 2 === 0 ? 'LAKI_LAKI' : 'PEREMPUAN'
        const ageInMonths = 1 + Math.floor(Math.random() * 59) // 1 to 60 months (0-5 years)
        
        const birthDate = new Date()
        birthDate.setMonth(birthDate.getMonth() - ageInMonths)

        // Get nama anak
        let namaAnak: string
        if (gender === 'LAKI_LAKI') {
          namaAnak = generateNamaAnak(gender, globalLakiIndex++)
        } else {
          namaAnak = generateNamaAnak(gender, globalPerempuanIndex++)
        }

        const namaIbu = generateNamaIbu(globalIbuIndex++)
        const tempatLahir = TEMPAT_LAHIR[Math.floor(Math.random() * TEMPAT_LAHIR.length)]

        // --- GROWTH TRAJECTORY ---
        // Distribution: ~80% Normal, ~10% Pendek, ~5% Sangat Pendek, ~5% Kurang Gizi
        const rand = Math.random()
        let targetZScoreWAZ = (Math.random() * 2) - 0.5 // Normal (-0.5 to 1.5)
        let targetZScoreHAZ = (Math.random() * 2) - 0.5

        if (rand > 0.95) { 
          // 5% Sangat Pendek
          targetZScoreHAZ = -3.0 - (Math.random() * 0.5)
          targetZScoreWAZ = -1.5 - (Math.random() * 0.5)
        } else if (rand > 0.90) {
          // 5% Kurang Gizi
          targetZScoreWAZ = -2.5 - (Math.random() * 0.5)
          targetZScoreHAZ = -1.0 - (Math.random() * 0.5)
        } else if (rand > 0.80) {
          // 10% Pendek
          targetZScoreHAZ = -2.2 - (Math.random() * 0.5)
          targetZScoreWAZ = -1.0 - (Math.random() * 0.5)
        }

        const anak = await prisma.anak.create({
          data: {
            name: namaAnak,
            nik: `3328${String(Math.floor(10000000000 + Math.random() * 90000000000)).slice(0, 12)}`,
            gender: gender,
            dateOfBirth: birthDate,
            placeOfBirth: tempatLahir,
            parentName: namaIbu,
            posyanduId: posyandu.id
          }
        })

        // Generate 3-6 measurement history records
        const historyCount = 3 + Math.floor(Math.random() * 4)
        
        for (let k = historyCount; k >= 0; k--) {
          const currentAge = ageInMonths - k
          if (currentAge < 0) continue

          const measureDate = new Date()
          measureDate.setMonth(measureDate.getMonth() - k)

          const wazParams = getStandard(currentAge, gender, 'WAZ')
          const hazParams = getStandard(currentAge, gender, 'HAZ')

          const noiseW = (Math.random() * 0.4) - 0.2
          const noiseH = (Math.random() * 0.4) - 0.2

          const weight = calculateValueFromZScore(targetZScoreWAZ + noiseW, wazParams.L, wazParams.M, wazParams.S)
          const height = calculateValueFromZScore(targetZScoreHAZ + noiseH, hazParams.L, hazParams.M, hazParams.S)

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
              zScoreTBU: statusTBU,
              zScoreBBTB: 'Normal'
            }
          })
        }

        totalCreated++
      }

      console.log(`  Batch ${batch + 1}/${batches} complete (${endIdx}/${posyandu.childCount})`)
    }
  }

  console.log(`\n✅ Seeding complete! Total children created: ${totalCreated}`)
  console.log('Distribution:')
  for (const p of POSYANDUS) {
    console.log(`  - ${p.name}: ${p.childCount} children`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
