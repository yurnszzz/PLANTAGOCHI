import { ShoppingBag, Star, Package, Gem, Gift } from 'lucide-react'
import CactusAvatar from '../components/CactusAvatar'
import './ProductShowcase.css'

const products = [
  {
    id: 1,
    name: 'Kaktus Mini Standard',
    price: 'Rp 25.000',
    priceNum: 25000,
    level: 2,
    tier: 'Standard',
    icon: Package,
    includes: ['Tanaman kaktus asli (3-5cm)', 'Pot semen putih 5cm', 'Media tanam', 'Batu hias', 'QR Code digital twin'],
    color: '--green-400',
  },
  {
    id: 2,
    name: 'Kaktus Premium Pot',
    price: 'Rp 40.000 – 50.000',
    priceNum: 45000,
    level: 3,
    tier: 'Premium',
    icon: Gem,
    popular: true,
    includes: ['Tanaman kaktus asli pilihan', 'Pot desain premium', 'Media tanam khusus', 'Batu hias warna', 'QR Code digital twin', 'Kartu perawatan'],
    color: '--amber-400',
  },
  {
    id: 3,
    name: 'Gift Bundle',
    price: 'Rp 75.000',
    priceNum: 75000,
    level: 5,
    tier: 'Gift',
    icon: Gift,
    includes: ['2-3 tanaman kaktus pilihan', 'Pot premium berdesain', 'Media tanam & batu hias', 'QR Code per tanaman', 'Kartu ucapan digital', 'Packaging premium'],
    color: '--rose-400',
  },
]

export default function ProductShowcase() {
  return (
    <section className="products" id="products">
      <div className="container">
        <div className="products__header">
          <span className="section-tag">
            <ShoppingBag size={14} />
            Produk
          </span>
          <h2 className="section-title">
            Paket Produk <span className="text-gradient">Siap Jual</span>
          </h2>
          <p className="section-desc">
            Tiga tier produk yang sudah dirancang untuk memaksimalkan margin dan menjangkau 
            berbagai segmen pelanggan.
          </p>
        </div>

        <div className="products__grid">
          {products.map((product) => (
            <div key={product.id} className={`products__card ${product.popular ? 'products__card--popular' : ''}`}>
              {product.popular && (
                <div className="products__popular-badge">
                  <Star size={12} />
                  Paling Populer
                </div>
              )}

              <div className="products__card-tier">
                <product.icon size={16} />
                {product.tier}
              </div>

              <div className="products__card-visual">
                <CactusAvatar level={product.level} size={120} animated={false} />
              </div>

              <h3 className="products__card-name">{product.name}</h3>
              <p className="products__card-price">{product.price}</p>

              <ul className="products__card-includes">
                {product.includes.map((item) => (
                  <li key={item} className="products__card-include">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="products__card-margin">
                <span>Gross Margin</span>
                <span className="products__card-margin-value">~65-70%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Product Details Section */}
        <div className="products__details">
          <h3 className="products__details-title">Detail Produk & Perawatan</h3>
          <div className="products__details-grid">
            <div className="products__detail-card">
              <h4>Paket Termasuk</h4>
              <ul>
                <li>Tanaman asli (1 kg muat 6 pcs)</li>
                <li>Pot semen putih 5cm</li>
                <li>Batu hias dekoratif</li>
                <li>Media tanam siap pakai</li>
              </ul>
            </div>
            <div className="products__detail-card">
              <h4>Perawatan Kaktus</h4>
              <ul>
                <li>Siram 1x seminggu atau 10 hari sekali</li>
                <li>Simpan di tempat terkena matahari</li>
                <li>Jemur secara rutin jika di dalam ruangan</li>
                <li>Tanam setelah sampai, siram setelah 1-2 hari</li>
              </ul>
            </div>
            <div className="products__detail-card">
              <h4>Garansi & Layanan</h4>
              <ul>
                <li>Refund jika tanaman/pot rusak saat pengiriman</li>
                <li>Packing aman: bubble wrap + tissue</li>
                <li>Dikirim H+1 setelah pesanan</li>
                <li>Customer support via chat responsif</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
