"use client"
import { useState, useEffect } from 'react'
import { Play, Square, Clock, RotateCcw } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'

interface TimeEntry {
  _id: string
  userId: string
  startTime: string
  endTime: string | null
  duration: number
  date: string
  status: 'running' | 'stopped'
}

export default function TimerPage() {
  const { user } = useAuth()
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null)

  // Lade laufenden Timer beim Start
  useEffect(() => {
    loadRunningTimer()
  }, [])

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isRunning])

  const loadRunningTimer = async () => {
    try {
      const response = await fetch(`/api/timer?userId=${user?.id}`)
      const data = await response.json()
      
      if (data.success && data.currentEntry) {
        setCurrentEntry(data.currentEntry)
        if (data.currentEntry.status === 'running') {
          // Berechne vergangene Zeit seit Start
          const startTime = new Date(data.currentEntry.startTime)
          const now = new Date()
          const diffSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000)
          setTime(diffSeconds)
          setIsRunning(true)
        }
      }
    } catch (error) {
      console.error('Error loading timer:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'start'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentEntry(data.entry)
        setIsRunning(true)
        setTime(0)
      }
    } catch (error) {
      console.error('Error starting timer:', error)
      alert('Fehler beim Starten des Timers')
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    if (!user?.id || !currentEntry) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'stop',
          entryId: currentEntry._id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentEntry(null)
        setIsRunning(false)
        // Zeit bleibt stehen fÃ¼r Anzeige
      }
    } catch (error) {
      console.error('Error stopping timer:', error)
      alert('Fehler beim Stoppen des Timers')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTime(0)
    setIsRunning(false)
    setCurrentEntry(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <Clock style={{ 
          width: '4rem', 
          height: '4rem', 
          margin: '0 auto 1rem auto',
          color: '#1e40af'
        }} />
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: '#1f2937'
        }}>
          Zeiterfassung
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#6b7280',
          marginBottom: '0.5rem'
        }}>
          Erfasse deine Arbeitszeit
        </p>
        {user && (
          <p style={{ 
            fontSize: '1rem', 
            color: '#059669',
            fontWeight: '600'
          }}>
            Angemeldet als: {user.name}
          </p>
        )}
      </div>

      {/* Timer Card */}
      <div style={{
        background: 'white',
        borderRadius: '1.5rem',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        textAlign: 'center',
        marginBottom: '2rem',
        minWidth: '400px',
        maxWidth: '500px'
      }}>
        
        {/* Timer Display */}
        <div style={{
          fontFamily: 'Courier New, monospace',
          fontSize: '3.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '2rem',
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '2px solid #e5e7eb'
        }}>
          {formatTime(time)}
        </div>

        {/* Status */}
        <div style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: isRunning ? '#059669' : '#6b7280',
          marginBottom: '2rem',
          padding: '0.75rem 1.5rem',
          background: isRunning ? '#f0fdf4' : '#f9fafb',
          borderRadius: '2rem',
          display: 'inline-block',
          border: `2px solid ${isRunning ? '#bbf7d0' : '#e5e7eb'}`
        }}>
          {isRunning ? 'ðŸŸ¢ Timer lÃ¤uft' : 'â¸ï¸ Bereit'}
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {!isRunning ? (
            <>
              <button
                onClick={handleStart}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: loading ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#047857'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#059669'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                <Play style={{ width: '1.25rem', height: '1.25rem' }} />
                {loading ? 'Startet...' : 'START'}
              </button>

              {time > 0 && (
                <button
                  onClick={handleReset}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    background: 'white',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f9fafb'
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                >
                  <RotateCcw style={{ width: '1.25rem', height: '1.25rem' }} />
                  Reset
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleStop}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                background: loading ? '#9ca3af' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '140px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#b91c1c'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#dc2626'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <Square style={{ width: '1.25rem', height: '1.25rem' }} />
              {loading ? 'Stoppt...' : 'STOPP'}
            </button>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h3 style={{ 
          marginBottom: '1rem', 
          fontSize: '1.25rem',
          color: '#1f2937'
        }}>
          â„¹ï¸ Informationen
        </h3>
        <div style={{ 
          textAlign: 'left', 
          fontSize: '0.875rem', 
          lineHeight: '1.6',
          color: '#6b7280'
        }}>
          <p>â€¢ Arbeitszeit wird automatisch erfasst</p>
          <p>â€¢ Daten werden in der Datenbank gespeichert</p>
          <p>â€¢ Zeiten werden im Wochenplan angezeigt</p>
          <p>â€¢ Standard-Arbeitszeit: 07:00 - 17:00 Uhr</p>
        </div>
      </div>

      {/* Heutige Statistik */}
      {time > 0 && (
        <div style={{
          marginTop: '2rem',
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          minWidth: '300px'
        }}>
          <h4 style={{ 
            marginBottom: '0.5rem', 
            fontSize: '1rem',
            color: '#1f2937'
          }}>
            ðŸ“Š Aktuelle Arbeitszeit
          </h4>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#059669',
            fontFamily: 'Courier New, monospace'
          }}>
            {formatTime(time)}
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
            Heute â€¢ {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      )}
    </div>
  )
}
