import { QrCode, Droplets, TrendingUp, Bell, Trophy, Share2 } from 'lucide-react'
import './FeaturesSection.css'

const features = [
  {
    icon: QrCode,
    title: 'Scan QR, Langsung Akses',
    desc: 'Setiap pot dilengkapi QR Code unik. Tinggal scan, kamu langsung masuk ke halaman digital twin tanamanmu. Tanpa install app, tanpa ribet.',
  },
  {
    icon: Droplets,
    title: 'Tombol "Sudah Disiram"',
    desc: 'Setiap minggu, tekan tombol siram di halaman web. Streak-mu bertambah, tanaman digitalmu tumbuh. Sederhana tapi bikin ketagihan!',
  },
  {
    icon: TrendingUp,
    title: 'Level-Up & Digital Twin',
    desc: 'Avatar kaktusmu berevolusi dari benih hingga berbunga seiring kamu merawatnya. Ada 5 level yang bisa kamu capai — bisakah kamu sampai max?',
  },
  {
    icon: Bell,
    title: 'Pengingat Siram',
    desc: 'Tidak perlu khawatir lupa menyiram. Kami akan mengingatkanmu lewat email saat waktunya menyiram tanamanmu.',
  },
  {
    icon: Trophy,
    title: 'Achievement & Streak',
    desc: 'Kumpulkan badge pencapaian dan bangun streak mingguan. Sayang kalau streak putus — motivasi kamu untuk terus merawat!',
  },
  {
    icon: Share2,
    title: 'Buku Rapor & Share',
    desc: 'Lihat rekap performa perawatan tanamanmu. Screenshot dan bagikan ke Instagram & TikTok — pamer progresmu ke teman-teman!',
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
            Semua yang Kamu Butuhkan untuk <span className="text-gradient">Merawat Kaktusmu</span>
          </h2>
          <p className="section-desc">
            Plantagochi memberikan pengalaman digital yang bikin kamu semangat merawat tanaman 
            setiap minggu — dari fitur streak hingga achievement badges.
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
