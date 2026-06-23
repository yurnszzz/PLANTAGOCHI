import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
      id="theme-toggle"
    >
      <div className="theme-toggle__track">
        <div className={`theme-toggle__thumb ${theme === 'light' ? 'theme-toggle__thumb--light' : ''}`}>
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
        </div>
      </div>
    </button>
  )
}
