# PANDUAN SETUP FIREBASE + EMAILJS
### Plantagochi — 100% Gratis (Spark Plan)
*Ikuti urutan ini persis. Estimasi total: ~1.5 jam*

---

## LANGKAH 1 — BUAT PROJECT FIREBASE

1. Buka **https://console.firebase.google.com**
2. Klik **"Add project"**
3. Nama project: `plantagochi`
4. Matikan Google Analytics → **"Create project"**
5. Tunggu hingga selesai → **"Continue"**

---

## LANGKAH 2 — ENABLE FIRESTORE

1. Sidebar kiri → **Build → Firestore Database**
2. Klik **"Create database"**
3. Mode: **"Start in production mode"** ✅
4. Region: **`asia-southeast2 (Jakarta)`**
5. Klik **"Enable"** → tunggu

---

## LANGKAH 3 — ENABLE AUTHENTICATION

1. Sidebar kiri → **Build → Authentication**
2. Klik **"Get started"**
3. Tab **"Sign-in method"** → klik **Email/Password**
4. Toggle baris pertama ke **ON** (Email/Password)
5. Klik **"Save"**

---

## LANGKAH 4 — BUAT AKUN ADMIN

### 4A. Buat user di Authentication

1. Masih di Authentication → tab **"Users"**
2. Klik **"Add user"**
3. Isi:
   - Email: `admin@plantagochi.com`
   - Password: buat password kuat (catat di tempat aman!)
4. Klik **"Add user"**
5. ⚠️ **COPY UID** yang muncul di kolom "User UID" — kamu butuh ini di langkah berikutnya

### 4B. Buat dokumen admin di Firestore

1. Sidebar → **Build → Firestore Database**
2. Klik **"+ Start collection"**
3. Collection ID: `admins` → **"Next"**
4. Document ID: **paste UID dari 4A** (JANGAN klik Auto-ID)
5. Klik **"+ Add field"**:
   - Field: `role` | Type: `string` | Value: `admin`
6. Klik **"+ Add field"** lagi:
   - Field: `email` | Type: `string` | Value: `admin@plantagochi.com`
7. Klik **"Save"**

---

## LANGKAH 5 — AMBIL FIREBASE CONFIG

1. Sidebar → klik ikon **gear ⚙️** → **"Project settings"**
2. Scroll ke **"Your apps"** → klik ikon **Web `</>`**
3. App nickname: `plantagochi-web`
4. Jangan centang Firebase Hosting
5. Klik **"Register app"**
6. **Copy seluruh blok `firebaseConfig`** yang muncul

---

## LANGKAH 6 — ISI FILE .env

Di folder project kamu, buka terminal:

```bash
cd app
cp .env.example .env
```

Buka file `app/.env` dan isi dengan nilai dari Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...          ← dari firebaseConfig.apiKey
VITE_FIREBASE_AUTH_DOMAIN=plantagochi.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=plantagochi
VITE_FIREBASE_STORAGE_BUCKET=plantagochi.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=12345...
VITE_FIREBASE_APP_ID=1:12345...:web:abc...

# EmailJS — isi setelah Langkah 8
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxx
```

⚠️ Jangan pernah commit `.env` ke Git. File ini sudah ada di `.gitignore`.

---

## LANGKAH 7 — INSTALL & TEST LOKAL

```bash
# Install dependencies (sudah include @emailjs/browser)
cd app
npm install

# Jalankan dev server
npm run dev
```

Buka `http://localhost:5173` — tidak boleh ada error Firebase di console browser.

Test login admin:
1. Buka `http://localhost:5173/login`
2. Tab **"Admin"** → login dengan email + password dari Langkah 4
3. Harusnya redirect ke `/admin`

---

## LANGKAH 8 — SETUP EMAILJS (Email Reminder)

EmailJS gratis: **200 email/bulan** — cukup untuk UAS.
Email reminder dikirim saat user membuka halaman tanamannya (client-side).

### 8A. Daftar & setup EmailJS

1. Buka **https://www.emailjs.com** → **"Sign Up Free"**
2. Daftar dengan email salah satu anggota tim

### 8B. Tambah Email Service

1. Dashboard → **"Email Services"** → **"Add New Service"**
2. Pilih **Gmail** (atau Outlook jika pakai Outlook)
3. Klik **"Connect Account"** → login dengan akun Gmail tim
4. Service Name: `plantagochi`
5. Klik **"Create Service"**
6. ⚠️ **Copy Service ID** yang muncul (format: `service_xxxxxxx`)

### 8C. Buat Email Template

1. Dashboard → **"Email Templates"** → **"Create New Template"**
2. Isi template:

**To Email:** `{{to_email}}`
**Subject:** `{{plant_name}} kangen disiram! 🌵`
**Body (HTML):**

```html
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
  <h2 style="color:#16a34a;margin:0 0 8px;">🌵 Plantagochi</h2>
  <p style="color:#374151;margin:0 0 16px;">
    Hei! <strong>{{plant_name}}</strong> sudah <strong>{{days_since}} hari</strong> tidak disiram.
  </p>
  <p style="color:#374151;margin:0 0 16px;">
    Streak kamu saat ini: <strong>🔥 {{streak}} minggu</strong>. Jangan sampai putus!
  </p>
  <a href="{{plant_url}}" 
     style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;">
    💧 Siram Sekarang
  </a>
  <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
    Plantagochi — Rawat Fisiknya, Level-Up Digitalnya.
  </p>
</div>
```

