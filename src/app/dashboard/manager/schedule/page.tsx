// src/app/dashboard/manager/schedule/page.tsx - KORRIGIERT
'use client'

import { useState, useEffect } from 'react'
import { Calendar, Save, Send, Clock } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'

interface DayPlan {
  start: string
  end: string
  pause: number
  hours: number
  enabled: boolean
}

interface WeeklyPlanData {
  monday: DayPlan
  tuesday: DayPlan
  wednesday: DayPlan
  thursday: DayPlan
  friday: DayPlan
  saturday: DayPlan
  sunday: DayPlan
}

export default function ManagerSchedulePage() {
  const { user } = useAuth()
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanData>({
    monday: { start: '08:00', end: '17:00', pause: 60, hours: 8, enabled: true },
    tuesday: { start: '08:00', end: '17:00', pause: 60, hours: 8, enabled: true },
    wednesday: { start: '08:00', end: '17:00', pause: 60, hours: 8, enabled: true },
    thursday: { start: '08:00', end: '17:00', pause: 60, hours: 8, enabled: true },
    friday: { start: '08:00', end: '17:00', pause: 60, hours: 8, enabled: true },
    saturday: { start: '00:00', end: '00:00', pause: 0, hours: 0, enabled: false },
    sunday: { start: '00:00', end: '00:00', pause: 0, hours: 0, enabled: false }
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const dayNames = {
    monday: 'Montag',
    tuesday: 'Dienstag', 
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag'
  }

  const calculateHours = (start: string, end: string, pause: number) => {
    if (!start || !end) return 0
    
    const [startHour, startMinute] = start.split(':').map(Number)
    const [endHour, endMinute] = end.split(':').map(Number)
    
    const startTotal = startHour * 60 + startMinute
    const endTotal = endHour * 60 + endMinute
    
    const totalMinutes = endTotal - startTotal - pause
    return Math.max(totalMinutes / 60, 0)
  }

  const handleTimeChange = (day: keyof WeeklyPlanData, field: keyof DayPlan, value: string | number | boolean) => {
    setWeeklyPlan(prev => {
      const updatedDay = { 
        ...prev[day], 
        [field]: value 
      }
      
      // Automatisch Stunden berechnen wenn Start/Ende/Pause geändert wird
      if (field === 'start' || field === 'end' || field === 'pause') {
        updatedDay.hours = calculateHours(
          field === 'start' ? value as string : updatedDay.start,
          field === 'end' ? value as string : updatedDay.end,
          field === 'pause' ? value as number : updatedDay.pause
        )
      }
      
      return {
        ...prev,
        [day]: updatedDay
      }
    })
  }

  //  KORREKT: ECHTER API CALL zum Speichern
  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/weekly-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyPlan: weeklyPlan,
          isWeeklyPlan: true,
          planPublished: false // Als Entwurf speichern
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        console.log(' Plan saved as draft:', data.weeklyPlan)
      } else {
        console.error('Error saving plan:', data.error)
        alert('Fehler beim Speichern: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('Fehler beim Speichern des Plans')
    } finally {
      setLoading(false)
    }
  }

  //  KORREKT: ECHTER API CALL zum Veröffentlichen
  const handlePublish = async () => {
    setLoading(true)
    try {
      console.log(' Publishing weekly plan:', weeklyPlan)
      
      const response = await fetch('/api/weekly-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyPlan: weeklyPlan,
          isWeeklyPlan: true,
          planPublished: true, // ALS VERÖFFENTLICHT MARKIEREN
          publishedBy: user?.id || "demo-manager"
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(' Wochenplan erfolgreich veröffentlicht!')
        console.log(' Plan published successfully:', data.weeklyPlan)
      } else {
        console.error('Error publishing plan:', data.error)
        alert(' Fehler beim Veröffentlichen: ' + data.error)
      }
    } catch (error) {
      console.error('Error publishing schedule:', error)
      alert(' Fehler beim Veröffentlichen des Plans')
    } finally {
      setLoading(false)
    }
  }

  const getTotalWeeklyHours = () => {
    return Object.values(weeklyPlan).reduce((total, day) => total + (day.enabled ? day.hours : 0), 0)
  }

  const getWorkDaysCount = () => {
    return Object.values(weeklyPlan).filter(day => day.enabled).length
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
          <Calendar style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Wochenplan erstellen
            </h1>
            <p style={{ 
              color: '#6b7280', 
              margin: 0
            }}>
              Erstellen Sie einen Wochenplan für Ihr Team
            </p>
          </div>
        </div>
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

      {/* Wochenplan Editor */}
      <div style={{ 
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: '#1f2937'
        }}>
          Wochenplan Editor
        </h2>

        {/* Tage Grid */}
        <div style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {(Object.keys(weeklyPlan) as Array<keyof WeeklyPlanData>).map((day) => {
            const dayPlan = weeklyPlan[day]
            
            return (
              <div key={day} style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 1fr 1fr 1fr 100px 80px',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                background: dayPlan.enabled ? '#f8fafc' : '#f9fafb',
                borderRadius: '0.75rem',
                border: `1px solid ${dayPlan.enabled ? '#e5e7eb' : '#f3f4f6'}`,
                opacity: dayPlan.enabled ? 1 : 0.6
              }}>
                {/* Tag Name mit Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <input
                    type="checkbox"
                    checked={dayPlan.enabled}
                    onChange={(e) => handleTimeChange(day, 'enabled', e.target.checked)}
                    style={{
                      width: '1.25rem',
                      height: '1.25rem'
                    }}
                  />
                  <span style={{
                    fontWeight: '600',
                    color: dayPlan.enabled ? '#1f2937' : '#9ca3af',
                    minWidth: '80px'
                  }}>
                    {dayNames[day]}
                  </span>
                </div>

                {/* Startzeit */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Start
                  </label>
                  <input
                    type="time"
                    value={dayPlan.start}
                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                    disabled={!dayPlan.enabled}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: dayPlan.enabled ? 'white' : '#f9fafb',
                      color: dayPlan.enabled ? '#1f2937' : '#9ca3af'
                    }}
                  />
                </div>

                {/* Endzeit */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Ende
                  </label>
                  <input
                    type="time"
                    value={dayPlan.end}
                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                    disabled={!dayPlan.enabled}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: dayPlan.enabled ? 'white' : '#f9fafb',
                      color: dayPlan.enabled ? '#1f2937' : '#9ca3af'
                    }}
                  />
                </div>

                {/* Pause */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Pause (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={dayPlan.pause}
                    onChange={(e) => handleTimeChange(day, 'pause', parseInt(e.target.value) || 0)}
                    disabled={!dayPlan.enabled}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: dayPlan.enabled ? 'white' : '#f9fafb',
                      color: dayPlan.enabled ? '#1f2937' : '#9ca3af',
                      textAlign: 'center'
                    }}
                  />
                </div>

                {/* Stunden Anzeige */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Arbeitszeit
                  </label>
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    background: dayPlan.enabled ? '#f0fdf4' : '#f9fafb',
                    border: `1px solid ${dayPlan.enabled ? '#bbf7d0' : '#f3f4f6'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: dayPlan.enabled ? '#059669' : '#9ca3af',
                    textAlign: 'center'
                  }}>
                    {dayPlan.hours.toFixed(1)}h
                  </div>
                </div>

                {/* Tagessumme */}
                <div style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: dayPlan.enabled ? '#1f2937' : '#9ca3af'
                }}>
                  {dayPlan.enabled ? `${dayPlan.hours.toFixed(1)}h` : '-'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Wochensumme */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          background: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              Wochengesamtstunden
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#059669'
            }}>
              {getTotalWeeklyHours().toFixed(1)} Stunden
            </div>
          </div>
          
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            textAlign: 'right'
          }}>
            {getWorkDaysCount()} Arbeitstage
            <br />
            Ø {getWorkDaysCount() > 0 
              ? `${(getTotalWeeklyHours() / getWorkDaysCount()).toFixed(1)}h` 
              : '0h'} pro Tag
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            background: saved ? '#059669' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          <Save size={18} />
          {saved ? 'Gespeichert!' : (loading ? 'Speichert...' : 'Speichern')}
        </button>

        <button
          onClick={handlePublish}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          <Send size={18} />
          {loading ? 'Veröffentlicht...' : 'Veröffentlichen'}
        </button>
      </div>

      {/* Info Box */}
      <div style={{
        background: '#f0f9ff',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid #bae6fd',
        marginTop: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <Clock size={18} color="#0369a1" />
          <span style={{ fontWeight: '600', color: '#0369a1' }}>
            Informationen
          </span>
        </div>
        <p style={{ color: '#0369a1', margin: 0, fontSize: '0.875rem' }}>
           Der Wochenplan wird für alle Mitarbeiter verbindlich
           Standard-Arbeitszeit ist 08:00 - 17:00 Uhr mit 60 Minuten Pause
           Wochenenden sind standardmäßig frei
           Stunden werden automatisch berechnet
        </p>
      </div>
    </div>
  )
}
