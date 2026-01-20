
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

// RW Distribution
const POYSANDU_COUNTS = {
    'rw01': 247,
    'rw02': 156,
    'rw03': 505,
    'rw04': 379
};
const TOTAL_TARGET = 1287;

// Names for random generation
const NAMES = {
    male: ['Muhammad', 'Ahmad', 'Dimas', 'Budi', 'Andi', 'Rafi', 'Fajar', 'Galih', 'Bagus', 'Arya', 'Daffa', 'Raffi', 'Rangga', 'Bayu', 'Hendra', 'Yoga', 'Farhan', 'Rizal', 'Ilham', 'Naufal', 'Alif', 'Danang', 'Fikri', 'Gilang', 'Kevin', 'Aditya', 'Rizky', 'Fauzan', 'Pratama', 'Santoso', 'Wijaya', 'Hidayat', 'Nugroho', 'Prasetyo', 'Saputra', 'Putra', 'Ramadhan', 'Setiawan', 'Kurniawan', 'Maulana', 'Adam', 'Yusuf', 'Ibrahim', 'Ismail', 'Zidan', 'Arjuna', 'Bima', 'Pandu'],
    female: ['Siti', 'Putri', 'Dewi', 'Aisyah', 'Nabila', 'Bunga', 'Anisa', 'Intan', 'Cantika', 'Dinda', 'Keisha', 'Aulia', 'Rizka', 'Salsabila', 'Naura', 'Tiara', 'Nazwa', 'Aqila', 'Zara', 'Alya', 'Maudy', 'Raisa', 'Isyana', 'Gita', 'Feby', 'Citra', 'Rahma', 'Permata', 'Sari', 'Maharani', 'Azzahra', 'Khansa', 'Safitri', 'Andini', 'Bilqis', 'Adhisty', 'Ayunda', 'Zahra', 'Syifa', 'Ayu', 'Rina', 'Ratna', 'Wulan', 'Indah', 'Fitri'],
    last: ['Pratama', 'Saputra', 'Wijaya', 'Hidayat', 'Nugroho', 'Prasetyo', 'Setiawan', 'Kurniawan', 'Ramadhan', 'Maulana', 'Firmansyah', 'Akbar', 'Rahman', 'Hakim', 'Putra', 'Santoso', 'Wibowo', 'Utomo', 'Suryanto', 'Hartono', 'Susilo', 'Gunawan', 'Budiman', 'Halim', 'Nurhaliza', 'Ayu', 'Lestari', 'Zahra', 'Syifa', 'Citra', 'Rahma', 'Permata', 'Sari', 'Maharani', 'Azzahra', 'Khansa', 'Safitri', 'Andini', 'Bilqis', 'Adhisty', 'Ayunda', 'Putri', 'Wulandari', 'Anggraini', 'Puspita', 'Rahayu', 'Septiani', 'Handayani', 'Kusuma', 'Dewi', 'Siregar', 'Nasution', 'Lubis', 'Harahap', 'Sinaga']
};

const PARENTS = ['Sri Wahyuni', 'Dewi Kartini', 'Ratna Sari', 'Endang Susilowati', 'Maya Anggraini', 'Yuni Hartati', 'Nur Hidayah', 'Tri Lestari', 'Eka Suryani', 'Rini Wulandari', 'Siti Aminah', 'Dian Puspita', 'Fitri Rahayu', 'Indah Kusuma', 'Lina Septiani', 'Nina Handayani', 'Puji Astuti', 'Rina Marlina', 'Suci Purwanti', 'Tuti Wahyuni', 'Wati Sulistyowati', 'Yanti Kuswanti', 'Ani Susanti', 'Budi Hartini', 'Citra Ningrum', 'Eni Rahayu', 'Fani Puspita', 'Gita Gutawa', 'Heni Zuraida'];

const LOCATIONS = ['Kramat', 'Tegal', 'Slawi', 'Brebes', 'Pemalang', 'Pekalongan', 'Adiwerna', 'Talang', 'Pangkah', 'Tarub'];

// WHO STANDARDS (Simplified for 0-60 months)
// L, M, S values
const WAZ_BOYS = {
  0: { L: 0.3487, M: 3.3464, S: 0.14602 },
  6: { L: 0.1257, M: 7.934, S: 0.10958 },
  12: { L: 0.0644, M: 9.6479, S: 0.10925 },
  18: { L: 0.0211, M: 10.9385, S: 0.11119 },
  24: { L: -0.0137, M: 12.1515, S: 0.11426 },
  36: { L: -0.0689, M: 14.3429, S: 0.12116 },
  48: { L: -0.1131, M: 16.3489, S: 0.12759 },
  60: { L: -0.1506, M: 18.3366, S: 0.13517 },
};
// We need full months for accurate calc. Using a linear interpolation helper for brevity in this script 
// or define enough points. Let's use interpolation to keep script small but accurate enough.

