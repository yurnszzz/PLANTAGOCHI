import { Link } from 'react-router-dom'
import { Check, X, ArrowRight, HelpCircle, Zap, Building2, Rocket } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PricingPage.css'

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: 'Gratis',
    priceNote: 'Selamanya',
    desc: 'Untuk penjual baru yang ingin mencoba platform Plantagochi.',
    features: [
      { text: 'Hingga 50 QR Code / tanaman', included: true },
      { text: 'Digital twin dasar (3 level)', included: true },
      { text: 'Tombol "Sudah Disiram"', included: true },
      { text: 'Streak counter', included: true },
      { text: 'Hosting di subdomain Plantagochi', included: true },
      { text: 'Notifikasi email (50/bulan)', included: true },
      { text: 'Branding Plantagochi', included: true },
      { text: 'Custom branding toko', included: false },
      { text: 'Achievement system', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Buku Rapor Tanaman', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Mulai Gratis',
    popular: false,
  },
  {
    name: 'Business',
    icon: Building2,
    price: 'Rp 149.000',
    priceNote: '/bulan',
    desc: 'Untuk toko yang serius mengembangkan engagement pelanggan.',
    features: [
      { text: 'Hingga 500 QR Code / tanaman', included: true },
      { text: 'Digital twin penuh (5 level)', included: true },
      { text: 'Tombol "Sudah Disiram"', included: true },
      { text: 'Streak counter', included: true },
      { text: 'Custom domain toko', included: true },
      { text: 'Notifikasi email (500/bulan)', included: true },
      { text: 'Custom branding toko', included: true },
      { text: 'Achievement system penuh', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Buku Rapor Tanaman', included: true },
      { text: 'Social sharing features', included: true },
      { text: 'Email support (24 jam)', included: true },
    ],
    cta: 'Mulai Business',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Rocket,
    price: 'Custom',
    priceNote: 'Hubungi kami',
    desc: 'Untuk bisnis besar dengan kebutuhan khusus dan volume tinggi.',
    features: [
      { text: 'QR Code unlimited', included: true },
      { text: 'Digital twin custom design', included: true },
      { text: 'Semua fitur Business', included: true },
      { text: 'White-label penuh', included: true },
      { text: 'API access', included: true },
      { text: 'Integrasi e-commerce', included: true },
      { text: 'Custom gamification rules', included: true },
      { text: 'Leaderboard komunitas', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA 99.9% uptime', included: true },
      { text: 'Onboarding khusus', included: true },
      { text: 'Priority support 24/7', included: true },
    ],
    cta: 'Hubungi Sales',
    popular: false,
  },
]

const faqs = [
  {
    q: 'Apakah pelanggan saya perlu download aplikasi?',
    a: 'Tidak! Plantagochi adalah web app. Pelanggan hanya perlu scan QR Code dan langsung bisa akses melalui browser smartphone mereka. Zero friction, zero install.',
  },
  {
    q: 'Bagaimana cara mendapatkan QR Code untuk setiap pot?',
    a: 'Setelah berlangganan, Anda mendapat akses ke dashboard untuk generate QR Code unik per tanaman. QR Code bisa dicetak sendiri sebagai stiker waterproof.',
  },
  {
    q: 'Apakah ada biaya tambahan untuk pelanggan saya?',
    a: 'Tidak ada. Akses web app bersifat lifetime per unit yang dibeli. Pelanggan Anda mendapat pengalaman digital twin tanpa biaya tambahan.',
  },
  {
    q: 'Bagaimana dengan data pelanggan saya?',
    a: 'Data pelanggan Anda sepenuhnya milik Anda. Kami tidak akan menjual atau membagikan data pelanggan ke pihak ketiga. Tersedia fitur export data.',
  },
  {
    q: 'Apakah saya bisa kustomisasi tampilan sesuai brand toko?',
    a: 'Ya! Pada paket Business ke atas, Anda bisa mengubah logo, warna, nama brand, dan bahkan menggunakan custom domain untuk toko Anda.',
  },
  {
    q: 'Berapa lama setup awalnya?',
    a: 'Kurang dari 15 menit. Daftar, atur profil toko, generate QR Code pertama Anda, dan langsung bisa digunakan. Kami juga menyediakan panduan lengkap.',
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pricing">
        <div className="container">
          {/* Header */}
          <div className="pricing__header">
            <span className="section-tag">
              <Zap size={14} />
              Harga
            </span>
            <h1 className="section-title">
              Paket yang <span className="text-gradient">Pas untuk Bisnis Anda</span>
            </h1>
            <p className="section-desc" style={{ textAlign: 'center' }}>
              Mulai gratis, scale sesuai kebutuhan. Semua paket sudah termasuk 
              infrastruktur hosting dan maintenance.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="pricing__grid">
            {plans.map((plan) => (
              <div key={plan.name} className={`pricing__card ${plan.popular ? 'pricing__card--popular' : ''}`}>
                {plan.popular && (
                  <div className="pricing__popular-badge">Paling Populer</div>
                )}
                <div className="pricing__card-header">
                  <div className="pricing__plan-icon">
                    <plan.icon size={20} />
                  </div>
                  <h3 className="pricing__plan-name">{plan.name}</h3>
                  <div className="pricing__price">
                    <span className="pricing__price-amount">{plan.price}</span>
                    <span className="pricing__price-note">{plan.priceNote}</span>
                  </div>
                  <p className="pricing__plan-desc">{plan.desc}</p>
                </div>

                <ul className="pricing__features">
                  {plan.features.map((f) => (
                    <li key={f.text} className={`pricing__feature ${f.included ? '' : 'pricing__feature--disabled'}`}>
                      {f.included
                        ? <Check size={16} className="pricing__feature-icon pricing__feature-icon--check" />
                        : <X size={16} className="pricing__feature-icon pricing__feature-icon--x" />
                      }
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.popular ? '/demo' : '#'}
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} pricing__cta`}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="pricing__faq">
            <h2 className="pricing__faq-title">
              <HelpCircle size={22} />
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <div className="pricing__faq-grid">
              {faqs.map((faq) => (
                <div key={faq.q} className="pricing__faq-item">
                  <h4 className="pricing__faq-question">{faq.q}</h4>
                  <p className="pricing__faq-answer">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
