import { Link } from 'react-router-dom'
import { ArrowRight, Leaf } from 'lucide-react'
import './CTASection.css'

export default function CTASection() {
  return (
    <section className="cta" id="cta">
      <div className="container">
        <div className="cta__card">
          <div className="cta__glow" />
          <div className="cta__content">
            <div className="section-tag">
              <Leaf size={14} />
              Mulai Sekarang
            </div>
            <h2 className="cta__title">
              Siap Punya Kaktus dengan <span className="text-gradient">Digital Twin?</span>
            </h2>
            <p className="cta__desc">
              Beli kaktus mini Plantagochi dan dapatkan pengalaman merawat tanaman yang interaktif 
              dan menyenangkan. Mulai dari Rp 25.000 per pot, sudah termasuk QR Code digital twin.
            </p>
            <div className="cta__actions">
              <Link to="/demo" className="btn btn-primary btn-lg" id="cta-demo-btn">
                Coba Demo Gratis
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg" id="cta-login-btn">
                Sudah Punya? Login
              </Link>
            </div>
            <p className="cta__note">
              Coba demo interaktif tanpa perlu pendaftaran.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
