import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, QrCode } from 'lucide-react'
import CactusAvatar from '../components/CactusAvatar'
import './HeroSection.css'

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      {/* Background effects */}
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__grid-pattern" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content animate-fade-in-up">
          <div className="section-tag">
            <Sparkles size={14} />
            Kaktus Mini dengan Jiwa Digital
          </div>

          <h1 className="hero__title">
            Rawat Fisiknya,
            <br />
            <span className="text-gradient">Level-Up Digitalnya.</span>
          </h1>

          <p className="hero__subtitle">
            Setiap kaktus Plantagochi hadir dengan <strong>digital twin</strong>-nya sendiri.
            Pindai QR Code di pot, rawat kaktus digitalmu, kumpulkan streak, dan naik level
            bersama tanaman fisikmu.
          </p>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">Rp 25rb</span>
              <span className="hero__stat-label">Mulai dari</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">5 Level</span>
              <span className="hero__stat-label">Evolusi Digital</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">0 Friksi</span>
              <span className="hero__stat-label">Scan QR, Langsung Akses</span>
            </div>
          </div>

          <div className="hero__actions">
            <Link to="/demo" className="btn btn-primary btn-lg" id="hero-cta-demo">
              Coba Demo Interaktif
              <ArrowRight size={18} />
            </Link>
            <Link to="/pricing" className="btn btn-secondary btn-lg" id="hero-cta-pricing">
              <QrCode size={18} />
              Lihat Paket Harga
            </Link>
          </div>
        </div>

        <div className="hero__visual animate-fade-in-up stagger-2">
          <div className="hero__phone-frame">
            <div className="hero__phone-notch" />
            <div className="hero__phone-content">
              <div className="hero__phone-header">
                <span className="hero__phone-title">Kaktus Kamu</span>
                <span className="hero__phone-streak">7 minggu</span>
              </div>
              <CactusAvatar level={4} name="Si Hijau" size={140} />
              <div className="hero__phone-actions">
                <button className="hero__water-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                  Sudah Disiram
                </button>
              </div>
              <div className="hero__phone-progress">
                <div className="hero__phone-progress-label">
                  <span>Level 4</span>
                  <span>Level 5</span>
                </div>
                <div className="hero__phone-progress-bar">
                  <div className="hero__phone-progress-fill" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="hero__badge hero__badge--1 animate-float">
            <QrCode size={16} />
            <span>Scan QR</span>
          </div>
          <div className="hero__badge hero__badge--2 animate-float stagger-3">
            <Sparkles size={16} />
            <span>Streak: 7x</span>
          </div>
        </div>
      </div>
    </section>
  )
}
