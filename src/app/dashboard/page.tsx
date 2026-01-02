// src/app/dashboard/page.tsx
"use client"
import { useAuth } from '@contexts/AuthContext'
import { Clock, Calendar, Plane, Users, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  const features = [
    {
      title: 'Zeiterfassung',
      description: 'Erfasse deine Arbeitszeiten',
      icon: Clock,
      href: '/dashboard/timer',
      color: '#3b82f6'
    },
    {
      title: 'Wochenplan',
      description: 'Siehe deinen Wochenplan',
      icon: Calendar,
      href: '/dashboard/schedule',
      color: '#10b981'
    },
    {
      title: 'Urlaub',
      description: 'Urlaubsanträge stellen',
      icon: Plane,
      href: '/dashboard/vacation',
      color: '#f59e0b'
    },
    {
      title: 'Überstunden',
      description: 'Überstunden verwalten',
      icon: BarChart3,
      href: '/dashboard/overtime',
      color: '#ef4444'
    }
  ]

  const managerFeatures = [
    {
      title: 'Manager Tools',
      description: 'Manager Bereich',
      icon: Users,
      href: '/dashboard/manager',
      color: '#8b5cf6'
    }
  ]

  return (
    <div style={containerStyle}>
      {/* Welcome Section */}
      <div style={welcomeSectionStyle}>
        <h1 style={welcomeTitleStyle}>
          Willkommen, <span style={userNameStyle}>{user?.name}!</span>
        </h1>
        <p style={welcomeSubtitleStyle}>
          {user?.role === 'manager' || user?.role === 'admin' 
            ? 'Verwalte dein Team und verfolge die Arbeitszeiten' 
            : 'Verfolge deine Arbeitszeiten und verwalte deine Anfragen'
          }
        </p>
      </div>

      {/* Main Features Grid */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Dashboard</h2>
        <div style={gridStyle}>
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} style={cardLinkStyle}>
              <div style={cardStyle}>
                <div style={{
                  ...iconContainerStyle,
                  background: feature.color
                }}>
                  <feature.icon style={iconStyle} />
                </div>
                <div style={cardContentStyle}>
                  <h3 style={cardTitleStyle}>{feature.title}</h3>
                  <p style={cardDescriptionStyle}>{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Manager Features */}
      {(user?.role === 'manager' || user?.role === 'admin') && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Manager Bereich</h2>
          <div style={gridStyle}>
            {managerFeatures.map((feature, index) => (
              <Link key={index} href={feature.href} style={cardLinkStyle}>
                <div style={cardStyle}>
                  <div style={{
                    ...iconContainerStyle,
                    background: feature.color
                  }}>
                    <feature.icon style={iconStyle} />
                  </div>
                  <div style={cardContentStyle}>
                    <h3 style={cardTitleStyle}>{feature.title}</h3>
                    <p style={cardDescriptionStyle}>{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Schnellübersicht</h2>
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>40</div>
            <div style={statLabelStyle}>Diese Woche (Stunden)</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>3</div>
            <div style={statLabelStyle}>Ausstehende Anfragen</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>15</div>
            <div style={statLabelStyle}>Verbleibende Urlaubstage</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// CSS Styles
const containerStyle: React.CSSProperties = {
  padding: '2rem 1rem',
  maxWidth: '1200px',
  margin: '0 auto',
  minHeight: 'calc(100vh - 70px)'
}

const welcomeSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '3rem',
  padding: '2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '1rem',
  color: 'white',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
}

const welcomeTitleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  background: 'linear-gradient(135deg, #fff 0%, #f0f4ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}

const userNameStyle: React.CSSProperties = {
  color: '#34d399'
}

const welcomeSubtitleStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  opacity: 0.9,
  margin: 0
}

const sectionStyle: React.CSSProperties = {
  marginBottom: '3rem'
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 600,
  marginBottom: '1.5rem',
  color: '#1f2937',
  borderBottom: '3px solid #3b82f6',
  paddingBottom: '0.5rem',
  display: 'inline-block'
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem'
}

const cardLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'inherit'
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  border: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  height: '100%'
}

const iconContainerStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
}

const iconStyle: React.CSSProperties = {
  width: '1.5rem',
  height: '1.5rem',
  color: 'white'
}

const cardContentStyle: React.CSSProperties = {
  flex: 1
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  margin: '0 0 0.5rem 0',
  color: '#1f2937'
}

const cardDescriptionStyle: React.CSSProperties = {
  color: '#6b7280',
  margin: 0,
  lineHeight: 1.5
}

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem'
}

const statCardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '1rem',
  padding: '1.5rem',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e5e7eb'
}

const statNumberStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#3b82f6',
  marginBottom: '0.5rem'
}

const statLabelStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '0.9rem',
  fontWeight: 500
}

// Hover Effects für Karten
const hoverEffects = `
  .dashboard-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  .dashboard-card {
    transition: all 0.3s ease;
  }
`

// CSS hinzufügen
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = hoverEffects
  document.head.appendChild(styleSheet)
}