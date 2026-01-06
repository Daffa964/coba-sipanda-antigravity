-- ==========================================================
-- SI-PANDA Database Schema for Supabase
-- Jalankan script ini PERTAMA sebelum seed data
-- ==========================================================

-- Hapus tabel lama jika ada (urutan penting karena foreign key)
DROP TABLE IF EXISTS "pengukuran" CASCADE;
DROP TABLE IF EXISTS "anak" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "posyandu" CASCADE;

-- ==========================================================
-- TABEL POSYANDU
-- ==========================================================
CREATE TABLE "posyandu" (
    "posyandu_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggal_dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_diubah" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "posyandu_pkey" PRIMARY KEY ("posyandu_id"),
    CONSTRAINT "posyandu_nama_key" UNIQUE ("nama")
);

-- ==========================================================
-- TABEL USER (Bidan & Kader)
-- ==========================================================
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'KADER',
    "posyandu_id" TEXT,
    "tanggal_dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_diubah" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "user_email_key" UNIQUE ("email"),
    CONSTRAINT "user_posyandu_id_fkey" FOREIGN KEY ("posyandu_id") 
        REFERENCES "posyandu"("posyandu_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==========================================================
-- TABEL ANAK
-- ==========================================================
CREATE TABLE "anak" (
    "anak_id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "nama_orangtua" TEXT NOT NULL,
    "posyandu_id" TEXT NOT NULL,
    "tanggal_dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_diubah" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "anak_pkey" PRIMARY KEY ("anak_id"),
    CONSTRAINT "anak_nik_key" UNIQUE ("nik"),
    CONSTRAINT "anak_posyandu_id_fkey" FOREIGN KEY ("posyandu_id") 
        REFERENCES "posyandu"("posyandu_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ==========================================================
-- TABEL PENGUKURAN
-- ==========================================================
CREATE TABLE "pengukuran" (
    "pengukuran_id" TEXT NOT NULL,
    "anak_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "berat_badan" DOUBLE PRECISION NOT NULL,
    "tinggi_badan" DOUBLE PRECISION NOT NULL,
    "usia_bulan" INTEGER NOT NULL,
    "z_score_bbtb" TEXT,
    "z_score_bbu" TEXT,
    "z_score_tbu" TEXT,
    "catatan" TEXT,
    "tanggal_dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_diubah" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "pengukuran_pkey" PRIMARY KEY ("pengukuran_id"),
    CONSTRAINT "pengukuran_anak_id_fkey" FOREIGN KEY ("anak_id") 
        REFERENCES "anak"("anak_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================================
-- INDEX untuk performa query
-- ==========================================================
CREATE INDEX "idx_anak_posyandu" ON "anak"("posyandu_id");
CREATE INDEX "idx_pengukuran_anak" ON "pengukuran"("anak_id");
CREATE INDEX "idx_pengukuran_tanggal" ON "pengukuran"("tanggal" DESC);
CREATE INDEX "idx_user_role" ON "user"("role");

-- ==========================================================
-- SELESAI
-- Schema siap digunakan. Jalankan script seed selanjutnya.
-- ==========================================================
