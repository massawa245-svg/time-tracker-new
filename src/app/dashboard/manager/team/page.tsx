"use client"

import { useState, useEffect } from 'react'
import { Users, UserPlus, Mail, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'

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
  const [loading, setLoading] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)

  useEffect(() => {
    if (user && (user.role === 'manager' || user.role === 'admin')) {
      const mockData = [
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
      ]
      setTeamMembers(mockData)
      setLoading(false)
    }
  }, [user])

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
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Lade Team-Mitglieder...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.headerTitle}>Team Management</h1>
            <p style={styles.headerSubtitle}>
              Verwalten Sie Ihr Team und laden Sie neue Mitglieder ein
            </p>
          </div>
          
          <button
            onClick={() => setShowInviteForm(true)}
            style={styles.inviteButton}
          >
            <UserPlus size={20} />
            Mitglied einladen
          </button>
        </div>
        
        {user && (
          <p style={styles.userInfo}>
            Angemeldet als: {user.name} ({user.role})
          </p>
        )}
      </div>

      {/* Team Mitglieder Liste */}
      <div style={styles.teamList}>
        <h2 style={styles.teamListTitle}>
          <Users size={20} />
          Team Mitglieder ({teamMembers.length})
        </h2>

        {teamMembers.length === 0 ? (
          <div style={styles.emptyState}>
            <Users style={styles.emptyIcon} />
            <p>Noch keine Team-Mitglieder</p>
            <p style={styles.emptyText}>Laden Sie das erste Teammitglied ein</p>
          </div>
        ) : (
          <div style={styles.membersList}>
            {teamMembers.map((member) => (
              <div key={member.id} style={styles.memberCard}>
                <div style={styles.memberInfo}>
                  <div style={styles.memberTop}>
                    {getStatusIcon(member.status)}
                    <span style={styles.memberName}>
                      {member.name}
                    </span>
                    <span style={{
                      ...styles.roleBadge,
                      backgroundColor: getRoleColor(member.role)
                    }}>
                      {member.role}
                    </span>
                  </div>
                  
                  <div style={styles.memberDetails}>
                    {member.email}  {member.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Einfaches Einladungs-Formular */}
      {showInviteForm && (
        <div style={styles.inviteForm}>
          <h3 style={styles.inviteFormTitle}>
            <Mail size={18} />
            Neues Teammitglied einladen
          </h3>
          <p style={styles.inviteFormText}>
            Diese Funktion wird in einer zukünftigen Version verfügbar sein.
          </p>
          <button
            onClick={() => setShowInviteForm(false)}
            style={styles.closeButton}
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  )
}

// ⭐ ALL STYLES AS JAVASCRIPT OBJECTS
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '2rem 1rem'
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem'
  },
  
  spinner: {
    width: '3rem',
    height: '3rem',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  
  header: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '2rem'
  },
  
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  
  headerTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  
  headerSubtitle: {
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  
  inviteButton: {
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
  },
  
  userInfo: {
    color: '#059669',
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  
  teamList: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  
  teamListTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280'
  },
  
  emptyIcon: {
    width: '3rem',
    height: '3rem',
    color: '#9ca3af',
    margin: '0 auto 1rem auto'
  },
  
  emptyText: {
    fontSize: '0.875rem'
  },
  
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  memberCard: {
    background: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  
  memberInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  
  memberTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  memberName: {
    fontWeight: '600',
    color: '#374151'
  },
  
  roleBadge: {
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  
  memberDetails: {
    color: '#6b7280'
  },
  
  inviteForm: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    marginTop: '2rem'
  },
  
  inviteFormTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  inviteFormText: {
    color: '#6b7280',
    marginBottom: '1.5rem'
  },
  
  closeButton: {
    padding: '0.75rem 1.5rem',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  }
}
