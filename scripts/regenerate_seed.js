// Script to generate new measurements with specific distribution
// 5 stunting, 96% gizi baik, sisanya kurang gizi (4%)

const fs = require('fs');

// Read the original file
const originalContent = fs.readFileSync('./prisma/03-seed-large.sql', 'utf-8');

// Split to get the anak insert section and measurements section
const lines = originalContent.split('\n');

// Find where PENGUKURAN section starts
let measurementStartLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('-- PENGUKURAN DATA')) {
    measurementStartLine = i;
    break;
  }
}

console.log('Measurement section starts at line:', measurementStartLine);

// Get the initial part (posyandu, users, anak)
const headerPart = lines.slice(0, measurementStartLine).join('\n');

// Count anak - there are 1287 children
const totalAnak = 1287;

// Distribution:
// 5 stunting (pendek/sangat pendek) -> TBU 
// 96% gizi baik (normal) = 1235 anak
// 4% kurang gizi (BB kurang) = 52 anak - 5 stunting overlap = 47 pure kurang gizi

const stuntingCount = 5; 
const normalPercent = 0.96;
const normalCount = Math.floor(totalAnak * normalPercent); // 1235
const kurangGiziCount = totalAnak - normalCount; // 52

console.log(`Distribution: Total=${totalAnak}, Normal=${normalCount}, KurangGizi=${kurangGiziCount}, Stunting=${stuntingCount}`);

// Generate measurements
let measurements = [];

// WHO LMS values for normal calculations (simplified, using medians)
const WAZ_MEDIANS = {
  1: 4.5, 3: 6.4, 6: 7.9, 9: 9.0, 12: 9.6, 18: 10.9, 24: 12.2, 
  30: 13.3, 36: 14.3, 42: 15.3, 48: 16.3, 54: 17.3, 60: 18.3
};

const HAZ_MEDIANS = {
  1: 54.7, 3: 61.4, 6: 67.6, 9: 72.0, 12: 75.7, 18: 82.3, 24: 87.1,
  30: 91.9, 36: 96.1, 42: 99.9, 48: 103.3, 54: 106.7, 60: 110.0
};

function getNearestAge(months, table) {
  const ages = Object.keys(table).map(Number);
  let nearest = ages[0];
  for (const age of ages) {
    if (Math.abs(age - months) < Math.abs(nearest - months)) {
      nearest = age;
    }
  }
  return nearest;
}

function getMedianWeight(months) {
  const nearest = getNearestAge(months, WAZ_MEDIANS);
  return WAZ_MEDIANS[nearest];
}

function getMedianHeight(months) {
  const nearest = getNearestAge(months, HAZ_MEDIANS);
  return HAZ_MEDIANS[nearest];
}

// Stunting IDs (first 5)
const stuntingIds = ['a0001', 'a0002', 'a0003', 'a0004', 'a0005'];

// Kurang gizi IDs (next 47 to make 52 total including 5 stunting overlap) 
const kurangGiziIds = [];
for (let i = 6; i <= 52; i++) {
  kurangGiziIds.push(`a${i.toString().padStart(4, '0')}`);
}

for (let i = 1; i <= totalAnak; i++) {
  const anakId = `a${i.toString().padStart(4, '0')}`;
  const measurementId = `m${i.toString().padStart(4, '0')}`;
  
  // Random age between 1-60 months
  const ageInMonths = Math.floor(Math.random() * 60) + 1;
  
  const medianWeight = getMedianWeight(ageInMonths);
  const medianHeight = getMedianHeight(ageInMonths);
  
  let weight, height, zScoreBBU, zScoreTBU, zScoreBBTB, catatan = 'NULL';
  
  if (stuntingIds.includes(anakId)) {
    // STUNTING: Height below -2SD (about 6% below median for HAZ)
    weight = (medianWeight * (0.95 + Math.random() * 0.1)).toFixed(1); // Normal weight
    height = (medianHeight * 0.88).toFixed(1); // Low height (-2SD to -3SD)
    zScoreBBU = 'Normal';
    zScoreTBU = i <= 2 ? 'Sangat Pendek' : 'Pendek'; // 2 sangat pendek, 3 pendek
    zScoreBBTB = 'Gizi Baik';
    catatan = "'Perlu intervensi stunting'";
  } else if (kurangGiziIds.includes(anakId)) {
    // KURANG GIZI: Weight below -2SD (about 20% below median)
    weight = (medianWeight * 0.78).toFixed(1); // Low weight
    height = (medianHeight * (0.96 + Math.random() * 0.08)).toFixed(1); // Normal height
    zScoreBBU = 'BB Kurang';
    zScoreTBU = 'Normal';
    zScoreBBTB = 'Gizi Kurang';
    catatan = "'Berat badan kurang'";
  } else {
    // NORMAL / GIZI BAIK
    weight = (medianWeight * (0.92 + Math.random() * 0.16)).toFixed(1); // 92%-108% of median
    height = (medianHeight * (0.95 + Math.random() * 0.1)).toFixed(1); // 95%-105% of median
    zScoreBBU = 'Normal';
    zScoreTBU = 'Normal';
    zScoreBBTB = 'Gizi Baik';
  }
  
  measurements.push(`('${measurementId}', '${anakId}', NOW(), ${weight}, ${height}, ${ageInMonths}, '${zScoreBBU}', '${zScoreTBU}', '${zScoreBBTB}', ${catatan}, NOW(), NOW())`);
}

// Build the new file content
const newContent = `${headerPart}
-- PENGUKURAN DATA
-- Distribution: ${stuntingCount} Stunting, ${normalCount} Gizi Baik (${(normalCount/totalAnak*100).toFixed(1)}%), ${kurangGiziCount} Kurang Gizi (${(kurangGiziCount/totalAnak*100).toFixed(1)}%)
INSERT INTO "pengukuran" ("pengukuran_id", "anak_id", "tanggal", "berat_badan", "tinggi_badan", "usia_bulan", "z_score_bbu", "z_score_tbu", "z_score_bbtb", "catatan", "tanggal_dibuat", "tanggal_diubah") VALUES
${measurements.join(',\n')};

-- ==========================================================
-- RINGKASAN DATA
-- ==========================================================
-- Total Posyandu: 4
-- Total Users: 5 (1 Bidan + 4 Kader)
-- Total Anak: ${totalAnak}
-- Total Pengukuran: ${totalAnak}
-- 
-- Status Distribution:
-- - Gizi Baik/Normal: ${normalCount} anak (${(normalCount/totalAnak*100).toFixed(1)}%)
-- - Kurang Gizi (BB Kurang): ${kurangGiziCount - stuntingCount} anak (${((kurangGiziCount-stuntingCount)/totalAnak*100).toFixed(1)}%)
-- - Stunting (Pendek/Sangat Pendek): ${stuntingCount} anak (${(stuntingCount/totalAnak*100).toFixed(1)}%)
--
-- LOGIN:
-- Bidan: bidan@kramat.desa.id / 123
-- Kader RW01: kaderrw01@kramat.desa.id / 123
-- Kader RW02: kaderrw02@kramat.desa.id / 123
-- Kader RW03: kaderrw03@kramat.desa.id / 123
-- Kader RW04: kaderrw04@kramat.desa.id / 123
-- ==========================================================
`;

// Write the new file
fs.writeFileSync('./prisma/03-seed-large.sql', newContent);
console.log('Done! New seed file generated.');
console.log(`Stunting: ${stuntingCount}, Normal: ${normalCount}, Kurang Gizi: ${kurangGiziCount}`);
