import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import QRCode from 'qrcode'
import { Plus, Download, Trash2, QrCode, Sprout, X, Copy, ExternalLink } from 'lucide-react'

export default function PlantsManager() {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(null)
  const [creating, setCreating] = useState(false)
  const [productTier, setProductTier] = useState('standard')
  const [batchCount, setBatchCount] = useState(1)
  const qrCanvasRef = useRef(null)

  // Fetch all plants
  useEffect(() => {
    fetchPlants()
  }, [])

  async function fetchPlants() {
    try {
      const snap = await getDocs(collection(db, 'plants'))
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0)
          return dateB - dateA
        })
      setPlants(list)
    } catch (err) {
      console.error('Fetch plants error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Generate UUID v4
  function generateToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Create new plant(s)
  async function handleCreate() {
    setCreating(true)
    try {
      const count = Math.min(Math.max(1, batchCount), 20) // max 20 at once
      const newPlants = []

      for (let i = 0; i < count; i++) {
        const token = generateToken()
        const plantData = {
          product_tier: productTier,
          plant_name: null,
          owner_email: null,
          total_waters: 0,
          streak: 0,
          longest_streak: 0,
          level: 1,
          last_watered_at: null,
          onboarded_at: null,
          created_at: new Date().toISOString(),
          is_active: false,
          unlocked_achievements: [],
          status: 'generated',
        }
        await setDoc(doc(db, 'plants', token), plantData)
        newPlants.push({ id: token, ...plantData })
      }

      setPlants(prev => [...newPlants, ...prev])
      setShowCreateModal(false)
      setBatchCount(1)
    } catch (err) {
      console.error('Create plant error:', err)
      alert('Gagal membuat tanaman. Coba lagi.')
    } finally {
      setCreating(false)
    }
  }

  // Delete plant
  async function handleDelete(plantId) {
    if (!confirm('Hapus tanaman ini? Data tidak bisa dikembalikan.')) return
    try {
      await deleteDoc(doc(db, 'plants', plantId))
      setPlants(prev => prev.filter(p => p.id !== plantId))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  // Show QR modal and generate QR
  async function handleShowQR(plant) {
    setShowQRModal(plant)
    // Generate QR after modal renders
    setTimeout(async () => {
      if (qrCanvasRef.current) {
        const url = `${window.location.origin}/p/${plant.id}`
        await QRCode.toCanvas(qrCanvasRef.current, url, {
          width: 280,
          margin: 2,
          color: { dark: '#064E3B', light: '#FFFFFF' },
        })
      }
    }, 100)
  }

  // Download QR as PNG
  async function downloadQR(plantId) {
    const url = `${window.location.origin}/p/${plantId}`
    const dataUrl = await QRCode.toDataURL(url, {
      width: 600,
      margin: 2,
      color: { dark: '#064E3B', light: '#FFFFFF' },
    })
    const link = document.createElement('a')
    link.download = `plantagochi-qr-${plantId.slice(0, 8)}.png`
    link.href = dataUrl
    link.click()
  }

  // Copy URL
  function copyURL(plantId) {
    const url = `${window.location.origin}/p/${plantId}`
    navigator.clipboard.writeText(url)
    alert('URL disalin!')
  }

  const getStatusLabel = (plant) => {
    if (plant.plant_name && plant.is_active) return 'active'
    if (plant.plant_name) return 'dormant'
    return 'generated'
  }

  const getStatusText = (status) => {
    const map = { active: 'Aktif', dormant: 'Dormant', generated: 'Belum Scan' }
    return map[status] || status
  }

  if (loading) {
    return (
      <div className="admin-empty">
        <div className="loading-screen__spinner" />
        <p>Memuat data tanaman...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page__header">
        <h2 className="admin-page__title">Tanaman & QR Code</h2>
        <p className="admin-page__subtitle">Kelola tanaman, generate dan cetak QR Code</p>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>{plants.length} Tanaman</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            id="btn-create-plant"
          >
            <Plus size={16} />
            <span>Buat QR Baru</span>
          </button>
        </div>

        {plants.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Nama</th>
                  <th>Tier</th>
                  <th>Level</th>
                  <th>Streak</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {plants.map(plant => {
                  const status = getStatusLabel(plant)
                  return (
                    <tr key={plant.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {plant.id.slice(0, 8)}...
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        {plant.plant_name || '—'}
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{plant.product_tier}</td>
                      <td>Lv.{plant.level || 1}</td>
                      <td>{plant.streak || 0}</td>
                      <td>
                        <span className={`admin-table__status admin-table__status--${status}`}>
                          {getStatusText(status)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-table__action-btn"
                            onClick={() => handleShowQR(plant)}
                            title="Lihat QR"
                          >
                            <QrCode size={16} />
                          </button>
                          <button
                            className="admin-table__action-btn"
                            onClick={() => copyURL(plant.id)}
                            title="Salin URL"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            className="admin-table__action-btn"
                            onClick={() => window.open(`/p/${plant.id}`, '_blank')}
                            title="Buka"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            className="admin-table__action-btn"
                            onClick={() => handleDelete(plant.id)}
                            title="Hapus"
                            style={{ color: 'var(--rose-400)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <Sprout size={40} />
            <h3>Belum Ada Tanaman</h3>
            <p>Klik "Buat QR Baru" untuk mulai generate QR Code</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Buat Tanaman & QR Code</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div className="onboarding__field">
                <label>Tier Produk</label>
                <select
                  value={productTier}
                  onChange={e => setProductTier(e.target.value)}
                  style={{
                    padding: '0.7rem 1rem', background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'var(--font-primary)',
                  }}
                >
                  <option value="standard">Standard (Rp 25.000)</option>
                  <option value="premium">Premium (Rp 40-50.000)</option>
                  <option value="gift">Gift Bundle (Rp 75.000)</option>
                </select>
              </div>

              <div className="onboarding__field">
                <label>Jumlah QR Code</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={batchCount}
                  onChange={e => setBatchCount(parseInt(e.target.value) || 1)}
                  style={{
                    padding: '0.7rem 1rem', background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'var(--font-primary)',
                  }}
                />
                <span className="onboarding__hint">Maksimal 20 QR Code sekaligus</span>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleCreate}
                disabled={creating}
                style={{ width: '100%' }}
              >
                {creating ? 'Membuat...' : `Buat ${batchCount} QR Code`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Preview Modal */}
      {showQRModal && (
        <div className="admin-modal-overlay" onClick={() => setShowQRModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">QR Code</h3>
              <button onClick={() => setShowQRModal(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <canvas ref={qrCanvasRef} style={{ margin: '0 auto', borderRadius: '12px' }} />

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 'var(--space-md) 0', wordBreak: 'break-all' }}>
              {window.location.origin}/p/{showQRModal.id}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                className="btn btn-primary"
                onClick={() => downloadQR(showQRModal.id)}
                style={{ flex: 1 }}
              >
                <Download size={16} />
                <span>Download PNG</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => copyURL(showQRModal.id)}
                style={{ flex: 1 }}
              >
                <Copy size={16} />
                <span>Salin URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
