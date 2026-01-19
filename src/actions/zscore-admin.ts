'use server'

import { prisma } from '@/lib/db'
import { calculateZScore, getNutritionalStatus, getStuntingStatus, getWastingStatus } from '@/lib/zscore'
import { Gender } from '@prisma/client'

/**
 * Recalculate all Z-scores for existing measurements.
 * This ensures consistency between stored status and actual Z-score calculations.
 */
export async function recalculateAllZScores() {
  try {
    // Get all children with their measurements
    const children = await prisma.anak.findMany({
      include: {
        measurements: true
      }
    })

    let updatedCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const child of children) {
      const gender = child.gender as Gender

      for (const measurement of child.measurements) {
        try {
          // Calculate Z-Scores using the same logic as createMeasurement
          // WAZ (Weight-for-Age) -> Underweight
          const zScoreBBU_Val = calculateZScore(measurement.weight, measurement.ageInMonths, gender, 'WAZ')
          const statusBBU = getNutritionalStatus(zScoreBBU_Val).status

          // HAZ (Height-for-Age) -> Stunting
          const zScoreTBU_Val = calculateZScore(measurement.height, measurement.ageInMonths, gender, 'HAZ')
          const statusTBU = getStuntingStatus(zScoreTBU_Val).status

          // WHZ (Weight-for-Height) -> Wasting
          const zScoreBBTB_Val = calculateZScore(measurement.weight, measurement.height, gender, 'WHZ')
          const statusBBTB = getWastingStatus(zScoreBBTB_Val).status

          // Check if any status changed
          const needsUpdate = 
            measurement.zScoreBBU !== statusBBU ||
            measurement.zScoreTBU !== statusTBU ||
            measurement.zScoreBBTB !== statusBBTB

          if (needsUpdate) {
            await prisma.measurement.update({
              where: { id: measurement.id },
              data: {
                zScoreBBU: statusBBU,
                zScoreTBU: statusTBU,
                zScoreBBTB: statusBBTB
              }
            })
            updatedCount++
          }
        } catch (measurementError) {
          errorCount++
          errors.push(`Measurement ${measurement.id}: ${measurementError}`)
        }
      }
    }

    return {
      success: true,
      message: `Recalculated Z-scores. Updated: ${updatedCount} measurements. Errors: ${errorCount}`,
      updatedCount,
      errorCount,
      errors: errors.slice(0, 10) // Only return first 10 errors
    }

  } catch (error) {
    console.error('Recalculate Z-scores error:', error)
    return { success: false, error: 'Failed to recalculate Z-scores' }
  }
}

/**
 * Get a summary of current Z-score distribution to verify consistency
 */
export async function getZScoreSummary() {
  try {
    const measurements = await prisma.measurement.findMany({
      include: {
        anak: true
      }
    })

    const summary = {
      total: measurements.length,
      bbu: {
        normal: 0,
        bbKurang: 0,
        bbSangatKurang: 0,
        bbLebih: 0,
        other: 0
      },
      tbu: {
        normal: 0,
        pendek: 0,
        sangatPendek: 0,
        tinggi: 0,
        other: 0
      },
      bbtb: {
        giziBaik: 0,
        giziKurang: 0,
        giziBuruk: 0,
        giziLebih: 0,
        obesitas: 0,
        other: 0
      },
      inconsistencies: [] as { id: string; name: string; issue: string }[]
    }

    for (const m of measurements) {
      // Count BBU status
      if (m.zScoreBBU === 'Normal') summary.bbu.normal++
      else if (m.zScoreBBU === 'BB Kurang') summary.bbu.bbKurang++
      else if (m.zScoreBBU === 'BB Sangat Kurang') summary.bbu.bbSangatKurang++
      else if (m.zScoreBBU === 'Risiko BB Lebih') summary.bbu.bbLebih++
      else summary.bbu.other++

      // Count TBU status
      if (m.zScoreTBU === 'Normal') summary.tbu.normal++
      else if (m.zScoreTBU === 'Pendek') summary.tbu.pendek++
      else if (m.zScoreTBU === 'Sangat Pendek') summary.tbu.sangatPendek++
      else if (m.zScoreTBU === 'Tinggi') summary.tbu.tinggi++
      else summary.tbu.other++

      // Count BBTB status
      if (m.zScoreBBTB === 'Gizi Baik') summary.bbtb.giziBaik++
      else if (m.zScoreBBTB === 'Gizi Kurang') summary.bbtb.giziKurang++
      else if (m.zScoreBBTB === 'Gizi Buruk') summary.bbtb.giziBuruk++
      else if (m.zScoreBBTB === 'Gizi Lebih') summary.bbtb.giziLebih++
      else if (m.zScoreBBTB === 'Obesitas') summary.bbtb.obesitas++
      else summary.bbtb.other++

      // Recalculate and check for inconsistencies
      const gender = m.anak.gender as Gender
      const expectedBBU = getNutritionalStatus(calculateZScore(m.weight, m.ageInMonths, gender, 'WAZ')).status
      const expectedTBU = getStuntingStatus(calculateZScore(m.height, m.ageInMonths, gender, 'HAZ')).status
      const expectedBBTB = getWastingStatus(calculateZScore(m.weight, m.height, gender, 'WHZ')).status

      if (m.zScoreBBU !== expectedBBU || m.zScoreTBU !== expectedTBU || m.zScoreBBTB !== expectedBBTB) {
        summary.inconsistencies.push({
          id: m.id,
          name: m.anak.name,
          issue: `BBU: ${m.zScoreBBU} -> ${expectedBBU}, TBU: ${m.zScoreTBU} -> ${expectedTBU}, BBTB: ${m.zScoreBBTB} -> ${expectedBBTB}`
        })
      }
    }

    return { success: true, data: summary }

  } catch (error) {
    console.error('Get Z-score summary error:', error)
    return { success: false, error: 'Failed to get summary' }
  }
}
