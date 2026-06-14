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
              Siap Tingkatkan Bisnis Kaktus Anda dengan <span className="text-gradient">Gamifikasi Digital?</span>
            </h2>
            <p className="cta__desc">
              Bergabung dengan Plantagochi dan berikan pengalaman interaktif yang tak terlupakan 
              kepada setiap pelanggan Anda. Mulai dari Rp 25.000 per pot, tanpa biaya langganan.
            </p>
            <div className="cta__actions">
              <Link to="/demo" className="btn btn-primary btn-lg" id="cta-demo-btn">
                Coba Demo Gratis
                <ArrowRight size={18} />
              </Link>
              <Link to="/pricing" className="btn btn-secondary btn-lg" id="cta-pricing-btn">
                Lihat Paket Harga
              </Link>
            </div>
            <p className="cta__note">
              Tidak perlu kartu kredit. Akses demo langsung tanpa pendaftaran.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
