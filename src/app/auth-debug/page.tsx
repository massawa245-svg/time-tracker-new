"use client"

import { useAuth } from '@contexts/AuthContext'

export default function AuthDebugPage() {
  const { user, isLoading } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      padding: '2rem',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}> Auth Debug</h1>
      
      {isLoading ? (
        <div style={{ color: '#94a3b8' }}>Loading auth data...</div>
      ) : user ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>✅ USER GEFUNDEN</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#60a5fa' }}>User Object:</h3>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#93c5fd' }}>user.id</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {user.id ? `"${user.id}"` : ' UNDEFINED'}
              </div>
            </div>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#86efac' }}>user._id</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {user._id ? `"${user._id}"` : ' UNDEFINED'}
              </div>
            </div>
            
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875', color: '#fcd34d' }}>user.userId</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {user.userId ? `"${user.userId}"` : ' UNDEFINED'}
              </div>
            </div>
            
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#c4b5fd' }}>Keys im Objekt</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {Object.keys(user).join(', ')}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem' }}>
            <h3 style={{ color: '#fca5a5' }}>🎯 Empfohlener ID Feldname:</h3>
            <code style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {user._id ? '_id' : user.userId ? 'userId' : user.id ? 'id' : 'KEINE ID GEFUNDEN!'}
            </code>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(239, 68, 68, 0.5)'
        }}>
          <h2 style={{ color: '#fca5a5' }}>❌ KEIN USER GEFUNDEN</h2>
          <p>Nicht eingeloggt oder AuthContext funktioniert nicht.</p>
        </div>
      )}
      
      <div style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
        <p>📋 Debug Info: Diese Seite zeigt die tatsächliche User-Objekt Struktur.</p>
      </div>
    </div>
  )
}
