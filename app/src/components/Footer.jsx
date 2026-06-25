import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Leaf, Mail, Globe, ExternalLink } from 'lucide-react'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (e, to) => {
    e.preventDefault()
    if (to.startsWith('/#')) {
      const id = to.replace('/#', '')
      if (location.pathname === '/') {
        // Already on landing page — just scroll
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Navigate to landing page first, then scroll
        navigate('/')
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      navigate(to)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
              Kaktus mini dengan pengalaman digital twin interaktif. 
              Beli, scan QR, dan mulai petualangan merawat tanamanmu.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Navigasi</h4>
            <a href="/" className="footer__link" onClick={(e) => handleNavClick(e, '/')}>Beranda</a>
            <a href="/#features" className="footer__link" onClick={(e) => handleNavClick(e, '/#features')}>Fitur</a>
            <a href="/#how-it-works" className="footer__link" onClick={(e) => handleNavClick(e, '/#how-it-works')}>Cara Kerja</a>
            <a href="/#products" className="footer__link" onClick={(e) => handleNavClick(e, '/#products')}>Produk</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Akses</h4>
            <Link to="/demo" className="footer__link">Demo Interaktif</Link>
            <Link to="/login" className="footer__link">Login</Link>
            <Link to="/pricing" className="footer__link">Harga</Link>
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
            <a href="https://github.com/yurnszzz/PLANTAGOCHI" target="_blank" rel="noopener noreferrer" className="footer__link footer__link--icon">
              <ExternalLink size={16} />
              GitHub
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Plantagochi — UPN Veteran Jakarta <Leaf size={14} className="footer__leaf" />
          </p>
        </div>
      </div>
    </footer>
  )
}
