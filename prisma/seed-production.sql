-- ==========================================================
-- SI-PANDA Database Seed for Supabase
-- Desa Kramat - Sistem Informasi Pantau Anak Desa
-- ==========================================================

-- Clear existing data (in correct order due to foreign keys)
DELETE FROM "pengukuran";
DELETE FROM "anak";
DELETE FROM "user";
DELETE FROM "posyandu";

-- ==========================================================
-- POSYANDU DATA (4 RW)
-- ==========================================================
INSERT INTO "posyandu" ("posyandu_id", "nama", "tanggal_dibuat", "tanggal_diubah") VALUES
('rw01', 'Posyandu RW 01', NOW(), NOW()),
('rw02', 'Posyandu RW 02', NOW(), NOW()),
('rw03', 'Posyandu RW 03', NOW(), NOW()),
('rw04', 'Posyandu RW 04', NOW(), NOW());

-- ==========================================================
-- USER DATA (Bidan + 4 Kader)
-- Password: 123 (plain text for testing)
-- ==========================================================
INSERT INTO "user" ("user_id", "nama", "email", "password", "role", "posyandu_id", "tanggal_dibuat", "tanggal_diubah") VALUES
('bidan1', 'Bidan Ratna Dewi', 'bidan@kramat.desa.id', '123', 'BIDAN', NULL, NOW(), NOW()),
('kader1', 'Ibu Sumarni', 'kaderrw01@kramat.desa.id', '123', 'KADER', 'rw01', NOW(), NOW()),
('kader2', 'Ibu Darmi', 'kaderrw02@kramat.desa.id', '123', 'KADER', 'rw02', NOW(), NOW()),
('kader3', 'Ibu Tumini', 'kaderrw03@kramat.desa.id', '123', 'KADER', 'rw03', NOW(), NOW()),
('kader4', 'Ibu Lastri', 'kaderrw04@kramat.desa.id', '123', 'KADER', 'rw04', NOW(), NOW());

-- ==========================================================
-- ANAK DATA (100 anak dengan distribusi per RW)
-- RW 01: 25 anak, RW 02: 20 anak, RW 03: 35 anak, RW 04: 20 anak
-- ==========================================================

