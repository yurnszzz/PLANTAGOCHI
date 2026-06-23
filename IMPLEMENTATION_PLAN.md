# IMPLEMENTATION PLAN — Plantagochi Phase 2

> **Dokumen ini untuk koordinasi tim. Update checklist saat task selesai.**

Terakhir diupdate: 23 Juni 2026

---

## Tim & Spesialisasi

| Nama | Peran | Fokus Utama |
|------|-------|-------------|
| **Hasan** | CEO / Frontend | Theme system, routing, UI pages, Lighthouse audit |
| **Joshua** | CTO / Backend Lead | Firebase setup, Firestore, auth, QR generation, security |
| **Rifqi (Apip)** | CMO / Frontend | Login page, onboarding, admin pages, responsive testing |
| **Latief** | COO / Support | Game logic copy, manual QA, dokumentasi, presentasi |
| **Ibrahim** | CFO / Support | Firebase Console observe, bug tracking, business docs |

---

## Progress Tracker

### ✅ SELESAI (Dikerjakan oleh Hasan)

| # | Task | File/Folder | Status |
|---|------|-------------|--------|
| 1 | Extract game logic ke shared module | `src/lib/gameLogic.js` | ✅ Done |
| 2 | Constants & configuration | `src/lib/constants.js` | ✅ Done |
| 3 | Firebase SDK init (template) | `src/lib/firebase.js` | ✅ Done |
| 4 | Theme context (dark/light) | `src/context/ThemeContext.jsx` | ✅ Done |
| 5 | Auth context (Firebase Auth) | `src/context/AuthContext.jsx` | ✅ Done |
| 6 | ThemeToggle component | `src/components/ThemeToggle.jsx` + CSS | ✅ Done |
| 7 | ProtectedRoute (auth guard) | `src/components/ProtectedRoute.jsx` | ✅ Done |
| 8 | Login page (user + admin tabs) | `src/pages/LoginPage.jsx` + CSS | ✅ Done |
| 9 | Plant page (digital twin real) | `src/plant/PlantPage.jsx` + CSS | ✅ Done |
| 10 | Plant onboarding (scan pertama) | `src/plant/PlantOnboarding.jsx` + CSS | ✅ Done |
| 11 | Admin layout (sidebar + topbar) | `src/admin/AdminLayout.jsx` + CSS | ✅ Done |
| 12 | Admin dashboard (stats overview) | `src/admin/DashboardPage.jsx` | ✅ Done |
| 13 | Admin plants manager + QR gen | `src/admin/PlantsManager.jsx` | ✅ Done |
| 14 | Admin users manager | `src/admin/UsersManager.jsx` | ✅ Done |
| 15 | Admin settings page | `src/admin/SettingsPage.jsx` | ✅ Done |
| 16 | App.jsx routing (3 area) | `src/App.jsx` | ✅ Done |
| 17 | main.jsx (providers wrap) | `src/main.jsx` | ✅ Done |
| 18 | Light theme CSS variables | `src/index.css` | ✅ Done |
| 19 | Navbar (theme toggle + login btn) | `src/components/Navbar.jsx` + CSS | ✅ Done |
| 20 | Firestore security rules | `firestore.rules` | ✅ Done |
| 21 | Environment template | `app/.env.example` | ✅ Done |
| 22 | README.md update | `README.md` | ✅ Done |
| 23 | npm dependencies (firebase, qrcode) | `package.json` | ✅ Done |

---

### 🔲 BELUM DIKERJAKAN — Per Orang

#### Joshua (CTO) — PRIORITAS TINGGI

| # | Task | Detail | Deadline |
|---|------|--------|----------|
| J1 | 🔲 Setup Firebase project (Spark) | Buat project di console.firebase.google.com, enable Firestore + Auth | Minggu 1 |
| J2 | 🔲 Isi `.env` dengan config Firebase | Copy config dari Firebase Console → `app/.env` | Minggu 1 |
| J3 | 🔲 Deploy Firestore rules | `firebase deploy --only firestore:rules` | Minggu 1 |
| J4 | 🔲 Buat admin account di Firebase | Auth → Add user, Firestore → admins collection | Minggu 1 |
| J5 | 🔲 Test login flow end-to-end | Login admin → dashboard → buat plant → QR → test scan | Minggu 2 |
| J6 | 🔲 Test watering flow end-to-end | Scan QR → onboard → siram → cek Firestore | Minggu 2 |
| J7 | 🔲 Firestore indexes (jika perlu) | Composite indexes untuk query admin | Minggu 3 |
| J8 | 🔲 Firebase Hosting deployment | `firebase deploy --only hosting` | Minggu 4 |

