export type Gender = 'LAKI_LAKI' | 'PEREMPUAN'

// Inverse Box-Cox to get value from Z-Score
// Value = M * (1 + L * S * Z)^(1/L)
function calculateValueFromZScore(z: number, L: number, M: number, S: number): number {
  return M * Math.pow((1 + L * S * z), 1 / L)
}

export function getGrowthReference(gender: Gender, type: 'WAZ' | 'HAZ') {
  const standards = type === 'WAZ' 
    ? (gender === 'LAKI_LAKI' ? WAZ_BOYS : WAZ_GIRLS)
    : (gender === 'LAKI_LAKI' ? HAZ_BOYS : HAZ_GIRLS)

  const zUpper = type === 'WAZ' ? 1 : 3 // BB/U +1SD (Permenkes), TB/U +3SD
  const zLower = -2

  return Object.entries(standards).map(([month, params]) => {
    const { L, M, S } = params
    return {
      ageInMonths: parseInt(month),
      upperLimit: parseFloat(calculateValueFromZScore(zUpper, L, M, S).toFixed(2)),
      lowerLimit: parseFloat(calculateValueFromZScore(zLower, L, M, S).toFixed(2)),
      median: parseFloat(M.toFixed(2))
    }
  }).sort((a, b) => a.ageInMonths - b.ageInMonths)
}

// Simplified WHO Standards
// Source: WHO Child Growth Standards

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

// 2. Height-for-Age (HAZ) - 0 to 5 years (Months) -> Detects Stunting
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

// 3. Weight-for-Height (WHZ) - 45cm to 120cm (Height) -> Detects Wasting
// Note: Key here is Height (cm), rounded to nearest .5 or 1
const WHZ_BOYS: Record<number, { L: number; M: number; S: number }> = {
  50: { L: 0.826, M: 3.4, S: 0.08 },
  60: { L: 0.826, M: 5.7, S: 0.08 },
  70: { L: 0.826, M: 8.3, S: 0.08 },
  80: { L: 0.826, M: 10.6, S: 0.08 },
  90: { L: 0.826, M: 12.9, S: 0.08 },
  100: { L: 0.826, M: 15.3, S: 0.08 },
  110: { L: 0.826, M: 18.0, S: 0.08 },
}
const WHZ_GIRLS: Record<number, { L: number; M: number; S: number }> = {
  50: { L: 0.697, M: 3.4, S: 0.08 },
  60: { L: 0.697, M: 5.5, S: 0.08 },
  70: { L: 0.697, M: 8.0, S: 0.08 },
  80: { L: 0.697, M: 10.3, S: 0.08 },
  90: { L: 0.697, M: 12.6, S: 0.08 },
  100: { L: 0.697, M: 15.1, S: 0.08 },
  110: { L: 0.697, M: 18.0, S: 0.08 },
}

// Helper to get standard
function getStandard(
    value: number, 
    gender: Gender, 
    type: 'WAZ' | 'HAZ' | 'WHZ'
  ) {
  let standards: Record<number, {L: number, M: number, S: number}>;

  if (type === 'WAZ') standards = gender === 'LAKI_LAKI' ? WAZ_BOYS : WAZ_GIRLS;
  else if (type === 'HAZ') standards = gender === 'LAKI_LAKI' ? HAZ_BOYS : HAZ_GIRLS;
  else standards = gender === 'LAKI_LAKI' ? WHZ_BOYS : WHZ_GIRLS; // WHZ

  // Find nearest key
  const keys = Object.keys(standards).map(Number).sort((a, b) => a - b)
  
  // For WHZ, value is Height. For Others, value is Month.
  // We use the same finding logic: nearest neighbor
  const nearest = keys.reduce((prev, curr) => {
    return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev)
  })

  return standards[nearest]
}

export function calculateZScore(
  measurementValue: number, // The value being evaluated (Weight for WAZ/WHZ, Height for HAZ)
  basisValue: number, // The basis (Age Month for WAZ/HAZ, Height for WHZ)
  gender: Gender,
  type: 'WAZ' | 'HAZ' | 'WHZ' = 'WAZ'
): number {
  // Determine what we are looking up.
  // if type == WHZ, basisValue is Height. measurementValue is Weight.
  // if type == HAZ, basisValue is Month. measurementValue is Height.
  // if type == WAZ, basisValue is Month. measurementValue is Weight.
  
  const std = getStandard(basisValue, gender, type)
  if (!std) return 0

  const { L, M, S } = std
  
  // Box-Cox Formula
  const zScore = (Math.pow(measurementValue / M, L) - 1) / (L * S)
  return parseFloat(zScore.toFixed(2))
}

export function getNutritionalStatus(zScore: number): { status: string; color: string } {
  // BB/U (Weight-for-Age) - Permenkes No 2 2020
  if (zScore < -3) return { status: 'BB Sangat Kurang', color: 'bg-red-600 text-white' }
  if (zScore < -2) return { status: 'BB Kurang', color: 'bg-orange-500 text-white' }
  if (zScore > 1) return { status: 'Risiko BB Lebih', color: 'bg-yellow-500 text-white' }
  return { status: 'Normal', color: 'bg-green-500 text-white' }
}

export function getStuntingStatus(zScore: number): { status: string; color: string } {
    // TB/U (Height-for-Age) - Permenkes No 2 2020
    if (zScore < -3) return { status: 'Sangat Pendek', color: 'bg-red-600 text-white' }
    if (zScore < -2) return { status: 'Pendek', color: 'bg-red-500 text-white' } // Still red/danger for stunting
    if (zScore > 3) return { status: 'Tinggi', color: 'bg-blue-500 text-white' }
    return { status: 'Normal', color: 'bg-green-500 text-white' }
}

export function getWastingStatus(zScore: number): { status: string; color: string } {
    // BB/TB (Weight-for-Height)
    if (zScore < -3) return { status: 'Gizi Buruk', color: 'bg-red-600 text-white' }
    if (zScore < -2) return { status: 'Gizi Kurang', color: 'bg-orange-500 text-white' }
    if (zScore > 3) return { status: 'Obesitas', color: 'bg-red-600 text-white' }
    if (zScore > 2) return { status: 'Gizi Lebih', color: 'bg-yellow-500 text-white' }
    return { status: 'Gizi Baik', color: 'bg-green-500 text-white' }
}
