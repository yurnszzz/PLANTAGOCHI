import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Fitur', to: '/#features' },
    { label: 'Cara Kerja', to: '/#how-it-works' },
    { label: 'Harga', to: '/pricing' },
    { label: 'Demo', to: '/demo' },
  ]

  const handleNavClick = (e, to) => {
    if (to.startsWith('/#')) {
      e.preventDefault()
      const id = to.replace('/#', '')
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = to
      }
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar">
      <div className="navbar__inner container-wide">
        <Link to="/" className="navbar__brand">
          <Logo size={32} />
          <span className="navbar__brand-text">Plantagochi</span>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
              onClick={(e) => handleNavClick(e, link.to)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/demo" className="btn btn-primary navbar__cta">
            Coba Gratis
          </Link>
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}
