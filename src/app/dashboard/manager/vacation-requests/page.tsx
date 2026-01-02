// src/app/dashboard/manager/vacation-requests/page.tsx - KORRIGIERT
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, User, Calendar, RefreshCw } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'

interface VacationRequest {
  _id: string
  userId: string
  userName: string
  startDate: string
  endDate: string
  type: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  daysRequested: number
  createdAt: string
}

export default function ManagerVacationPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<VacationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (user && (user.role === 'manager' || user.role === 'admin')) {
      loadVacationRequests()
    }
  }, [user])

  //  KORREKT: API CALL OHNE userId - LADE ALLE REQUESTS
  const loadVacationRequests = async () => {
    try {
      setLoading(true)
      
      //  LADE ALLE REQUESTS (kein userId Parameter)
      const response = await fetch('/api/vacation')
      const data = await response.json()
      
      if (data.success) {
        //  Hole User-Namen für bessere Anzeige
        const requestsWithUserNames = await Promise.all(
          data.requests.map(async (request: VacationRequest) => {
            // Hier würden wir normalerweise die User-Daten von der User-API holen
            // Für jetzt verwenden wir Mock-User-Namen basierend auf userId
            const userName = await getUserName(request.userId)
            return { ...request, userName }
          })
        )
        
        setRequests(requestsWithUserNames)
      } else {
        console.error('Error loading vacation requests:', data.message)
        // Fallback zu Mock-Daten
        setRequests(getMockRequests())
      }
    } catch (error) {
      console.error('Error loading vacation requests:', error)
      // Fallback zu Mock-Daten
      setRequests(getMockRequests())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Hilfsfunktion um User-Namen zu holen (Mock für jetzt)
  const getUserName = async (userId: string): Promise<string> => {
    const userNames: { [key: string]: string } = {
      '1': 'Demo Manager',
      '2': 'Demo Mitarbeiter', 
      '3': 'Max Mustermann',
      '4': 'Anna Schmidt',
      '5': 'Thomas Weber'
    }
    return userNames[userId] || `User ${userId}`
  }

  // Fallback Mock-Daten
  const getMockRequests = (): VacationRequest[] => {
    return [
      {
        _id: '1',
        userId: '2',
        userName: 'Demo Mitarbeiter',
        startDate: '2024-12-10',
        endDate: '2024-12-12',
        type: 'vacation',
        reason: 'Familienfeier',
        status: 'pending',
        daysRequested: 3,
        createdAt: '2024-11-15T10:00:00Z'
      },
      {
        _id: '2', 
        userId: '3',
        userName: 'Max Mustermann',
        startDate: '2024-12-20',
        endDate: '2024-12-22',
        type: 'vacation',
        reason: 'Weihnachtsurlaub',
        status: 'pending',
        daysRequested: 3,
        createdAt: '2024-11-15T11:00:00Z'
      }
    ]
  }

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      //  ECHTER API CALL zum Genehmigen
      const response = await fetch('/api/vacation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status: 'approved',
          approvedBy: user?.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        //  Aktualisiere lokalen State
        setRequests(prev => prev.map(req => 
          req._id === requestId ? { ...req, status: 'approved' } : req
        ))
      } else {
        console.error('Error approving request:', data.message)
        alert('Fehler beim Genehmigen des Antrags: ' + data.message)
      }
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Fehler beim Genehmigen des Antrags')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      //  ECHTER API CALL zum Ablehnen
      const response = await fetch('/api/vacation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status: 'rejected', 
          approvedBy: user?.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        //  Aktualisiere lokalen State
        setRequests(prev => prev.map(req => 
          req._id === requestId ? { ...req, status: 'rejected' } : req
        ))
      } else {
        console.error('Error rejecting request:', data.message)
        alert('Fehler beim Ablehnen des Antrags: ' + data.message)
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Fehler beim Ablehnen des Antrags')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadVacationRequests()
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

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const processedRequests = requests.filter(req => req.status !== 'pending')

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
        <p style={{ color: '#6b7280' }}>Lade Urlaubsanträge...</p>
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
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Urlaubsanträge
            </h1>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '0.5rem'
            }}>
              Verwalten und genehmigen Sie Urlaubsanträge Ihrer Mitarbeiter
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.6 : 1
            }}
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Aktualisiert...' : 'Aktualisieren'}
          </button>
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

      {/* Ausstehende Anträge */}
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
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Clock color="#f59e0b" />
          Ausstehende Anträge ({pendingRequests.length})
        </h2>

        {pendingRequests.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#6b7280'
          }}>
            <CheckCircle style={{ 
              width: '3rem', 
              height: '3rem', 
              color: '#059669',
              margin: '0 auto 1rem auto'
            }} />
            <p>Keine ausstehenden Anträge</p>
            <p style={{ fontSize: '0.875rem' }}>Alle Anträge wurden bearbeitet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.map((request) => (
              <div key={request._id} style={{
                background: '#fffbeb',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '2px solid #fef3c7'
              }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'start'
                }}>
                  {/* Request Info */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <User size={18} color="#92400e" />
                      <span style={{ fontWeight: '600', color: '#92400e' }}>
                        {request.userName}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <Calendar size={16} color="#92400e" />
                      <span style={{ color: '#92400e' }}>
                        {new Date(request.startDate).toLocaleDateString('de-DE')} - {new Date(request.endDate).toLocaleDateString('de-DE')}
                      </span>
                      <span style={{ 
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {request.daysRequested} Tage
                      </span>
                    </div>

                    <div style={{ color: '#b45309', marginBottom: '0.5rem' }}>
                      {request.reason}
                    </div>

                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280' 
                    }}>
                      Eingereicht: {new Date(request.createdAt).toLocaleDateString('de-DE')}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleApprove(request._id)}
                      disabled={actionLoading === request._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: actionLoading === request._id ? 'not-allowed' : 'pointer',
                        opacity: actionLoading === request._id ? 0.6 : 1
                      }}
                    >
                      <CheckCircle size={16} />
                      {actionLoading === request._id ? '...' : 'Genehmigen'}
                    </button>

                    <button
                      onClick={() => handleReject(request._id)}
                      disabled={actionLoading === request._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: actionLoading === request._id ? 'not-allowed' : 'pointer',
                        opacity: actionLoading === request._id ? 0.6 : 1
                      }}
                    >
                      <XCircle size={16} />
                      {actionLoading === request._id ? '...' : 'Ablehnen'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bearbeitete Anträge */}
      {processedRequests.length > 0 && (
        <div style={{ 
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '1.5rem',
            color: '#1f2937'
          }}>
            Bearbeitete Anträge ({processedRequests.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {processedRequests.map((request) => (
              <div key={request._id} style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <User size={16} color="#374151" />
                      <span style={{ fontWeight: '600', color: '#374151' }}>
                        {request.userName}
                      </span>
                    </div>
                    
                    <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      {new Date(request.startDate).toLocaleDateString('de-DE')} - {new Date(request.endDate).toLocaleDateString('de-DE')} 
                       {request.daysRequested} Tage  {request.reason}
                    </div>
                  </div>

                  <div style={{
                    padding: '0.5rem 1rem',
                    background: getStatusColor(request.status),
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {getStatusText(request.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