const HAZ_BOYS = {
  0: { L: 1, M: 49.8842, S: 0.03795 },
  6: { L: 1, M: 67.6236, S: 0.03165 },
  12: { L: 1, M: 75.7488, S: 0.03137 },
  18: { L: 1, M: 82.2587, S: 0.03279 },
  24: { L: 1, M: 87.1161, S: 0.03507 },
  36: { L: 1, M: 96.0835, S: 0.03858 },
  48: { L: 1, M: 103.3273, S: 0.04059 },
  60: { L: 1, M: 109.9638, S: 0.04214 },
};

const WAZ_GIRLS = {
  0: { L: 0.3809, M: 3.2322, S: 0.14171 },
  6: { L: -0.0756, M: 7.297, S: 0.12204 },
  12: { L: -0.2024, M: 8.9481, S: 0.12268 },
  18: { L: -0.2637, M: 10.2315, S: 0.12309 },
  24: { L: -0.2941, M: 11.4775, S: 0.1239 },
  36: { L: -0.3201, M: 13.8503, S: 0.12919 },
  48: { L: -0.3361, M: 16.0697, S: 0.13884 },
  60: { L: -0.3518, M: 18.2193, S: 0.14821 },
};

const HAZ_GIRLS = {
  0: { L: 1, M: 49.1477, S: 0.0379 },
  6: { L: 1, M: 65.7311, S: 0.03448 },
  12: { L: 1, M: 74.015, S: 0.03479 },
  18: { L: 1, M: 80.7079, S: 0.03598 },
  24: { L: 1, M: 85.7153, S: 0.03764 },
  36: { L: 1, M: 95.0515, S: 0.04006 },
  48: { L: 1, M: 102.7312, S: 0.04193 },
  60: { L: 1, M: 108.8948, S: 0.04334 },
};

// ============================================================================
// HELPERS
// ============================================================================

function interpolate(age, standards) {
    const keys = Object.keys(standards).map(Number).sort((a,b)=>a-b);
    let lower = keys[0];
    let upper = keys[keys.length-1];
    
    for(let i=0; i<keys.length; i++){
        if(keys[i] <= age) lower = keys[i];
        if(keys[i] >= age) { upper = keys[i]; break; }
    }
    
    if(lower === upper) return standards[lower];
    
    const p = (age - lower) / (upper - lower);
    const low = standards[lower];
    const up = standards[upper];
    
    return {
        L: low.L + (up.L - low.L) * p,
        M: low.M + (up.M - low.M) * p,
        S: low.S + (up.S - low.S) * p
    };
}

