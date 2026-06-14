import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Droplets, Flame, Award, ArrowLeft, Sun, BookOpen, Share2, Calendar, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CactusAvatar from '../components/CactusAvatar'
import './DemoPage.css'

const STORAGE_KEY = 'plantagochi_demo'

const ACHIEVEMENTS = [
  { id: 'first_water', name: 'Siram Pertama', desc: 'Siram tanamanmu untuk pertama kalinya', icon: Droplets, requirement: 1 },
  { id: 'streak_3', name: 'Konsisten!', desc: 'Capai streak 3 minggu', icon: Flame, requirement: 3 },
  { id: 'streak_5', name: 'Tekun!', desc: 'Capai streak 5 minggu', icon: TrendingUp, requirement: 5 },
  { id: 'level_3', name: 'Tumbuh Besar', desc: 'Naikkan tanamanmu ke Level 3', icon: Award, requirement: 3 },
  { id: 'level_5', name: 'Berbunga!', desc: 'Naikkan tanamanmu ke Level 5 (max)', icon: Sun, requirement: 5 },
]

function getLevel(totalWaters) {
  if (totalWaters >= 16) return 5
  if (totalWaters >= 12) return 4
  if (totalWaters >= 8) return 3
  if (totalWaters >= 4) return 2
  return 1
}

function getLevelProgress(totalWaters) {
  const thresholds = [0, 4, 8, 12, 16]
  const level = getLevel(totalWaters)
  if (level >= 5) return 100
  const current = totalWaters - thresholds[level - 1]
  const needed = thresholds[level] - thresholds[level - 1]
  return Math.round((current / needed) * 100)
}

function getDefaultState() {
  return {
    plantName: '',
    totalWaters: 0,
    streak: 0,
    lastWatered: null,
    history: [],
    onboarded: false,
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) { /* ignore */ }
  return getDefaultState()
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) { /* ignore */ }
}

