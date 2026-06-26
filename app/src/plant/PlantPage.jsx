import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getLevel, getLevelInfo, getLevelProgress, getWatersToNextLevel, canWater, processWatering } from '../lib/gameLogic'
import { ACHIEVEMENTS, CARE_TIPS, APP_CONFIG, WATER_INTERVAL_DAYS } from '../lib/constants'
import { sendWateringReminder, getDaysSinceWatering } from '../lib/emailService'
import CactusAvatar from '../components/CactusAvatar'
import {
  Droplets, Flame, Trophy, Star, BookOpen, Lightbulb,
  ChevronDown, ChevronUp, ArrowLeft, Share2, AlertCircle,
  CalendarCheck, Users, ShoppingBag
} from 'lucide-react'
import './PlantPage.css'

// ── Daily check-in helpers (localStorage, per plant per day) ──
const CHECKIN_KEY = 'plantagochi_checkins'
function getTodayStr() { return new Date().toISOString().slice(0, 10) }
function getCheckinLog() {
  try { return JSON.parse(localStorage.getItem(CHECKIN_KEY) || '{}') } catch { return {} }
}
function hasCheckedIn(plantToken) {
  const log = getCheckinLog()
  return log[plantToken] === getTodayStr()
}
function markCheckedIn(plantToken) {
  const log = getCheckinLog()
  log[plantToken] = getTodayStr()
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(log))
}

// ── Accessories catalog ──
const ACCESSORIES = [
  { id: 'sunglasses', label: 'Kacamata Hitam', emoji: '🕶️', cost: 30 },
  { id: 'hat',        label: 'Topi Ulang Tahun', emoji: '🎂', cost: 50 },
  { id: 'ribbon',     label: 'Pita Merah',      emoji: '🎀', cost: 20 },
  { id: 'crown',      label: 'Mahkota',          emoji: '👑', cost: 80 },
  { id: 'scarf',      label: 'Syal',             emoji: '🧣', cost: 40 },
]

