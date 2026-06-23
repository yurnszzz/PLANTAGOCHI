import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Leaf, Shield, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LoginPage.css'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [plants, setPlants] = useState(null)
  const navigate = useNavigate()
  const { loginAdmin } = useAuth()

  // User: lookup plants by email
  const handleUserLookup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const q = query(
        collection(db, 'plants'),
        where('owner_email', '==', email.trim().toLowerCase())
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        setError('Tidak ditemukan tanaman yang terkait dengan email ini. Pastikan email yang dimasukkan sama dengan saat onboarding.')
        setPlants(null)
      } else {
        const plantList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPlants(plantList)
      }
    } catch (err) {
      setError('Gagal mencari data. Silakan coba lagi.')
      console.error('Lookup error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Admin: login with email + password
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAdmin(email, password)
      navigate('/admin')
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Email atau password salah.')
      } else if (err.code === 'auth/user-not-found') {
        setError('Akun admin tidak ditemukan.')
      } else if (err.message?.includes('bukan admin')) {
        setError(err.message)
      } else {
        setError('Login gagal. Silakan coba lagi.')
      }
      console.error('Admin login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="login-page">
        <div className="container">
          <div className="login-page__wrapper">
            {/* Header */}
            <div className="login-page__header">
              <h1 className="login-page__title">
                Masuk ke <span className="text-gradient">Plantagochi</span>
              </h1>
              <p className="login-page__desc">
                Akses digital twin tanamanmu atau kelola dashboard admin
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="login-page__tabs">
              <button
                className={`login-page__tab ${activeTab === 'user' ? 'login-page__tab--active' : ''}`}
                onClick={() => { setActiveTab('user'); setError(''); setPlants(null) }}
                id="tab-user"
              >
                <Leaf size={16} />
                <span>Pemilik Tanaman</span>
              </button>
              <button
                className={`login-page__tab ${activeTab === 'admin' ? 'login-page__tab--active' : ''}`}
                onClick={() => { setActiveTab('admin'); setError(''); setPlants(null) }}
                id="tab-admin"
              >
                <Shield size={16} />
                <span>Admin</span>
              </button>
            </div>

            {/* Card */}
            <div className="login-page__card">
              {activeTab === 'user' ? (
                /* ========== USER TAB ========== */
                <>
                  <div className="login-page__card-info">
                    <Leaf size={20} className="login-page__card-icon" />
                    <p>Masukkan email yang kamu daftarkan saat onboarding tanaman untuk mengakses digital twin-mu.</p>
                  </div>

                  <form onSubmit={handleUserLookup} className="login-page__form">
                    <div className="login-page__field">
                      <label htmlFor="user-email">Email</label>
                      <div className="login-page__input-wrapper">
                        <Mail size={18} />
                        <input
                          id="user-email"
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg login-page__submit"
                      disabled={loading}
                      id="btn-user-lookup"
                    >
                      {loading ? 'Mencari...' : 'Cari Tanamanku'}
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </form>

                  {/* Plant results */}
                  {plants && plants.length > 0 && (
                    <div className="login-page__results">
                      <h3 className="login-page__results-title">Tanaman Ditemukan</h3>
                      <div className="login-page__plant-list">
                        {plants.map(plant => (
                          <button
                            key={plant.id}
                            className="login-page__plant-item"
                            onClick={() => navigate(`/p/${plant.id}`)}
                          >
                            <div className="login-page__plant-info">
                              <span className="login-page__plant-name">
                                {plant.plant_name || 'Tanaman Tanpa Nama'}
                              </span>
                              <span className="login-page__plant-level">
                                Lv.{plant.level || 1} — {['Benih', 'Tunas', 'Remaja', 'Dewasa', 'Berbunga'][((plant.level || 1) - 1)]}
                              </span>
                            </div>
                            <ArrowRight size={16} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="login-page__alt">
                    <p>Punya QR Code dari pot kamu?</p>
                    <span>Scan langsung untuk akses instan tanpa login</span>
                  </div>
                </>
              ) : (
                /* ========== ADMIN TAB ========== */
                <>
                  <div className="login-page__card-info login-page__card-info--admin">
                    <Shield size={20} className="login-page__card-icon" />
                    <p>Login ke dashboard admin Plantagochi. Hanya untuk tim internal.</p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="login-page__form">
                    <div className="login-page__field">
                      <label htmlFor="admin-email">Email Admin</label>
                      <div className="login-page__input-wrapper">
                        <Mail size={18} />
                        <input
                          id="admin-email"
                          type="email"
                          placeholder="admin@plantagochi.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="login-page__field">
                      <label htmlFor="admin-password">Password</label>
                      <div className="login-page__input-wrapper">
                        <Lock size={18} />
                        <input
                          id="admin-password"
                          type="password"
                          placeholder="Masukkan password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg login-page__submit"
                      disabled={loading}
                      id="btn-admin-login"
                    >
                      {loading ? 'Memproses...' : 'Login Admin'}
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </form>
                </>
              )}

              {/* Error message */}
              {error && (
                <div className="login-page__error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
