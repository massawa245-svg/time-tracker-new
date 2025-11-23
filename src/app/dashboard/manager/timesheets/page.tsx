// src/app/dashboard/manager/timesheets/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Clock, User, Calendar, Download } from 'lucide-react'
import { useAuth } from '../../../../contexts/AuthContext'

interface TimeEntry {
  _id: string
  userId: string
  userName: string
  startTime: string
  endTime: string
  duration: number
  date: string
}

export default function ManagerTimesheetsPage() {
  const { user } = useAuth()
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (user && (user.role === 'manager' || user.role === 'admin')) {
      loadTimeEntries()
    }
  }, [user, selectedDate])

  const loadTimeEntries = async () => {
    try {
      setLoading(true)
      // Hier würden echte API Calls stehen
      // Für jetzt verwenden wir Mock-Daten
      const mockEntries: TimeEntry[] = [
        {
          _id: '1',
          userId: '1',
          userName: 'Demo Manager',
          startTime: '2024-11-15T07:00:00',
          endTime: '2024-11-15T12:00:00',
          duration: 5 * 3600,
          date: '2024-11-15'
        },
        {
          _id: '2',
          userId: '1', 
          userName: 'Demo Manager',
          startTime: '2024-11-15T13:00:00',
          endTime: '2024-11-15T17:00:00',
          duration: 4 * 3600,
          date: '2024-11-15'
        },
        {
          _id: '3',
          userId: '2',
          userName: 'Demo Mitarbeiter',
          startTime: '2024-11-15T08:00:00',
          endTime: '2024-11-15T16:30:00',
          duration: 8.5 * 3600,
          date: '2024-11-15'
        }
      ]
      
      // Filter nach ausgewähltem Datum
      const filteredEntries = mockEntries.filter(entry => entry.date === selectedDate)
      setTimeEntries(filteredEntries)
    } catch (error) {
      console.error('Error loading time entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1000px', 
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
        <p style={{ color: '#6b7280' }}>Lade Zeiterfassung...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '1000px', 
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <Clock style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Zeiterfassung
            </h1>
            <p style={{ 
              color: '#6b7280', 
              margin: 0
            }}>
              Arbeitszeiten Ihrer Mitarbeiter einsehen
            </p>
          </div>
        </div>
        
        {/* Date Picker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <Calendar size={18} color="#6b7280" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white'
            }}
          />
        </div>

        {user && (
          <p style={{ 
            color: '#059669',
            fontWeight: '600',
            fontSize: '0.875rem',
            marginTop: '0.5rem'
          }}>
            Angemeldet als: {user.name} ({user.role})
          </p>
        )}
      </div>

      {/* Summary */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
            {timeEntries.length}
          </div>
          <div style={{ color: '#6b7280' }}>Einträge</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>
            {totalHours.toFixed(1)}h
          </div>
          <div style={{ color: '#6b7280' }}>Gesamtstunden</div>
        </div>
      </div>

      {/* Time Entries */}
      <div style={{ 
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Zeiteinträge ({new Date(selectedDate).toLocaleDateString('de-DE')})
          </h2>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            <Download size={16} />
            Exportieren
          </button>
        </div>

        {timeEntries.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#6b7280'
          }}>
            <Clock style={{ 
              width: '3rem', 
              height: '3rem', 
              color: '#9ca3af',
              margin: '0 auto 1rem auto'
            }} />
            <p>Keine Zeiteinträge für dieses Datum</p>
            <p style={{ fontSize: '0.875rem' }}>Es wurden noch keine Arbeitszeiten erfasst</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {timeEntries.map((entry) => (
              <div key={entry._id} style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} color="#374151" />
                    <span style={{ fontWeight: '600', color: '#374151' }}>
                      {entry.userName}
                    </span>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Start
                    </div>
                    <div style={{ fontWeight: '600', color: '#374151' }}>
                      {formatDateTime(entry.startTime)}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Ende
                    </div>
                    <div style={{ fontWeight: '600', color: '#374151' }}>
                      {formatDateTime(entry.endTime)}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Dauer
                    </div>
                    <div style={{ fontWeight: '600', color: '#059669' }}>
                      {formatTime(entry.duration)}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: '#059669',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {Math.floor(entry.duration / 3600)}h {(entry.duration % 3600) / 60}min
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
