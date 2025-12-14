'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema Validation
const AnakSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  placeOfBirth: z.string().optional(),
  dateOfBirth: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', 'Tanggal lahir tidak valid'),
  gender: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
  parentName: z.string().min(1, 'Nama Orang Tua wajib diisi'),
  posyanduId: z.string().min(1, 'Posyandu wajib dipilih'),
})

export async function getAnakList(posyanduId?: string, query?: string) {
  const cookieStore = await (await import('next/headers')).cookies()
  const cookie = cookieStore.get('session')?.value
  const session = cookie ? await (await import('@/lib/auth')).verifySession(cookie) : null
  
  const where: any = {}

  // Enforce Access Control
  if (session?.role === 'KADER') {
     // Force filter by their Posyandu ID
     where.posyanduId = session.posyanduId
  } else if (posyanduId) {
     // Admin/Bidan can filter (or if public API used correctly)
     where.posyanduId = posyanduId
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { nik: { contains: query } },
      { parentName: { contains: query, mode: 'insensitive' } },
    ]
  }

  try {
    const anak = await prisma.anak.findMany({
      where,
      include: {
        posyandu: true,
        measurements: {
          take: 1,
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: anak }
  } catch (error) {
    console.error('Error fetching anak:', error)
    return { success: false, error: 'Gagal mengambil data anak' }
  }
}

export async function createAnak(prevState: any, formData: FormData) {
  const data = {
    name: formData.get('name'),
    nik: formData.get('nik'),
    placeOfBirth: formData.get('placeOfBirth'),
    dateOfBirth: formData.get('dateOfBirth'),
    gender: formData.get('gender'),
    parentName: formData.get('parentName'),
    posyanduId: formData.get('posyanduId'),
  }

  // Validate
  const validated = AnakSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message }
  }

  try {
    // Check Unique NIK
    const existing = await prisma.anak.findUnique({
      where: { nik: validated.data.nik },
    })
    if (existing) {
      return { success: false, error: 'NIK sudah terdaftar' }
    }

    // Enforce Posyandu ID for Kader
    const cookieStore = await (await import('next/headers')).cookies()
    const cookie = cookieStore.get('session')?.value
    const session = cookie ? await (await import('@/lib/auth')).verifySession(cookie) : null
    
    let finalPosyanduId = validated.data.posyanduId
    if (session?.role === 'KADER') {
       finalPosyanduId = session.posyanduId as string
    }

    await prisma.anak.create({
      data: {
        name: validated.data.name,
        nik: validated.data.nik,
        placeOfBirth: validated.data.placeOfBirth || '',
        dateOfBirth: new Date(validated.data.dateOfBirth),
        gender: validated.data.gender,
        parentName: validated.data.parentName,
        posyanduId: finalPosyanduId,
      },
    })

    revalidatePath('/dashboard/anak')
    revalidatePath(`/posyandu/${validated.data.posyanduId}`)
    return { success: true, message: 'Data anak berhasil ditambahkan' }
  } catch (error) {
    console.error('Create anak error:', error)
    return { success: false, error: 'Gagal menyimpan data anak' }
  }
}

export async function getPosyanduList() {
  try {
    const posyandu = await prisma.posyandu.findMany()
    return posyandu
  } catch (error) {
    return []
  }
}
