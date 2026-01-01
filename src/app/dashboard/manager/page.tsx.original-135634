// src/app/dashboard/manager/page.tsx - KORRIGIERT
'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, BarChart3, Clock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'

interface ManagerStats {
  totalEmployees: number
  pendingRequests: number
  activeSchedules: number
  todayHours: number
}

export default function ManagerPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState<ManagerStats>({
    totalEmployees: 0,
    pendingRequests: 0,
    activeSchedules: 0,
    todayHours: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const features = [
    {
      title: 'Wochenplan erstellen',
      description: 'Wochenpläne für Mitarbeiter erstellen und veröffentlichen',
      icon: Calendar,
      path: '/dashboard/manager/schedule',
      color: '#3b82f6'
    },
    {
      title: 'Urlaubsanträge',
      description: 'Urlaubsanträge genehmigen oder ablehnen',
      icon: Users,
      path: '/dashboard/manager/vacation-requests',
      color: '#10b981'
    },
    {
      title: 'Team Übersicht',
      description: 'Teamleistung und Statistiken anzeigen',
      icon: BarChart3,
      path: '/dashboard/manager/team',
      color: '#8b5cf6'
    },
    {
      title: 'Zeiterfassung',
      description: 'Arbeitszeiten der Mitarbeiter einsehen',
      icon: Clock,
      path: '/dashboard/manager/timesheets',
      color: '#f59e0b'
    },
  ]

  useEffect(() => {
    // Prüfe ob User Manager/Admin ist
    if (user && (user.role === 'manager' || user.role === 'admin')) {
      loadManagerStats()
    } else if (user) {
      setError('Sie haben keine Berechtigung für den Manager-Bereich')
      setLoading(false)
    }
  }, [user])

  const loadManagerStats = async () => {
    try {
      setLoading(true)
      // Hier würden echte API Calls stehen
      // Für jetzt verwenden wir Mock-Daten basierend auf unseren Test-Daten
      setStats({
        totalEmployees: 8, // User 1-8 aus unseren Test-Daten
        pendingRequests: 2, // User 2 hat pending Urlaubsantrag
        activeSchedules: 1, // Ein aktiver Wochenplan
        todayHours: 42 // Heutige Gesamtarbeitszeit
      })
    } catch (error) {
      console.error('Error loading manager stats:', error)
      setError('Fehler beim Laden der Manager-Daten')
    } finally {
      setLoading(false)
    }
  }

  // Wenn kein Manager/Admin
  if (user && !(user.role === 'manager' || user.role === 'admin')) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <AlertCircle style={{ 
          width: '4rem', 
          height: '4rem', 
          color: '#ef4444',
          margin: '0 auto 1rem auto'
        }} />
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          Zugriff verweigert
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '1.125rem'
        }}>
          Sie haben keine Berechtigung für den Manager-Bereich.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Zum Dashboard
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '2rem auto'
        }}></div>
        <p style={{ color: '#6b7280' }}>Lade Manager-Daten...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <AlertCircle style={{ 
          width: '3rem', 
          height: '3rem', 
          color: '#ef4444',
          margin: '0 auto 1rem auto'
        }} />
        <h2 style={{ 
          color: '#dc2626', 
          marginBottom: '1rem'
        }}>
          Fehler
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
        <button
          onClick={loadManagerStats}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem 1rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem',
          color: '#1f2937'
        }}>
          Manager Dashboard
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '0.5rem'
        }}>
          Verwalten Sie Ihre Mitarbeiter und Arbeitspläne
        </p>
        {user && (
          <p style={{ 
            color: '#059669',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>
            Angemeldet als: {user.name} ({user.role})
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
            {stats.totalEmployees}
          </div>
          <div style={{ color: '#6b7280' }}>Mitarbeiter</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
            {stats.pendingRequests}
          </div>
          <div style={{ color: '#6b7280' }}>Ausstehende Anträge</div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            {stats.activeSchedules}
          </div>
          <div style={{ color: '#6b7280' }}>Aktive Pläne</div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>
            {stats.todayHours}h
          </div>
          <div style={{ color: '#6b7280' }}>Heutige Stunden</div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem'
      }}>
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => router.push(feature.path)}
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = feature.color
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                background: feature.color
              }}>
                <feature.icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                {feature.title}
              </h3>
            </div>
            <p style={{ color: '#6b7280', lineHeight: '1.5' }}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

