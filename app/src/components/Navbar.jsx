import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogIn } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Fitur', to: '/#features' },
    { label: 'Cara Kerja', to: '/#how-it-works' },
    { label: 'Produk', to: '/#products' },
    { label: 'Demo', to: '/demo' },
    { label: 'Peringkat', to: '/leaderboard' },
    { label: 'Taman', to: '/garden' },
  ]

  const handleNavClick = (e, to) => {
    // Always close mobile menu first
    setMobileOpen(false)

    if (to.startsWith('/#')) {
      e.preventDefault()
      const id = to.replace('/#', '')

      if (location.pathname === '/') {
        // Already on landing — smooth scroll
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      } else {
        // Navigate to landing first, then scroll after mount
        navigate('/')
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    } else if (to === '/') {
      // Beranda — scroll to top
      if (location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar">
      <div className="navbar__inner container-wide">
        <Link to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
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
          <div className="navbar__actions">
            <ThemeToggle />
            <Link to="/login" className="btn btn-secondary navbar__login" onClick={() => setMobileOpen(false)}>
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <Link to="/demo" className="btn btn-primary navbar__cta" onClick={() => setMobileOpen(false)}>
              Coba Gratis
            </Link>
          </div>
        </div>

        <div className="navbar__mobile-actions">
          <ThemeToggle />
          <button
            className="navbar__toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="navbar-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
