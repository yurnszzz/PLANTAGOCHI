import { Package, QrCode, Smartphone, Heart } from 'lucide-react'
import './HowItWorksSection.css'

const steps = [
  {
    icon: Package,
    num: '01',
    title: 'Beli Kaktus + QR Code',
    desc: 'Pilih kaktus mini favoritmu. Setiap pot sudah dilengkapi stiker QR Code unik yang terhubung ke platform digital.',
  },
  {
    icon: QrCode,
    num: '02',
    title: 'Scan & Daftarkan',
    desc: 'Pindai QR Code, masuk ke halaman onboarding, dan beri nama pada tanaman digitalmu. Cuma butuh 10 detik!',
  },
  {
    icon: Smartphone,
    num: '03',
    title: 'Rawat & Level-Up',
    desc: 'Setiap minggu, tekan tombol "Sudah Disiram". Streak bertambah, tanaman digitalmu naik level dan berevolusi.',
  },
  {
    icon: Heart,
    num: '04',
    title: 'Share & Koleksi',
    desc: 'Lihat Buku Rapor tanamanmu, kumpulkan achievement, dan share progresmu ke media sosial!',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="how-it-works__header">
          <span className="section-tag">
            <QrCode size={14} />
            Cara Kerja
          </span>
          <h2 className="section-title">
            Sesederhana <span className="text-gradient">Scan & Grow</span>
          </h2>
          <p className="section-desc">
            Dari pembelian hingga engagement berkelanjutan — hanya butuh 4 langkah sederhana.
          </p>
        </div>

        <div className="how-it-works__steps">
          {steps.map((step, i) => (
            <div key={step.num} className="how-it-works__step">
              <div className="how-it-works__step-line">
                <div className="how-it-works__step-dot">
                  <step.icon size={20} />
                </div>
                {i < steps.length - 1 && <div className="how-it-works__connector" />}
              </div>
              <div className="how-it-works__step-content">
                <span className="how-it-works__step-num">{step.num}</span>
                <h3 className="how-it-works__step-title">{step.title}</h3>
                <p className="how-it-works__step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
