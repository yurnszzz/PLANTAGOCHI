/**
 * Plantagochi — Constants & Configuration
 * Single source of truth for game mechanics, achievements, and app settings
 */

// =====================
// Level System
// =====================

export const LEVEL_THRESHOLDS = [
  { level: 1, threshold: 0,  name: 'Benih',    emoji: null },
  { level: 2, threshold: 4,  name: 'Tunas',    emoji: null },
  { level: 3, threshold: 8,  name: 'Remaja',   emoji: null },
  { level: 4, threshold: 12, name: 'Dewasa',   emoji: null },
  { level: 5, threshold: 16, name: 'Berbunga', emoji: null },
]

export const MAX_LEVEL = 5

// =====================
// Watering / Streak
// =====================

export const WATER_INTERVAL_DAYS = 7    // Must wait 7 days between waterings
export const GRACE_PERIOD_DAYS = 3      // 3-day grace before streak resets
export const DEMO_COOLDOWN_MS = 3000    // 3 seconds for demo mode

// =====================
// Achievements
// =====================

export const ACHIEVEMENTS = [
  {
    id: 'first_water',
    name: 'Siram Pertama',
    desc: 'Siram tanamanmu untuk pertama kalinya',
    requirement: 1,
    type: 'water',
  },
  {
    id: 'water_5',
    name: 'Perawat Pemula',
    desc: 'Siram tanaman sebanyak 5 kali',
    requirement: 5,
    type: 'water',
  },
  {
    id: 'water_10',
    name: 'Perawat Handal',
    desc: 'Siram tanaman sebanyak 10 kali',
    requirement: 10,
    type: 'water',
  },
  {
    id: 'water_20',
    name: 'Ahli Kaktus',
    desc: 'Siram tanaman sebanyak 20 kali',
    requirement: 20,
    type: 'water',
  },
  {
    id: 'streak_3',
    name: 'Konsisten!',
    desc: 'Capai streak 3 minggu berturut-turut',
    requirement: 3,
    type: 'streak',
  },
  {
    id: 'streak_5',
    name: 'Tekun!',
    desc: 'Capai streak 5 minggu berturut-turut',
    requirement: 5,
    type: 'streak',
  },
  {
    id: 'streak_8',
    name: 'Tak Terbendung!',
    desc: 'Capai streak 8 minggu berturut-turut',
    requirement: 8,
    type: 'streak',
  },
  {
    id: 'level_2',
    name: 'Mulai Tumbuh',
    desc: 'Naikkan tanamanmu ke Level 2',
    requirement: 2,
    type: 'level',
  },
  {
    id: 'level_3',
    name: 'Tumbuh Besar',
    desc: 'Naikkan tanamanmu ke Level 3',
    requirement: 3,
    type: 'level',
  },
  {
    id: 'level_5',
    name: 'Berbunga!',
    desc: 'Naikkan tanamanmu ke Level 5 (max)',
    requirement: 5,
    type: 'level',
  },
]

// =====================
// Care Tips (from store data)
// =====================

export const CARE_TIPS = [
  'Siram 1x seminggu atau 10 hari sekali',
  'Simpan di tempat terkena sinar matahari',
  'Jemur secara rutin jika di dalam ruangan',
  'Setelah sampai, tanam dulu lalu siram setelah 1-2 hari',
  'Gunakan media tanam yang porous (berpori) agar air tidak menggenang',
  'Hindari menyiram berlebihan — kaktus lebih tahan kering daripada basah',
]

// =====================
// Product Tiers
// =====================

export const PRODUCT_TIERS = [
  { id: 'standard', name: 'Kaktus Mini Standard', price: 25000, priceLabel: 'Rp 25.000' },
  { id: 'premium',  name: 'Kaktus Premium Pot',   price: 45000, priceLabel: 'Rp 40.000 – 50.000' },
  { id: 'gift',     name: 'Gift Bundle',           price: 75000, priceLabel: 'Rp 75.000' },
]

// =====================
// Plant Status
// =====================

export const PLANT_STATUS = {
  GENERATED: 'generated',  // QR created, not yet sold/scanned
  SCANNED: 'scanned',      // QR scanned but not onboarded
  ACTIVE: 'active',        // Onboarded and being used
  DORMANT: 'dormant',      // No activity for 30+ days
}

// =====================
// Admin Roles
// =====================

export const ADMIN_ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
}

// =====================
// App Config
// =====================

export const APP_CONFIG = {
  APP_NAME: 'Plantagochi',
  TAGLINE: 'Rawat Fisiknya, Level-Up Digitalnya.',
  MAX_PLANT_NAME_LENGTH: 20,
  PLANT_URL_PREFIX: '/p/',
}
