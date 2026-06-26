import { MessageCircle, Star } from 'lucide-react'
import './TestimonialSection.css'

const testimonials = [
  {
    name: 'Rina Safitri',
    role: 'Mahasiswi',
    text: 'Aku beli kaktus buat hiasan meja belajar, ternyata ada fitur digital twin-nya! Jadi rajin nyiram karena sayang streaknya mau putus.',
    stars: 5,
    avatar: 'RS',
  },
  {
    name: 'Ahmad Fadli',
    role: 'Kolektor Tanaman',
    text: 'Udah punya 3 kaktus dari Plantagochi. Seru banget nge-level up tanamannya, achievement-nya bikin ketagihan. Mau beli lagi!',
    stars: 5,
    avatar: 'AF',
  },
  {
    name: 'Dewi Lestari',
    role: 'Young Professional',
    text: 'Gift bundle-nya perfect buat hadiah wisuda teman. Mereka excited banget scan QR Code-nya. Packaging juga aman pakai bubble wrap.',
    stars: 5,
    avatar: 'DL',
  },
  {
    name: 'Bagus Prasetyo',
    role: 'Content Creator',
    text: 'Fitur Buku Rapor Tanaman-nya keren! Langsung screenshot, share ke IG story. Followers pada nanya "beli dimana?"',
    stars: 5,
    avatar: 'BP',
  },
]

export default function TestimonialSection() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <span className="section-tag">
            <MessageCircle size={14} />
            Testimoni
          </span>
          <h2 className="section-title">
            Dicintai oleh <span className="text-gradient">Para Pemilik Kaktus</span>
          </h2>
          <p className="section-desc">
            Lihat bagaimana Plantagochi membantu mereka merawat tanaman 
            dengan lebih menyenangkan dan konsisten.
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonials__card">
              <div className="testimonials__stars">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="var(--amber-400)" color="var(--amber-400)" />
                ))}
              </div>
              <p className="testimonials__text">"{t.text}"</p>
              <div className="testimonials__author">
                <div className="testimonials__avatar">{t.avatar}</div>
                <div>
                  <p className="testimonials__name">{t.name}</p>
                  <p className="testimonials__role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
