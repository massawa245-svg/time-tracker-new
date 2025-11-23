"use client"
import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, CheckCircle, XCircle, Eye, Download } from 'lucide-react'

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

interface WorkSchedule {
  _id: string
  weeklyPlan: WeeklyPlanData
  publishedAt: string
  publishedBy: {
    name: string
    email: string
  }
}

export default function SchedulePage() {
  const [weeklyPlan, setWeeklyPlan] = useState<WorkSchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date())

  useEffect(() => {
    loadWeeklyPlan()
  }, [])

  const loadWeeklyPlan = async () => {
    try {
      console.log(' Loading weekly plan...')
      const response = await fetch('/api/weekly-plan')
      const data = await response.json()
      
      console.log('📦 API Response:', data)
      
      if (data.success && data.weeklyPlan) {
        console.log('✅ Weekly plan data:', data.weeklyPlan)
        setWeeklyPlan(data.weeklyPlan)
      } else {
        console.log('❌ No weekly plan in response')
      }
    } catch (error) {
      console.error('❌ Error loading weekly plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalWeeklyHours = () => {
    if (!weeklyPlan?.weeklyPlan) return 0
    return Object.values(weeklyPlan.weeklyPlan).reduce((total, day) => total + (day.enabled ? day.hours : 0), 0)
  }

  const getWorkDaysCount = () => {
    if (!weeklyPlan?.weeklyPlan) return 0
    return Object.values(weeklyPlan.weeklyPlan).filter(day => day.enabled).length
  }

  const formatTime = (time: string) => {
    if (time === '00:00') return '12:00 AM'
    const [hours, minutes] = time.split(':')
    const hourNum = parseInt(hours)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum % 12 || 12
    return `${displayHour}:${minutes} ${period}`
  }

  const formatPause = (minutes: number) => {
    if (minutes === 0) return '0 min'
    return `${minutes} min`
  }

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek)
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1) // Montag
    
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  //  PDF Export Funktion - EINFACHE VERSION
  const handlePDFExport = () => {
    if (!weeklyPlan) return;
    
    let content = "TimeTracker Pro - Wochenplan\n";
    content += "============================\n\n";
    content += "Wochenplan für: " + new Date().toLocaleDateString('de-DE') + "\n";
    content += "Veröffentlicht am: " + new Date(weeklyPlan.publishedAt).toLocaleDateString('de-DE') + "\n";
    
    if (weeklyPlan.publishedBy) {
      content += "Veröffentlicht von: " + weeklyPlan.publishedBy.name + "\n";
    }
    
    content += "\n";
    
    // Tage hinzufügen
    const dayNames = {
      monday: 'Montag',
      tuesday: 'Dienstag', 
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag'
    };
    
    Object.keys(weeklyPlan.weeklyPlan).forEach(day => {
      const dayPlan = weeklyPlan.weeklyPlan[day as keyof WeeklyPlanData];
      const dayName = dayNames[day as keyof typeof dayNames];
      const schedule = dayPlan.enabled 
        ? formatTime(dayPlan.start) + " - " + formatTime(dayPlan.end) + " (" + dayPlan.hours + "h, " + dayPlan.pause + "min Pause)"
        : 'Frei';
      
      content += dayName + ": " + schedule + "\n";
    });
    
    content += "\nGesamtstunden: " + getTotalWeeklyHours() + "h\n";
    content += "Arbeitstage: " + getWorkDaysCount() + "\n";
    
    const avgHours = getWorkDaysCount() > 0 
      ? Math.round((getTotalWeeklyHours() / getWorkDaysCount()) * 100) / 100
      : 0;
    content += "Durchschnitt pro Tag: " + avgHours + "h\n\n";
    content += "Exportiert am: " + new Date().toLocaleDateString('de-DE');

    // Erstelle Blob und Download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "wochenplan-" + new Date().toISOString().split('T')[0] + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Wochenplan wurde als Textdatei heruntergeladen!');
  };

  const dayNames = {
    monday: 'Montag',
    tuesday: 'Dienstag', 
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag'
  }

  const weekDates = getWeekDates()

  //  LOADING STATE
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        padding: '2rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ color: '#6b7280', margin: 0 }}>Lade Wochenplan...</p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Bitte warten, Daten werden geladen
          </p>
        </div>
      </div>
    )
  }

  //  KEIN WOCHENPLAN VERFÜGBAR
  if (!weeklyPlan || !weeklyPlan.weeklyPlan) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <Calendar style={{ width: '4rem', height: '4rem', color: '#9ca3af', margin: '0 auto 1rem auto' }} />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Kein Wochenplan verfügbar
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
               <strong>Der Manager hat noch keinen Wochenplan veröffentlicht.</strong>
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Sobald Ihr Teamleiter einen Wochenplan erstellt und veröffentlicht, 
              sehen Sie ihn hier. Bei Fragen wenden Sie sich bitte an Ihren Vorgesetzten.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={loadWeeklyPlan}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  //  WOCHENPLAN VERFÜGBAR
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
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
            <Calendar style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Wochenplan
              </h1>
              <p style={{ 
                color: '#6b7280', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={16} color="#059669" />
                Veröffentlicht am {new Date(weeklyPlan.publishedAt).toLocaleDateString('de-DE')}
                {weeklyPlan.publishedBy && ` von ${weeklyPlan.publishedBy.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Wochenplan Übersicht */}
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
            color: '#1f2937',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Eye size={20} />
            Aktueller Wochenplan
          </h2>

          {/* Tage Grid */}
          <div style={{
            display: 'grid',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {(Object.keys(weeklyPlan.weeklyPlan) as Array<keyof WeeklyPlanData>).map((day) => {
              const dayPlan = weeklyPlan.weeklyPlan[day]
              if (!dayPlan) return null
              
              return (
                <div key={day} style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr 1fr 1fr 1fr 80px',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  background: dayPlan.enabled ? '#f8fafc' : '#f9fafb',
                  borderRadius: '0.75rem',
                  border: `1px solid ${dayPlan.enabled ? '#e5e7eb' : '#f3f4f6'}`,
                  opacity: dayPlan.enabled ? 1 : 0.6
                }}>
                  {/* Tag Name */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {dayPlan.enabled ? (
                        <CheckCircle size={16} color="#059669" />
                      ) : (
                        <XCircle size={16} color="#9ca3af" />
                      )}
                    </div>
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
                    <div style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: '#f9fafb',
                      fontSize: '0.875rem',
                      color: dayPlan.enabled ? '#1f2937' : '#9ca3af'
                    }}>
                      {formatTime(dayPlan.start)}
                    </div>
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
                    <div style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: '#f9fafb',
                      fontSize: '0.875rem',
                      color: dayPlan.enabled ? '#1f2937' : '#9ca3af'
                    }}>
                      {formatTime(dayPlan.end)}
                    </div>
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
                    <div style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: '#f9fafb',
                      fontSize: '0.875rem',
                      color: dayPlan.enabled ? '#1f2937' : '#9ca3af',
                      textAlign: 'center'
                    }}>
                      {formatPause(dayPlan.pause)}
                    </div>
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
                      {dayPlan.hours}h
                    </div>
                  </div>

                  {/* Tagessumme */}
                  <div style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: dayPlan.enabled ? '#1f2937' : '#9ca3af'
                  }}>
                    {dayPlan.enabled ? `${dayPlan.hours}h` : '-'}
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
                {getTotalWeeklyHours()} Stunden
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
                ? `${Math.round((getTotalWeeklyHours() / getWorkDaysCount()) * 100) / 100}h` 
                : '0h'} pro Tag
            </div>
          </div>
        </div>

        {/* Action Button - PDF Export */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={handlePDFExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Download size={18} />
            PDF Export
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          background: '#f0f9ff',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid #bae6fd',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Clock size={18} color="#0369a1" />
            <span style={{ fontWeight: '600', color: '#0369a1' }}>
              Wichtige Information
            </span>
          </div>
          <p style={{ color: '#0369a1', margin: 0, fontSize: '0.875rem' }}>
            Dieser Wochenplan wurde vom Management erstellt und ist für alle Mitarbeiter verbindlich.
            Bei Fragen wenden Sie sich bitte an Ihren Vorgesetzten.
          </p>
        </div>
      </div>
    </div>
  )
}
