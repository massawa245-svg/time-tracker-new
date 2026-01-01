"use client"

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Clock, CheckCircle } from 'lucide-react'

interface TimerEntry {
  _id: string
  startTime: string
  endTime?: string
  duration: number
  status: 'running' | 'stopped'
}

export default function SimpleTimerPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [currentTimer, setCurrentTimer] = useState<TimerEntry | null>(null)
  const [todayTotal, setTodayTotal] = useState(0)
  const [todayEntries, setTodayEntries] = useState<TimerEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Beim Laden: User aus localStorage holen
  useEffect(() => {
    console.log(' SimpleTimer initializing...')
    
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        console.log(' Found user in localStorage:', user)
        
        // Extrahiere User ID (verschiedene Möglichkeiten)
        const extractedUserId = user._id || user.id || user.userId || user.email || 'demo-user'
        console.log(' Extracted userId:', extractedUserId)
        setUserId(extractedUserId)
        
        // Lade Timer Daten
        loadTimerData(extractedUserId)
      } else {
        console.log('ℹ No user in localStorage, using demo')
        setUserId('demo-user-' + Date.now())
      }
    } catch (error) {
      console.error(' Error loading user:', error)
      setUserId('demo-user-' + Date.now())
    }
  }, [])

  // Format time to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Format to hours with decimals
  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(2)
  }

  // Load timer data
  const loadTimerData = async (targetUserId: string) => {
    if (!targetUserId) {
      console.log(' No userId for timer load')
      return
    }
    
    try {
      setLoading(true)
      console.log(' Loading timer data for userId:', targetUserId)
      
      const response = await fetch(`/api/timer?userId=${encodeURIComponent(targetUserId)}`)
      const data = await response.json()
      
      console.log(' Timer API Response:', data)
      
      if (data.success) {
        setCurrentTimer(data.currentEntry)
        setTodayEntries(data.todayEntries || [])
        setTodayTotal(data.totalToday || 0)
        
        // If timer is running, calculate elapsed time
        if (data.currentEntry) {
          setIsRunning(true)
          const startTime = new Date(data.currentEntry.startTime).getTime()
          const now = Date.now()
          const elapsed = Math.floor((now - startTime) / 1000)
          setTime(elapsed)
          
          // Start timer updates
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = setInterval(() => {
            setTime(prev => prev + 1)
          }, 1000)
        } else {
          setIsRunning(false)
          setTime(0)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      } else {
        console.log(' Timer API not successful:', data.message)
      }
    } catch (err) {
      console.error(' Error loading timer:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTimer = async () => {
    if (!userId) {
      setError('Keine User ID gefunden. Bitte zuerst einloggen.')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      console.log(' Starting timer for userId:', userId)
      
      const response = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          action: 'start'
        })
      })
      
      const data = await response.json()
      console.log(' Start Timer Response:', data)
      
      if (data.success) {
        setIsRunning(true)
        setCurrentTimer(data.entry)
        setTime(0)
        
        // Start timer updates
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
          setTime(prev => prev + 1)
        }, 1000)
        
        // Reload data
        await loadTimerData(userId)
      } else {
        setError(data.message || 'Fehler beim Starten')
      }
    } catch (err) {
      console.error(' Error starting timer:', err)
      setError('Fehler beim Starten des Timers')
    } finally {
      setLoading(false)
    }
  }

  const handleStopTimer = async () => {
    if (!userId || !currentTimer?._id) {
      setError('Kein laufender Timer gefunden')
      return
    }
    
    try {
      setLoading(true)
      console.log(' Stopping timer:', currentTimer._id)
      
      const response = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          action: 'stop',
          entryId: currentTimer._id
        })
      })
      
      const data = await response.json()
      console.log(' Stop Timer Response:', data)
      
      if (data.success) {
        setIsRunning(false)
        setCurrentTimer(null)
        setTime(0)
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        
        // Reload data
        await loadTimerData(userId)
      } else {
        setError(data.message || 'Fehler beim Stoppen')
      }
    } catch (err) {
      console.error(' Error stopping timer:', err)
      setError('Fehler beim Stoppen des Timers')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTime(0)
    if (!isRunning) {
      setCurrentTimer(null)
    }
  }

  // Inline Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      padding: '1rem'
    },
    
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    
    userInfo: {
      background: userId ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
      border: userId ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(245, 158, 11, 0.5)',
      padding: '1rem',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    },
    
    timerCard: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '2rem',
      padding: '3rem 2rem',
      maxWidth: '600px',
      margin: '0 auto 2rem auto',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    },
    
    timeDisplay: {
      fontSize: '5rem',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      fontFamily: "'Roboto Mono', monospace",
      marginBottom: '2rem',
      textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
    }
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Simple Timer</h1>
        <p style={{ color: '#94a3b8' }}>Direct localStorage solution</p>
      </div>

      {/* User Info */}
      <div style={styles.userInfo}>
        {userId ? (
          <>
            <CheckCircle size={16} style={{ display: 'inline', marginRight: '0.5rem', color: '#10b981' }} />
            <strong>User ID:</strong> {userId}
            <div style={{ fontSize: '0.75rem', color: '#86efac', marginTop: '0.25rem' }}>
              {userId.includes('demo') ? ' Demo User' : ' Real User'}
            </div>
          </>
        ) : (
          <>
            <div style={{ color: '#fcd34d' }}>
               Keine User ID gefunden. Bitte zuerst <a href="/manual-login" style={{ color: '#60a5fa', textDecoration: 'underline' }}>einloggen</a>.
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fecaca',
          padding: '1rem',
          borderRadius: '0.75rem',
          marginBottom: '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Main Timer Card */}
      <div style={styles.timerCard}>
        <div style={styles.timeDisplay}>
          {formatTime(time)}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {!isRunning ? (
            <button
              onClick={handleStartTimer}
              disabled={loading || !userId}
              style={{
                padding: '1rem 2rem',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: (loading || !userId) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                color: 'white',
                opacity: (loading || !userId) ? 0.6 : 1
              }}
            >
              <Play size={20} />
              {loading ? 'Starting...' : 'Start Timer'}
            </button>
          ) : (
            <button
              onClick={handleStopTimer}
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                opacity: loading ? 0.6 : 1,
                animation: 'pulse 2s infinite'
              }}
            >
              <Pause size={20} />
              {loading ? 'Stopping...' : 'Stop Timer'}
            </button>
          )}
          
          <button
            onClick={handleReset}
            disabled={isRunning || loading}
            style={{
              padding: '1rem 2rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: (isRunning || loading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              opacity: (isRunning || loading) ? 0.5 : 1
            }}
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
        
        {/* Status */}
        <div style={{
          textAlign: 'center',
          color: isRunning ? '#10b981' : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '1.1rem'
        }}>
          {isRunning ? (
            <>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s infinite'
              }} />
              Timer läuft...
            </>
          ) : (
            <>
              <Pause size={20} />
              Timer gestoppt
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      {todayEntries.length > 0 && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '600px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Clock size={20} />
            Heute: {formatHours(todayTotal)} Stunden
          </h2>
          
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            {todayEntries.length} Sessions gespeichert
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        {userId.includes('demo') ? (
          <div style={{ color: '#fbbf24' }}>
            ⚠️ Demo Mode - Timer wird nur für diese Session gespeichert
          </div>
        ) : (
          <div style={{ color: '#10b981' }}>
             Timer wird mit User ID "{userId}" gespeichert
          </div>
        )}
      </div>
    </div>
  )
}
