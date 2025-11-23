// src/app/dashboard/manager/team/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { Users, UserPlus, Mail, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '../../../../contexts/AuthContext'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
}

export default function TeamManagementPage() {
  const { user } = useAuth()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)

  useEffect(() => {
    if (user && (user.role === 'manager' || user.role === 'admin')) {
      loadTeamMembers()
    }
  }, [user])

  const loadTeamMembers = async () => {
    try {
      setLoading(true)
      // Hier würden wir später die echte API aufrufen
      // Für jetzt Mock-Daten
      setTeamMembers([
        { 
          id: '1', 
          name: 'Demo Mitarbeiter', 
          email: 'demo@company.com', 
          role: 'employee', 
          department: 'Development', 
          status: 'active' 
        },
        { 
          id: '2', 
          name: 'Max Mustermann', 
          email: 'max@company.com', 
          role: 'employee', 
          department: 'Marketing', 
          status: 'active' 
        },
        { 
          id: '3', 
          name: 'Anna Schmidt', 
          email: 'anna@company.com', 
          role: 'manager', 
          department: 'HR', 
          status: 'active' 
        }
      ])
    } catch (error) {
      console.error('Error loading team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc2626'
      case 'manager': return '#059669'
      case 'employee': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} color="#059669" />
      case 'invited': return <Clock size={16} color="#d97706" />
      default: return <Clock size={16} color="#6b7280" />
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <p>Lade Team-Mitglieder...</p>
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
              Team Management
            </h1>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '0.5rem'
            }}>
              Verwalten Sie Ihr Team und laden Sie neue Mitglieder ein
            </p>
          </div>
          
          <button
            onClick={() => setShowInviteForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <UserPlus size={20} />
            Mitglied einladen
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

      {/* Team Mitglieder Liste */}
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
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Users size={20} />
          Team Mitglieder ({teamMembers.length})
        </h2>

        {teamMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <Users style={{ width: '3rem', height: '3rem', color: '#9ca3af', margin: '0 auto 1rem auto' }} />
            <p>Noch keine Team-Mitglieder</p>
            <p style={{ fontSize: '0.875rem' }}>Laden Sie das erste Teammitglied ein</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {teamMembers.map((member) => (
              <div key={member.id} style={{
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
                      {getStatusIcon(member.status)}
                      <span style={{ fontWeight: '600', color: '#374151' }}>
                        {member.name}
                      </span>
                      <span style={{ 
                        background: getRoleColor(member.role),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {member.role}
                      </span>
                    </div>
                    
                    <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      {member.email}  {member.department}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Einfaches Einladungs-Formular */}
      {showInviteForm && (
        <div style={{ 
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginTop: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            <Mail style={{ display: 'inline', marginRight: '0.5rem' }} />
            Neues Teammitglied einladen
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Diese Funktion wird in einer zukünftigen Version verfügbar sein.
          </p>
          <button
            onClick={() => setShowInviteForm(false)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  )
}