#### Rifqi / Apip (CMO) — MEDIUM

| # | Task | Detail | Deadline |
|---|------|--------|----------|
| R1 | 🔲 Cross-browser testing | Test di Chrome, Safari, Firefox — mobile & desktop | Minggu 2 |
| R2 | 🔲 Mobile responsive testing | Semua plant pages harus sempurna di HP | Minggu 2 |
| R3 | 🔲 Fix UI bugs dari testing | Bug visual yang ditemukan saat testing | Minggu 3 |
| R4 | 🔲 Share/screenshot Buku Rapor | Implement `html-to-canvas` + Web Share API di PlantReport | Minggu 3 |

#### Hasan (CEO) — MEDIUM

| # | Task | Detail | Deadline |
|---|------|--------|----------|
| H1 | 🔲 Test dark/light theme semua halaman | Pastikan semua halaman bagus di kedua tema | Minggu 1 |
| H2 | 🔲 Lighthouse audit | Target >90 performance mobile | Minggu 3 |
| H3 | 🔲 Fix CTASection.jsx copy | Hapus "tanpa biaya langganan" → sesuaikan model | Minggu 1 |
| H4 | 🔲 Final polish & animations | Micro-interactions, transitions, loading states | Minggu 4 |

#### Latief (COO) — RINGAN

| # | Task | Detail | Deadline |
|---|------|--------|----------|
| L1 | 🔲 Manual QA — semua user flows | Test: scan → onboard → siram → level up → rapor | Minggu 2 |
| L2 | 🔲 Manual QA — admin flows | Test: login → dashboard → buat QR → lihat users | Minggu 3 |
| L3 | 🔲 Kumpulkan screenshot untuk presentasi | Screenshot setiap halaman & fitur | Minggu 3 |
| L4 | 🔲 Bantu buat slides presentasi | PowerPoint / Google Slides | Minggu 4 |

#### Ibrahim (CFO) — RINGAN

| # | Task | Detail | Deadline |
|---|------|--------|----------|
| I1 | 🔲 Observe Joshua setup Firebase | Catat langkah-langkah untuk dokumentasi | Minggu 1 |
| I2 | 🔲 Buat spreadsheet bug tracking | Google Sheets untuk catat bugs dari QA Latief | Minggu 2 |
| I3 | 🔲 Update dokumen bisnis | Reconcile angka di Business Plan & Studi Kelayakan | Minggu 3 |
| I4 | 🔲 Bantu slides presentasi | Bagian keuangan & bisnis model | Minggu 4 |

---

## Panduan Setup Firebase (Step-by-Step)

> **Ini untuk Joshua. Minta Ibrahim ikut observe supaya bisa dokumentasi.**

### 1. Buat Project
1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Klik "Add project" → nama: `plantagochi`
3. Matikan Google Analytics (tidak perlu untuk MVP)
4. Klik "Create project"

### 2. Enable Firestore
1. Sidebar → Build → Firestore Database
2. "Create database" → **Production mode** → Pilih region `asia-southeast2 (Jakarta)`
3. Setelah jadi, kita akan deploy rules dari file `firestore.rules`

### 3. Enable Authentication
1. Sidebar → Build → Authentication → "Get started"
2. Tab "Sign-in method" → Enable **Email/Password**
3. Tab "Users" → "Add user" → masukkan email & password untuk akun admin

### 4. Buat Admin Document
1. Kembali ke Firestore → "Start collection" → Collection ID: `admins`
2. Document ID: **copy UID dari user yang baru dibuat di Authentication**
3. Tambah fields:
   - `role` (string): `admin`
   - `email` (string): `<email admin>`

