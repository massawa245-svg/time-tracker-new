import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>TimeTracker Pro</h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>Professional Time Tracking Application</p>        
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            href="/auth/login"
            style={{
              display: 'block',
              width: '100%',
              background: '#2563eb',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
          >
            Zum Login
          </Link>

          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '1rem'
          }}>
            <p>Demo Accounts:</p>
            <p>demo@company.com / demo123</p>
            <p>manager@company.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