-- RW 01 (25 anak)
INSERT INTO "anak" ("anak_id", "nik", "nama", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "nama_orangtua", "posyandu_id", "tanggal_dibuat", "tanggal_diubah") VALUES
('a001', '3328010100000001', 'Muhammad Pratama', 'Kramat', '2024-01-15', 'LAKI_LAKI', 'Sri Wahyuni', 'rw01', NOW(), NOW()),
('a002', '3328010100000002', 'Putri Azzahra', 'Tegal', '2023-06-20', 'PEREMPUAN', 'Dewi Kartini', 'rw01', NOW(), NOW()),
('a003', '3328010100000003', 'Ahmad Fauzan', 'Slawi', '2023-09-10', 'LAKI_LAKI', 'Ratna Sari', 'rw01', NOW(), NOW()),
('a004', '3328010100000004', 'Keisha Nurhaliza', 'Brebes', '2024-02-05', 'PEREMPUAN', 'Endang Susilowati', 'rw01', NOW(), NOW()),
('a005', '3328010100000005', 'Dimas Setiawan', 'Kramat', '2023-03-18', 'LAKI_LAKI', 'Maya Anggraini', 'rw01', NOW(), NOW()),
('a006', '3328010100000006', 'Aulia Rahma', 'Pemalang', '2023-11-22', 'PEREMPUAN', 'Yuni Hartati', 'rw01', NOW(), NOW()),
('a007', '3328010100000007', 'Rafi Hidayat', 'Tegal', '2024-04-08', 'LAKI_LAKI', 'Nur Hidayah', 'rw01', NOW(), NOW()),
('a008', '3328010100000008', 'Nabila Safitri', 'Kramat', '2023-08-14', 'PEREMPUAN', 'Tri Lestari', 'rw01', NOW(), NOW()),
('a009', '3328010100000009', 'Bagus Nugroho', 'Slawi', '2023-05-30', 'LAKI_LAKI', 'Eka Suryani', 'rw01', NOW(), NOW()),
('a010', '3328010100000010', 'Intan Permata', 'Kramat', '2024-01-02', 'PEREMPUAN', 'Rini Wulandari', 'rw01', NOW(), NOW()),
('a011', '3328010100000011', 'Arya Wijaya', 'Brebes', '2023-07-25', 'LAKI_LAKI', 'Siti Aminah', 'rw01', NOW(), NOW()),
('a012', '3328010100000012', 'Cantika Dewi', 'Tegal', '2023-12-11', 'PEREMPUAN', 'Dian Puspita', 'rw01', NOW(), NOW()),
('a013', '3328010100000013', 'Fajar Rahman', 'Kramat', '2024-03-07', 'LAKI_LAKI', 'Fitri Rahayu', 'rw01', NOW(), NOW()),
('a014', '3328010100000014', 'Salsabila Ayu', 'Pemalang', '2023-10-19', 'PEREMPUAN', 'Indah Kusuma', 'rw01', NOW(), NOW()),
('a015', '3328010100000015', 'Galih Prasetyo', 'Slawi', '2023-04-03', 'LAKI_LAKI', 'Lina Septiani', 'rw01', NOW(), NOW()),
('a016', '3328010100000016', 'Tiara Maharani', 'Kramat', '2024-02-28', 'PEREMPUAN', 'Nina Handayani', 'rw01', NOW(), NOW()),
('a017', '3328010100000017', 'Hendra Kurniawan', 'Tegal', '2023-09-05', 'LAKI_LAKI', 'Puji Astuti', 'rw01', NOW(), NOW()),
('a018', '3328010100000018', 'Nazwa Khansa', 'Kramat', '2023-06-12', 'PEREMPUAN', 'Rina Marlina', 'rw01', NOW(), NOW()),
('a019', '3328010100000019', 'Yoga Maulana', 'Brebes', '2024-01-20', 'LAKI_LAKI', 'Suci Purwanti', 'rw01', NOW(), NOW()),
('a020', '3328010100000020', 'Aqila Zahra', 'Kramat', '2023-08-28', 'PEREMPUAN', 'Tuti Wahyuni', 'rw01', NOW(), NOW()),
('a021', '3328010100000021', 'Farhan Akbar', 'Slawi', '2023-11-15', 'LAKI_LAKI', 'Wati Sulistyowati', 'rw01', NOW(), NOW()),
('a022', '3328010100000022', 'Zara Bilqis', 'Tegal', '2024-04-22', 'PEREMPUAN', 'Yanti Kuswanti', 'rw01', NOW(), NOW()),
('a023', '3328010100000023', 'Rizal Firmansyah', 'Kramat', '2023-03-09', 'LAKI_LAKI', 'Ani Susanti', 'rw01', NOW(), NOW()),
('a024', '3328010100000024', 'Alya Putri', 'Pemalang', '2023-07-17', 'PEREMPUAN', 'Budi Hartini', 'rw01', NOW(), NOW()),
('a025', '3328010100000025', 'Ilham Saputra', 'Kramat', '2024-02-14', 'LAKI_LAKI', 'Citra Ningrum', 'rw01', NOW(), NOW()),

