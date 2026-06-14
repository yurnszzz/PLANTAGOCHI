import { Link } from 'react-router-dom'
import { Leaf, Mail, Globe, ExternalLink } from 'lucide-react'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <Logo size={36} />
              <span className="footer__logo-text">Plantagochi</span>
            </div>
            <p className="footer__tagline">
              Rawat Fisiknya, Level-Up Digitalnya.
            </p>
            <p className="footer__desc">
              Platform SaaS gamifikasi interaktif untuk penjual kaktus & sukulen mini. 
              Tingkatkan engagement pelanggan Anda dengan digital twin.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Navigasi</h4>
            <Link to="/" className="footer__link">Beranda</Link>
            <Link to="/#features" className="footer__link">Fitur</Link>
            <Link to="/pricing" className="footer__link">Harga</Link>
            <Link to="/demo" className="footer__link">Demo</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Sumber Daya</h4>
            <a href="#" className="footer__link">Dokumentasi API</a>
            <a href="#" className="footer__link">Panduan Integrasi</a>
            <a href="#" className="footer__link">FAQ</a>
            <a href="#" className="footer__link">Blog</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Kontak</h4>
            <a href="mailto:hello@plantagochi.id" className="footer__link footer__link--icon">
              <Mail size={16} />
              hello@plantagochi.id
            </a>
            <a href="#" className="footer__link footer__link--icon">
              <Globe size={16} />
              @plantagochi
            </a>
            <a href="#" className="footer__link footer__link--icon">
              <ExternalLink size={16} />
              GitHub
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Plantagochi. Dibuat dengan <Leaf size={14} className="footer__leaf" /> oleh Tim Technopreneurship UI.
          </p>
          <div className="footer__legal">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