### 5. Ambil Config Web App
1. Sidebar → Project Settings (gear icon)
2. Scroll ke "Your apps" → "Add app" → pilih Web (icon `</>`)
3. App nickname: `plantagochi-web` → Register app
4. Copy `firebaseConfig` object
5. Buat file `app/.env`:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=plantagochi.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=plantagochi
VITE_FIREBASE_STORAGE_BUCKET=plantagochi.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 6. Deploy Rules
```bash
npm install -g firebase-tools
firebase login
firebase init  # pilih Firestore saja, gunakan file yang sudah ada
firebase deploy --only firestore:rules
```

### 7. Test
```bash
cd app
npm run dev
```
- Buka `http://localhost:5173/login` → Tab Admin → login
- Buka `http://localhost:5173/admin` → buat tanaman → generate QR
- Scan QR atau buka URL tanaman → test onboarding & watering

---

## Arsitektur Singkat

```
┌────────────────────────────────────────────────────┐
│                  WEB PORTAL                         │
│  Landing (/) → Demo (/demo) → Pricing (/pricing)  │
│                Login (/login)                       │
│           [Tab User] [Tab Admin]                    │
└───────┬────────────────────────────┬────────────────┘
        │                            │
        ▼                            ▼
┌───────────────────┐    ┌──────────────────────┐
│    USER APP       │    │   ADMIN DASHBOARD    │
│                   │    │                      │
│  /p/:token        │    │  /admin              │
│  /p/:token/setup  │    │  /admin/plants       │
│                   │    │  /admin/users        │
│  • CactusAvatar   │    │  /admin/settings     │
│  • Watering btn   │    │                      │
│  • Streak/Level   │    │  • Generate QR       │
│  • Achievements   │    │  • CRUD plants       │
│  • Buku Rapor     │    │  • View users        │
└────────┬──────────┘    └──────────┬───────────┘
         │                          │
         ▼                          ▼
┌────────────────────────────────────────────────────┐
│             FIREBASE (Spark / Free)                 │
│                                                     │
│  Firestore:  plants/{token}  →  watering_logs/      │
│              admins/{uid}                            │
│  Auth:       Email/Password (admin login)            │
└────────────────────────────────────────────────────┘
```

---

## Login Flow

```
User punya 2 cara masuk:

1. SCAN QR CODE (utama)
   Scan → /p/:token → Jika belum onboard → /p/:token/setup
                     → Jika sudah → tampilkan digital twin

2. LOGIN VIA PORTAL
   /login → Tab "Pemilik Tanaman" → Input email
          → Sistem cari plant di Firestore by owner_email
          → Tampilkan daftar tanaman → Klik → redirect ke /p/:token

Admin:
   /login → Tab "Admin" → Email + Password
          → Firebase Auth → Cek role di Firestore admins collection
          → Redirect ke /admin
```

---

## File yang Sudah Dibuat (Phase 2)

```
Baru:
  src/lib/gameLogic.js          ← Logic siram, streak, level, achievement
  src/lib/constants.js          ← Konfigurasi game (threshold, badges, tips)
  src/lib/firebase.js           ← Firebase init + env vars
  src/context/ThemeContext.jsx   ← Dark/Light theme provider
  src/context/AuthContext.jsx    ← Firebase Auth provider
  src/components/ThemeToggle.*   ← Tombol switch tema
  src/components/ProtectedRoute.jsx ← Guard untuk admin routes
  src/pages/LoginPage.*         ← Login terintegrasi (user + admin)
  src/plant/PlantPage.*         ← Digital twin page (real, Firestore)
  src/plant/PlantOnboarding.*   ← Onboarding scan pertama
  src/admin/AdminLayout.*       ← Sidebar + layout admin
  src/admin/DashboardPage.jsx   ← Dashboard overview
  src/admin/PlantsManager.jsx   ← CRUD plants + QR generation
  src/admin/UsersManager.jsx    ← Lihat pemilik tanaman
  src/admin/SettingsPage.jsx    ← Settings & info app
  firestore.rules               ← Firestore security rules
  app/.env.example              ← Template environment variables

Updated:
  src/App.jsx                   ← Routing 3 area (portal/plant/admin)
  src/main.jsx                  ← ThemeProvider + AuthProvider wrap
  src/index.css                 ← Light theme CSS variables
  src/components/Navbar.*       ← ThemeToggle + Login button
  README.md                     ← Full rewrite
  .gitignore                    ← .env entries
```

---

*Kalau ada pertanyaan, tanya di grup atau hubungi Hasan/Joshua langsung.*