-- RW 02 (20 anak)
('a026', '3328010100000026', 'Naufal Ramadhan', 'Tegal', '2023-05-21', 'LAKI_LAKI', 'Dewi Lestari', 'rw02', NOW(), NOW()),
('a027', '3328010100000027', 'Maudy Andini', 'Kramat', '2023-10-08', 'PEREMPUAN', 'Eni Rahayu', 'rw02', NOW(), NOW()),
('a028', '3328010100000028', 'Alif Hakim', 'Slawi', '2024-01-25', 'LAKI_LAKI', 'Fitri Puspita', 'rw02', NOW(), NOW()),
('a029', '3328010100000029', 'Raisa Citra', 'Brebes', '2023-08-03', 'PEREMPUAN', 'Gita Anggraini', 'rw02', NOW(), NOW()),
('a030', '3328010100000030', 'Danang Susanto', 'Kramat', '2023-12-19', 'LAKI_LAKI', 'Heni Suryani', 'rw02', NOW(), NOW()),
('a031', '3328010100000031', 'Isyana Rahma', 'Tegal', '2024-03-14', 'PEREMPUAN', 'Ida Yulianti', 'rw02', NOW(), NOW()),
('a032', '3328010100000032', 'Fikri Wibowo', 'Pemalang', '2023-06-27', 'LAKI_LAKI', 'Jumi Hartati', 'rw02', NOW(), NOW()),
('a033', '3328010100000033', 'Gita Permata', 'Kramat', '2023-09-22', 'PEREMPUAN', 'Karni Mulyani', 'rw02', NOW(), NOW()),
('a034', '3328010100000034', 'Gilang Utomo', 'Slawi', '2024-02-08', 'LAKI_LAKI', 'Lastri Ningrum', 'rw02', NOW(), NOW()),
('a035', '3328010100000035', 'Feby Sari', 'Kramat', '2023-04-15', 'PEREMPUAN', 'Murni Handayani', 'rw02', NOW(), NOW()),
('a036', '3328010100000036', 'Kevin Suryanto', 'Tegal', '2023-11-30', 'LAKI_LAKI', 'Nani Kusuma', 'rw02', NOW(), NOW()),
('a037', '3328010100000037', 'Citra Wulandari', 'Brebes', '2024-04-05', 'PEREMPUAN', 'Oni Septiani', 'rw02', NOW(), NOW()),
('a038', '3328010100000038', 'Aditya Hartono', 'Kramat', '2023-07-12', 'LAKI_LAKI', 'Peni Purwanti', 'rw02', NOW(), NOW()),
('a039', '3328010100000039', 'Rahma Kusuma', 'Slawi', '2023-10-28', 'PEREMPUAN', 'Rani Lestari', 'rw02', NOW(), NOW()),
('a040', '3328010100000040', 'Rizky Gunawan', 'Kramat', '2024-01-08', 'LAKI_LAKI', 'Sari Ningsih', 'rw02', NOW(), NOW()),
('a041', '3328010100000041', 'Permata Dewi', 'Tegal', '2023-05-04', 'PEREMPUAN', 'Tini Hartati', 'rw02', NOW(), NOW()),
('a042', '3328010100000042', 'Fauzan Budiman', 'Pemalang', '2023-12-25', 'LAKI_LAKI', 'Uni Mulyani', 'rw02', NOW(), NOW()),
('a043', '3328010100000043', 'Sari Anggraini', 'Kramat', '2024-03-20', 'PEREMPUAN', 'Vina Yulianti', 'rw02', NOW(), NOW()),
('a044', '3328010100000044', 'Pratama Halim', 'Slawi', '2023-08-17', 'LAKI_LAKI', 'Weni Rahayu', 'rw02', NOW(), NOW()),
('a045', '3328010100000045', 'Maharani Putri', 'Kramat', '2023-11-03', 'PEREMPUAN', 'Yeni Puspita', 'rw02', NOW(), NOW()),

