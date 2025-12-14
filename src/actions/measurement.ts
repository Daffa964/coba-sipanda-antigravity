'use server'

import { prisma } from '@/lib/db'
import { calculateZScore, getNutritionalStatus, getStuntingStatus, getWastingStatus } from '@/lib/zscore'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const MeasurementSchema = z.object({
  anakId: z.string().min(1),
  date: z.string(), // ISO Date
  weight: z.number().min(0.1),
  height: z.number().min(10),
})

export async function createMeasurement(prevState: any, formData: FormData) {
  const data = {
    anakId: formData.get('anakId'),
    date: formData.get('date'),
    weight: parseFloat(formData.get('weight') as string),
    height: parseFloat(formData.get('height') as string),
  }

  const validated = MeasurementSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message }
  }

  try {
    // 1. Get Child Data for DOB and Gender
    const anak = await prisma.anak.findUnique({
      where: { id: validated.data.anakId }
    })

    if (!anak) return { success: false, error: 'Data anak tidak ditemukan' }

    // 2. Calculate Age in Months
    const measureDate = new Date(validated.data.date)
    const birthDate = new Date(anak.dateOfBirth)
    
    // Simple month diff
    let ageInMonths = (measureDate.getFullYear() - birthDate.getFullYear()) * 12
    ageInMonths -= birthDate.getMonth()
    ageInMonths += measureDate.getMonth()
    
    if (ageInMonths < 0) ageInMonths = 0

    // 3. Calculate Z-Scores
    // WAZ (Weight-for-Age) -> Underweight
    const zScoreBBU_Val = calculateZScore(validated.data.weight, ageInMonths, anak.gender, 'WAZ')
    const statusBBU = getNutritionalStatus(zScoreBBU_Val).status

    // HAZ (Height-for-Age) -> Stunting
    const zScoreTBU_Val = calculateZScore(validated.data.height, ageInMonths, anak.gender, 'HAZ')
    const statusTBU = getStuntingStatus(zScoreTBU_Val).status

    // WHZ (Weight-for-Height) -> Wasting
    const zScoreBBTB_Val = calculateZScore(validated.data.weight, validated.data.height, anak.gender, 'WHZ')
    const statusBBTB = getWastingStatus(zScoreBBTB_Val).status

    // 4. Save to DB
    await prisma.measurement.create({
      data: {
        anakId: validated.data.anakId,
        date: measureDate,
        weight: validated.data.weight,
        height: validated.data.height,
        ageInMonths,
        zScoreBBU: statusBBU,
        zScoreTBU: statusTBU,
        zScoreBBTB: statusBBTB,
      }
    })

    revalidatePath(`/dashboard/anak/${validated.data.anakId}`)
    return { success: true, message: 'Data pengukuran berhasil disimpan' }

  } catch (error) {
    console.error('Measurement error:', error)
    return { success: false, error: 'Gagal menyimpan pengukuran' }
  }
}

export async function getMeasurementHistory(anakId: string) {
  try {
    const measurements = await prisma.measurement.findMany({
      where: { anakId },
      orderBy: { date: 'desc' }
    })
    return { success: true, data: measurements }
  } catch (error) {
    return { success: false, data: [] }
  }
}
