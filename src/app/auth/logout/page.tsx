"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { motion } from 'framer-motion'
import { LogOut, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LogoutPage() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        setStatus('loading')
        await logout() // API Call wird hier durchgeführt
        setStatus('success')
        
        // Automatischer Redirect nach Erfolg
        setTimeout(() => {
          router.push('/')
        }, 2000)
        
      } catch (error) {
        console.error('Logout failed:', error)
        setStatus('error')
        setErrorMessage('Abmeldung fehlgeschlagen. Bitte versuche es erneut.')
      }
    }

    performLogout()
  }, [logout, router])

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={cardStyle}
      >
        <div style={headerStyle}>
          <Clock size={48} style={iconStyle} />
          <h1 style={titleStyle}>Abmeldung</h1>
          <p style={subtitleStyle}>
            {user ? `Bis bald, ${user.name}!` : 'Sie werden abgemeldet...'}
          </p>
        </div>

        <div style={contentStyle}>
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={loadingContainerStyle}
            >
              <div style={spinnerStyle}></div>
              <p style={loadingTextStyle}>Verbindung zum Server wird getrennt...</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={successStyle}
            >
              <CheckCircle size={48} style={successIconStyle} />
              <p style={successTextStyle}>Erfolgreich abgemeldet!</p>
              <p style={redirectTextStyle}>Sie werden zur Startseite weitergeleitet...</p>
              <Link href="/" style={homeLinkStyle}>
                Jetzt zur Startseite
              </Link>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={errorStyle}
            >
              <AlertCircle size={48} style={errorIconStyle} />
              <p style={errorTextStyle}>{errorMessage}</p>
              <div style={buttonGroupStyle}>
                <button 
                  onClick={() => window.location.reload()}
                  style={retryButtonStyle}
                >
                  Erneut versuchen
                </button>
                <Link href="/dashboard" style={dashboardLinkStyle}>
                  Zum Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// CSS Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
  padding: '2rem 1rem'
}

const cardStyle = {
  background: 'white',
  borderRadius: '1rem',
  padding: '3rem 2rem',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  textAlign: 'center' as const,
  maxWidth: '400px',
  width: '100%'
}

const headerStyle = {
  marginBottom: '2rem'
}

const iconStyle = {
  color: '#2563eb',
  margin: '0 auto 1rem auto'
}

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: '0.5rem'
}

const subtitleStyle = {
  color: '#6b7280',
  fontSize: '1.125rem'
}

const contentStyle = {
  position: 'relative' as const,
  minHeight: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '1rem'
}

const spinnerStyle = {
  width: '3rem',
  height: '3rem',
  border: '3px solid #e5e7eb',
  borderTop: '3px solid #2563eb',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
}

const loadingTextStyle = {
  color: '#6b7280',
  fontSize: '1rem'
}

const successStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '1rem'
}

const successIconStyle = {
  color: '#059669'
}

const successTextStyle = {
  color: '#059669',
  fontSize: '1.25rem',
  fontWeight: '600'
}

const redirectTextStyle = {
  color: '#6b7280',
  fontSize: '0.875rem'
}

const homeLinkStyle = {
  background: '#2563eb',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'all 0.2s ease'
}

const errorStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '1rem'
}

const errorIconStyle = {
  color: '#dc2626'
}

const errorTextStyle = {
  color: '#dc2626',
  fontSize: '1rem',
  textAlign: 'center' as const
}

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem'
}

const retryButtonStyle = {
  background: '#dc2626',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: '500'
}

const dashboardLinkStyle = {
  background: '#6b7280',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  textDecoration: 'none',
  fontWeight: '500'
}

// CSS Animation
const spinnerAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = spinnerAnimation
  document.head.appendChild(styleSheet)
}