# Plantagochi

### Kaktus Mini dengan Jiwa Digital — Phygital Gamifikasi Interaktif

> _"Rawat Fisiknya, Level-Up Digitalnya."_

🌐 **Live:** https://plantagochi-922c7.web.app

---

## Deskripsi Proyek

**Plantagochi** adalah produk phygital (physical + digital) yang menggabungkan penjualan kaktus mini fisik dengan pengalaman **digital twin** interaktif. Setiap pot kaktus dilengkapi QR Code unik — saat di-scan, pembeli langsung masuk ke halaman web untuk merawat versi digital dari tanamannya: beri nama, siram mingguan, bangun streak, naik level, dan kumpulkan achievement.

### Konsep Utama

```
Beli kaktus fisik → Scan QR Code di pot → Masuk halaman digital twin
→ Beri nama tanaman → Siram mingguan (streak) → Level-up avatar
→ Kumpulkan achievement → Beli aksesori → Bersaing di leaderboard
```

### Arsitektur Aplikasi

Aplikasi terdiri dari **3 area utama**:

| Area | Routes | Deskripsi |
|------|--------|-----------|
| **Web Portal** | `/`, `/demo`, `/pricing`, `/login`, `/leaderboard`, `/garden` | Landing page, demo, komunitas |
| **User App** | `/p/:token`, `/p/:token/setup` | Digital twin — diakses via QR scan |
| **Admin Dashboard** | `/admin/*` | Kelola tanaman, generate QR, lihat analytics |

---

## Fitur

### Fitur Inti
- **QR Code per Pot** — Generate dari admin dashboard, scan langsung ke digital twin
- **Digital Twin & Level-Up** — Avatar kaktus SVG berevolusi 5 level (Benih → Tunas → Remaja → Dewasa → Berbunga)
- **Streak System** — Counter mingguan dengan grace period 3 hari
- **Achievement Badges** — 5 badge yang unlock permanen
- **Buku Rapor Tanaman** — Rekap performa perawatan
- **Email Reminder** — Notifikasi otomatis jika kaktus belum disiram >7 hari (via EmailJS)
- **Dark/Light Theme** — Toggle tema dengan deteksi preferensi sistem

### Fitur Komunitas & Gamifikasi Lanjutan
- **🏆 Leaderboard** (`/leaderboard`) — Papan peringkat global Top 20 berdasarkan streak, level, atau total siram
- **🏡 Taman Komunitas** (`/garden`) — Galeri kaktus seluruh pengguna + tombol "Kasih Sayang" (10/hari)
- **📅 Daily Check-in** — Sapa kaktus setiap hari untuk mendapatkan 🪙 5 koin
- **👒 Toko Aksesori** — Tukarkan koin untuk aksesori visual kaktus (kacamata, topi, pita, mahkota, syal)

### Admin Dashboard
- Generate & kelola QR Code per tanaman
- Monitor seluruh pengguna & status tanaman
- Statistik platform (total tanaman, digital twins aktif, rata-rata streak)

---

## Tim

| Nama | Peran | NIM |
|------|-------|-----|
| Hasan Shofiyyur Rahman | CEO / Frontend Lead | 2410512011 |
| Rapolo Joshua Napitupulu | CTO / Backend Lead | 2410512001 |
| Rifqi Afif Zhain | CMO / Marketing | 2410512013 |
| Abdul Latief Aminullah | COO / Operations | 2410512024 |
| Muhammad Ibrahim Al Farisi | CFO / Finance | 2410512026 |

> Tugas Mata Kuliah: **Technopreneurship** — Semester Genap TA. 2025/2026
> Universitas Pembangunan Nasional "Veteran" Jakarta

---

## Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| React 19 | UI Library |
| Vite 8 | Build Tool & Dev Server |
| React Router v7 | Client-side Routing |
| Firebase Firestore | Database NoSQL (Spark — Free) |
| Firebase Authentication | Login admin |
| Firebase Hosting | Static hosting |
| EmailJS | Email reminder client-side (Free tier) |
| Lucide React | SVG Icon Library |
| npm `qrcode` | QR Code generation |
| CSS Vanilla | Design system + Dark/Light Theme |