export default function PlantPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isWatering, setIsWatering] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [toast, setToast] = useState(null)
  const [levelUpAnim, setLevelUpAnim] = useState(false)
  const [waterDrops, setWaterDrops] = useState(false)
  const [checkedInToday, setCheckedInToday] = useState(false)

  // Fetch plant data from Firestore
  useEffect(() => {
    async function fetchPlant() {
      try {
        const docRef = doc(db, 'plants', token)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          setError('not_found')
          return
        }

        const data = docSnap.data()

        // Not onboarded yet — redirect to setup
        if (!data.plant_name) {
          navigate(`/p/${token}/setup`, { replace: true })
          return
        }

        setPlant({ id: docSnap.id, ...data })
        setCheckedInToday(hasCheckedIn(docSnap.id))

        // Trigger email reminder jika tanaman sudah overdue (client-side, Spark-compatible)
        const daysSince = getDaysSinceWatering(data.last_watered_at, WATER_INTERVAL_DAYS)
        if (daysSince && data.owner_email && data.plant_name) {
          // Fire-and-forget — tidak perlu await, jangan block UI
          sendWateringReminder({
            plantToken: docSnap.id,
            plantName:  data.plant_name,
            ownerEmail: data.owner_email,
            streak:     data.streak || 0,
            daysSince,
            plantUrl:   window.location.href,
          })
        }
      } catch (err) {
        console.error('Fetch plant error:', err)
        setError('fetch_error')
      } finally {
        setLoading(false)
      }
    }

    fetchPlant()
  }, [token, navigate])

  // Show toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Daily check-in handler (+5 XP bonus)
  const handleCheckIn = async () => {
    if (checkedInToday || !plant) return
    markCheckedIn(plant.id)
    setCheckedInToday(true)
    try {
      const plantRef = doc(db, 'plants', token)
      // +5 XP represented as 0.5 water credit (visual only in coins)
      await updateDoc(plantRef, {
        coins: (plant.coins || 0) + 5,
        last_checkin: new Date().toISOString(),
      })
      setPlant(prev => ({ ...prev, coins: (prev.coins || 0) + 5 }))
      showToast('Check-in berhasil! +5 koin 🪙', 'success')
    } catch (err) {
      console.error('Check-in error:', err)
    }
  }

  // Buy accessory handler
  const handleBuyAccessory = async (acc) => {
    if (!plant) return
    const coins = plant.coins || 0
    const owned = plant.accessories || []
    if (owned.includes(acc.id)) {
      // Equip / unequip
      const equipped = plant.equipped_accessory === acc.id ? null : acc.id
      await updateDoc(doc(db, 'plants', token), { equipped_accessory: equipped })
      setPlant(prev => ({ ...prev, equipped_accessory: equipped }))
      showToast(equipped ? `${acc.label} dipakai! ${acc.emoji}` : 'Aksesori dilepas.', 'success')
      return
    }
    if (coins < acc.cost) {
      showToast(`Koin tidak cukup! Butuh ${acc.cost} koin.`, 'error')
      return
    }
    const newCoins = coins - acc.cost
    const newAccessories = [...owned, acc.id]
    try {
      await updateDoc(doc(db, 'plants', token), {
        coins: newCoins,
        accessories: newAccessories,
        equipped_accessory: acc.id,
      })
      setPlant(prev => ({ ...prev, coins: newCoins, accessories: newAccessories, equipped_accessory: acc.id }))
      showToast(`${acc.label} dibeli & dipakai! ${acc.emoji}`, 'success')
    } catch (err) {
      console.error('Buy accessory error:', err)
      showToast('Gagal membeli. Coba lagi.', 'error')
    }
  }

  // Handle watering action
  const handleWater = async () => {
    if (!plant || isWatering) return

    // Check cooldown
    if (!canWater(plant.last_watered_at)) {
      const lastWatered = new Date(plant.last_watered_at)
      const nextWater = new Date(lastWatered.getTime() + 7 * 24 * 60 * 60 * 1000)
      const daysLeft = Math.ceil((nextWater - Date.now()) / (1000 * 60 * 60 * 24))
      showToast(`Sudah disiram! Tunggu ${daysLeft} hari lagi.`, 'info')
      return
    }

    setIsWatering(true)
    setWaterDrops(true)

    try {
      const oldLevel = plant.level || getLevel(plant.total_waters || 0)
      const updates = processWatering(plant)

      // Write to Firestore
      const plantRef = doc(db, 'plants', token)
      await updateDoc(plantRef, {
        ...updates,
        last_watered_at: new Date().toISOString(),
      })

      // Log watering
      await addDoc(collection(db, 'plants', token, 'watering_logs'), {
        watered_at: new Date().toISOString(),
        is_streak_break: updates.streak === 1 && (plant.streak || 0) > 1,
      })

      // Update local state
      setPlant(prev => ({ ...prev, ...updates }))

      // Check for level up
      if (updates.level > oldLevel) {
        setLevelUpAnim(true)
        setTimeout(() => setLevelUpAnim(false), 2000)
        showToast(`Level Up! Sekarang Level ${updates.level} — ${getLevelInfo(updates.level).name}`, 'success')
      } else {
        showToast('Berhasil disiram!', 'success')
      }

      // Check new achievements
      const newAchievements = updates.unlocked_achievements.filter(
        a => !(plant.unlocked_achievements || []).find(pa => pa.code === a.code)
      )
      if (newAchievements.length > 0) {
        setTimeout(() => {
          const badge = ACHIEVEMENTS.find(ab => ab.id === newAchievements[0].code)
          if (badge) showToast(`Achievement: ${badge.name}!`, 'success')
        }, 1500)
      }
    } catch (err) {
      console.error('Watering error:', err)
      showToast('Gagal menyiram. Coba lagi.', 'error')
    } finally {
      setIsWatering(false)
      setTimeout(() => setWaterDrops(false), 1000)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-screen__spinner" />
        <p>Memuat tanaman...</p>
      </div>
    )
  }

  // Error states
  if (error === 'not_found') {
    return (
      <div className="plant-error">
        <AlertCircle size={48} />
        <h2>Tanaman Tidak Ditemukan</h2>
        <p>QR Code ini tidak valid atau tanaman belum didaftarkan.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Ke Beranda</button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="plant-error">
        <AlertCircle size={48} />
        <h2>Terjadi Kesalahan</h2>
        <p>Gagal memuat data tanaman. Silakan refresh halaman.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh</button>
      </div>
    )
  }

  if (!plant) return null

  const level = plant.level || getLevel(plant.total_waters || 0)
  const levelInfo = getLevelInfo(level)
  const progress = getLevelProgress(plant.total_waters || 0)
  const watersNeeded = getWatersToNextLevel(plant.total_waters || 0)
  const unlockedCodes = (plant.unlocked_achievements || []).map(a => a.code)
  const isWaterable = canWater(plant.last_watered_at)

  return (
    <div className="plant-page">
      {/* Toast */}
      {toast && (
        <div className={`plant-toast plant-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Water drops animation */}
      {waterDrops && (
        <div className="plant-water-drops">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="plant-water-drop" style={{ animationDelay: `${i * 0.1}s`, left: `${20 + Math.random() * 60}%` }}>
              <Droplets size={16} />
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="plant-page__header">
        <button className="plant-page__back" onClick={() => navigate('/')} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <h1 className="plant-page__plant-name">{plant.plant_name}</h1>
        <button className="plant-page__share" aria-label="Share">
          <Share2 size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="plant-page__content">
        {/* Avatar */}
        <div className={`plant-page__avatar ${levelUpAnim ? 'plant-page__avatar--level-up' : ''}`}>
          <div className="plant-page__avatar-wrap">
            <CactusAvatar level={level} size={180} />
            {plant.equipped_accessory && (
              <span className="plant-page__accessory-overlay">
                {ACCESSORIES.find(a => a.id === plant.equipped_accessory)?.emoji}
              </span>
            )}
          </div>
          <span className="plant-page__level-badge">Lv.{level} — {levelInfo.name}</span>
          <span className="plant-page__coins">🪙 {plant.coins || 0} koin</span>
        </div>

        {/* Progress */}
        <div className="plant-page__progress">
          <div className="plant-page__progress-bar">
            <div className="plant-page__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="plant-page__progress-text">
            {level < 5
              ? `Siram ${watersNeeded} kali lagi untuk naik level`
              : 'Level Maksimum Tercapai!'}
          </p>
        </div>

        {/* Water Button */}
        <div className="plant-page__water-btn-wrap">
          <button
            className={`plant-page__water-btn ${!isWaterable ? 'plant-page__water-btn--disabled' : ''} ${isWatering ? 'plant-page__water-btn--watering' : ''}`}
            onClick={handleWater}
            disabled={!isWaterable || isWatering}
            id="btn-water"
          >
            <Droplets size={24} />
            <span>{isWatering ? 'Menyiram...' : isWaterable ? 'Siram Sekarang' : 'Sudah Disiram Minggu Ini'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="plant-page__stats">
          <div className="plant-page__stat">
            <Droplets size={18} className="plant-page__stat-icon" />
            <span className="plant-page__stat-value">{plant.total_waters || 0}</span>
            <span className="plant-page__stat-label">Total Siram</span>
          </div>
          <div className="plant-page__stat">
            <Flame size={18} className="plant-page__stat-icon plant-page__stat-icon--streak" />
            <span className="plant-page__stat-value">{plant.streak || 0}</span>
            <span className="plant-page__stat-label">Streak</span>
          </div>
          <div className="plant-page__stat">
            <Star size={18} className="plant-page__stat-icon plant-page__stat-icon--star" />
            <span className="plant-page__stat-value">{plant.longest_streak || 0}</span>
            <span className="plant-page__stat-label">Best Streak</span>
          </div>
          <div className="plant-page__stat">
            <Trophy size={18} className="plant-page__stat-icon plant-page__stat-icon--trophy" />
            <span className="plant-page__stat-value">{unlockedCodes.length}/{ACHIEVEMENTS.length}</span>
            <span className="plant-page__stat-label">Badges</span>
          </div>
        </div>

        {/* Achievements */}
        <div className="plant-page__section">
          <h3 className="plant-page__section-title">
            <Trophy size={18} />
            <span>Achievements</span>
          </h3>
          <div className="plant-page__achievements">
            {ACHIEVEMENTS.map(a => {
              const unlocked = unlockedCodes.includes(a.id)
              return (
                <div key={a.id} className={`plant-page__badge ${unlocked ? 'plant-page__badge--unlocked' : ''}`}>
                  <div className="plant-page__badge-icon">
                    {a.type === 'water' && <Droplets size={16} />}
                    {a.type === 'streak' && <Flame size={16} />}
                    {a.type === 'level' && <Star size={16} />}
                  </div>
                  <div className="plant-page__badge-info">
                    <span className="plant-page__badge-name">{a.name}</span>
                    <span className="plant-page__badge-desc">{a.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Buku Rapor */}
        <button className="plant-page__toggle" onClick={() => setShowReport(!showReport)}>
          <BookOpen size={18} />
          <span>Buku Rapor Tanaman</span>
          {showReport ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showReport && (
          <div className="plant-page__report">
            <div className="plant-page__report-row">
              <span>Nama Tanaman</span>
              <strong>{plant.plant_name}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Level</span>
              <strong>Lv.{level} — {levelInfo.name}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Total Siram</span>
              <strong>{plant.total_waters || 0} kali</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Streak Aktif</span>
              <strong>{plant.streak || 0} minggu</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Streak Terpanjang</span>
              <strong>{plant.longest_streak || 0} minggu</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Achievements</span>
              <strong>{unlockedCodes.length}/{ACHIEVEMENTS.length}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Tanaman Sejak</span>
              <strong>{plant.onboarded_at ? new Date(plant.onboarded_at).toLocaleDateString('id-ID') : '-'}</strong>
            </div>
          </div>
        )}

        {/* Tips Perawatan */}
        <button className="plant-page__toggle" onClick={() => setShowTips(!showTips)}>
          <Lightbulb size={18} />
          <span>Tips Perawatan</span>
          {showTips ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showTips && (
          <div className="plant-page__tips">
            {CARE_TIPS.map((tip, i) => (
              <div key={i} className="plant-page__tip">
                <Lightbulb size={14} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        )}

        {/* Daily Check-in */}
        <div className="plant-page__checkin">
          <div className="plant-page__checkin-header">
            <CalendarCheck size={18} />
            <span>Check-in Harian</span>
            <span className="plant-page__checkin-bonus">+5 🪙</span>
          </div>
          <p className="plant-page__checkin-desc">Sapa kaktusmu setiap hari dan dapatkan koin untuk beli aksesori!</p>
          <button
            className={`plant-page__checkin-btn ${checkedInToday ? 'plant-page__checkin-btn--done' : ''}`}
            onClick={handleCheckIn}
            disabled={checkedInToday}
          >
            {checkedInToday ? '✅ Sudah Check-in Hari Ini' : '👋 Sapa Kaktusmu!'}
          </button>
        </div>

        {/* Toko Aksesori */}
        <button className="plant-page__toggle" onClick={() => setShowShop(!showShop)}>
          <ShoppingBag size={18} />
          <span>Toko Aksesori</span>
          <span className="plant-page__shop-coins">🪙 {plant.coins || 0}</span>
          {showShop ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showShop && (
          <div className="plant-page__shop">
            {ACCESSORIES.map(acc => {
              const owned = (plant.accessories || []).includes(acc.id)
              const equipped = plant.equipped_accessory === acc.id
              return (
                <div key={acc.id} className={`plant-page__shop-item ${equipped ? 'plant-page__shop-item--equipped' : ''}`}>
                  <span className="plant-page__shop-emoji">{acc.emoji}</span>
                  <div className="plant-page__shop-info">
                    <span className="plant-page__shop-name">{acc.label}</span>
                    {equipped && <span className="plant-page__shop-tag">Dipakai</span>}
                    {owned && !equipped && <span className="plant-page__shop-tag plant-page__shop-tag--owned">Dimiliki</span>}
                  </div>
                  <button
                    className={`plant-page__shop-btn ${owned ? 'plant-page__shop-btn--owned' : ''}`}
                    onClick={() => handleBuyAccessory(acc)}
                  >
                    {equipped ? 'Lepas' : owned ? 'Pakai' : `🪙 ${acc.cost}`}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Link ke komunitas */}
        <div className="plant-page__community-links">
          <a href="/leaderboard" className="plant-page__community-link">
            <Trophy size={16} />
            <span>Papan Peringkat</span>
          </a>
          <a href="/garden" className="plant-page__community-link">
            <Users size={16} />
            <span>Taman Komunitas</span>
          </a>
        </div>
      </div>
    </div>
  )
}
