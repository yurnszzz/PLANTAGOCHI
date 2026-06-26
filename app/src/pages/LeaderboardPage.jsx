import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import CactusAvatar from '../components/CactusAvatar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Trophy, Flame, Droplets, Medal } from 'lucide-react'
import './LeaderboardPage.css'

const TABS = [
  { id: 'streak', label: 'Streak Terpanjang', icon: Flame, field: 'longest_streak' },
  { id: 'level',  label: 'Level Tertinggi',   icon: Trophy, field: 'level' },
  { id: 'waters', label: 'Total Siram',        icon: Droplets, field: 'total_waters' },
]

const RANK_COLORS = ['#F59E0B', '#94A3B8', '#CD7F32']
const RANK_LABELS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('streak')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      try {
        const tab = TABS.find(t => t.id === activeTab)
        const q = query(
          collection(db, 'plants'),
          orderBy(tab.field, 'desc'),
          limit(20)
        )
        const snap = await getDocs(q)
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.plant_name) // only onboarded plants
        setEntries(data)
      } catch (err) {
        console.error('Leaderboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [activeTab])

  const tab = TABS.find(t => t.id === activeTab)

  return (
    <>
      <Navbar />
      <main className="leaderboard-page">
        <div className="container">
          <div className="leaderboard-page__header">
            <Trophy size={40} className="leaderboard-page__icon" />
            <h1>Papan Peringkat</h1>
            <p>Top 20 kaktus paling rajin disiram di seluruh komunitas Plantagochi</p>
          </div>

          {/* Tabs */}
          <div className="leaderboard-page__tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`leaderboard-page__tab ${activeTab === t.id ? 'leaderboard-page__tab--active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          {!loading && entries.length >= 3 && (
            <div className="leaderboard-page__podium">
              {[entries[1], entries[0], entries[2]].map((entry, podiumIdx) => {
                const rank = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2
                const actualRank = rank === 0 ? 1 : rank === 1 ? 2 : 3
                return (
                  <div
                    key={entry.id}
                    className={`leaderboard-page__podium-item leaderboard-page__podium-item--${actualRank}`}
                  >
                    <div className="leaderboard-page__podium-avatar">
                      <CactusAvatar level={entry.level || 1} size={actualRank === 1 ? 80 : 60} animated={false} />
                      <span className="leaderboard-page__podium-rank">{RANK_LABELS[actualRank - 1]}</span>
                    </div>
                    <p className="leaderboard-page__podium-name">{entry.plant_name}</p>
                    <p className="leaderboard-page__podium-value" style={{ color: RANK_COLORS[actualRank - 1] }}>
                      {entry[tab.field] || 0}
                      <span>{activeTab === 'streak' ? ' minggu' : activeTab === 'level' ? ' lv' : 'x'}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Full List */}
          <div className="leaderboard-page__list">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="leaderboard-page__skeleton" />
              ))
            ) : entries.length === 0 ? (
              <div className="leaderboard-page__empty">
                <Trophy size={48} />
                <p>Belum ada tanaman yang terdaftar. Jadilah yang pertama!</p>
              </div>
            ) : (
              entries.map((entry, idx) => (
                <div key={entry.id} className={`leaderboard-page__row ${idx < 3 ? 'leaderboard-page__row--top' : ''}`}>
                  <span className="leaderboard-page__rank">
                    {idx < 3 ? RANK_LABELS[idx] : `#${idx + 1}`}
                  </span>
                  <div className="leaderboard-page__avatar-sm">
                    <CactusAvatar level={entry.level || 1} size={40} animated={false} />
                  </div>
                  <div className="leaderboard-page__info">
                    <p className="leaderboard-page__plant-name">{entry.plant_name}</p>
                    <p className="leaderboard-page__plant-meta">Lv.{entry.level || 1} · {entry.total_waters || 0}x siram</p>
                  </div>
                  <div className="leaderboard-page__score">
                    <span className="leaderboard-page__score-value">{entry[tab.field] || 0}</span>
                    <span className="leaderboard-page__score-unit">
                      {activeTab === 'streak' ? 'minggu' : activeTab === 'level' ? 'level' : 'siram'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
