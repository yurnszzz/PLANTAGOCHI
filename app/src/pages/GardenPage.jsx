import { useState, useEffect, useCallback } from 'react'
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, increment, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import CactusAvatar from '../components/CactusAvatar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Heart, Sprout, Search } from 'lucide-react'
import './GardenPage.css'

const LIKES_THROTTLE_KEY = 'plantagochi_likes'
const DAILY_LIKE_LIMIT = 10

function getTodayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function getLikesGiven() {
  try {
    const raw = localStorage.getItem(LIKES_THROTTLE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch { return {} }
}

function hasLikedToday(plantId) {
  const log = getLikesGiven()
  const today = getTodayKey()
  return !!(log[today] && log[today][plantId])
}

function countLikesToday() {
  const log = getLikesGiven()
  const today = getTodayKey()
  return log[today] ? Object.keys(log[today]).length : 0
}

function markLiked(plantId) {
  const log = getLikesGiven()
  const today = getTodayKey()
  if (!log[today]) log[today] = {}
  log[today][plantId] = true
  // Bersihkan data lama (>7 hari)
  Object.keys(log).forEach(k => {
    if (k < new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)) delete log[k]
  })
  localStorage.setItem(LIKES_THROTTLE_KEY, JSON.stringify(log))
}

export default function GardenPage() {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [likeAnim, setLikeAnim] = useState({})
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => {
    async function fetchPlants() {
      try {
        const q = query(
          collection(db, 'plants'),
          where('is_active', '==', true),
          orderBy('total_waters', 'desc'),
          limit(48)
        )
        const snap = await getDocs(q)
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.plant_name)
        setPlants(data)
      } catch (err) {
        console.error('Garden fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlants()
  }, [])

  async function handleLike(plant) {
    if (hasLikedToday(plant.id)) {
      showToast('Sudah kasih sayang hari ini! Coba lagi besok 💚', 'info')
      return
    }
    if (countLikesToday() >= DAILY_LIKE_LIMIT) {
      showToast('Batas kasih sayang harian tercapai (10/hari) 🌵', 'info')
      return
    }

    // Optimistic update
    setLikeAnim(prev => ({ ...prev, [plant.id]: true }))
    setTimeout(() => setLikeAnim(prev => ({ ...prev, [plant.id]: false })), 600)

    markLiked(plant.id)

    // Update Firestore: +5 XP (total_waters sebagai XP proxy) + likes counter
    try {
      const plantRef = doc(db, 'plants', plant.id)
      await updateDoc(plantRef, {
        community_likes: increment(1),
      })
      // Update local state
      setPlants(prev => prev.map(p =>
        p.id === plant.id
          ? { ...p, community_likes: (p.community_likes || 0) + 1 }
          : p
      ))
      showToast(`Kasih sayang terkirim ke ${plant.plant_name}! 💚`)
    } catch (err) {
      console.error('Like error:', err)
    }
  }

  const filtered = plants.filter(p =>
    !search || p.plant_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main className="garden-page">
        <div className="container">
          <div className="garden-page__header">
            <Sprout size={40} className="garden-page__icon" />
            <h1>Taman Komunitas</h1>
            <p>Lihat kaktus milik sesama, dan kirim sedikit kasih sayang 💚</p>
          </div>

          {/* Search */}
          <div className="garden-page__search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari nama kaktus..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="garden-page__search-input"
            />
          </div>

          {/* Toast */}
          {toast && (
            <div className={`garden-toast garden-toast--${toast.type}`}>{toast.msg}</div>
          )}

          {/* Grid */}
          <div className="garden-page__grid">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="garden-card garden-card--skeleton" />
              ))
            ) : filtered.length === 0 ? (
              <div className="garden-page__empty">
                <Sprout size={48} />
                <p>{search ? 'Tidak ada kaktus dengan nama itu.' : 'Belum ada kaktus di taman komunitas.'}</p>
              </div>
            ) : (
              filtered.map(plant => (
                <div key={plant.id} className="garden-card">
                  <div className="garden-card__avatar">
                    <CactusAvatar level={plant.level || 1} size={80} animated={false} />
                  </div>
                  <p className="garden-card__name">{plant.plant_name}</p>
                  <p className="garden-card__meta">Lv.{plant.level || 1} · 🔥{plant.streak || 0}</p>
                  <button
                    className={`garden-card__like-btn ${hasLikedToday(plant.id) ? 'garden-card__like-btn--liked' : ''} ${likeAnim[plant.id] ? 'garden-card__like-btn--anim' : ''}`}
                    onClick={() => handleLike(plant)}
                  >
                    <Heart size={14} fill={hasLikedToday(plant.id) ? 'currentColor' : 'none'} />
                    <span>{plant.community_likes || 0}</span>
                  </button>
                </div>
              ))
            )}
          </div>

          <p className="garden-page__note">
            Kamu bisa memberi kasih sayang ke 10 kaktus per hari 💚
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
