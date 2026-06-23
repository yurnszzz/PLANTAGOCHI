import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Sprout, Users, Flame, TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPlants: 0,
    activeTwins: 0,
    avgStreak: 0,
    totalWatersAll: 0,
  })
  const [recentPlants, setRecentPlants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const plantsSnap = await getDocs(collection(db, 'plants'))
        const plants = plantsSnap.docs.map(d => ({ id: d.id, ...d.data() }))

        const active = plants.filter(p => p.plant_name && p.is_active)
        const totalStreaks = active.reduce((sum, p) => sum + (p.streak || 0), 0)
        const totalWaters = plants.reduce((sum, p) => sum + (p.total_waters || 0), 0)

        setStats({
          totalPlants: plants.length,
          activeTwins: active.length,
          avgStreak: active.length > 0 ? (totalStreaks / active.length).toFixed(1) : 0,
          totalWatersAll: totalWaters,
        })

        // Recent plants
        const sorted = plants
          .filter(p => p.plant_name)
          .sort((a, b) => {
            const dateA = a.onboarded_at ? new Date(a.onboarded_at) : new Date(0)
            const dateB = b.onboarded_at ? new Date(b.onboarded_at) : new Date(0)
            return dateB - dateA
          })
          .slice(0, 5)
        setRecentPlants(sorted)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="admin-empty">
        <div className="loading-screen__spinner" />
        <p>Memuat dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page__header">
        <h2 className="admin-page__title">Dashboard</h2>
        <p className="admin-page__subtitle">Ringkasan performa Plantagochi</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <Sprout size={20} />
          </div>
          <span className="admin-stat-card__value">{stats.totalPlants}</span>
          <span className="admin-stat-card__label">Total Tanaman (QR)</span>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ color: 'var(--green-300)' }}>
            <Users size={20} />
          </div>
          <span className="admin-stat-card__value">{stats.activeTwins}</span>
          <span className="admin-stat-card__label">Digital Twins Aktif</span>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ color: 'var(--amber-400)' }}>
            <Flame size={20} />
          </div>
          <span className="admin-stat-card__value">{stats.avgStreak}</span>
          <span className="admin-stat-card__label">Rata-rata Streak</span>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ color: 'var(--rose-400)' }}>
            <TrendingUp size={20} />
          </div>
          <span className="admin-stat-card__value">{stats.totalWatersAll}</span>
          <span className="admin-stat-card__label">Total Penyiraman</span>
        </div>
      </div>

      {/* Recent Plants */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>Tanaman Terbaru</h3>
          <Clock size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
        {recentPlants.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Tanaman</th>
                <th>Level</th>
                <th>Streak</th>
                <th>Status</th>
                <th>Onboarded</th>
              </tr>
            </thead>
            <tbody>
              {recentPlants.map(plant => (
                <tr key={plant.id}>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    {plant.plant_name}
                  </td>
                  <td>Lv.{plant.level || 1}</td>
                  <td>{plant.streak || 0}</td>
                  <td>
                    <span className={`admin-table__status admin-table__status--${plant.is_active ? 'active' : 'dormant'}`}>
                      {plant.is_active ? 'Aktif' : 'Dormant'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {plant.onboarded_at ? new Date(plant.onboarded_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">
            <Sprout size={40} />
            <h3>Belum Ada Tanaman</h3>
            <p>Buat tanaman pertama dari menu Tanaman & QR</p>
          </div>
        )}
      </div>
    </div>
  )
}