-- RW 03 (35 anak)
('a046', '3328010100000046', 'Santoso Wijaya', 'Tegal', '2024-02-18', 'LAKI_LAKI', 'Zulfa Anggraini', 'rw03', NOW(), NOW()),
('a047', '3328010100000047', 'Azzahra Andini', 'Kramat', '2023-06-05', 'PEREMPUAN', 'Aminah Suryani', 'rw03', NOW(), NOW()),
('a048', '3328010100000048', 'Hidayat Nugroho', 'Brebes', '2023-09-28', 'LAKI_LAKI', 'Bintang Hartati', 'rw03', NOW(), NOW()),
('a049', '3328010100000049', 'Khansa Bilqis', 'Slawi', '2024-01-12', 'PEREMPUAN', 'Cahaya Mulyani', 'rw03', NOW(), NOW()),
('a050', '3328010100000050', 'Nugroho Prasetyo', 'Kramat', '2023-04-25', 'LAKI_LAKI', 'Dina Ningrum', 'rw03', NOW(), NOW()),
('a051', '3328010100000051', 'Safitri Ayu', 'Tegal', '2023-08-08', 'PEREMPUAN', 'Eva Handayani', 'rw03', NOW(), NOW()),
('a052', '3328010100000052', 'Prasetyo Kurniawan', 'Pemalang', '2023-12-02', 'LAKI_LAKI', 'Fina Kusuma', 'rw03', NOW(), NOW()),
('a053', '3328010100000053', 'Adhisty Zahra', 'Kramat', '2024-03-28', 'PEREMPUAN', 'Gina Septiani', 'rw03', NOW(), NOW()),
('a054', '3328010100000054', 'Setiawan Akbar', 'Slawi', '2023-07-20', 'LAKI_LAKI', 'Hana Purwanti', 'rw03', NOW(), NOW()),
('a055', '3328010100000055', 'Rohali Putri', 'Tegal', '2023-10-15', 'PEREMPUAN', 'Ira Lestari', 'rw03', NOW(), NOW()),
('a056', '3328010100000056', 'Kurniawan Maulana', 'Kramat', '2024-02-02', 'LAKI_LAKI', 'Juni Ningsih', 'rw03', NOW(), NOW()),
('a057', '3328010100000057', 'Ayunda Bilqis', 'Brebes', '2023-05-18', 'PEREMPUAN', 'Kani Hartati', 'rw03', NOW(), NOW()),
('a058', '3328010100000058', 'Maulana Firmansyah', 'Slawi', '2023-09-02', 'LAKI_LAKI', 'Lani Mulyani', 'rw03', NOW(), NOW()),
('a059', '3328010100000059', 'Zahra Syifa', 'Kramat', '2024-01-28', 'PEREMPUAN', 'Mani Yulianti', 'rw03', NOW(), NOW()),
('a060', '3328010100000060', 'Firmansyah Akbar', 'Tegal', '2023-04-10', 'LAKI_LAKI', 'Nani Rahayu', 'rw03', NOW(), NOW()),
('a061', '3328010100000061', 'Syifa Rahma', 'Pemalang', '2023-08-25', 'PEREMPUAN', 'Oni Puspita', 'rw03', NOW(), NOW()),
('a062', '3328010100000062', 'Akbar Hadi', 'Kramat', '2023-12-18', 'LAKI_LAKI', 'Puti Anggraini', 'rw03', NOW(), NOW()),
('a063', '3328010100000063', 'Ayu Lestari', 'Slawi', '2024-04-12', 'PEREMPUAN', 'Rani Suryani', 'rw03', NOW(), NOW()),
('a064', '3328010100000064', 'Hadi Rahman', 'Tegal', '2023-07-05', 'LAKI_LAKI', 'Sani Hartati', 'rw03', NOW(), NOW()),
('a065', '3328010100000065', 'Lestari Wulandari', 'Kramat', '2023-10-30', 'PEREMPUAN', 'Tani Mulyani', 'rw03', NOW(), NOW()),
('a066', '3328010100000066', 'Rahman Surya', 'Brebes', '2024-02-22', 'LAKI_LAKI', 'Uni Ningrum', 'rw03', NOW(), NOW()),
('a067', '3328010100000067', 'Wulandari Kusuma', 'Slawi', '2023-06-15', 'PEREMPUAN', 'Vani Handayani', 'rw03', NOW(), NOW()),
('a068', '3328010100000068', 'Surya Hakim', 'Kramat', '2023-09-08', 'LAKI_LAKI', 'Wani Kusuma', 'rw03', NOW(), NOW()),
('a069', '3328010100000069', 'Kusuma Anggraini', 'Tegal', '2024-01-05', 'PEREMPUAN', 'Yani Septiani', 'rw03', NOW(), NOW()),
('a070', '3328010100000070', 'Hakim Susanto', 'Kramat', '2023-04-18', 'LAKI_LAKI', 'Zani Purwanti', 'rw03', NOW(), NOW()),
('a071', '3328010100000071', 'Anggraini Puspita', 'Pemalang', '2023-08-12', 'PEREMPUAN', 'Ani Lestari', 'rw03', NOW(), NOW()),
('a072', '3328010100000072', 'Susanto Wahyu', 'Slawi', '2023-12-05', 'LAKI_LAKI', 'Bani Ningsih', 'rw03', NOW(), NOW()),
('a073', '3328010100000073', 'Puspita Rahayu', 'Kramat', '2024-03-08', 'PEREMPUAN', 'Cani Hartati', 'rw03', NOW(), NOW()),
('a074', '3328010100000074', 'Wahyu Eko', 'Tegal', '2023-07-28', 'LAKI_LAKI', 'Dani Mulyani', 'rw03', NOW(), NOW()),
('a075', '3328010100000075', 'Rahayu Septiani', 'Brebes', '2023-11-22', 'PEREMPUAN', 'Eni Yulianti', 'rw03', NOW(), NOW()),
('a076', '3328010100000076', 'Eko Joko', 'Kramat', '2024-02-28', 'LAKI_LAKI', 'Fani Rahayu', 'rw03', NOW(), NOW()),
('a077', '3328010100000077', 'Septiani Purwanti', 'Slawi', '2023-05-15', 'PEREMPUAN', 'Gani Puspita', 'rw03', NOW(), NOW()),
('a078', '3328010100000078', 'Joko Agus', 'Tegal', '2023-09-20', 'LAKI_LAKI', 'Hani Anggraini', 'rw03', NOW(), NOW()),
('a079', '3328010100000079', 'Purwanti Handayani', 'Kramat', '2024-01-18', 'PEREMPUAN', 'Iani Suryani', 'rw03', NOW(), NOW()),
('a080', '3328010100000080', 'Agus Taufik', 'Pemalang', '2023-04-02', 'LAKI_LAKI', 'Juni Hartati', 'rw03', NOW(), NOW()),

