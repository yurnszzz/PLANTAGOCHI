import { QrCode, Droplets, TrendingUp, Bell, Trophy, Share2 } from 'lucide-react'
import './FeaturesSection.css'

const features = [
  {
    icon: QrCode,
    title: 'Scan QR, Langsung Akses',
    desc: 'Setiap pot dilengkapi QR Code unik. Pelanggan scan, langsung masuk ke halaman digital twin tanaman mereka. Zero friction, tanpa install app.',
  },
  {
    icon: Droplets,
    title: 'Tombol "Sudah Disiram"',
    desc: 'Mekanisme self-report mingguan yang membangun kebiasaan merawat tanaman. Satu tap, streak bertambah, tanaman tumbuh.',
  },
  {
    icon: TrendingUp,
    title: 'Level-Up & Digital Twin',
    desc: 'Avatar tanaman berevolusi seiring streak. Dari benih mungil hingga kaktus berbunga — pelanggan Anda akan ketagihan naik level.',
  },
  {
    icon: Bell,
    title: 'Notifikasi Email Pengingat',
    desc: 'Sistem email otomatis mengingatkan pelanggan untuk menyiram. Integrasi EmailJS gratis hingga 200 email/bulan.',
  },
  {
    icon: Trophy,
    title: 'Achievement & Streak',
    desc: 'Sistem pencapaian dan streak mingguan terinspirasi Duolingo. Buat pelanggan merasa "sayang" untuk melewatkan satu minggu.',
  },
  {
    icon: Share2,
    title: 'Buku Rapor & Social Share',
    desc: 'Rekap performa perawatan yang bisa di-screenshot dan dibagikan ke Instagram & TikTok. Marketing gratis dari pelanggan Anda.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features__header">
          <span className="section-tag">
            <TrendingUp size={14} />
            Fitur Unggulan
          </span>
          <h2 className="section-title">
            Semua yang Dibutuhkan untuk <span className="text-gradient">Meningkatkan Engagement</span>
          </h2>
          <p className="section-desc">
            Platform Plantagochi menyediakan seluruh fitur gamifikasi yang membuat pelanggan 
            toko kaktus Anda kembali lagi dan lagi — tanpa tambahan hardware.
          </p>
        </div>

        <div className="features__grid">
          {features.map((feat, i) => (
            <div key={feat.title} className={`card features__card stagger-${i + 1}`}>
              <div className="card-icon">
                <feat.icon size={22} />
              </div>
              <h3 className="card-title">{feat.title}</h3>
              <p className="card-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
