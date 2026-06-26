import { Link } from 'react-router-dom'
import { Check, ArrowRight, HelpCircle, Leaf, Star, Gift } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PricingPage.css'

const products = [
  {
    name: 'Starter Pack',
    icon: Leaf,
    price: 'Rp 25.000',
    priceNote: '/ pot kaktus',
    desc: 'Satu pot kaktus mini fisik dengan digital twin. Cocok untuk hadiah atau koleksi pertama.',
    features: [
      '1 pot kaktus mini fisik',
      '1 QR Code digital twin unik',
      'Evolusi avatar 5 level',
      'Streak & achievement system',
      'Daily check-in (+koin harian)',
      'Toko aksesori kaktus',
      'Leaderboard komunitas',
      'Email reminder mingguan',
    ],
    cta: 'Beli Sekarang',
    highlight: false,
    badge: null,
  },
  {
    name: 'Twin Pack',
    icon: Star,
    price: 'Rp 45.000',
    priceNote: '/ 2 pot kaktus',
    desc: 'Dua pot kaktus — satu untukmu, satu untuk teman. Hemat Rp 5.000 dari harga satuan.',
    features: [
      '2 pot kaktus mini fisik',
      '2 QR Code digital twin unik',
      'Semua fitur Starter Pack',
      'Hemat Rp 5.000',
      'Cocok untuk hadiah berpasangan',
      'Bisa dipantau terpisah',
    ],
    cta: 'Beli Twin Pack',
    highlight: true,
    badge: 'Terlaris',
  },
  {
    name: 'Gift Box',
    icon: Gift,
    price: 'Rp 99.000',
    priceNote: '/ kotak hadiah',
    desc: 'Lima pot kaktus dalam kotak hadiah eksklusif. Sempurna untuk ulang tahun atau hampers.',
    features: [
      '5 pot kaktus mini fisik',
      '5 QR Code digital twin unik',
      'Semua fitur Starter Pack',
      'Kotak hadiah eksklusif',
      'Kartu ucapan custom',
      'Hemat Rp 26.000',
    ],
    cta: 'Beli Gift Box',
    highlight: false,
    badge: 'Paling Hemat',
  },
]

const faqs = [
  {
    q: 'Bagaimana cara mengaktifkan digital twin?',
    a: 'Scan QR Code yang tertempel di pot menggunakan kamera HP. Kamu akan langsung diarahkan ke halaman digital twin tanamanmu dan bisa langsung beri nama serta mulai merawatnya.',
  },
  {
    q: 'Apakah ada biaya bulanan setelah beli?',
    a: 'Tidak ada! Kamu cukup bayar harga pot kaktus fisik sekali saja. Digital twin dan semua fitur gamifikasinya gratis selamanya.',
  },
  {
    q: 'Berapa lama kaktus fisiknya bertahan?',
    a: 'Kaktus mini kami dipilih khusus yang tahan lama dan mudah dirawat. Dengan penyiraman 1x seminggu, kaktus bisa bertahan bertahun-tahun.',
  },
  {
    q: 'Bisa beli untuk dikirim ke luar kota?',
    a: 'Saat ini kami masih dalam tahap pengembangan untuk pengiriman. Hubungi kami via WhatsApp untuk informasi ketersediaan pengiriman ke kotamu.',
  },
  {
    q: 'Apa itu streak dan kenapa penting?',
    a: 'Streak adalah hitungan berapa minggu berturut-turut kamu menyiram kaktus digital. Semakin panjang streak, semakin tinggi peringkat di leaderboard komunitas!',
  },
  {
    q: 'Apakah koin bisa dipakai beli kaktus sungguhan?',
    a: 'Koin virtual hanya bisa dipakai di toko aksesori digital kaktusmu. Tapi siapa tahu — ke depannya koin bisa ditukar reward menarik!',
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pricing-page">
        <div className="container">

          {/* Header */}
          <div className="pricing-page__header">
            <div className="section-tag">
              <Leaf size={14} />
              Koleksi Plantagochi
            </div>
            <h1>Pilih Kaktusmu</h1>
            <p>
              Setiap pot dilengkapi QR Code digital twin. Beli fisiknya, rawat digitalnya —
              gratis selamanya tanpa biaya bulanan.
            </p>
          </div>

          {/* Product Cards */}
          <div className="pricing-page__grid">
            {products.map((product) => (
              <div
                key={product.name}
                className={`pricing-card ${product.highlight ? 'pricing-card--highlight' : ''}`}
              >
                {product.badge && (
                  <div className="pricing-card__badge">{product.badge}</div>
                )}

                <div className="pricing-card__icon">
                  <product.icon size={24} />
                </div>

                <h2 className="pricing-card__name">{product.name}</h2>
                <p className="pricing-card__desc">{product.desc}</p>

                <div className="pricing-card__price">
                  <span className="pricing-card__amount">{product.price}</span>
                  <span className="pricing-card__note">{product.priceNote}</span>
                </div>

                <ul className="pricing-card__features">
                  {product.features.map((f) => (
                    <li key={f}>
                      <Check size={15} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/#cta"
                  className={`btn ${product.highlight ? 'btn-primary' : 'btn-secondary'} pricing-card__cta`}
                >
                  {product.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="pricing-page__guarantee">
            <span>🌵</span>
            <div>
              <strong>Digital Twin Gratis Selamanya</strong>
              <p>Tidak ada biaya berlangganan. Bayar sekali, nikmati seterusnya.</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="pricing-page__faq">
            <h2 className="pricing-page__faq-title">
              <HelpCircle size={24} />
              Pertanyaan Umum
            </h2>
            <div className="pricing-page__faq-grid">
              {faqs.map((faq) => (
                <div key={faq.q} className="pricing-faq-item">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
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
