<p align="center">
  <h1 align="center">🧒 SI-PANDA</h1>
  <p align="center"><strong>Sistem Informasi Pemantau Gizi Anak Desa</strong></p>
  <p align="center">
    Solusi digital untuk pencatatan gizi, pencegahan stunting, dan pemantauan kesehatan anak di Desa Kramat, Kecamatan Kota Kudus, Kabupaten Kudus, Jawa Tengah.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-5.10-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
</p>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Struktur Database](#-struktur-database)
- [Peran Pengguna](#-peran-pengguna)
- [Struktur Folder](#-struktur-folder)
- [Instalasi & Setup](#-instalasi--setup)
- [Deployment](#-deployment)
- [Akun Default](#-akun-default)
- [Referensi Standar](#-referensi-standar)
- [Kontak](#-kontak)

---

## 📖 Tentang Proyek

**SI-PANDA** (Sistem Informasi Pemantau Gizi Anak Desa) adalah aplikasi web berbasis **Next.js** yang dirancang untuk membantu tenaga kesehatan (Bidan dan Kader Posyandu) dalam memantau tumbuh kembang dan status gizi anak balita di lingkungan Desa Kramat, Kudus, Jawa Tengah.

Sistem ini mendigitalisasi proses pencatatan data pertumbuhan anak yang selama ini dilakukan secara manual, sehingga mempercepat deteksi dini masalah gizi seperti **stunting**, **wasting**, dan **underweight** berdasarkan standar WHO dengan perhitungan **Z-Score**.

### Latar Belakang

Stunting merupakan masalah gizi kronis yang masih menjadi perhatian serius di Indonesia. Dengan sistem digital ini, diharapkan:
- Pencatatan data pengukuran menjadi lebih **akurat dan terstruktur**
- Deteksi dini status gizi abnormal bisa dilakukan **secara otomatis**
- Laporan bulanan dapat dihasilkan **dengan cepat**
- Orang tua dapat **memantau pertumbuhan anak** melalui QR Code

---

## ✨ Fitur Utama

### 📊 Dashboard & Monitoring
- **Dashboard Bidan**: Ringkasan statistik seluruh posyandu (total anak, stunting, gizi buruk, dll.)
- **Dashboard Kader**: Ringkasan statistik per posyandu/RW
- **Grafik Interaktif**: Visualisasi data menggunakan Recharts
- **Filter Stunting**: Klik statistik stunting untuk langsung melihat daftar anak terkait

### 👶 Manajemen Data Anak
- CRUD data anak (NIK, nama, tanggal lahir, jenis kelamin, nama orang tua)
- Pencarian dan filter data anak berdasarkan status gizi
- Riwayat pengukuran per anak

### 📏 Pengukuran & Z-Score
- Pencatatan berat badan (BB) dan tinggi badan (TB) per bulan
- **Perhitungan Z-Score otomatis** berdasarkan standar WHO:
  - **BB/U** (Berat Badan menurut Umur) → Deteksi underweight
  - **TB/U** (Tinggi Badan menurut Umur) → Deteksi stunting
  - **BB/TB** (Berat Badan menurut Tinggi Badan) → Deteksi wasting
- Klasifikasi status gizi otomatis (Normal, Pendek, Sangat Pendek, Gizi Kurang, Gizi Buruk, dll.)

### 📈 Grafik Pertumbuhan
- Grafik tumbuh kembang berat badan anak dalam chart interaktif
- Grafik tumbuh kembang tinggi badan anak
- Visualisasi tren pertumbuhan dari waktu ke waktu

### 🔔 Sistem Rekomendasi & Alert
- **Stunting Alert Dialog**: Peringatan otomatis saat anak terdeteksi stunting/gizi buruk
- **Rekomendasi Gizi**: Saran makanan, aktivitas, dan tindakan medis berdasarkan status gizi
- Prioritas penanganan berdasarkan tingkat keparahan (dari Gizi Buruk hingga Normal)

### 📄 Laporan & Ekspor
- **Laporan Bulanan**: Ringkasan data pengukuran per bulan
- **Ekspor PDF**: Generate laporan bulanan dan laporan NIK dalam format PDF (jsPDF)
- **Ekspor Excel**: Generate laporan dalam format Excel/XLSX
- **Kartu Laporan**: Summary cards dengan statistik kunci

### 📱 QR Code & Akses Publik
- **Generate QR Code** per anak untuk akses data oleh orang tua
- **Halaman Publik**: Orang tua dapat scan QR untuk melihat data pertumbuhan anak (tanpa login)
- **Grafik Pertumbuhan Publik**: Grafik berat & tinggi badan tersedia di halaman publik

### 💬 Integrasi WhatsApp
- **Share via WhatsApp**: Bagikan informasi status gizi dan rekomendasi langsung ke orang tua melalui WhatsApp

### 🔐 Keamanan & Otorisasi
- Autentikasi berbasis **JWT** (JSON Web Token) menggunakan library `jose`
- Password hashing dengan **bcrypt**
- **Role-Based Access Control (RBAC)**:
  - Bidan → Akses ke semua posyandu
  - Kader → Hanya akses posyandu sendiri
- Middleware proteksi route dengan auto-redirect

---

## 🛠 Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Bahasa** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **ORM** | [Prisma 5.10](https://www.prisma.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/)) |
| **Autentikasi** | JWT ([jose](https://github.com/panva/jose)) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **Chart** | [Recharts 3](https://recharts.org/) |
| **PDF Export** | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) |
| **Excel Export** | [SheetJS (xlsx)](https://sheetjs.com/) |
| **QR Code** | [react-qr-code](https://github.com/rosskhanas/react-qr-code) |
| **Validasi** | [Zod 4](https://zod.dev/) |
| **Date Utils** | [date-fns 4](https://date-fns.org/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────────┐ │
│  │ Landing  │  │  Login   │  │   Dashboard/App     │ │
│  │  Page    │  │  Page    │  │  (Bidan / Kader)    │ │
│  └─────────┘  └──────────┘  └─────────────────────┘ │
│                      │                               │
│              ┌───────┴────────┐                      │
│              │  Public Page   │ ← QR Code Scan       │
│              │ (Data Anak)    │                       │
│              └────────────────┘                      │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                 SERVER (Next.js App Router)           │
│  ┌──────────────┐  ┌───────────┐  ┌───────────────┐ │
│  │  Middleware   │  │  Server   │  │   Server      │ │
│  │  (Auth+RBAC) │  │  Actions  │  │  Components   │ │
│  └──────────────┘  └───────────┘  └───────────────┘ │
│          │              │                            │
│    ┌─────┴──────────────┴──────┐                     │
│    │      Library Layer        │                     │
│    │  ┌────────┐ ┌───────────┐ │                     │
│    │  │ Z-Score│ │Recommend. │ │                     │
│    │  │ Calc.  │ │  Engine   │ │                     │
│    │  └────────┘ └───────────┘ │                     │
│    └───────────────────────────┘                     │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│          DATABASE (PostgreSQL / Supabase)             │
│  ┌──────────┐ ┌──────┐ ┌──────┐ ┌────────────────┐  │
│  │ Posyandu │ │ User │ │ Anak │ │  Pengukuran    │  │
│  └──────────┘ └──────┘ └──────┘ └────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🗃 Struktur Database

Sistem menggunakan **4 model utama** yang dikelola melalui Prisma ORM:

### Model `Posyandu`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `posyandu_id` | String (CUID) | Primary key |
| `nama` | String | Nama posyandu (unik), contoh: "RW 01", "RW 02" |
| `tanggal_dibuat` | DateTime | Timestamp pembuatan |
| `tanggal_diubah` | DateTime | Timestamp update terakhir |

### Model `User`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `user_id` | String (CUID) | Primary key |
| `nama` | String | Nama pengguna |
| `email` | String | Email login (unik) |
| `password` | String | Password (hashed bcrypt) |
| `role` | Enum | `BIDAN` atau `KADER` |
| `posyandu_id` | String? | FK ke Posyandu (wajib untuk Kader) |

### Model `Anak`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `anak_id` | String (CUID) | Primary key |
| `nik` | String | NIK anak (unik) |
| `nama` | String | Nama lengkap anak |
| `tempat_lahir` | String? | Tempat lahir |
| `tanggal_lahir` | DateTime | Tanggal lahir |
| `jenis_kelamin` | Enum | `LAKI_LAKI` atau `PEREMPUAN` |
| `nama_orangtua` | String | Nama orang tua/wali |
| `posyandu_id` | String | FK ke Posyandu |

### Model `Pengukuran` (Measurement)
| Field | Tipe | Keterangan |
|-------|------|------------|
| `pengukuran_id` | String (CUID) | Primary key |
| `anak_id` | String | FK ke Anak |
| `tanggal` | DateTime | Tanggal pengukuran |
| `berat_badan` | Float | Berat badan (kg) |
| `tinggi_badan` | Float | Tinggi badan (cm) |
| `usia_bulan` | Int | Usia dalam bulan saat pengukuran |
| `z_score_bbu` | String? | Status Z-Score BB/U |
| `z_score_tbu` | String? | Status Z-Score TB/U |
| `z_score_bbtb` | String? | Status Z-Score BB/TB |
| `catatan` | String? | Catatan tambahan |

### Relasi Antar Model

```
Posyandu 1──────N User    (Satu posyandu memiliki banyak user)
Posyandu 1──────N Anak    (Satu posyandu memiliki banyak anak)
Anak     1──────N Measurement (Satu anak memiliki banyak pengukuran)
```

---

## 👥 Peran Pengguna

### 🩺 Bidan
- Mengakses **semua posyandu** dalam sistem
- Melihat dashboard statistik keseluruhan desa
- Mengelola data anak di semua posyandu
- Menginput pengukuran dan melihat laporan
- Mengekspor laporan dalam format PDF/Excel

### 👩‍⚕️ Kader Posyandu
- Hanya mengakses posyandu **(RW) sendiri**
- Melihat dashboard statistik posyandu masing-masing
- Mengelola data anak di posyandu sendiri
- Menginput pengukuran dan melihat laporan
- **Tidak dapat** mengakses data posyandu lain (auto-redirect)

---

## 📁 Struktur Folder

```
coba-sipanda-antigravity/
├── prisma/
│   ├── schema.prisma           # Definisi schema database
│   ├── seed.ts                 # Script seeding utama
│   ├── seed-comprehensive.ts   # Seed data komprehensif
│   ├── seed-kader.ts           # Seed data kader
│   ├── 01-schema.sql           # SQL schema manual
│   ├── 02-seed.sql             # SQL seed data dasar
│   ├── 03-seed-large.sql       # SQL seed data massal (1000+ anak)
│   ├── 04-seed-from-json.sql   # SQL seed dari file JSON
│   └── seed-production.sql     # SQL seed untuk production
│
├── public/                     # Aset statis
│
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page (publik)
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── login/              # Halaman login
│   │   ├── dashboard/          # Dashboard Bidan
│   │   │   ├── page.tsx        # Halaman utama dashboard
│   │   │   ├── anak/           # Manajemen data anak
│   │   │   ├── laporan/        # Halaman laporan
│   │   │   └── loading.tsx     # Loading skeleton
│   │   ├── posyandu/[id]/      # Dashboard Kader (per posyandu)
│   │   │   ├── page.tsx        # Dashboard per posyandu
│   │   │   ├── anak/           # Data anak per posyandu
│   │   │   ├── laporan/        # Laporan per posyandu
│   │   │   └── settings/       # Pengaturan posyandu
│   │   ├── public/             # Halaman publik (scan QR)
│   │   ├── profile/            # Halaman profil user
│   │   └── api/                # API routes
│   │
│   ├── components/
│   │   ├── anak-form.tsx       # Form input data anak
│   │   ├── anak-list.tsx       # Daftar anak (+ filter & search)
│   │   ├── dashboard-stats.tsx # Kartu statistik dashboard
│   │   ├── dashboard-interventions.tsx # Panel intervensi
│   │   ├── growth-chart.tsx    # Grafik pertumbuhan (Recharts)
│   │   ├── measurement-form.tsx    # Form input pengukuran
│   │   ├── measurement-history.tsx # Riwayat pengukuran
│   │   ├── month-year-picker.tsx   # Picker bulan/tahun
│   │   ├── navbar.tsx          # Navigasi utama
│   │   ├── qr-code-generator.tsx   # Generator QR Code
│   │   ├── report-summary-cards.tsx # Kartu ringkasan laporan
│   │   ├── report-table.tsx    # Tabel laporan
│   │   ├── stunting-alert-dialog.tsx # Dialog peringatan stunting
│   │   ├── parent-recommendation.tsx # Rekomendasi untuk orang tua
│   │   ├── whatsapp-share.tsx  # Tombol share WhatsApp
│   │   ├── user-menu.tsx       # Menu user/logout
│   │   └── back-button.tsx     # Tombol kembali
│   │
│   ├── actions/
│   │   ├── anak.ts             # Server actions CRUD anak
│   │   ├── auth.ts             # Server actions autentikasi
│   │   ├── measurement.ts      # Server actions pengukuran
│   │   └── report.ts           # Server actions laporan
│   │
│   ├── lib/
│   │   ├── auth.ts             # Utility autentikasi (JWT)
│   │   ├── db.ts               # Prisma client instance
│   │   ├── zscore.ts           # Perhitungan Z-Score (WHO)
│   │   ├── recommendations.ts  # Engine rekomendasi gizi
│   │   └── export-utils.ts     # Utility ekspor PDF/Excel
│   │
│   └── middleware.ts           # Auth + RBAC middleware
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── DEPLOY.md                   # Panduan deployment
└── data_anak.json              # Data anak (sumber seed)
```

---

## 🚀 Instalasi & Setup

### Prasyarat

- **Node.js** ≥ 18.x
- **npm** (atau yarn/pnpm)
- **PostgreSQL** (atau akun [Supabase](https://supabase.com))

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/<username>/coba-sipanda-antigravity.git
   cd coba-sipanda-antigravity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment**

   Buat file `.env` di root project:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   JWT_SECRET="your-jwt-secret-key"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Push schema ke database
   npx prisma db push

   # (Opsional) Seed data awal
   npx prisma db seed
   ```

5. **Jalankan development server**
   ```bash
   npm run dev
   ```

6. Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## ☁️ Deployment

Aplikasi ini di-deploy menggunakan **Vercel** + **Supabase**. Panduan lengkap tersedia di file [`DEPLOY.md`](./DEPLOY.md).

### Ringkasan Deployment

1. Buat project database di **Supabase** (region: Singapore)
2. Deploy repository ke **Vercel**
3. Set environment variables (`DATABASE_URL`, `JWT_SECRET`)
4. Push schema & seed database
5. Akses aplikasi di `https://nama-project.vercel.app`

---

## 🔑 Akun Default

Setelah seeding, akun berikut tersedia untuk login:

| Role | Email | Password |
|------|-------|----------|
| **Bidan** | `bidan@kramat.desa.id` | `123` |
| **Kader RW 01** | `kaderrw01@kramat.desa.id` | `123` |
| **Kader RW 02** | `kaderrw02@kramat.desa.id` | `123` |
| **Kader RW 03** | `kaderrw03@kramat.desa.id` | `123` |
| **Kader RW 04** | `kaderrw04@kramat.desa.id` | `123` |

> ⚠️ **Penting**: Ganti password default setelah deployment ke production!

---

## 📐 Referensi Standar

Perhitungan Z-Score pada sistem ini mengacu pada:

- **WHO Child Growth Standards** – Standar pertumbuhan anak internasional
- **Permenkes No. 2 Tahun 2020** – Peraturan Menteri Kesehatan RI tentang Standar Antropometri Anak
- Menggunakan metode **Box-Cox transformation** (LMS method) dengan parameter L, M, S per usia dan jenis kelamin

### Klasifikasi Status Gizi

| Indikator | Kategori | Ambang Z-Score |
|-----------|----------|----------------|
| **TB/U** | Sangat Pendek (Severely Stunted) | < -3 SD |
| **TB/U** | Pendek (Stunted) | -3 SD s/d < -2 SD |
| **TB/U** | Normal | -2 SD s/d +3 SD |
| **BB/U** | BB Sangat Kurang (Severely Underweight) | < -3 SD |
| **BB/U** | BB Kurang (Underweight) | -3 SD s/d < -2 SD |
| **BB/U** | Normal | -2 SD s/d +1 SD |
| **BB/TB** | Gizi Buruk (Severely Wasted) | < -3 SD |
| **BB/TB** | Gizi Kurang (Wasted) | -3 SD s/d < -2 SD |
| **BB/TB** | Normal / Gizi Baik | -2 SD s/d +1 SD |
| **BB/TB** | Risiko BB Lebih (Possible Risk of Overweight) | +1 SD s/d +2 SD |
| **BB/TB** | Gizi Lebih (Overweight) | +2 SD s/d +3 SD |
| **BB/TB** | Obesitas (Obese) | > +3 SD |

---

## 📞 Kontak

**Posyandu Desa Kramat**

- 📍 Jl. Nganguk Wali No.1, Nganguk, Kramat, Kec. Kota Kudus, Kabupaten Kudus, Jawa Tengah 59312
- 📧 posyandu.kramat@gmail.com
- 📱 +62 812-3456-7890

---

## 📜 Lisensi

© 2024 Pemerintah Desa Kramat, Kudus. Didukung oleh Puskesmas setempat.

---

<p align="center">
  <em>Dibuat dengan ❤️ untuk generasi masa depan Desa Kramat yang sehat dan bebas stunting.</em>
</p>
