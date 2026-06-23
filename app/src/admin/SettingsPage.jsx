import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { APP_CONFIG } from '../lib/constants'
import { Sun, Moon, Info } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <div>
      <div className="admin-page__header">
        <h2 className="admin-page__title">Pengaturan</h2>
        <p className="admin-page__subtitle">Konfigurasi aplikasi dan profil admin</p>
      </div>

      {/* Account Info */}
      <div className="admin-table-container" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="admin-table-header">
          <h3>Akun Admin</h3>
        </div>
        <div style={{ padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="plant-page__report-row">
              <span>Email</span>
              <strong>{user?.email || '-'}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>UID</span>
              <strong style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{user?.uid || '-'}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Role</span>
              <strong>Admin</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="admin-table-container" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="admin-table-header">
          <h3>Tampilan</h3>
        </div>
        <div style={{ padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 500, marginBottom: '4px' }}>Tema</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {theme === 'dark' ? 'Mode Gelap aktif' : 'Mode Terang aktif'}
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={toggle}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>Informasi Aplikasi</h3>
        </div>
        <div style={{ padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="plant-page__report-row">
              <span>Nama Aplikasi</span>
              <strong>{APP_CONFIG.APP_NAME}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Tagline</span>
              <strong>{APP_CONFIG.TAGLINE}</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Stack</span>
              <strong>React + Vite + Firebase Spark</strong>
            </div>
            <div className="plant-page__report-row">
              <span>Database</span>
              <strong>Firestore (Free Tier)</strong>
            </div>
          </div>

          <div style={{
            marginTop: 'var(--space-xl)', padding: 'var(--space-md)',
            background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)', display: 'flex', gap: 'var(--space-sm)',
            fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5
          }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--green-400)' }} />
            <span>
              Plantagochi berjalan di Firebase Spark (gratis). 
              Limit: 50K reads/hari, 20K writes/hari, 1GB storage.
              Cukup untuk proyek mata kuliah Technopreneurship.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
