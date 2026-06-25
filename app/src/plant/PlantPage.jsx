import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getLevel, getLevelInfo, getLevelProgress, getWatersToNextLevel, canWater, getCooldownRemaining, processWatering } from '../lib/gameLogic'
import { ACHIEVEMENTS, CARE_TIPS, APP_CONFIG } from '../lib/constants'
import CactusAvatar from '../components/CactusAvatar'
import {
  Droplets, Flame, Trophy, Star, BookOpen, Lightbulb,
  ChevronDown, ChevronUp, ArrowLeft, Share2, AlertCircle,
  User, Calendar, Sparkles, Heart, Smile, Frown, Meh, Zap
} from 'lucide-react'
import './PlantPage.css'

const PLANT_MOODS = [
  { emoji: '😊', label: 'Senang', icon: Smile, color: 'var(--green-400)' },
  { emoji: '😐', label: 'Biasa', icon: Meh, color: 'var(--amber-400)' },
  { emoji: '😞', label: 'Haus', icon: Frown, color: 'var(--rose-400)' },
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
  const [showProfile, setShowProfile] = useState(false)
  const [toast, setToast] = useState(null)
  const [levelUpAnim, setLevelUpAnim] = useState(false)
  const [waterDrops, setWaterDrops] = useState(false)

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

  // Calculate plant mood based on watering
  const getPlantMood = () => {
    if (!plant?.last_watered_at) return PLANT_MOODS[2] // Haus
    const daysSince = (Date.now() - new Date(plant.last_watered_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince <= 7) return PLANT_MOODS[0]  // Senang
    if (daysSince <= 10) return PLANT_MOODS[1] // Biasa (grace period)
    return PLANT_MOODS[2] // Haus
  }

  // Calculate XP (experience points)
  const getXP = () => {
    const waters = plant?.total_waters || 0
    const streakBonus = (plant?.longest_streak || 0) * 10
    return (waters * 25) + streakBonus + ((plant?.unlocked_achievements || []).length * 50)
  }

  // Calculate days since onboarding
  const getDaysSinceOnboarding = () => {
    if (!plant?.onboarded_at) return 0
    return Math.floor((Date.now() - new Date(plant.onboarded_at).getTime()) / (1000 * 60 * 60 * 24))
  }

  // Handle watering action
  const handleWater = async () => {
    if (!plant || isWatering) return

    // Check cooldown
    if (!canWater(plant.last_watered_at)) {
      const remaining = getCooldownRemaining(plant.last_watered_at)
      showToast(`Sudah disiram! ${remaining || 'Tunggu minggu depan.'}`, 'info')
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
      setPlant(prev => ({ ...prev, ...updates, last_watered_at: new Date().toISOString() }))

      // Check for level up
      if (updates.level > oldLevel) {
        setLevelUpAnim(true)
        setTimeout(() => setLevelUpAnim(false), 2000)
        showToast(`Level Up! Sekarang Level ${updates.level} — ${getLevelInfo(updates.level).name}`, 'success')
      } else {
        showToast('Berhasil disiram! 🌵', 'success')
      }

      // Check new achievements
      const newAchievements = updates.unlocked_achievements.filter(
        a => !(plant.unlocked_achievements || []).find(pa => pa.code === a.code)
      )
      if (newAchievements.length > 0) {
        setTimeout(() => {
          const badge = ACHIEVEMENTS.find(ab => ab.id === newAchievements[0].code)
          if (badge) showToast(`🏆 Achievement: ${badge.name}!`, 'success')
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

  // Handle share
  const handleShare = async () => {
    const url = `${window.location.origin}/p/${token}`
    const text = `🌵 ${plant.plant_name} sudah Level ${plant.level || 1}! Streak ${plant.streak || 0} minggu di Plantagochi!`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Plantagochi', text, url })
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      showToast('Link disalin ke clipboard!', 'info')
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
  const mood = getPlantMood()
  const xp = getXP()
  const daysSince = getDaysSinceOnboarding()

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
        <button className="plant-page__share" onClick={handleShare} aria-label="Share">
          <Share2 size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="plant-page__content">

        {/* Mood Indicator */}
        <div className="plant-page__mood">
          <mood.icon size={16} style={{ color: mood.color }} />
          <span style={{ color: mood.color }}>{plant.plant_name} merasa {mood.label.toLowerCase()}</span>
        </div>

        {/* Avatar */}
        <div className={`plant-page__avatar ${levelUpAnim ? 'plant-page__avatar--level-up' : ''}`}>
          <CactusAvatar level={level} size={180} />
          <span className="plant-page__level-badge">Lv.{level} — {levelInfo.name}</span>
        </div>

        {/* XP Bar */}
        <div className="plant-page__xp-bar">
          <div className="plant-page__xp-info">
            <span><Zap size={14} /> {xp} XP</span>
          </div>
        </div>

        {/* Progress */}
        <div className="plant-page__progress">
          <div className="plant-page__progress-bar">
            <div className="plant-page__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="plant-page__progress-text">
            {level < 5
              ? `Siram ${watersNeeded} kali lagi untuk naik level`
              : '🌸 Level Maksimum Tercapai!'}
          </p>
        </div>

        {/* Water Button */}
        <button
          className={`plant-page__water-btn ${!isWaterable ? 'plant-page__water-btn--disabled' : ''} ${isWatering ? 'plant-page__water-btn--watering' : ''}`}
          onClick={handleWater}
          disabled={!isWaterable || isWatering}
          id="btn-water"
        >
          <Droplets size={24} />
          <span>{isWatering ? 'Menyiram...' : isWaterable ? 'Siram Sekarang' : `Sudah Disiram${getCooldownRemaining(plant.last_watered_at) ? ' • ' + getCooldownRemaining(plant.last_watered_at) : ''}`}</span>
        </button>

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
            <span>Achievements ({unlockedCodes.length}/{ACHIEVEMENTS.length})</span>
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
                  {unlocked && <Sparkles size={14} style={{ color: 'var(--amber-400)', flexShrink: 0 }} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* User Profile */}
        <button className="plant-page__toggle" onClick={() => setShowProfile(!showProfile)}>
          <User size={18} />
          <span>Profil Pemilik</span>
          {showProfile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showProfile && (
          <div className="plant-page__report">
            <div className="plant-page__report-row">
              <span>Email</span>
              <strong>{plant.owner_email || 'Belum diisi'}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Merawat Sejak</span>
              <strong>{plant.onboarded_at ? new Date(plant.onboarded_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Lama Merawat</span>
              <strong>{daysSince} hari</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Total XP</span>
              <strong>{xp} XP</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Mood Tanaman</span>
              <strong style={{ color: mood.color }}>{mood.emoji} {mood.label}</strong>
            </div>
          </div>
        )}

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
              <span>Total XP</span>
              <strong>{xp} XP</strong>
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
      </div>
    </div>
  )
}
