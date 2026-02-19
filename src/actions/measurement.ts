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
    // 1. Ambil Data Anak untuk Tanggal Lahir dan Jenis Kelamin
    const anak = await prisma.anak.findUnique({
      where: { id: validated.data.anakId }
    })

    if (!anak) return { success: false, error: 'Data anak tidak ditemukan' }

    // 2. Hitung Umur dalam Bulan
    const measureDate = new Date(validated.data.date)
    const birthDate = new Date(anak.dateOfBirth)
    
    // Cek apakah pengukuran sudah ada untuk bulan dan tahun ini
    const existingMeasurement = await prisma.measurement.findFirst({
        where: {
            anakId: validated.data.anakId,
            date: {
                gte: new Date(measureDate.getFullYear(), measureDate.getMonth(), 1),
                lt: new Date(measureDate.getFullYear(), measureDate.getMonth() + 1, 1)
            }
        }
    })

    if (existingMeasurement) {
        return { 
            success: false, 
            error: `Data pengukuran untuk bulan ${measureDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })} sudah ada. Silahkan edit data yang sudah ada.` 
        }
    }
    
    // Selisih bulan sederhana
    let ageInMonths = (measureDate.getFullYear() - birthDate.getFullYear()) * 12
    ageInMonths -= birthDate.getMonth()
    ageInMonths += measureDate.getMonth()
    
    if (ageInMonths < 0) ageInMonths = 0

    // 3. Hitung Z-Scores
    // BB/U (Berat Badan menurut Umur) -> Gizi Buruk/Kurang/Baik/Lebih
    const zScoreBBU_Val = calculateZScore(validated.data.weight, ageInMonths, anak.gender, 'WAZ')
    const statusBBU = getNutritionalStatus(zScoreBBU_Val).status

    // TB/U (Tinggi Badan menurut Umur) -> Pendek/Sangat Pendek/Normal/Tinggi
    const zScoreTBU_Val = calculateZScore(validated.data.height, ageInMonths, anak.gender, 'HAZ')
    const statusTBU = getStuntingStatus(zScoreTBU_Val).status

    // BB/TB (Berat Badan menurut Tinggi Badan) -> Gizi Buruk/Kurang/Baik/Risiko Lebih/Obesitas
    const zScoreBBTB_Val = calculateZScore(validated.data.weight, validated.data.height, anak.gender, 'WHZ')
    const statusBBTB = getWastingStatus(zScoreBBTB_Val).status

    // 4. Simpan ke Database
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

export async function updateMeasurement(id: string, anakId: string, formData: FormData) {
    const data = {
      anakId,
      date: formData.get('date'),
      weight: parseFloat(formData.get('weight') as string),
      height: parseFloat(formData.get('height') as string),
    }
  
    const validated = MeasurementSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }
  
    try {
      // 1. Ambil Data Anak untuk Tanggal Lahir dan Jenis Kelamin
      const anak = await prisma.anak.findUnique({
        where: { id: validated.data.anakId }
      })
  
      if (!anak) return { success: false, error: 'Data anak tidak ditemukan' }
  
      // 2. Hitung Umur dalam Bulan
      const measureDate = new Date(validated.data.date)
      const birthDate = new Date(anak.dateOfBirth)
      
      // Cek apakah pengukuran lain sudah ada untuk bulan/tahun ini (kecuali yang sedang diedit)
      const existingMeasurement = await prisma.measurement.findFirst({
        where: {
            anakId: validated.data.anakId,
            id: { not: id },
            date: {
                gte: new Date(measureDate.getFullYear(), measureDate.getMonth(), 1),
                lt: new Date(measureDate.getFullYear(), measureDate.getMonth() + 1, 1)
            }
        }
      })

      if (existingMeasurement) {
        return { 
            success: false, 
            error: `Data pengukuran untuk bulan ${measureDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })} sudah ada.` 
        }
      }

      // Selisih bulan sederhana
      let ageInMonths = (measureDate.getFullYear() - birthDate.getFullYear()) * 12
      ageInMonths -= birthDate.getMonth()
      ageInMonths += measureDate.getMonth()
      
      if (ageInMonths < 0) ageInMonths = 0
  
      // 3. Hitung Z-Scores
      const zScoreBBU_Val = calculateZScore(validated.data.weight, ageInMonths, anak.gender, 'WAZ')
      const statusBBU = getNutritionalStatus(zScoreBBU_Val).status
  
      const zScoreTBU_Val = calculateZScore(validated.data.height, ageInMonths, anak.gender, 'HAZ')
      const statusTBU = getStuntingStatus(zScoreTBU_Val).status
  
      const zScoreBBTB_Val = calculateZScore(validated.data.weight, validated.data.height, anak.gender, 'WHZ')
      const statusBBTB = getWastingStatus(zScoreBBTB_Val).status
  
      // 4. Perbarui di Database
      await prisma.measurement.update({
        where: { id },
        data: {
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
      return { success: true, message: 'Data pengukuran berhasil diperbarui' }
  
    } catch (error) {
      console.error('Update Measurement error:', error)
      return { success: false, error: 'Gagal memperbarui pengukuran' }
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

export async function deleteMeasurement(id: string) {
  try {
    const measurement = await prisma.measurement.findUnique({
      where: { id },
      select: { anakId: true }
    })

    if (!measurement) {
      return { success: false, error: 'Data pengukuran tidak ditemukan' }
    }

    await prisma.measurement.delete({
      where: { id }
    })

    revalidatePath(`/dashboard/anak/${measurement.anakId}`)
    return { success: true, message: 'Data pengukuran berhasil dihapus' }
  } catch (error) {
    console.error('Delete Measurement error:', error)
    return { success: false, error: 'Gagal menghapus pengukuran' }
  }
}
