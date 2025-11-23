// app/dashboard/vacation/page.tsx - KORRIGIERT
'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, Send, FileText, TrendingUp } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext' //  useAuth import hinzufügen

interface VacationRequest {
  _id: string
  startDate: string
  endDate: string
  type: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  daysRequested: number
  createdAt: string
}

export default function VacationPage() {
  const { user } = useAuth() //  useAuth hinzufügen
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: 'vacation',
    reason: '',
    notes: ''
  })
  const [requests, setRequests] = useState<VacationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    fetchUserRequests()
  }, [])

  const fetchUserRequests = async () => {
    setLoading(true)
    try {
      //  KORREKT: userId als Query Parameter hinzufügen
      const response = await fetch(`/api/vacation?userId=${user?.id}`)
      const data = await response.json()
      if (data.success) {
        setRequests(data.requests)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      //  KORREKT: userId zum FormData hinzufügen
      const response = await fetch('/api/vacation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id //  WICHTIG: userId hinzufügen
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Urlaubsantrag erfolgreich eingereicht!')
        setFormData({ startDate: '', endDate: '', type: 'vacation', reason: '', notes: '' })
        fetchUserRequests()
      } else {
        alert('Fehler: ' + data.message)
      }
    } catch (error) {
      alert('Fehler beim Senden des Antrags')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#059669'
      case 'rejected': return '#dc2626'
      default: return '#d97706'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Genehmigt'
      case 'rejected': return 'Abgelehnt'
      default: return 'Ausstehend'
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Main Form Section */}
      <div>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Urlaubsbeantragung
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            Beantragen Sie hier Ihren Urlaub
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Date Range */}
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
                    Startdatum
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
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
                    <Calendar style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    Enddatum
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
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

              {/* Vacation Details */}
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
                    <MapPin style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    Urlaubsart
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
                    <option value="vacation">Bezahlter Urlaub</option>
                    <option value="unpaid">Unbezahlter Urlaub</option>
                    <option value="sick">Krankheit</option>
                    <option value="personal">Familienurlaub</option>
                    <option value="other">Sonderurlaub</option>
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
                    <Clock style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    Anzahl Tage
                  </label>
                  <div style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: '#f9fafb',
                    fontSize: '1rem',
                    color: '#374151'
                  }}>
                    {calculateDays()} Tage
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <FileText style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Grund
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Grund für den Urlaub"
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

              {/* Notes */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <FileText style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Notizen
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Zusätzliche Notizen oder Informationen"
                  rows={4}
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
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitLoading}
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
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  opacity: submitLoading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!submitLoading) {
                    e.currentTarget.style.background = '#047857';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!submitLoading) {
                    e.currentTarget.style.background = '#059669';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{submitLoading ? 'Wird gesendet...' : 'Urlaub beantragen'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Request History */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginTop: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem'
          }}>
            Meine Anträge
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Lade Anträge...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.map((request) => (
                <div key={request._id} style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </div>
                      <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                        {request.reason}  {request.daysRequested} Tage  {request.type}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Eingereicht: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: getStatusColor(request.status),
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {getStatusText(request.status)}
                    </div>
                  </div>
                </div>
              ))}
              
              {requests.length === 0 && (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  Noch keine Urlaubsanträge gestellt
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Vacation Summary */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Urlaubsübersicht
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>Verfügbare Tage:</span>
              <span style={{ fontWeight: '600', color: '#059669' }}>24 Tage</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>Genommene Tage:</span>
              <span style={{ fontWeight: '600', color: '#dc2626' }}>8 Tage</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>Verbleibend:</span>
              <span style={{ fontWeight: '600', color: '#2563eb' }}>16 Tage</span>
            </div>
            <div style={{ 
              height: '8px', 
              background: '#e5e7eb', 
              borderRadius: '4px',
              marginTop: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: '#059669',
                width: '66%',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Ausstehende Anträge
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.filter(req => req.status === 'pending').map((request) => (
              <div key={request._id} style={{
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: '#fffbeb'
              }}>
                <div style={{ fontWeight: '600', color: '#92400e' }}>
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#b45309' }}>{request.reason}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Status: Ausstehend  {request.daysRequested} Tage
                </div>
              </div>
            ))}
            
            {requests.filter(req => req.status === 'pending').length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                Keine ausstehenden Anträge
              </div>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Wichtige Informationen
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <div> Mindestens 2 Wochen Vorlaufzeit</div>
            <div> Urlaubsanträge müssen vom Vorgesetzten genehmigt werden</div>
            <div> Maximal 10 zusammenhängende Werktage</div>
            <div> Resturlaub verfällt am 31.03. des Folgejahres</div>
          </div>
        </div>
      </div>
    </div>
  )
}

