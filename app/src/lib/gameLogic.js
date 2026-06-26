/**
 * Plantagochi — Game Logic (Shared Module)
 * Extracted from DemoPage.jsx for reuse across User App + Admin Dashboard
 */

import { LEVEL_THRESHOLDS, WATER_INTERVAL_DAYS, GRACE_PERIOD_DAYS, ACHIEVEMENTS } from './constants'

/**
 * Calculate plant level from total waters
 * Level 1 (Benih) → Level 5 (Berbunga)
 */
export function getLevel(totalWaters) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalWaters >= LEVEL_THRESHOLDS[i].threshold) {
      return LEVEL_THRESHOLDS[i].level
    }
  }
  return 1
}

/**
 * Get level info (name, threshold) for a given level
 */
export function getLevelInfo(level) {
  return LEVEL_THRESHOLDS.find(t => t.level === level) || LEVEL_THRESHOLDS[0]
}

/**
 * Calculate progress percentage towards next level
 */
export function getLevelProgress(totalWaters) {
  const level = getLevel(totalWaters)
  if (level >= 5) return 100

  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === level).threshold
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === level + 1).threshold
  const current = totalWaters - currentThreshold
  const needed = nextThreshold - currentThreshold
  return Math.round((current / needed) * 100)
}

/**
 * Calculate remaining waters needed to reach next level
 */
export function getWatersToNextLevel(totalWaters) {
  const level = getLevel(totalWaters)
  if (level >= 5) return 0
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === level + 1).threshold
  return nextThreshold - totalWaters
}

/**
 * Check if plant can be watered (cooldown check)
 * Handles ISO strings, Firestore Timestamps, and edge cases
 * @param {string|object|null} lastWateredAt - ISO string or Firestore Timestamp
 * @param {boolean} isDemoMode - If true, use 3-second cooldown
 * @returns {boolean}
 */
export function canWater(lastWateredAt, isDemoMode = false) {
  if (!lastWateredAt) return true

  // Handle Firestore Timestamp objects (has .toDate or .seconds)
  let lastDate
  if (typeof lastWateredAt === 'object' && lastWateredAt.toDate) {
    lastDate = lastWateredAt.toDate()
  } else if (typeof lastWateredAt === 'object' && lastWateredAt.seconds) {
    lastDate = new Date(lastWateredAt.seconds * 1000)
  } else {
    lastDate = new Date(lastWateredAt)
  }

  // Guard against invalid dates
  if (isNaN(lastDate.getTime())) return true

  const diff = Date.now() - lastDate.getTime()
  // If diff is negative (future date from manual edits), allow watering
  if (diff < 0) return true

  const cooldownMs = isDemoMode
    ? 3000 // 3 seconds for demo
    : WATER_INTERVAL_DAYS * 24 * 60 * 60 * 1000 // 7 days for production
  return diff > cooldownMs
}

/**
 * Get remaining cooldown time as human-readable string
 */
export function getCooldownRemaining(lastWateredAt) {
  if (!lastWateredAt) return null

  let lastDate
  if (typeof lastWateredAt === 'object' && lastWateredAt.toDate) {
    lastDate = lastWateredAt.toDate()
  } else if (typeof lastWateredAt === 'object' && lastWateredAt.seconds) {
    lastDate = new Date(lastWateredAt.seconds * 1000)
  } else {
    lastDate = new Date(lastWateredAt)
  }

  if (isNaN(lastDate.getTime())) return null

  const nextWater = new Date(lastDate.getTime() + WATER_INTERVAL_DAYS * 24 * 60 * 60 * 1000)
  const remaining = nextWater - Date.now()
  if (remaining <= 0) return null

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days} hari ${hours} jam lagi`
  return `${hours} jam lagi`
}

/**
 * Process a watering action — the core game loop
 * Handles streak calculation with grace period and reset logic
 * @param {Object} plant - Current plant state
 * @returns {Object} Updated fields
 */
export function processWatering(plant) {
  const now = new Date()
  const daysSinceLast = plant.last_watered_at
    ? (now - new Date(plant.last_watered_at)) / (1000 * 60 * 60 * 24)
    : null

  let newStreak
  if (daysSinceLast === null) {
    newStreak = 1 // first watering ever
  } else if (daysSinceLast <= WATER_INTERVAL_DAYS + GRACE_PERIOD_DAYS) {
    newStreak = (plant.streak || 0) + 1 // within window, streak continues
  } else {
    newStreak = 1 // window exceeded, streak resets
  }

  const newTotalWaters = (plant.total_waters || 0) + 1
  const newLevel = getLevel(newTotalWaters)
  const longestStreak = Math.max(plant.longest_streak || 0, newStreak)

  // Check for newly unlocked achievements
  const currentUnlocked = plant.unlocked_achievements || []
  const newAchievements = checkNewAchievements(
    newTotalWaters, newStreak, longestStreak, newLevel, currentUnlocked
  )

  return {
    total_waters: newTotalWaters,
    streak: newStreak,
    longest_streak: longestStreak,
    level: newLevel,
    last_watered_at: now.toISOString(),
    unlocked_achievements: [...currentUnlocked, ...newAchievements],
  }
}

/**
 * Check which achievements are newly unlocked
 * Achievements are permanent — once unlocked, never revoked
 */
export function checkNewAchievements(totalWaters, streak, longestStreak, level, currentUnlocked) {
  const unlockedCodes = currentUnlocked.map(a => a.code)
  const newlyUnlocked = []

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedCodes.includes(achievement.id)) continue // already unlocked

    let qualifies = false
    if (achievement.type === 'water') qualifies = totalWaters >= achievement.requirement
    else if (achievement.type === 'streak') qualifies = longestStreak >= achievement.requirement
    else if (achievement.type === 'level') qualifies = level >= achievement.requirement

    if (qualifies) {
      newlyUnlocked.push({
        code: achievement.id,
        unlocked_at: new Date().toISOString(),
      })
    }
  }

  return newlyUnlocked
}
