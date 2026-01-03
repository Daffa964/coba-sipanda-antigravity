# Panduan Deploy SI-PANDA ke Vercel + Supabase

## Langkah 1: Buat Database di Supabase

1. Buka **[supabase.com](https://supabase.com)** → klik **Start your project**
2. Login dengan GitHub
3. Klik **New Project**
   - Organization: Pilih/buat organization
   - Project name: `sipanda`
   - Database Password: Buat password yang kuat (SIMPAN!)
   - Region: Singapore (terdekat dengan Indonesia)
4. Tunggu project selesai dibuat (~2 menit)
5. Buka **Settings** → **Database** → **Connection string**
6. Copy **URI** (Transaction mode), format:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

---

## Langkah 2: Deploy ke Vercel

1. Buka **[vercel.com](https://vercel.com)** → klik **Sign Up** dengan GitHub
2. Klik **Add New...** → **Project**
3. Pilih repo **coba-sipanda-antigravity** → klik **Import**
4. Di halaman konfigurasi:
   - Framework Preset: **Next.js** (otomatis terdeteksi)
   - Root Directory: `.` (default)
   - Build Command: `npx prisma generate && npm run build`
5. Buka **Environment Variables**, tambahkan:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | *(paste connection string dari Supabase)* |
   | `JWT_SECRET` | *(buat secret random, misal: `sipanda-jwt-secret-2024`)* |

6. Klik **Deploy**
7. Tunggu ~3-5 menit sampai selesai

---

## Langkah 3: Setup Database Schema

Setelah deploy berhasil, jalankan migrasi database:

### Opsi A: Via Vercel Terminal (Mudah)
1. Di dashboard Vercel project → klik **...** → **Open Command Line**
2. Jalankan:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### Opsi B: Via Local Terminal
1. Update `.env` lokal dengan DATABASE_URL dari Supabase
2. Jalankan:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

---

## Langkah 4: Akses Aplikasi

Setelah selesai, aplikasi bisa diakses di:
```
https://[nama-project].vercel.app
```

### Akun Login Default:
- **Bidan**: `bidan@kramat.desa.id` / `123`
- **Kader RW 01**: `kaderrw01@kramat.desa.id` / `123`
- **Kader RW 02**: `kaderrw02@kramat.desa.id` / `123`
- **Kader RW 03**: `kaderrw03@kramat.desa.id` / `123`
- **Kader RW 04**: `kaderrw04@kramat.desa.id` / `123`

---

## Troubleshooting

### Error: "prisma generate failed"
- Pastikan `DATABASE_URL` sudah di-set di Environment Variables
- Redeploy project

### Error: "relation does not exist"
- Database belum di-migrate, jalankan: `npx prisma db push`

### QR Code masih localhost
- QR Code otomatis menggunakan domain production setelah deploy
- Tidak perlu perubahan kode

---

## Tips

- **Custom Domain**: Di Vercel → Settings → Domains → tambahkan domain Anda
- **Update Aplikasi**: Cukup push ke GitHub, Vercel auto-redeploy
- **Monitor Logs**: Vercel → Project → Logs