> **Semua layanan 100% gratis** — tidak butuh kartu kredit, tidak butuh paket Blaze.

---

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/yurnszzz/PLANTAGOCHI.git
cd PLANTAGOCHI
```

### 2. Setup Firebase

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Buat project → enable **Firestore** (region `asia-southeast2`) + **Authentication** (Email/Password)
3. Project Settings → Add Web App → copy `firebaseConfig`
4. Buat file `app/.env`:

```bash
cd app
cp .env.example .env
# Isi dengan nilai dari Firebase Console + EmailJS
```

5. Buat admin account di Firebase Authentication, lalu tambahkan dokumen di Firestore:
   - Collection: `admins` → Document ID: `<UID admin>`
   - Fields: `role: "admin"`, `email: "<email admin>"`

### 3. Install & Jalankan

```bash
cd app
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

### 4. Deploy

```bash
# Install Firebase CLI (sekali saja)
npm install -g firebase-tools
firebase login

# Deploy rules
firebase deploy --only firestore:rules

# Build & deploy hosting (PowerShell — jalankan satu per satu)
cd app
npm run build
cd ..
firebase deploy --only hosting
```

---

## Struktur Proyek

```
PLANTAGOCHI/
├── app/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/           # Navbar, Footer, CactusAvatar, ThemeToggle
│   │   ├── pages/                # Landing, Demo, Pricing, Login
│   │   │                         # LeaderboardPage, GardenPage  ← baru
│   │   ├── plant/                # PlantPage, PlantOnboarding
│   │   ├── admin/                # AdminLayout, Dashboard, Plants, Users, Settings
│   │   ├── sections/             # HeroSection, FeaturesSection, dll.
│   │   ├── context/              # AuthContext, ThemeContext
│   │   ├── lib/                  # firebase.js, gameLogic.js, constants.js
│   │   │                         # emailService.js  ← baru
│   │   ├── App.jsx               # Root routing
│   │   ├── main.jsx              # Entry point + providers
│   │   └── index.css             # Design system (dark + light theme)
│   ├── .env.example
│   └── package.json
│
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Composite indexes
├── firebase.json                 # Firebase CLI config
├── BUSINESS PLAN PLANTAGOCHI.md
├── Laporan_Studi_Kelayakan_Bisnis_Plantagochi.md
├── PRD PLANTAGOCHI.md
├── IMPLEMENTATION_PLAN.md
└── README.md
```

---

## Halaman Aplikasi

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| Landing Page | `/` | Marketing page — hero, fitur, cara kerja, harga, CTA |
| Demo Interaktif | `/demo` | Demo digital twin (tanpa login) |
| Harga | `/pricing` | Paket produk + FAQ |
| Login | `/login` | Tab Admin (email+password) |
| **Leaderboard** | `/leaderboard` | Top 20 kaktus — streak / level / total siram |
| **Taman Komunitas** | `/garden` | Galeri + tombol kasih sayang |
| Digital Twin | `/p/:token` | Halaman tanaman — tersambung Firebase |
| Onboarding | `/p/:token/setup` | Scan pertama — beri nama & email |
| Admin Dashboard | `/admin` | Statistik platform |
| Admin Tanaman | `/admin/plants` | CRUD tanaman + generate QR |
| Admin Users | `/admin/users` | Daftar pemilik tanaman |
| Admin Settings | `/admin/settings` | Pengaturan & info app |

---

## Environment Variables

Buat file `app/.env` berdasarkan `app/.env.example`:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# EmailJS (daftar gratis di emailjs.com)
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

> ⚠️ Jangan pernah commit `.env` ke Git. File ini sudah ada di `.gitignore`.

---

## Referensi Dokumen

| Dokumen | File |
|---------|------|
| Business Plan | `BUSINESS PLAN PLANTAGOCHI.md` |
| Studi Kelayakan | `Laporan_Studi_Kelayakan_Bisnis_Plantagochi.md` |
| Product Requirements | `PRD PLANTAGOCHI.md` |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |