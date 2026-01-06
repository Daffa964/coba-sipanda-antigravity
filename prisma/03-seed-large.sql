-- ==========================================================
-- SI-PANDA Large Seed Data (1287 anak)
-- Jalankan SETELAH 01-schema.sql di Supabase SQL Editor
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

-- ==========================================================
-- ANAK DATA GENERATOR (untuk 1287 anak)
-- Menggunakan generate_series PostgreSQL
-- ==========================================================

-- Fungsi untuk generate nama acak
DO $$
DECLARE
  nama_depan_laki TEXT[] := ARRAY['Muhammad', 'Ahmad', 'Dimas', 'Budi', 'Andi', 'Rafi', 'Fajar', 'Galih', 'Bagus', 'Arya', 'Daffa', 'Raffi', 'Rangga', 'Bayu', 'Hendra', 'Yoga', 'Farhan', 'Rizal', 'Ilham', 'Naufal', 'Alif', 'Danang', 'Fikri', 'Gilang', 'Kevin', 'Aditya', 'Rizky', 'Fauzan', 'Pratama', 'Santoso', 'Wijaya', 'Hidayat', 'Nugroho', 'Prasetyo', 'Saputra', 'Putra', 'Ramadhan', 'Setiawan', 'Kurniawan', 'Maulana'];
  nama_belakang_laki TEXT[] := ARRAY['Pratama', 'Saputra', 'Wijaya', 'Hidayat', 'Nugroho', 'Prasetyo', 'Setiawan', 'Kurniawan', 'Ramadhan', 'Maulana', 'Firmansyah', 'Akbar', 'Rahman', 'Hakim', 'Putra', 'Santoso', 'Wibowo', 'Utomo', 'Suryanto', 'Hartono', 'Susilo', 'Gunawan', 'Budiman', 'Halim'];
  nama_depan_perempuan TEXT[] := ARRAY['Siti', 'Putri', 'Dewi', 'Aisyah', 'Nabila', 'Bunga', 'Anisa', 'Intan', 'Cantika', 'Dinda', 'Keisha', 'Aulia', 'Rizka', 'Salsabila', 'Naura', 'Tiara', 'Nazwa', 'Aqila', 'Zara', 'Alya', 'Maudy', 'Raisa', 'Isyana', 'Gita', 'Feby', 'Citra', 'Rahma', 'Permata', 'Sari', 'Maharani', 'Azzahra', 'Khansa', 'Safitri', 'Andini', 'Bilqis', 'Adhisty', 'Ayunda', 'Zahra', 'Syifa', 'Ayu'];
  nama_belakang_perempuan TEXT[] := ARRAY['Nurhaliza', 'Ayu', 'Lestari', 'Zahra', 'Syifa', 'Citra', 'Rahma', 'Permata', 'Sari', 'Maharani', 'Azzahra', 'Khansa', 'Safitri', 'Andini', 'Bilqis', 'Adhisty', 'Ayunda', 'Putri', 'Wulandari', 'Anggraini', 'Puspita', 'Rahayu', 'Septiani', 'Handayani', 'Kusuma', 'Dewi'];
  nama_ibu TEXT[] := ARRAY['Sri Wahyuni', 'Dewi Kartini', 'Ratna Sari', 'Endang Susilowati', 'Maya Anggraini', 'Yuni Hartati', 'Nur Hidayah', 'Tri Lestari', 'Eka Suryani', 'Rini Wulandari', 'Siti Aminah', 'Dian Puspita', 'Fitri Rahayu', 'Indah Kusuma', 'Lina Septiani', 'Nina Handayani', 'Puji Astuti', 'Rina Marlina', 'Suci Purwanti', 'Tuti Wahyuni', 'Wati Sulistyowati', 'Yanti Kuswanti', 'Ani Susanti', 'Budi Hartini', 'Citra Ningrum'];
  tempat_lahir TEXT[] := ARRAY['Kramat', 'Tegal', 'Slawi', 'Brebes', 'Pemalang', 'Pekalongan', 'Adiwerna', 'Talang', 'Pangkah', 'Tarub'];
  
  posyandu_data RECORD;
  posyandus TEXT[][] := ARRAY[['rw01', '247'], ['rw02', '156'], ['rw03', '505'], ['rw04', '379']];
  
  anak_counter INTEGER := 0;
  laki_idx INTEGER := 0;
  perempuan_idx INTEGER := 0;
  
  gender TEXT;
  nama TEXT;
  age_months INTEGER;
  birth_date DATE;
  z_bbu TEXT;
  z_tbu TEXT;
  weight NUMERIC;
  height NUMERIC;
  rand_val NUMERIC;
  
  pos_id TEXT;
  pos_count INTEGER;
  i INTEGER;
  j INTEGER;
