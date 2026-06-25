/**
 * Plantagochi — Firebase Cloud Functions
 * Author: Joshua (CTO)
 * 
 * Functions:
 *   1. createPlant      — Admin: buat plant + generate token
 *   2. recordWatering   — End-user: siram tanaman (validasi server-side)
 *   3. sendWateringReminders — Scheduled: reminder email mingguan
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { onSchedule } = require('firebase-functions/v2/scheduler')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

// ======= Import game logic (shared dengan frontend) =======
// Karena Cloud Functions adalah Node.js, kita tidak bisa import langsung dari
// src/lib/gameLogic.js (ESM). Kita copy logikanya di sini sebagai CJS.

const LEVEL_THRESHOLDS = [
  { level: 1, threshold: 0,  name: 'Benih' },
  { level: 2, threshold: 4,  name: 'Tunas' },
  { level: 3, threshold: 8,  name: 'Remaja' },
  { level: 4, threshold: 12, name: 'Dewasa' },
  { level: 5, threshold: 16, name: 'Berbunga' },
]

const WATER_INTERVAL_DAYS = 7
const GRACE_PERIOD_DAYS = 3

const ACHIEVEMENTS = [
  { id: 'first_water', name: 'Siram Pertama', requirement: 1, type: 'water' },
  { id: 'streak_3',   name: 'Konsisten!',    requirement: 3, type: 'streak' },
  { id: 'streak_5',   name: 'Tekun!',        requirement: 5, type: 'streak' },
  { id: 'level_3',    name: 'Tumbuh Besar',  requirement: 3, type: 'level' },
  { id: 'level_5',    name: 'Berbunga!',     requirement: 5, type: 'level' },
]

function getLevel(totalWaters) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalWaters >= LEVEL_THRESHOLDS[i].threshold) return LEVEL_THRESHOLDS[i].level
  }
  return 1
}

function getLevelName(level) {
  return (LEVEL_THRESHOLDS.find(t => t.level === level) || LEVEL_THRESHOLDS[0]).name
}

function processWatering(plant) {
  const now = new Date()
  const daysSinceLast = plant.last_watered_at
    ? (now - new Date(plant.last_watered_at)) / (1000 * 60 * 60 * 24)
    : null

  let newStreak
  if (daysSinceLast === null) {
    newStreak = 1
  } else if (daysSinceLast <= WATER_INTERVAL_DAYS + GRACE_PERIOD_DAYS) {
    newStreak = (plant.streak || 0) + 1
  } else {
    newStreak = 1
  }

  const newTotalWaters = (plant.total_waters || 0) + 1
  const newLevel = getLevel(newTotalWaters)
  const longestStreak = Math.max(plant.longest_streak || 0, newStreak)

  // Check newly unlocked achievements (permanent — never revoked)
  const currentUnlocked = plant.unlocked_achievements || []
  const unlockedCodes = currentUnlocked.map(a => a.code)
  const newAchievements = []

  for (const ach of ACHIEVEMENTS) {
    if (unlockedCodes.includes(ach.id)) continue
    let qualifies = false
    if (ach.id === 'first_water') qualifies = newTotalWaters >= ach.requirement
    else if (ach.id.startsWith('streak_')) qualifies = longestStreak >= ach.requirement
    else if (ach.id.startsWith('level_')) qualifies = newLevel >= ach.requirement
    if (qualifies) {
      newAchievements.push({ code: ach.id, unlocked_at: now.toISOString() })
    }
  }

  return {
    total_waters: newTotalWaters,
    streak: newStreak,
    longest_streak: longestStreak,
    level: newLevel,
    last_watered_at: now.toISOString(),
    unlocked_achievements: [...currentUnlocked, ...newAchievements],
    // Track new achievements separately so caller can toast them
    _newly_unlocked: newAchievements,
    _level_up: newLevel > (plant.level || 1),
    _new_level_name: getLevelName(newLevel),
  }
}

// ======= Init Firebase Admin =======
initializeApp()
const db = getFirestore()

// ======================================================
// FUNCTION 1: createPlant
// Admin-only: create a new plant document with UUID token
// Called from: Admin dashboard → PlantsManager.jsx
//
// NOTE: Untuk UAS/MVP, PlantsManager.jsx sudah bisa
// createPlant langsung dari client karena kita pakai
// Firestore rules yang membolehkan admin write.
// Function ini berguna untuk masa depan jika kita mau
// strict server-side validation + quota control per seller.
// ======================================================
exports.createPlant = onCall({ region: 'asia-southeast1' }, async (request) => {
  // Verify admin
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Login required.')
  }

  const adminDoc = await db.collection('admins').doc(request.auth.uid).get()
  if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
    throw new HttpsError('permission-denied', 'Admin access required.')
  }

  const { productTier = 'standard', count = 1 } = request.data
  const safeCount = Math.min(Math.max(1, count), 20)

  const tokens = []
  const batch = db.batch()

  for (let i = 0; i < safeCount; i++) {
    // Generate UUID v4
    const token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })

    const plantData = {
      product_tier: productTier,
      plant_name: null,
      owner_email: null,
      total_waters: 0,
      streak: 0,
      longest_streak: 0,
      level: 1,
      last_watered_at: null,
      onboarded_at: null,
      created_at: FieldValue.serverTimestamp(),
      is_active: false,
      unlocked_achievements: [],
      status: 'generated',
    }

    batch.set(db.collection('plants').doc(token), plantData)
    tokens.push(token)
  }

  await batch.commit()
  return { success: true, tokens, count: tokens.length }
})

// ======================================================
// FUNCTION 2: recordWatering
// End-user: validates cooldown server-side, processes game logic,
// writes to Firestore. Prevents client-side cheating.
//
// NOTE: Untuk UAS/MVP, PlantPage.jsx sudah langsung
// updateDoc ke Firestore (tanpa Cloud Function). Itu OK
// karena security rules kita sudah enforce cooldown 7 hari.
// Function ini adalah versi "proper" untuk production
// yang bisa kamu swap-in nanti tanpa ubah frontend.
// ======================================================
exports.recordWatering = onCall({ region: 'asia-southeast1' }, async (request) => {
  const { plantToken } = request.data

  if (!plantToken || typeof plantToken !== 'string') {
    throw new HttpsError('invalid-argument', 'plantToken diperlukan.')
  }

  const plantRef = db.collection('plants').doc(plantToken)

  try {
    let newAchievements = []
    let leveledUp = false
    let newLevelName = ''

    await db.runTransaction(async (tx) => {
      const plantSnap = await tx.get(plantRef)

      if (!plantSnap.exists) {
        throw new HttpsError('not-found', 'Tanaman tidak ditemukan.')
      }

      const plant = plantSnap.data()

      if (!plant.plant_name) {
        throw new HttpsError('failed-precondition', 'Tanaman belum di-onboard.')
      }

      // Server-side cooldown check
      if (plant.last_watered_at) {
        const daysSinceLast = (Date.now() - new Date(plant.last_watered_at).getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceLast < WATER_INTERVAL_DAYS) {
          const daysLeft = Math.ceil(WATER_INTERVAL_DAYS - daysSinceLast)
          throw new HttpsError('failed-precondition', `Sudah disiram. Tunggu ${daysLeft} hari lagi.`)
        }
      }

      const updates = processWatering(plant)
      newAchievements = updates._newly_unlocked
      leveledUp = updates._level_up
      newLevelName = updates._new_level_name

      // Remove internal-only fields before writing
      const { _newly_unlocked, _level_up, _new_level_name, ...firestoreUpdates } = updates
      tx.update(plantRef, firestoreUpdates)

      // Log watering in subcollection
      const logRef = plantRef.collection('watering_logs').doc()
      tx.set(logRef, {
        watered_at: new Date().toISOString(),
        streak_after: updates.streak,
        level_after: updates.level,
        is_streak_break: updates.streak === 1 && (plant.streak || 0) > 1,
      })
    })

    return {
      success: true,
      leveledUp,
      newLevelName,
      newAchievements: newAchievements.map(a => a.code),
    }
  } catch (err) {
    if (err instanceof HttpsError) throw err
    console.error('recordWatering error:', err)
    throw new HttpsError('internal', 'Gagal menyiram. Coba lagi.')
  }
})

// ======================================================
// FUNCTION 3: sendWateringReminders
// Scheduled: runs daily at 08:00 WIB
// Queries plants where last_watered_at > 7 days ago,
// owner_email is set, and plant is active.
//
// REQUIRES: Blaze plan + Resend API key di environment variable
// Setup: firebase functions:secrets:set RESEND_API_KEY
// ======================================================
exports.sendWateringReminders = onSchedule(
  {
    schedule: 'every day 08:00',
    timeZone: 'Asia/Jakarta',
    region: 'asia-southeast1',
  },
  async () => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set. Skipping email reminders.')
      return
    }

    const cutoff = new Date(Date.now() - WATER_INTERVAL_DAYS * 24 * 60 * 60 * 1000)

    // Query plants overdue for watering
    const staleSnap = await db.collection('plants')
      .where('is_active', '==', true)
      .where('last_watered_at', '<', cutoff.toISOString())
      .get()

    if (staleSnap.empty) {
      console.log('No plants need watering reminder today.')
      return
    }

    // Filter: only plants with owner_email
    const plantsToRemind = staleSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.owner_email)

    console.log(`Sending reminders to ${plantsToRemind.length} plants...`)

    let sent = 0
    let failed = 0

    for (const plant of plantsToRemind) {
      try {
        const plantUrl = `https://plantagochi.web.app/p/${plant.id}`
        const daysSince = plant.last_watered_at
          ? Math.floor((Date.now() - new Date(plant.last_watered_at).getTime()) / (1000 * 60 * 60 * 24))
          : '?'

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Plantagochi <reminder@plantagochi.web.app>',
            to: plant.owner_email,
            subject: `${plant.plant_name} kangen disiram! 🌵`,
            html: buildReminderEmail(plant, plantUrl, daysSince),
          }),
        })

        if (!res.ok) {
          const err = await res.text()
          throw new Error(`Resend error: ${err}`)
        }

        // Log notification sent
        await db.collection('plants').doc(plant.id)
          .collection('notification_logs').add({
            type: 'reminder',
            status: 'sent',
            sent_at: new Date().toISOString(),
          })

        sent++
      } catch (err) {
        console.error(`Failed to send reminder to plant ${plant.id}:`, err.message)
        failed++
      }
    }

    console.log(`Reminders: ${sent} sent, ${failed} failed`)
  }
)

// ======================================================
// Email template builder
// ======================================================
function buildReminderEmail(plant, plantUrl, daysSince) {
  const levelNames = ['', 'Benih', 'Tunas', 'Remaja', 'Dewasa', 'Berbunga']
  const levelName = levelNames[plant.level] || 'Benih'

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plantagochi Reminder</title>
</head>
<body style="margin:0;padding:0;background:#0A0F0D;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#4ADE80;font-size:24px;margin:0;letter-spacing:-0.5px;">🌵 Plantagochi</h1>
      <p style="color:#6B7280;font-size:13px;margin:8px 0 0;">Rawat Fisiknya, Level-Up Digitalnya.</p>
    </div>

    <!-- Card -->
    <div style="background:rgba(17,25,22,0.8);border:1px solid rgba(74,222,128,0.15);border-radius:16px;padding:28px;">
      <h2 style="color:#F0FDF4;font-size:20px;margin:0 0 8px;">
        ${plant.plant_name} sudah ${daysSince} hari tidak disiram!
      </h2>
      <p style="color:#9CA3AF;font-size:14px;margin:0 0 24px;line-height:1.6;">
        Digital twin kaktusmu sedang menunggu. Siram sekarang sebelum streak-mu ${plant.streak > 0 ? `(${plant.streak} minggu) ` : ''}berakhir!
      </p>

      <!-- Stats Row -->
      <div style="display:flex;gap:12px;margin-bottom:24px;">
        <div style="flex:1;background:rgba(74,222,128,0.08);border-radius:10px;padding:14px;text-align:center;">
          <div style="color:#4ADE80;font-size:22px;font-weight:700;">Lv.${plant.level}</div>
          <div style="color:#6B7280;font-size:11px;margin-top:2px;">${levelName}</div>
        </div>
        <div style="flex:1;background:rgba(251,146,60,0.08);border-radius:10px;padding:14px;text-align:center;">
          <div style="color:#FB923C;font-size:22px;font-weight:700;">🔥 ${plant.streak}</div>
          <div style="color:#6B7280;font-size:11px;margin-top:2px;">Streak</div>
        </div>
      </div>

      <!-- CTA Button -->
      <a href="${plantUrl}" 
         style="display:block;background:#4ADE80;color:#0A0F0D;text-decoration:none;
                text-align:center;padding:14px 24px;border-radius:10px;
                font-weight:700;font-size:16px;letter-spacing:0.2px;">
        💧 Siram Sekarang
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#374151;font-size:12px;margin:0;">
        Kamu menerima email ini karena mendaftarkan tanaman di Plantagochi.<br>
        <a href="${plantUrl}" style="color:#4ADE80;text-decoration:none;">Lihat tanamanku</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