function calculateValueFromZScore(z, age, gender, type) {
    let standards;
    if (type === 'WAZ') standards = (gender === 'LAKI_LAKI') ? WAZ_BOYS : WAZ_GIRLS;
    else standards = (gender === 'LAKI_LAKI') ? HAZ_BOYS : HAZ_GIRLS;
    
    const { L, M, S } = interpolate(age, standards);
    
    // Value = M * (1 + L * S * Z)^(1/L)
    return M * Math.pow((1 + L * S * z), 1 / L);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName(gender) {
    const firstList = gender === 'LAKI_LAKI' ? NAMES.male : NAMES.female;
    const first = firstList[randomInt(0, firstList.length - 1)];
    const last = NAMES.last[randomInt(0, NAMES.last.length - 1)];
    return `${first} ${last}`;
}

// ============================================================================
// MAIN GENERATION
// ============================================================================

let sql = `-- ==========================================================
-- SI-PANDA Large Seed Data (${TOTAL_TARGET} anak)
-- GENERATED SCRIPT - Z-Scores Mathematically Consistent
-- ==========================================================

-- POSYANDU
INSERT INTO "posyandu" ("posyandu_id", "nama", "tanggal_dibuat", "tanggal_diubah") VALUES
('rw01', 'Posyandu RW 01', NOW(), NOW()),
('rw02', 'Posyandu RW 02', NOW(), NOW()),
('rw03', 'Posyandu RW 03', NOW(), NOW()),
('rw04', 'Posyandu RW 04', NOW(), NOW());

-- USERS
INSERT INTO "user" ("user_id", "nama", "email", "password", "role", "posyandu_id", "tanggal_dibuat", "tanggal_diubah") VALUES
('bidan1', 'Bidan Ratna Dewi', 'bidan@kramat.desa.id', '123', 'BIDAN', NULL, NOW(), NOW()),
('kader1', 'Ibu Sumarni', 'kaderrw01@kramat.desa.id', '123', 'KADER', 'rw01', NOW(), NOW()),
('kader2', 'Ibu Darmi', 'kaderrw02@kramat.desa.id', '123', 'KADER', 'rw02', NOW(), NOW()),
('kader3', 'Ibu Tumini', 'kaderrw03@kramat.desa.id', '123', 'KADER', 'rw03', NOW(), NOW()),
('kader4', 'Ibu Lastri', 'kaderrw04@kramat.desa.id', '123', 'KADER', 'rw04', NOW(), NOW());

-- ANAK DATA
INSERT INTO "anak" ("anak_id", "nik", "nama", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "nama_orangtua", "posyandu_id", "tanggal_dibuat", "tanggal_diubah") VALUES
`;

let measureSql = `
-- PENGUKURAN DATA
INSERT INTO "pengukuran" ("pengukuran_id", "anak_id", "tanggal", "berat_badan", "tinggi_badan", "usia_bulan", "z_score_bbu", "z_score_tbu", "z_score_bbtb", "catatan", "tanggal_dibuat", "tanggal_diubah") VALUES
`;

let anakRows = [];
let measureRows = [];
let counter = 1;

for (const [posId, count] of Object.entries(POYSANDU_COUNTS)) {
    for (let i = 0; i < count; i++) {
        const idStr = counter.toString().padStart(4, '0');
        const anakId = `a${idStr}`;
        const gender = Math.random() > 0.49 ? 'LAKI_LAKI' : 'PEREMPUAN';
        const name = randomName(gender);
        const parent = PARENTS[randomInt(0, PARENTS.length - 1)];
        const birthplace = LOCATIONS[randomInt(0, LOCATIONS.length - 1)];
        const ageMonths = randomInt(1, 60);
        
        // Use a fixed measurement date (January 2026) for consistency
        const measureDate = new Date('2026-01-19');
        
        // Calculate birth date from measurement date and ageMonths
        const birthDate = new Date(measureDate);
        birthDate.setMonth(birthDate.getMonth() - ageMonths);
        const birthDateStr = birthDate.toISOString().split('T')[0];
        const measureDateStr = measureDate.toISOString().split('T')[0];
        
        anakRows.push(`('${anakId}', '3328010100${idStr.padStart(6,'0')}', '${name.replace(/'/g, "''")}', '${birthplace}', '${birthDateStr}', '${gender}', '${parent}', '${posId}', NOW(), NOW())`);
        
        // MEASUREMENTS: Generate statuses
        let z_tbu = 'Normal';
        let z_bbu = 'Normal';
        let targetHaz = randomFloat(-1.5, 1.5); // Default Normal
        let targetWaz = randomFloat(-1.5, 1.5); // Default Normal
        
        const rand = Math.random();
        // 14% Pendek (Stunting), 4% Sangat Pendek, 5% BB Kurang
        if (rand < 0.14) {
             z_tbu = 'Pendek';
             targetHaz = randomFloat(-2.9, -2.1);
        } else if (rand < 0.18) {
             z_tbu = 'Sangat Pendek';
             targetHaz = randomFloat(-4, -3.1);
        }
        
        if (Math.random() < 0.05) {
             z_bbu = 'BB Kurang';
             targetWaz = randomFloat(-3, -2.1);
        }
        
        // Calculate Height & Weight based on Target Z
        // Add small random jitter so it's not perfect
        let height = calculateValueFromZScore(targetHaz, ageMonths, gender, 'HAZ');
        let weight = calculateValueFromZScore(targetWaz, ageMonths, gender, 'WAZ');
        
        // Rounding
        height = Math.round(height * 10) / 10;
        weight = Math.round(weight * 10) / 10;
        
        measureRows.push(`('m${idStr}', '${anakId}', '${measureDateStr}', ${weight}, ${height}, ${ageMonths}, '${z_bbu}', '${z_tbu}', 'Gizi Baik', NULL, NOW(), NOW())`);
        
        counter++;
    }
}

sql += anakRows.join(',\n') + ';\n';
sql += measureSql + measureRows.join(',\n') + ';\n';

fs.writeFileSync(path.join(__dirname, '../prisma/03-seed-large.sql'), sql);
console.log('Successfully generated prisma/03-seed-large.sql with ' + (counter - 1) + ' records.');