export default function DemoPage() {
  const [state, setState] = useState(loadState)
  const [nameInput, setNameInput] = useState('')
  const [waterAnimation, setWaterAnimation] = useState(false)
  const [levelUpAnimation, setLevelUpAnimation] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  const canWater = useCallback(() => {
    if (!state.lastWatered) return true
    const last = new Date(state.lastWatered)
    const now = new Date()
    // For demo: allow watering every 3 seconds instead of weekly
    const diff = now - last
    return diff > 3000
  }, [state.lastWatered])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleOnboard = (e) => {
    e.preventDefault()
    if (!nameInput.trim()) return
    setState(prev => ({
      ...prev,
      plantName: nameInput.trim(),
      onboarded: true,
    }))
    showNotification(`Selamat datang, ${nameInput.trim()}! Mulai rawat tanamanmu.`)
  }

  const handleWater = () => {
    if (!canWater()) {
      showNotification('Kamu sudah menyiram baru-baru ini! Tunggu sebentar.', 'info')
      return
    }

    const prevLevel = getLevel(state.totalWaters)
    const newTotal = state.totalWaters + 1
    const newLevel = getLevel(newTotal)

    setWaterAnimation(true)
    setTimeout(() => setWaterAnimation(false), 1200)

    if (newLevel > prevLevel) {
      setTimeout(() => {
        setLevelUpAnimation(true)
        showNotification(`Level Up! ${state.plantName} naik ke Level ${newLevel}!`)
        setTimeout(() => setLevelUpAnimation(false), 2000)
      }, 800)
    }

    setState(prev => ({
      ...prev,
      totalWaters: newTotal,
      streak: prev.streak + 1,
      lastWatered: new Date().toISOString(),
      history: [...prev.history, { date: new Date().toISOString(), action: 'water' }],
    }))

    if (!waterAnimation) {
      showNotification('Tanaman disiram! Streak +1')
    }
  }

  const handleReset = () => {
    setState(getDefaultState())
    setNameInput('')
    showNotification('Demo direset. Mulai petualangan baru!', 'info')
  }

  const level = getLevel(state.totalWaters)
  const progress = getLevelProgress(state.totalWaters)
  const unlockedAchievements = ACHIEVEMENTS.filter(a => {
    if (a.id === 'first_water') return state.totalWaters >= a.requirement
    if (a.id.startsWith('streak_')) return state.streak >= a.requirement
    if (a.id.startsWith('level_')) return level >= a.requirement
    return false
  })

  // Onboarding screen
  if (!state.onboarded) {
    return (
      <>
        <Navbar />
        <main className="demo">
          <div className="demo__onboarding">
            <div className="demo__onboarding-card">
              <div className="demo__onboarding-visual">
                <CactusAvatar level={1} size={160} />
              </div>
              <h1 className="demo__onboarding-title">
                Halo! Aku kaktus barumu.
              </h1>
              <p className="demo__onboarding-desc">
                Beri aku nama dan mulai rawat aku. Aku akan tumbuh besar dan berbunga 
                kalau kamu rajin menyiramku!
              </p>
              <form className="demo__onboarding-form" onSubmit={handleOnboard}>
                <input
                  type="text"
                  className="demo__name-input"
                  placeholder="Ketik nama tanamanmu..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={20}
                  autoFocus
                  id="plant-name-input"
                />
                <button type="submit" className="btn btn-primary btn-lg" id="start-btn">
                  Mulai Petualangan
                </button>
              </form>
              <Link to="/" className="demo__back-link">
                <ArrowLeft size={16} />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Main demo interface
  return (
    <>
      <Navbar />
      <main className="demo">
        {/* Notification toast */}
        {notification && (
          <div className={`demo__toast demo__toast--${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="demo__layout container">
          {/* Left column - Main interaction */}
          <div className="demo__main">
            <div className="demo__header">
              <div>
                <h1 className="demo__plant-name">{state.plantName}</h1>
                <p className="demo__subtitle">Digital Twin - Demo Interaktif</p>
              </div>
              <button className="btn btn-ghost" onClick={handleReset} id="reset-btn">
                Reset Demo
              </button>
            </div>

            <div className={`demo__avatar-container ${levelUpAnimation ? 'demo__avatar-container--level-up' : ''}`}>
              {waterAnimation && (
                <div className="demo__water-drops">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="demo__water-drop" style={{ animationDelay: `${i * 0.1}s`, left: `${20 + i * 15}%` }} />
                  ))}
                </div>
              )}
              <CactusAvatar level={level} name={state.plantName} size={220} />
            </div>

            {/* Progress bar */}
            <div className="demo__progress-section">
              <div className="demo__progress-labels">
                <span>Level {level}</span>
                <span>{level < 5 ? `Level ${level + 1}` : 'MAX'}</span>
              </div>
              <div className="demo__progress-bar">
                <div className="demo__progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="demo__progress-text">
                {level < 5
                  ? `Siram ${[0, 4, 8, 12, 16][level] - state.totalWaters} kali lagi untuk naik level`
                  : 'Level Maksimum Tercapai!'}
              </p>
            </div>

            {/* Water button */}
            <button
              className={`demo__water-btn ${!canWater() ? 'demo__water-btn--disabled' : ''}`}
              onClick={handleWater}
              disabled={!canWater()}
              id="water-btn"
            >
              <Droplets size={22} />
              <span>{canWater() ? 'Sudah Disiram!' : 'Baru Disiram...'}</span>
            </button>

            <p className="demo__water-note">
              <Calendar size={14} />
              Demo: bisa disiram setiap 3 detik. Versi asli: 1x per minggu.
            </p>
          </div>

          {/* Right column - Stats & Achievements */}
          <div className="demo__sidebar">
            {/* Stats cards */}
            <div className="demo__stats">
              <div className="demo__stat-card">
                <div className="demo__stat-icon demo__stat-icon--streak">
                  <Flame size={20} />
                </div>
                <div>
                  <p className="demo__stat-value">{state.streak}</p>
                  <p className="demo__stat-label">Streak Minggu</p>
                </div>
              </div>
              <div className="demo__stat-card">
                <div className="demo__stat-icon demo__stat-icon--water">
                  <Droplets size={20} />
                </div>
                <div>
                  <p className="demo__stat-value">{state.totalWaters}</p>
                  <p className="demo__stat-label">Total Siram</p>
                </div>
              </div>
              <div className="demo__stat-card">
                <div className="demo__stat-icon demo__stat-icon--level">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="demo__stat-value">{level}</p>
                  <p className="demo__stat-label">Level</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="demo__achievements">
              <h3 className="demo__section-title">
                <Award size={18} />
                Pencapaian
              </h3>
              <div className="demo__achievements-list">
                {ACHIEVEMENTS.map(a => {
                  const unlocked = unlockedAchievements.includes(a)
                  return (
                    <div key={a.id} className={`demo__achievement ${unlocked ? 'demo__achievement--unlocked' : ''}`}>
                      <div className="demo__achievement-icon">
                        <a.icon size={16} />
                      </div>
                      <div>
                        <p className="demo__achievement-name">{a.name}</p>
                        <p className="demo__achievement-desc">{a.desc}</p>
                      </div>
                      {unlocked && <span className="demo__achievement-badge">Tercapai</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Report Card / Buku Rapor */}
            <button className="demo__report-toggle" onClick={() => setShowReport(!showReport)} id="report-toggle">
              <BookOpen size={18} />
              {showReport ? 'Tutup' : 'Lihat'} Buku Rapor
            </button>

            {showReport && (
              <div className="demo__report">
                <h3 className="demo__report-title">Buku Rapor Tanaman</h3>
                <div className="demo__report-grid">
                  <div className="demo__report-item">
                    <span className="demo__report-label">Nama</span>
                    <span className="demo__report-value">{state.plantName}</span>
                  </div>
                  <div className="demo__report-item">
                    <span className="demo__report-label">Level</span>
                    <span className="demo__report-value">Lv.{level}</span>
                  </div>
                  <div className="demo__report-item">
                    <span className="demo__report-label">Streak</span>
                    <span className="demo__report-value">{state.streak} minggu</span>
                  </div>
                  <div className="demo__report-item">
                    <span className="demo__report-label">Total Siram</span>
                    <span className="demo__report-value">{state.totalWaters}x</span>
                  </div>
                  <div className="demo__report-item">
                    <span className="demo__report-label">Pencapaian</span>
                    <span className="demo__report-value">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
                  </div>
                  <div className="demo__report-item">
                    <span className="demo__report-label">Status</span>
                    <span className="demo__report-value demo__report-value--green">Sehat</span>
                  </div>
                </div>
                <button className="btn btn-secondary demo__share-btn" id="share-btn">
                  <Share2 size={16} />
                  Screenshot & Share
                </button>
              </div>
            )}

            {/* Care Tips */}
            <div className="demo__tips">
              <h3 className="demo__section-title">
                <Sun size={18} />
                Tips Perawatan
              </h3>
              <ul className="demo__tips-list">
                <li>Siram 1x seminggu atau 10 hari sekali</li>
                <li>Simpan di tempat terkena sinar matahari</li>
                <li>Jemur secara rutin jika di dalam ruangan</li>
                <li>Setelah sampai, tanam dulu lalu siram setelah 1-2 hari</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
