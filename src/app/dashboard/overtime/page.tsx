// app/dashboard/overtime/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Clock, Plus, Calendar, TrendingUp, Target, BarChart3, ArrowLeft, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react'
import Link from 'next/link'

export default function OvertimePage() {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    type: 'regular',
    project: '',
    description: '',
  })

  const [overtimeEntries, setOvertimeEntries] = useState([
    { id: 1, date: '2024-12-15', startTime: '18:00', endTime: '20:30', hours: 2.5, type: 'regular', project: 'Web Development', description: 'Bug fixing and deployment', approved: true },
    { id: 2, date: '2024-12-14', startTime: '19:00', endTime: '20:00', hours: 1.0, type: 'weekend', project: 'Client Meeting', description: 'Weekend client call', approved: false },
    { id: 3, date: '2024-12-10', startTime: '20:00', endTime: '23:00', hours: 3.0, type: 'holiday', project: 'Mobile App', description: 'Holiday development', approved: true }
  ])

  const [calculatedHours, setCalculatedHours] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Calculate hours when start or end time changes
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`)
      const end = new Date(`2000-01-01T${formData.endTime}`)
      const timeDiff = end.getTime() - start.getTime()
      const hours = Math.round((timeDiff / (1000 * 60 * 60)) * 10) / 10
      setCalculatedHours(hours > 0 ? hours : hours + 24) // Handle overnight
    }
  }, [formData.startTime, formData.endTime])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (calculatedHours <= 0) {
      setError('End time must be after start time')
      setLoading(false)
      return
    }

    if (!formData.project.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newEntry = {
        id: overtimeEntries.length + 1,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        hours: calculatedHours,
        type: formData.type,
        project: formData.project,
        description: formData.description,
        approved: false
      }
      
      setOvertimeEntries([newEntry, ...overtimeEntries])
      setSuccess('Überstunden erfolgreich erfasst!')
      
      // Reset form
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        type: 'regular',
        project: '',
        description: '',
      })
      setCalculatedHours(0)
      
    } catch (err) {
      setError('Failed to submit overtime entry')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalOvertime = () => {
    return overtimeEntries.reduce((total, entry) => total + entry.hours, 0)
  }

  const calculateApprovedOvertime = () => {
    return overtimeEntries
      .filter(entry => entry.approved)
      .reduce((total, entry) => total + entry.hours, 0)
  }

  const calculatePendingOvertime = () => {
    return overtimeEntries
      .filter(entry => !entry.approved)
      .reduce((total, entry) => total + entry.hours, 0)
  }

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return `${wholeHours}h ${minutes.toString().padStart(2, '0')}m`
  }

  const getStatusIcon = (approved: boolean) => {
    return approved ? 
      <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} /> : 
      <ClockIcon style={{ width: '1.25rem', height: '1.25rem', color: '#d97706' }} />
  }

  const getStatusColor = (approved: boolean) => {
    return approved ? 
      { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } : 
      { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: { background: string, color: string } } = {
      regular: { background: '#dbeafe', color: '#1e40af' },
      weekend: { background: '#e9d5ff', color: '#7e22ce' },
      holiday: { background: '#fecaca', color: '#dc2626' },
      night: { background: '#ddd6fe', color: '#5b21b6' },
      emergency: { background: '#fed7aa', color: '#ea580c' }
    }
    return colors[type] || { background: '#f3f4f6', color: '#374151' }
  }

  const typeLabels: { [key: string]: string } = {
    regular: 'Regulär',
    weekend: 'Wochenende',
    holiday: 'Feiertag',
    night: 'Nachtarbeit',
    emergency: 'Notfalldienst'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link 
                href="/dashboard" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#6b7280',
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>
                Overtime Tracking
              </span>
            </div>

            <div style={{ width: '8rem' }}></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem'
        }}>
          {/* Overtime Form */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '2rem'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Überstunden erfassen
            </h1>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Erfassen Sie hier Ihre geleisteten Überstunden
            </p>

            {success && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
                color: '#166534'
              }}>
                {success}
              </div>
            )}

            {error && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <Calendar style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    Datum
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: 'white',
                      fontSize: '1rem'
                    }}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <TrendingUp style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    Überstunden-Typ
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="regular">Reguläre Überstunden</option>
                    <option value="weekend">Wochenendarbeit</option>
                    <option value="holiday">Feiertagsarbeit</option>
                    <option value="night">Nachtarbeit</option>
                    <option value="emergency">Notfalldienst</option>
                  </select>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <Clock style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    Startzeit
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <Clock style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    Endzeit
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {formData.startTime && formData.endTime && (
                <div style={{
                  padding: '1rem',
                  background: '#dbeafe',
                  border: '1px solid #93c5fd',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>
                      Berechnete Stunden:
                    </span>
                    <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e40af' }}>
                      {calculatedHours} Stunden
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <Target style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Projekt
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Projekt auswählen</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Client Meeting">Kundenmeeting</option>
                  <option value="Design">Design</option>
                  <option value="Testing">Testing</option>
                  <option value="Other">Anderes</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <BarChart3 style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Beschreibung
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Beschreibung der Tätigkeiten"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'white',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: '#059669',
                  color: 'white',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#047857';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#059669';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '0.5rem'
                    }}></div>
                    Wird erfasst...
                  </span>
                ) : (
                  <>
                    <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>Überstunden erfassen</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Overtime Summary & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <TrendingUp style={{ width: '2rem', height: '2rem', color: '#2563eb', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  {calculateTotalOvertime().toFixed(1)}h
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Gesamt</div>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <CheckCircle style={{ width: '2rem', height: '2rem', color: '#059669', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  {calculateApprovedOvertime().toFixed(1)}h
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Genehmigt</div>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <ClockIcon style={{ width: '2rem', height: '2rem', color: '#d97706', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  {calculatePendingOvertime().toFixed(1)}h
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Ausstehend</div>
              </div>
            </div>

            {/* Recent Entries */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              padding: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Letzte Einträge
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem'
              }}>
                Ihre Überstunden-Historie
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {overtimeEntries.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Clock style={{ width: '3rem', height: '3rem', color: '#9ca3af', margin: '0 auto 1rem auto' }} />
                    <p style={{ color: '#6b7280' }}>Noch keine Überstunden erfasst</p>
                  </div>
                ) : (
                  overtimeEntries.map((entry) => {
                    const statusStyle = getStatusColor(entry.approved)
                    const typeStyle = getTypeColor(entry.type)
                    
                    return (
                      <div
                        key={entry.id}
                        style={{
                          padding: '1rem',
                          border: statusStyle.border,
                          borderRadius: '0.5rem',
                          background: statusStyle.background,
                          color: statusStyle.color
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getStatusIcon(entry.approved)}
                            <span style={{ fontWeight: '600' }}>
                              {new Date(entry.date).toLocaleDateString('de-DE')}
                            </span>
                          </div>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: typeStyle.background,
                            color: typeStyle.color
                          }}>
                            {typeLabels[entry.type]}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem' }}>
                            {entry.startTime} - {entry.endTime}
                          </span>
                          <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>{entry.hours}h</span>
                        </div>
                        
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                          {entry.project}
                        </div>
                        
                        {entry.description && (
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {entry.description}
                          </div>
                        )}
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          marginTop: '0.5rem',
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          <span>Erfasst: {new Date(entry.date).toLocaleDateString('de-DE')}</span>
                          <span style={{ color: entry.approved ? '#059669' : '#d97706' }}>
                            {entry.approved ? 'Genehmigt' : 'Ausstehend'}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}