import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { APP_CONFIG } from '../lib/constants'
import CactusAvatar from '../components/CactusAvatar'
import { Sprout, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import './PlantOnboarding.css'

export default function PlantOnboarding() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [plantName, setPlantName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: welcome, 2: name input

  // Verify token exists and isn't already onboarded
  useEffect(() => {
    async function verify() {
      try {
        const docSnap = await getDoc(doc(db, 'plants', token))
        if (!docSnap.exists()) {
          setError('not_found')
        } else if (docSnap.data().plant_name) {
          // Already onboarded — go to plant page
          navigate(`/p/${token}`, { replace: true })
          return
        }
      } catch {
        setError('fetch_error')
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!plantName.trim()) return

    setSubmitting(true)
    try {
      await updateDoc(doc(db, 'plants', token), {
        plant_name: plantName.trim(),
        owner_email: email.trim().toLowerCase() || null,
        onboarded_at: new Date().toISOString(),
        is_active: true,
        level: 1,
        total_waters: 0,
        streak: 0,
        longest_streak: 0,
        unlocked_achievements: [],
      })
      navigate(`/p/${token}`, { replace: true })
    } catch (err) {
      console.error('Onboarding error:', err)
      setError('submit_error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-screen__spinner" />
        <p>Memuat...</p>
      </div>
    )
  }

  if (error === 'not_found') {
    return (
      <div className="plant-error">
        <AlertCircle size={48} />
        <h2>QR Code Tidak Valid</h2>
        <p>Tanaman dengan kode ini tidak ditemukan di sistem kami.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Ke Beranda</button>
      </div>
    )
  }

  return (
    <div className="onboarding">
      <div className="onboarding__container">
        {step === 1 ? (
          /* Step 1: Welcome */
          <div className="onboarding__welcome">
            <div className="onboarding__avatar-preview">
              <CactusAvatar level={1} size={140} />
            </div>
            <h1 className="onboarding__title">
              Selamat Datang di <span className="text-gradient">Plantagochi</span>!
            </h1>
            <p className="onboarding__desc">
              Kamu baru saja mengadopsi tanaman kaktus mini!
              Beri nama tanamanmu dan mulai perjalanan merawat digital twin-nya.
            </p>
            <button
              className="btn btn-primary btn-lg onboarding__start-btn"
              onClick={() => setStep(2)}
              id="btn-start-onboarding"
            >
              <Sprout size={20} />
              <span>Mulai Petualangan</span>
            </button>
          </div>
        ) : (
          /* Step 2: Name Input */
          <form onSubmit={handleSubmit} className="onboarding__form">
            <div className="onboarding__avatar-small">
              <CactusAvatar level={1} size={100} />
            </div>
            <h2 className="onboarding__form-title">Beri Nama Tanamanmu</h2>

            <div className="onboarding__field">
              <label htmlFor="plant-name">Nama Tanaman *</label>
              <div className="onboarding__input-wrapper">
                <Sprout size={18} />
                <input
                  id="plant-name"
                  type="text"
                  placeholder='Contoh: "Si Hijau"'
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  maxLength={APP_CONFIG.MAX_PLANT_NAME_LENGTH}
                  required
                  autoFocus
                />
              </div>
              <span className="onboarding__char-count">
                {plantName.length}/{APP_CONFIG.MAX_PLANT_NAME_LENGTH}
              </span>
            </div>

            <div className="onboarding__field">
              <label htmlFor="owner-email">Email (opsional)</label>
              <div className="onboarding__input-wrapper">
                <Mail size={18} />
                <input
                  id="owner-email"
                  type="email"
                  placeholder="Untuk pengingat siram & login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <span className="onboarding__hint">
                Isi email agar bisa login dari portal dan terima pengingat siram
              </span>
            </div>

            {error === 'submit_error' && (
              <div className="login-page__error">
                <AlertCircle size={16} />
                <span>Gagal mendaftarkan tanaman. Coba lagi.</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg onboarding__submit"
              disabled={submitting || !plantName.trim()}
              id="btn-submit-onboarding"
            >
              {submitting ? 'Mendaftarkan...' : 'Mulai Merawat'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
