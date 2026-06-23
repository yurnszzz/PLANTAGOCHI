import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Users, Search, Mail, Sprout } from 'lucide-react'

export default function UsersManager() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const snap = await getDocs(collection(db, 'plants'))
        const plants = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.plant_name) // only onboarded

        // Group by email
        const emailMap = {}
        plants.forEach(p => {
          const email = p.owner_email || 'no-email'
          if (!emailMap[email]) {
            emailMap[email] = { email: p.owner_email, plants: [] }
          }
          emailMap[email].plants.push(p)
        })

        setUsers(Object.values(emailMap).sort((a, b) => b.plants.length - a.plants.length))
      } catch (err) {
        console.error('Fetch users error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filtered = users.filter(u => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (u.email && u.email.includes(term)) ||
      u.plants.some(p => p.plant_name?.toLowerCase().includes(term))
    )
  })

  if (loading) {
    return (
      <div className="admin-empty">
        <div className="loading-screen__spinner" />
        <p>Memuat data pengguna...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page__header">
        <h2 className="admin-page__title">Pengguna</h2>
        <p className="admin-page__subtitle">Daftar pemilik tanaman yang telah onboarding</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>{filtered.length} Pengguna</h3>
          <div className="login-page__input-wrapper" style={{ maxWidth: 260 }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari email atau nama tanaman..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: 'var(--font-primary)', flex: 1 }}
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Tanaman</th>
                <th>Total Siram</th>
                <th>Best Streak</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const totalWaters = user.plants.reduce((s, p) => s + (p.total_waters || 0), 0)
                const bestStreak = Math.max(...user.plants.map(p => p.longest_streak || 0))
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{user.email || 'Tanpa email'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {user.plants.map(p => (
                          <span key={p.id} style={{ fontSize: '0.8rem' }}>
                            {p.plant_name} (Lv.{p.level || 1})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{totalWaters}</td>
                    <td>{bestStreak}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">
            <Users size={40} />
            <h3>Belum Ada Pengguna</h3>
            <p>Pengguna akan muncul setelah scan QR dan onboarding</p>
          </div>
        )}
      </div>
    </div>
  )
}