3. Klik **"Save"**
4. ⚠️ **Copy Template ID** (format: `template_xxxxxxx`)

### 8D. Ambil Public Key

1. Dashboard → klik nama kamu di kanan atas → **"Account"**
2. Tab **"General"** → bagian **"API Keys"**
3. ⚠️ **Copy Public Key**

### 8E. Isi .env dengan nilai EmailJS

Update `app/.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx    ← dari 8B
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx  ← dari 8C
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxx       ← dari 8D
```

Restart dev server setelah update `.env`:
```bash
# Ctrl+C untuk stop, lalu:
npm run dev
```

---

## LANGKAH 9 — DEPLOY FIRESTORE RULES & INDEXES

```bash
# Install Firebase CLI (sekali saja)
npm install -g firebase-tools

# Login
firebase login

# Init (dari root project, bukan dari folder app/)
cd ..   # pastikan di folder PLANTAGOCHI/
firebase init
```

Saat firebase init:
- Centang: ✅ **Firestore** dan ✅ **Hosting**
- Jangan centang Functions (tidak perlu untuk Spark)
- "Use an existing project" → pilih `plantagochi`
- Firestore Rules file: tekan Enter (default `firestore.rules` ✅)
- Firestore Indexes file: tekan Enter (default `firestore.indexes.json` ✅)
- Hosting public directory: `app/dist`
- Configure as SPA: **Yes**
- Overwrite existing index.html: **No**

Deploy rules dan indexes:
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## LANGKAH 10 — BUILD & DEPLOY KE FIREBASE HOSTING

```bash
# Build frontend
cd app
npm run build

# Deploy ke hosting
cd ..
firebase deploy --only hosting
```

Setelah selesai:
```
✔ Deploy complete!
Hosting URL: https://plantagochi.web.app
```

Buka URL tersebut → test semua flow dari browser + HP.

---

## CHECKLIST AKHIR

### J1–J4 (Firebase Setup)
- [ ] Firebase project `plantagochi` aktif
- [ ] Firestore enabled (region Jakarta)
- [ ] Authentication Email/Password enabled
- [ ] Admin user dibuat + dokumen Firestore `admins/{uid}` ada

### J2 (env)
- [ ] `app/.env` sudah diisi semua nilai Firebase + EmailJS
- [ ] `npm run dev` berjalan tanpa error Firebase di console

### J3 (rules)
- [ ] `firebase deploy --only firestore:rules` sukses
- [ ] `firebase deploy --only firestore:indexes` sukses

### J5 (test login)
- [ ] Login admin `/login` → Tab Admin → redirect ke `/admin` ✅
- [ ] Login email salah → muncul error message ✅
- [ ] Sidebar admin berfungsi (Dashboard / Tanaman / Users / Settings) ✅

### J6 (test watering)
- [ ] Admin buat QR → copy URL `/p/:token`
- [ ] Buka URL di incognito → redirect ke `/p/:token/setup` ✅
- [ ] Isi nama + email → submit → redirect ke `/p/:token` ✅
- [ ] Klik "Sudah Disiram" → toast muncul + data tersimpan di Firestore ✅
- [ ] Refresh halaman → data masih ada (level, streak) ✅

### J7 (email)
- [ ] EmailJS service & template dibuat
- [ ] `.env` EmailJS sudah diisi
- [ ] Test: set `last_watered_at` di Firestore ke 8 hari lalu, buka halaman tanaman → cek inbox `owner_email` ✅

### J8 (hosting)
- [ ] `npm run build` sukses
- [ ] `firebase deploy --only hosting` sukses
- [ ] Site live di `https://plantagochi.web.app` ✅
- [ ] Scan QR dari HP → halaman onboarding terbuka ✅

---

## TEST EMAIL REMINDER (Cara Manual)

Karena cooldown 7 hari, untuk test email:

1. Buka **Firebase Console → Firestore**
2. Cari dokumen plant yang sudah di-onboard (punya `owner_email` dan `plant_name`)
3. Edit field `last_watered_at` → ubah ke tanggal 8 hari lalu:
   - Format: `2026-06-16T10:00:00.000Z` (ganti tanggal sesuai 8 hari lalu dari hari ini)
4. Save
5. Buka halaman tanaman tersebut di browser
6. Cek inbox email `owner_email` — harusnya muncul email reminder dalam beberapa detik

Jika tidak muncul: cek browser console untuk pesan `[EmailJS]`.

---

## TROUBLESHOOTING

| Error | Solusi |
|-------|--------|
| `auth/invalid-api-key` | `.env` belum diisi / dev server belum di-restart |
| `Missing or insufficient permissions` | Rules belum di-deploy: `firebase deploy --only firestore:rules` |
| Login admin berhasil tapi redirect ke `/login` lagi | Cek Firestore → `admins/{uid}` → field `role` harus `admin` |
| Email reminder tidak terkirim | Cek console browser untuk pesan `[EmailJS]`. Pastikan `.env` EmailJS sudah diisi + dev server di-restart |
| `npm run build` error | Jalankan `npm run lint` dulu untuk cek error |

