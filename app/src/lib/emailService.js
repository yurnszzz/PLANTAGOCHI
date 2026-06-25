/**
 * Plantagochi — Email Service (EmailJS)
 *
 * Strategi: EmailJS dipanggil dari browser saat user membuka halaman tanaman.
 * - Jika tanaman sudah >7 hari tidak disiram → kirim reminder
 * - Reminder hanya dikirim sekali per sesi (dicek via localStorage throttle)
 * - Tidak perlu backend / Cloud Functions / Blaze plan
 *
 * Setup (sekali saja):
 * 1. Daftar di https://www.emailjs.com (gratis, 200 email/bulan)
 * 2. Dashboard → Email Services → Add New Service → Gmail / Outlook
 * 3. Dashboard → Email Templates → Create New Template (lihat template di bawah)
 * 4. Dashboard → Account → copy Public Key
 * 5. Isi VITE_EMAILJS_* di .env
 *
 * Template EmailJS yang disarankan (buat di dashboard EmailJS):
 * Subject: {{plant_name}} kangen disiram! 🌵
 * Body (HTML):
 *   Halo!
 *   {{plant_name}} sudah {{days_since}} hari tidak disiram.
 *   Yuk siram sekarang sebelum streak {{streak}} minggu-mu berakhir!
 *   → {{plant_url}}
 */

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

// Throttle key: jangan spam email di session yang sama
const REMINDER_THROTTLE_KEY = 'plantagochi_reminder_sent'
const THROTTLE_HOURS = 24 // kirim paling banyak 1x per 24 jam per tanaman

/**
 * Cek apakah reminder sudah pernah dikirim untuk tanaman ini dalam 24 jam terakhir
 */
function isThrottled(plantToken) {
  try {
    const raw = localStorage.getItem(REMINDER_THROTTLE_KEY)
    if (!raw) return false
    const log = JSON.parse(raw)
    const lastSent = log[plantToken]
    if (!lastSent) return false
    const hoursSince = (Date.now() - new Date(lastSent).getTime()) / (1000 * 60 * 60)
    return hoursSince < THROTTLE_HOURS
  } catch {
    return false
  }
}

/**
 * Catat bahwa reminder sudah dikirim untuk tanaman ini
 */
function markSent(plantToken) {
  try {
    const raw = localStorage.getItem(REMINDER_THROTTLE_KEY)
    const log = raw ? JSON.parse(raw) : {}
    log[plantToken] = new Date().toISOString()
    localStorage.setItem(REMINDER_THROTTLE_KEY, JSON.stringify(log))
  } catch {
    // ignore
  }
}

/**
 * Kirim email reminder via EmailJS
 * @param {Object} params
 * @param {string} params.plantToken  - ID tanaman (untuk throttle key)
 * @param {string} params.plantName   - Nama tanaman
 * @param {string} params.ownerEmail  - Email pemilik
 * @param {number} params.streak      - Streak aktif
 * @param {number} params.daysSince   - Hari sejak terakhir disiram
 * @param {string} params.plantUrl    - URL halaman tanaman
 * @returns {Promise<boolean>} true jika berhasil dikirim
 */
export async function sendWateringReminder({ plantToken, plantName, ownerEmail, streak, daysSince, plantUrl }) {
  // Guard: jangan kirim jika konfigurasi belum diisi
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('[EmailJS] Environment variables belum diisi. Skip reminder.')
    return false
  }

  // Guard: throttle — jangan kirim jika sudah dikirim dalam 24 jam
  if (isThrottled(plantToken)) {
    console.log('[EmailJS] Reminder sudah dikirim dalam 24 jam terakhir. Skip.')
    return false
  }

  // Guard: tidak ada email
  if (!ownerEmail) {
    return false
  }

  try {
    // Lazy-load emailjs-com agar tidak memperberat bundle
    const emailjs = await import('@emailjs/browser')

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email:   ownerEmail,
        plant_name: plantName,
        streak:     streak || 0,
        days_since: Math.floor(daysSince),
        plant_url:  plantUrl,
        level_name: getLevelName(plantName), // helper di bawah
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    )

    markSent(plantToken)
    console.log(`[EmailJS] Reminder terkirim ke ${ownerEmail} untuk ${plantName}`)
    return true
  } catch (err) {
    console.error('[EmailJS] Gagal kirim reminder:', err)
    return false
  }
}

/**
 * Cek apakah tanaman perlu diingatkan
 * @param {string|null} lastWateredAt - ISO string
 * @param {number} intervalDays - Interval penyiraman (default 7)
 * @returns {number|null} Jumlah hari sejak terakhir disiram, atau null jika belum perlu
 */
export function getDaysSinceWatering(lastWateredAt, intervalDays = 7) {
  if (!lastWateredAt) return null
  const daysSince = (Date.now() - new Date(lastWateredAt).getTime()) / (1000 * 60 * 60 * 24)
  return daysSince >= intervalDays ? daysSince : null
}

function getLevelName(level) {
  const names = ['', 'Benih', 'Tunas', 'Remaja', 'Dewasa', 'Berbunga']
  return names[level] || 'Benih'
}
