# Plantagochi

### Platform Phygital Gamifikasi Interaktif — Kaktus & Sukulen Mini

> _"Rawat Fisiknya, Level-Up Digitalnya."_

---

## Deskripsi Proyek

**Plantagochi** adalah ekosistem phygital (physical + digital) yang menggabungkan penjualan kaktus mini fisik dengan pengalaman **digital twin** interaktif. Setiap pot kaktus yang dijual dilengkapi QR Code unik — saat di-scan, pembeli langsung masuk ke halaman web untuk merawat versi digital dari tanamannya: beri nama, siram mingguan, bangun streak, naik level, dan kumpulkan achievement.

### Konsep Utama

```
Pembeli beli kaktus → Scan QR Code di pot → Masuk halaman digital twin
→ Beri nama tanaman → Siram mingguan (streak) → Level-up avatar
→ Kumpulkan achievement → Share ke medsos → Engagement meningkat
```

### Arsitektur Aplikasi

Aplikasi terdiri dari **3 area utama**:

| Area | Routes | Deskripsi |
|------|--------|-----------|
| **Web Portal** | `/`, `/demo`, `/pricing`, `/login` | Landing page, demo interaktif, pricing, dan login terintegrasi |
| **User App** | `/p/:token`, `/p/:token/setup` | Digital twin — diakses via QR scan atau login email |
| **Admin Dashboard** | `/admin/*` | Kelola tanaman, generate QR, lihat users & analytics |

### Fitur Utama

- **QR Code per Pot** — Generate dari admin dashboard, scan langsung ke digital twin
- **Digital Twin & Level-Up** — Avatar kaktus SVG berevolusi 5 level (Benih → Tunas → Remaja → Dewasa → Berbunga)
- **Streak System** — Counter mingguan dengan grace period, terinspirasi Duolingo
- **Achievement Badges** — 5 badge yang unlock permanen
- **Buku Rapor Tanaman** — Rekap performa perawatan
- **Dark/Light Theme** — Toggle tema dengan deteksi preferensi sistem
- **Admin Dashboard** — Generate QR, kelola tanaman & users, lihat stats
- **Login Terintegrasi** — User login via email, Admin login via email+password

---

## Tim

| Nama | Peran | NIM |
|------|-------|-----|
| Hasan Shofiyyur Rahman | CEO / Strategi | 2410512011 |
| Rapolo Joshua Napitupulu | CTO / Tech Lead | 2410512001 |
| Rifqi Afif Zhain | CMO / Marketing | 2410512013 |
| Abdul Latief Aminullah | COO / Operations | 2410512024 |
| Muhammad Ibrahim Al Farisi | CFO / Finance | 2410512026 |

> Tugas Mata Kuliah: **Technopreneurship** — Semester Genap TA. 2025/2026

---

## Tech Stack

| Teknologi | Kegunaan | Tier |
|-----------|----------|------|
| React 19 | UI Library | — |
| Vite 8 | Build Tool & Dev Server | — |
| React Router v7 | Client-side Routing | — |
| Firebase Firestore | Database NoSQL | Spark (Free) |
| Firebase Authentication | Login admin & user lookup | Spark (Free) |
| Lucide React | SVG Icon Library | — |
| npm `qrcode` | QR Code generation (client-side) | — |
| CSS (Vanilla) | Styling & Design System + Dark/Light Theme | — |

> **Semua layanan yang dipakai 100% gratis** — tidak butuh kartu kredit.

---

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/yurnszzz/PLANTAGOCHI.git
cd PLANTAGOCHI
```

### 2. Setup Firebase (Wajib)

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Buat project baru (nama: `plantagochi`)
3. **Firestore Database** → Create database → Start in production mode
4. **Authentication** → Get started → Enable Email/Password
5. **Project Settings** → Your apps → Add Web App → Copy config
6. Buat file `app/.env` berdasarkan `app/.env.example`:

```bash
cd app
cp .env.example .env
# Edit .env dengan config Firebase dari langkah 5
```

7. **Buat admin account**:
   - Authentication → Add user → masukkan email & password admin
   - Firestore → Start collection `admins` → Add document:
     - Document ID: `<uid dari user yang baru dibuat>`
     - Field: `role` (string) = `admin`
     - Field: `email` (string) = `<email admin>`

### 3. Install Dependencies

```bash
cd app
npm install
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

### 5. Deploy Firestore Rules

```bash
# Install Firebase CLI (sekali saja)
npm install -g firebase-tools

# Login & deploy rules
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

---

## Struktur Proyek

```
PLANTAGOCHI/
├── app/                                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/                   # Shared UI (Navbar, Footer, CactusAvatar, ThemeToggle)
│   │   ├── pages/                        # Portal pages (Landing, Demo, Pricing, Login)
│   │   ├── plant/                        # User App (PlantPage, PlantOnboarding)
│   │   ├── admin/                        # Admin Dashboard (Layout, Dashboard, Plants, Users, Settings)
│   │   ├── sections/                     # Landing page sections (Hero, Features, HowItWorks, etc.)
│   │   ├── context/                      # React Context (AuthContext, ThemeContext)
│   │   ├── hooks/                        # Custom hooks
│   │   ├── lib/                          # Utilities (firebase.js, gameLogic.js, constants.js)
│   │   ├── App.jsx                       # Root routing
│   │   ├── main.jsx                      # Entry point + providers
│   │   └── index.css                     # Design system (dark + light theme)
│   ├── .env.example                      # Template environment variables
│   └── package.json
│
├── firestore.rules                       # Firestore security rules
├── BUSINESS PLAN PLANTAGOCHI.md          # Dokumen bisnis plan
├── Laporan_Studi_Kelayakan_Bisnis_Plantagochi.md
├── PRD PLANTAGOCHI.md                    # Product Requirements Document
├── IMPLEMENTATION_PLAN.md                # Rencana implementasi & pembagian tugas
└── README.md                             # File ini
```

---

## Halaman Aplikasi

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **Landing Page** | `/` | Marketing page — hero, fitur, cara kerja, produk, testimoni, CTA |
| **Demo Interaktif** | `/demo` | Demo digital twin (localStorage, tanpa backend) |
| **Harga** | `/pricing` | Info paket produk + FAQ |
| **Login** | `/login` | Login terintegrasi — Tab User (email lookup) + Tab Admin |
| **Digital Twin** | `/p/:token` | Halaman tanaman real — tersambung Firebase |
| **Onboarding** | `/p/:token/setup` | Scan pertama — beri nama & email |
| **Admin Dashboard** | `/admin` | Overview stats |
| **Admin Tanaman** | `/admin/plants` | CRUD tanaman + generate QR Code |
| **Admin Users** | `/admin/users` | Lihat pemilik tanaman |
| **Admin Settings** | `/admin/settings` | Pengaturan tema & info app |

---

## Referensi

- Business Plan: `BUSINESS PLAN PLANTAGOCHI.md`
- Studi Kelayakan: `Laporan_Studi_Kelayakan_Bisnis_Plantagochi.md`
- PRD: `PRD PLANTAGOCHI.md`
- Implementation Plan: `IMPLEMENTATION_PLAN.md`
