"use client"

import { useState } from 'react'
import { LogIn, User, Mail, Lock, CheckCircle } from 'lucide-react'

export default function ManualLoginPage() {
  const [email, setEmail] = useState('solomuntesfa24@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const handleManualLogin = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try {
      console.log(' Manual login attempt for:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'demo' })
      })

      const data = await response.json()
      console.log(' Login API response:', data)
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setSuccess(true)
      setUserData(data)
      
      // Versuche User in localStorage zu setzen
      if (data.user) {
        const userForStorage = {
          id: data.user._id || data.user.id || data.user.userId || data.user.email,
          _id: data.user._id,
          userId: data.user.userId || data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        }
        
        localStorage.setItem('user', JSON.stringify(userForStorage))
        console.log('💾 User saved to localStorage:', userForStorage)
        
        // Versuche AuthContext zu aktualisieren
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'))
          console.log('🔄 Storage event dispatched')
        }
      }
      
    } catch (err) {
      console.error('❌ Manual login error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDemoUser = () => {
    const demoUser = {
      id: 'demo-user-123',
      _id: 'demo-user-123',
      userId: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin'
    }
    
    localStorage.setItem('user', JSON.stringify(demoUser))
    console.log(' Demo user set:', demoUser)
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'))
    }
    
    setSuccess(true)
    setUserData({ user: demoUser, success: true })
  }

  const checkLocalStorage = () => {
    const user = localStorage.getItem('user')
    console.log('📋 localStorage user:', user)
    alert('LocalStorage User: ' + (user || 'NONE'))
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('user')
    console.log('🧹 localStorage cleared')
    setSuccess(false)
    setUserData(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <LogIn size={48} style={{ margin: '0 auto 1rem auto', color: '#60a5fa' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Manual Login Fix
          </h1>
          <p style={{ color: '#94a3b8' }}>
            Direkter Login Fix für Timer Problem
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} />
            Login Test
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
              <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
              <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Password (leer lassen für Demo)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleManualLogin}
              disabled={loading}
              style={{
                flex: '1',
                padding: '1rem 2rem',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Real Login
                </>
              )}
            </button>

            <button
              onClick={handleSetDemoUser}
              style={{
                padding: '1rem 1.5rem',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Set Demo User
            </button>
          </div>
        </div>

        {/* Debug Tools */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
             Debug Tools
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={checkLocalStorage}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Check localStorage
            </button>
            
            <button
              onClick={clearLocalStorage}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Clear localStorage
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard/timer'}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fcd34d',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Go to Timer
            </button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#fca5a5', marginBottom: '0.5rem' }}> Error</h3>
            <p>{error}</p>
          </div>
        )}

        {success && userData && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <h3 style={{ color: '#86efac', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} />
              Login Successful!
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>User Data:</strong>
              <pre style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '0.5rem',
                overflow: 'auto',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
            
            <p style={{ color: '#86efac' }}>
               User sollte jetzt in localStorage und AuthContext sein.
              <br />
              Öffne jetzt den Timer: <a href="/dashboard/timer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>/dashboard/timer</a>
            </p>
          </div>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
