# Plantagochi

### Platform SaaS Gamifikasi Interaktif untuk Penjual Kaktus & Sukulen Mini

> _"Rawat Fisiknya, Level-Up Digitalnya."_

---

## Deskripsi Proyek

**Plantagochi** adalah platform SaaS (Software as a Service) yang menyediakan ekosistem gamifikasi digital untuk toko kaktus dan sukulen mini. Platform ini memungkinkan penjual memberikan pengalaman **digital twin** kepada setiap pelanggan mereka — di mana setiap tanaman fisik yang dibeli memiliki representasi digital yang dapat dirawat, di-level-up, dan dibagikan ke media sosial.

### Konsep Utama

```
Pelanggan beli kaktus → Scan QR Code di pot → Masuk halaman digital twin
→ Rawat tanaman digital (streak mingguan) → Level-up → Share ke medsos
→ Engagement meningkat → Repeat purchase
```

### Fitur Utama

- **QR Code Integration** — Setiap pot dilengkapi QR Code unik yang langsung mengarahkan ke halaman digital twin
- **Digital Twin & Level-Up** — Avatar tanaman berevolusi dari benih hingga berbunga (5 level)
- **Streak System** — Penghitung streak mingguan terinspirasi Duolingo
- **Achievement Badges** — Sistem pencapaian untuk meningkatkan engagement
- **Buku Rapor Tanaman** — Rekap performa perawatan yang bisa di-share ke medsos
- **Email Notification** — Pengingat otomatis untuk menyiram tanaman

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

| Teknologi | Kegunaan |
|-----------|----------|
| React 19 | UI Library |
| Vite 6 | Build Tool & Dev Server |
| React Router v7 | Client-side Routing |
| Lucide React | SVG Icon Library |
| CSS (Vanilla) | Styling & Design System |
| LocalStorage | State Persistence (Demo) |

---

## Struktur Proyek

```
PLANTAGOCHI/
├── app/                            # Web Application
│   ├── public/
│   │   └── plantagochi-icon.svg    # Custom SVG favicon
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── CactusAvatar.jsx    # Digital twin SVG avatar (5 levels)
│   │   │   ├── CactusAvatar.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   ├── Logo.jsx            # Inline SVG brand logo
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── pages/                  # Route pages
│   │   │   ├── DemoPage.jsx        # Interactive demo (core product)
│   │   │   ├── DemoPage.css
│   │   │   ├── LandingPage.jsx     # Marketing landing page
│   │   │   ├── PricingPage.jsx     # SaaS pricing tiers
│   │   │   └── PricingPage.css
│   │   ├── sections/               # Landing page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HeroSection.css
│   │   │   ├── FeaturesSection.jsx
│   │   │   ├── FeaturesSection.css
│   │   │   ├── HowItWorksSection.jsx
│   │   │   ├── HowItWorksSection.css
│   │   │   ├── ProductShowcase.jsx
│   │   │   ├── ProductShowcase.css
│   │   │   ├── TestimonialSection.jsx
│   │   │   ├── TestimonialSection.css
│   │   │   ├── CTASection.jsx
│   │   │   └── CTASection.css
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global design system
│   ├── index.html                  # HTML template with SEO meta
│   ├── package.json
│   └── vite.config.js
├── BUSINESS PLAN PLANTAGOCHI.md    # Dokumen bisnis plan
├── Laporan_Studi_Kelayakan_Bisnis_Plantagochi.md  # Studi kelayakan bisnis
└── README.md                       # File ini
```

---

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone <repo-url>
cd PLANTAGOCHI
```

### 2. Install Dependencies

```bash
cd app
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

---

## Halaman Aplikasi

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **Landing Page** | `/` | Marketing page dengan hero, fitur, cara kerja, produk, testimoni, dan CTA |
| **Demo Interaktif** | `/demo` | Demo langsung digital twin — onboarding, siram, streak, level-up, achievement |
| **Harga** | `/pricing` | Paket SaaS (Starter/Business/Enterprise) dengan FAQ |

---

## Model Bisnis SaaS

Plantagochi beroperasi sebagai **white-label SaaS platform**:

| Paket | Harga | Target |
|-------|-------|--------|
| **Starter** | Gratis | Penjual baru, hingga 50 QR Code |
| **Business** | Rp 149.000/bulan | Toko serius, 500 QR Code, custom branding |
| **Enterprise** | Custom | Bisnis besar, unlimited, white-label penuh |

---

## Referensi

- Business Plan: `BUSINESS PLAN PLANTAGOCHI.md`
- Studi Kelayakan: `Laporan_Studi_Kelayakan_Bisnis_Plantagochi.md`

---