BEGIN
  FOR i IN 1..4 LOOP
    pos_id := posyandus[i][1];
    pos_count := posyandus[i][2]::INTEGER;
    
    FOR j IN 1..pos_count LOOP
      anak_counter := anak_counter + 1;
      
      -- Alternate gender
      IF j % 2 = 1 THEN
        gender := 'LAKI_LAKI';
        laki_idx := laki_idx + 1;
        nama := nama_depan_laki[1 + (laki_idx % array_length(nama_depan_laki, 1))] || ' ' || 
                nama_belakang_laki[1 + ((laki_idx + laki_idx / array_length(nama_depan_laki, 1)) % array_length(nama_belakang_laki, 1))];
      ELSE
        gender := 'PEREMPUAN';
        perempuan_idx := perempuan_idx + 1;
        nama := nama_depan_perempuan[1 + (perempuan_idx % array_length(nama_depan_perempuan, 1))] || ' ' || 
                nama_belakang_perempuan[1 + ((perempuan_idx + perempuan_idx / array_length(nama_depan_perempuan, 1)) % array_length(nama_belakang_perempuan, 1))];
      END IF;
      
      -- Random age 1-60 months
      age_months := 1 + floor(random() * 59)::INTEGER;
      birth_date := CURRENT_DATE - (age_months || ' months')::INTERVAL;
      
      -- Status distribution: 80% normal, 10% pendek, 5% sangat pendek, 5% kurang gizi
      rand_val := random();
      z_bbu := 'Normal';
      z_tbu := 'Normal';
      
      IF rand_val > 0.95 THEN
        z_tbu := 'Sangat Pendek';
        z_bbu := 'Kurang Gizi';
      ELSIF rand_val > 0.90 THEN
        z_bbu := 'Kurang Gizi';
      ELSIF rand_val > 0.80 THEN
        z_tbu := 'Pendek';
      END IF;
      
      -- Realistic weight/height based on age
      weight := ROUND((3.5 + (age_months * 0.4) + (random() - 0.5) * 2)::NUMERIC, 1);
      height := ROUND((50 + (age_months * 1.5) + (random() - 0.5) * 5)::NUMERIC, 1);
      
      -- Insert Anak
      INSERT INTO "anak" ("anak_id", "nik", "nama", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "nama_orangtua", "posyandu_id", "tanggal_dibuat", "tanggal_diubah")
      VALUES (
        'a' || LPAD(anak_counter::TEXT, 4, '0'),
        '3328010100' || LPAD(anak_counter::TEXT, 6, '0'),
        nama,
        tempat_lahir[1 + floor(random() * array_length(tempat_lahir, 1))::INTEGER],
        birth_date,
        gender,
        nama_ibu[1 + (anak_counter % array_length(nama_ibu, 1))],
        pos_id,
        NOW(),
        NOW()
      );
      
      -- Insert Pengukuran
      INSERT INTO "pengukuran" ("pengukuran_id", "anak_id", "tanggal", "berat_badan", "tinggi_badan", "usia_bulan", "z_score_bbu", "z_score_tbu", "z_score_bbtb", "catatan", "tanggal_dibuat", "tanggal_diubah")
      VALUES (
        'm' || LPAD(anak_counter::TEXT, 4, '0'),
        'a' || LPAD(anak_counter::TEXT, 4, '0'),
        NOW(),
        weight,
        height,
        age_months,
        z_bbu,
        z_tbu,
        'Normal',
        NULL,
        NOW(),
        NOW()
      );
      
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Successfully inserted % children with measurements!', anak_counter;
END $$;

-- ==========================================================
-- SUMMARY
-- ==========================================================
-- Total Anak: 1287 (RW01: 247, RW02: 156, RW03: 505, RW04: 379)
-- Total Users: 5 (1 Bidan + 4 Kader)
-- Status Distribution: ~80% Normal, ~10% Pendek, ~5% Sangat Pendek, ~5% Kurang Gizi
--
-- Login: bidan@kramat.desa.id / 123
-- ==========================================================