-- RW 04 (20 anak)
('a081', '3328010100000081', 'Taufik Irfan', 'Slawi', '2023-08-18', 'LAKI_LAKI', 'Kani Mulyani', 'rw04', NOW(), NOW()),
('a082', '3328010100000082', 'Handayani Rahayu', 'Kramat', '2023-12-12', 'PEREMPUAN', 'Lani Ningrum', 'rw04', NOW(), NOW()),
('a083', '3328010100000083', 'Irfan Fadli', 'Tegal', '2024-04-02', 'LAKI_LAKI', 'Mani Handayani', 'rw04', NOW(), NOW()),
('a084', '3328010100000084', 'Wahyuningsih Dewi', 'Brebes', '2023-07-08', 'PEREMPUAN', 'Nani Kusuma', 'rw04', NOW(), NOW()),
('a085', '3328010100000085', 'Fadli Faisal', 'Kramat', '2023-10-25', 'LAKI_LAKI', 'Oni Septiani', 'rw04', NOW(), NOW()),
('a086', '3328010100000086', 'Susanti Lestari', 'Slawi', '2024-02-05', 'PEREMPUAN', 'Pani Purwanti', 'rw04', NOW(), NOW()),
('a087', '3328010100000087', 'Faisal Hafiz', 'Tegal', '2023-05-28', 'LAKI_LAKI', 'Rani Lestari', 'rw04', NOW(), NOW()),
('a088', '3328010100000088', 'Alawiyah Zahra', 'Kramat', '2023-09-15', 'PEREMPUAN', 'Sani Ningsih', 'rw04', NOW(), NOW()),
('a089', '3328010100000089', 'Hafiz Zaki', 'Pemalang', '2024-01-02', 'LAKI_LAKI', 'Tani Hartati', 'rw04', NOW(), NOW()),
('a090', '3328010100000090', 'Sulistyowati Ayu', 'Slawi', '2023-04-20', 'PEREMPUAN', 'Uni Mulyani', 'rw04', NOW(), NOW()),
('a091', '3328010100000091', 'Zaki Raihan', 'Kramat', '2023-08-05', 'LAKI_LAKI', 'Vani Yulianti', 'rw04', NOW(), NOW()),
('a092', '3328010100000092', 'Kuswanti Rahma', 'Tegal', '2023-12-28', 'PEREMPUAN', 'Wani Rahayu', 'rw04', NOW(), NOW()),
('a093', '3328010100000093', 'Raihan Azka', 'Brebes', '2024-03-15', 'LAKI_LAKI', 'Yani Puspita', 'rw04', NOW(), NOW()),
('a094', '3328010100000094', 'Dewi Permata', 'Kramat', '2023-06-22', 'PEREMPUAN', 'Zani Anggraini', 'rw04', NOW(), NOW()),
('a095', '3328010100000095', 'Azka Pratama', 'Slawi', '2023-10-08', 'LAKI_LAKI', 'Ani Suryani', 'rw04', NOW(), NOW()),
('a096', '3328010100000096', 'Sari Maharani', 'Tegal', '2024-02-12', 'PEREMPUAN', 'Beni Hartati', 'rw04', NOW(), NOW()),
('a097', '3328010100000097', 'Saputra Wijaya', 'Kramat', '2023-05-08', 'LAKI_LAKI', 'Ceni Mulyani', 'rw04', NOW(), NOW()),
('a098', '3328010100000098', 'Putri Khansa', 'Pemalang', '2023-09-25', 'PEREMPUAN', 'Deni Ningrum', 'rw04', NOW(), NOW()),
('a099', '3328010100000099', 'Putra Maulana', 'Slawi', '2024-01-15', 'LAKI_LAKI', 'Eni Handayani', 'rw04', NOW(), NOW()),
('a100', '3328010100000100', 'Wulandari Safitri', 'Kramat', '2023-04-12', 'PEREMPUAN', 'Feni Kusuma', 'rw04', NOW(), NOW());

