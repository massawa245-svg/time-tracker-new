// src/components/Footer.tsx
"use client"
import { Clock, Github, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [hoverStates, setHoverStates] = useState<{[key: string]: boolean}>({})

  const handleMouseEnter = (key: string) => {
    setHoverStates(prev => ({ ...prev, [key]: true }))
  }

  const handleMouseLeave = (key: string) => {
    setHoverStates(prev => ({ ...prev, [key]: false }))
  }

  const linkStyle = (key: string): React.CSSProperties => ({
    color: hoverStates[key] ? '#34d399' : '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  })

  const socialLinkStyle = (key: string): React.CSSProperties => ({
    color: hoverStates[key] ? '#34d399' : '#94a3b8',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
    background: hoverStates[key] ? 'rgba(52, 211, 153, 0.1)' : 'transparent'
  })

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={gridStyle}>
          {/* Brand */}
          <div>
            <div style={brandStyle}>
              <Clock style={clockIconStyle} />
              <span style={brandTextStyle}>
                TimeTracker Pro
              </span>
            </div>
            <p style={descriptionStyle}>
              Professionelle Zeiterfassung mit intelligenten Analytics und Team-Features. 
              Vertraut von tausenden Profis weltweit.
            </p>
            <div style={contactInfoStyle}>
              <div style={contactItemStyle}>
                <Phone style={contactIconStyle} />
                <span>+49 (0) 123 456 789</span>
              </div>
              <div style={contactItemStyle}>
                <Mail style={contactIconStyle} />
                <span>hallo@timetracker.pro</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 style={headingStyle}>
              Produkt
            </h3>
            <ul style={listStyle}>
              <li>
                <Link 
                  href="/features" 
                  style={linkStyle('features')}
                  onMouseEnter={() => handleMouseEnter('features')}
                  onMouseLeave={() => handleMouseLeave('features')}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  style={linkStyle('pricing')}
                  onMouseEnter={() => handleMouseEnter('pricing')}
                  onMouseLeave={() => handleMouseLeave('pricing')}
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link 
                  href="/demo" 
                  style={linkStyle('demo')}
                  onMouseEnter={() => handleMouseEnter('demo')}
                  onMouseLeave={() => handleMouseLeave('demo')}
                >
                  Live Demo
                </Link>
              </li>
              <li>
                <Link 
                  href="/integrations" 
                  style={linkStyle('integrations')}
                  onMouseEnter={() => handleMouseEnter('integrations')}
                  onMouseLeave={() => handleMouseLeave('integrations')}
                >
                  Integrationen
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 style={headingStyle}>
              Unternehmen
            </h3>
            <ul style={listStyle}>
              <li>
                <Link 
                  href="/about" 
                  style={linkStyle('about')}
                  onMouseEnter={() => handleMouseEnter('about')}
                  onMouseLeave={() => handleMouseLeave('about')}
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  style={linkStyle('blog')}
                  onMouseEnter={() => handleMouseEnter('blog')}
                  onMouseLeave={() => handleMouseLeave('blog')}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  style={linkStyle('careers')}
                  onMouseEnter={() => handleMouseEnter('careers')}
                  onMouseLeave={() => handleMouseLeave('careers')}
                >
                  Karriere
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  style={linkStyle('contact')}
                  onMouseEnter={() => handleMouseEnter('contact')}
                  onMouseLeave={() => handleMouseLeave('contact')}
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={bottomStyle}>
          <p style={copyrightStyle}>
            © 2024 TimeTracker Pro. Alle Rechte vorbehalten.
          </p>
          <div style={socialLinksStyle}>
            <a 
              href="#" 
              style={socialLinkStyle('github')}
              onMouseEnter={() => handleMouseEnter('github')}
              onMouseLeave={() => handleMouseLeave('github')}
            >
              <Github style={socialIconStyle} />
            </a>
            <a 
              href="#" 
              style={socialLinkStyle('twitter')}
              onMouseEnter={() => handleMouseEnter('twitter')}
              onMouseLeave={() => handleMouseLeave('twitter')}
            >
              <Twitter style={socialIconStyle} />
            </a>
            <a 
              href="#" 
              style={socialLinkStyle('email')}
              onMouseEnter={() => handleMouseEnter('email')}
              onMouseLeave={() => handleMouseLeave('email')}
            >
              <Mail style={socialIconStyle} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// CSS Styles mit TypeScript
const footerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  color: 'white',
  padding: '4rem 1rem 2rem 1rem',
  marginTop: 'auto'
}

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto'
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '3rem',
  marginBottom: '3rem'
}

const brandStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem'
}

const clockIconStyle: React.CSSProperties = {
  width: '2rem',
  height: '2rem',
  color: '#34d399'
}

const brandTextStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}

const descriptionStyle: React.CSSProperties = {
  color: '#94a3b8',
  lineHeight: '1.6',
  marginBottom: '1.5rem'
}

const contactInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}

const contactItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#cbd5e1',
  fontSize: '0.875rem'
}

const contactIconStyle: React.CSSProperties = {
  width: '1rem',
  height: '1rem'
}

const headingStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: 'white'
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}

const bottomStyle: React.CSSProperties = {
  borderTop: '1px solid #334155',
  paddingTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem'
}

const copyrightStyle: React.CSSProperties = {
  color: '#64748b',
  textAlign: 'center',
  margin: 0
}

const socialLinksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem'
}

const socialIconStyle: React.CSSProperties = {
  width: '1.25rem',
  height: '1.25rem'
}