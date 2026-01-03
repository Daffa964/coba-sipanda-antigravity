'use server'

import { prisma } from '@/lib/db'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function getMonthlyReport(
  month: number, // 1-12
  year: number,
  posyanduId?: string
) {
  try {
    const startDate = startOfMonth(new Date(year, month - 1))
    const endDate = endOfMonth(new Date(year, month - 1))

    const whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate
      }
    }

    if (posyanduId) {
      whereClause.anak = {
        posyanduId: posyanduId
      }
    }

    // Fetch measurements for the period
    const measurements = await prisma.measurement.findMany({
      where: whereClause,
      include: {
        anak: {
          include: {
            posyandu: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate Stats
    const totalMeasurements = measurements.length
    let stuntingCount = 0
    let wastingCount = 0
    let underweightCount = 0
    let normalCount = 0

    // Deduplicate logic: If a child was measured multiple times in a month, should we count them once or multiple times?
    // Usually for reports, we want unique children. Let's process by unique child if multiple measurements exist.
    // For simplicity in this v1, we will process all measurements but we might want to filter latest per child.
    // Let's filter to keep only the LATEST measurement for each child in this month to avoid double counting status.
    
    const uniqueMeasurementsMap = new Map()
    
    measurements.forEach((m) => {
        if (!uniqueMeasurementsMap.has(m.anakId)) {
            uniqueMeasurementsMap.set(m.anakId, m)
        } else {
            // If exists, check if this one is newer (although we sorted by date desc, so the first one should be latest)
        }
    })
    
    const uniqueMeasurements = Array.from(uniqueMeasurementsMap.values())
    const totalChildrenMeasured = uniqueMeasurements.length

    uniqueMeasurements.forEach((m) => {
      const isStunted = m.zScoreTBU?.includes('Pendek') || m.zScoreTBU?.includes('Sangat Pendek')
      const isWasted = m.zScoreBBTB?.includes('Gizi Kurang') || m.zScoreBBTB?.includes('Gizi Buruk')
      const isUnderweight = m.zScoreBBU?.includes('Kurang') || m.zScoreBBU?.includes('Buruk') // Simplification

      if (isStunted) stuntingCount++
      if (isWasted) wastingCount++
      if (isUnderweight) underweightCount++

      if (!isStunted && !isWasted && !isUnderweight) normalCount++
    })

    return {
      success: true,
      data: {
        meta: {
          month,
          year,
          posyanduId,
          generatedAt: new Date()
        },
        stats: {
          totalMeasurements,
          totalChildrenMeasured,
          stuntingCount,
          wastingCount,
          underweightCount,
          normalCount
        },
        measurements: measurements // Return all logs for the table
      }
    }

  } catch (error) {
    console.error('Error generating report:', error)
    return { success: false, error: 'Failed to generate report' }
  }
}