-- ==========================================================
-- PENGUKURAN DATA (1 pengukuran terbaru per anak)
-- Distribusi: ~80% Normal, ~10% Pendek, ~5% Sangat Pendek, ~5% Kurang Gizi
-- ==========================================================
INSERT INTO "pengukuran" ("pengukuran_id", "anak_id", "tanggal", "berat_badan", "tinggi_badan", "usia_bulan", "z_score_bbu", "z_score_tbu", "z_score_bbtb", "catatan", "tanggal_dibuat", "tanggal_diubah") VALUES
-- RW 01 - Normal (20), Pendek (3), Sangat Pendek (1), Kurang Gizi (1)
('m001', 'a001', NOW(), 10.5, 75.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m002', 'a002', NOW(), 12.0, 82.0, 18, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m003', 'a003', NOW(), 8.5, 68.0, 15, 'Kurang Gizi', 'Normal', 'Normal', 'Perlu pemantauan', NOW(), NOW()),
('m004', 'a004', NOW(), 9.0, 70.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m005', 'a005', NOW(), 14.0, 88.0, 24, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m006', 'a006', NOW(), 8.0, 68.0, 13, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m007', 'a007', NOW(), 7.5, 66.0, 9, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m008', 'a008', NOW(), 11.0, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m009', 'a009', NOW(), 13.5, 80.0, 21, 'Normal', 'Pendek', 'Normal', 'Sedikit di bawah standar', NOW(), NOW()),
('m010', 'a010', NOW(), 9.5, 72.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m011', 'a011', NOW(), 12.5, 82.0, 17, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m012', 'a012', NOW(), 8.5, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m013', 'a013', NOW(), 7.0, 64.0, 10, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m014', 'a014', NOW(), 11.5, 76.0, 15, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m015', 'a015', NOW(), 14.5, 92.0, 27, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m016', 'a016', NOW(), 9.0, 70.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m017', 'a017', NOW(), 11.0, 72.0, 15, 'Normal', 'Sangat Pendek', 'Normal', 'Perlu intervensi', NOW(), NOW()),
('m018', 'a018', NOW(), 12.0, 80.0, 18, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m019', 'a019', NOW(), 9.5, 73.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m020', 'a020', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m021', 'a021', NOW(), 8.5, 70.0, 13, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m022', 'a022', NOW(), 7.0, 64.0, 9, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m023', 'a023', NOW(), 15.0, 92.0, 30, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m024', 'a024', NOW(), 12.5, 80.0, 17, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m025', 'a025', NOW(), 10.0, 74.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),

-- RW 02 - Normal (16), Pendek (2), Kurang Gizi (2)
('m026', 'a026', NOW(), 13.0, 85.0, 21, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m027', 'a027', NOW(), 10.5, 76.0, 14, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m028', 'a028', NOW(), 9.0, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m029', 'a029', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m030', 'a030', NOW(), 8.5, 68.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m031', 'a031', NOW(), 7.5, 66.0, 10, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m032', 'a032', NOW(), 12.5, 80.0, 18, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m033', 'a033', NOW(), 10.0, 74.0, 14, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m034', 'a034', NOW(), 9.5, 72.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m035', 'a035', NOW(), 14.0, 88.0, 24, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m036', 'a036', NOW(), 8.0, 67.0, 13, 'Kurang Gizi', 'Normal', 'Normal', 'Perlu tambahan gizi', NOW(), NOW()),
('m037', 'a037', NOW(), 7.0, 64.0, 9, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m038', 'a038', NOW(), 12.0, 80.0, 17, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m039', 'a039', NOW(), 11.0, 76.0, 14, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m040', 'a040', NOW(), 9.5, 72.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m041', 'a041', NOW(), 13.5, 86.0, 21, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m042', 'a042', NOW(), 8.0, 66.0, 12, 'Kurang Gizi', 'Normal', 'Normal', 'Perlu pemantauan', NOW(), NOW()),
('m043', 'a043', NOW(), 7.5, 65.0, 10, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m044', 'a044', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m045', 'a045', NOW(), 10.0, 74.0, 13, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),

-- RW 03 - Normal (28), Pendek (4), Sangat Pendek (2), Kurang Gizi (1)
('m046', 'a046', NOW(), 10.5, 75.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m047', 'a047', NOW(), 12.0, 82.0, 18, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m048', 'a048', NOW(), 11.0, 74.0, 15, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m049', 'a049', NOW(), 9.0, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m050', 'a050', NOW(), 14.0, 90.0, 27, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m051', 'a051', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m052', 'a052', NOW(), 8.5, 68.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m053', 'a053', NOW(), 7.0, 64.0, 9, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m054', 'a054', NOW(), 12.5, 80.0, 17, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m055', 'a055', NOW(), 10.5, 74.0, 14, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m056', 'a056', NOW(), 9.5, 72.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m057', 'a057', NOW(), 13.0, 85.0, 21, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m058', 'a058', NOW(), 11.0, 70.0, 15, 'Normal', 'Sangat Pendek', 'Normal', 'Perlu intervensi', NOW(), NOW()),
('m059', 'a059', NOW(), 9.0, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m060', 'a060', NOW(), 14.5, 92.0, 30, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m061', 'a061', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m062', 'a062', NOW(), 8.5, 68.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m063', 'a063', NOW(), 7.5, 65.0, 9, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m064', 'a064', NOW(), 12.0, 80.0, 17, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m065', 'a065', NOW(), 10.0, 72.0, 13, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m066', 'a066', NOW(), 9.5, 72.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m067', 'a067', NOW(), 13.5, 86.0, 18, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m068', 'a068', NOW(), 11.0, 70.0, 14, 'Normal', 'Sangat Pendek', 'Normal', 'Perlu intervensi', NOW(), NOW()),
('m069', 'a069', NOW(), 9.0, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m070', 'a070', NOW(), 15.0, 94.0, 33, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m071', 'a071', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m072', 'a072', NOW(), 8.5, 68.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m073', 'a073', NOW(), 7.5, 65.0, 10, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m074', 'a074', NOW(), 12.5, 80.0, 17, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m075', 'a075', NOW(), 10.5, 74.0, 13, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m076', 'a076', NOW(), 9.5, 72.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m077', 'a077', NOW(), 13.0, 85.0, 21, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m078', 'a078', NOW(), 8.0, 66.0, 14, 'Kurang Gizi', 'Normal', 'Normal', 'Perlu tambahan gizi', NOW(), NOW()),
('m079', 'a079', NOW(), 9.0, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m080', 'a080', NOW(), 14.0, 90.0, 30, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),

-- RW 04 - Normal (16), Pendek (2), Sangat Pendek (1), Kurang Gizi (1)
('m081', 'a081', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m082', 'a082', NOW(), 8.5, 68.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m083', 'a083', NOW(), 7.5, 65.0, 9, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m084', 'a084', NOW(), 12.0, 76.0, 17, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m085', 'a085', NOW(), 10.5, 74.0, 14, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m086', 'a086', NOW(), 9.5, 72.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m087', 'a087', NOW(), 13.5, 86.0, 21, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m088', 'a088', NOW(), 11.0, 70.0, 14, 'Normal', 'Sangat Pendek', 'Normal', 'Perlu intervensi', NOW(), NOW()),
('m089', 'a089', NOW(), 9.0, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m090', 'a090', NOW(), 14.5, 92.0, 30, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m091', 'a091', NOW(), 11.5, 78.0, 16, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m092', 'a092', NOW(), 8.5, 68.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m093', 'a093', NOW(), 7.5, 65.0, 10, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m094', 'a094', NOW(), 12.5, 78.0, 18, 'Normal', 'Pendek', 'Normal', NULL, NOW(), NOW()),
('m095', 'a095', NOW(), 10.5, 74.0, 14, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m096', 'a096', NOW(), 9.5, 72.0, 11, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m097', 'a097', NOW(), 13.0, 85.0, 21, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m098', 'a098', NOW(), 8.0, 66.0, 14, 'Kurang Gizi', 'Normal', 'Normal', 'Perlu tambahan gizi', NOW(), NOW()),
('m099', 'a099', NOW(), 9.0, 70.0, 12, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW()),
('m100', 'a100', NOW(), 14.0, 90.0, 30, 'Normal', 'Normal', 'Normal', NULL, NOW(), NOW());

-- ==========================================================
-- SUMMARY
-- ==========================================================
-- Total Posyandu: 4
-- Total Users: 5 (1 Bidan + 4 Kader)
-- Total Anak: 100 (RW01: 25, RW02: 20, RW03: 35, RW04: 20)
-- Total Pengukuran: 100
-- 
-- Status Distribution:
-- - Normal: ~80%
-- - Pendek: ~11%
-- - Sangat Pendek: ~4%
-- - Kurang Gizi: ~5%
--
-- Login Credentials:
-- Bidan: bidan@kramat.desa.id / 123
-- Kader RW01: kaderrw01@kramat.desa.id / 123
-- Kader RW02: kaderrw02@kramat.desa.id / 123
-- Kader RW03: kaderrw03@kramat.desa.id / 123
-- Kader RW04: kaderrw04@kramat.desa.id / 123
-- ==========================================================
