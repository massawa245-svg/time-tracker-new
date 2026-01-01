// Manager Dashboard with INLINE STYLES - Always works!
export default function ManagerDashboard() {
  return (
    <div style={styles.container}>
      {/* Alert Box */}
      <div style={styles.alertBox}>
        <h1 style={styles.alertTitle}> Inline Styles Manager Dashboard</h1>
        <p style={styles.alertText}>This page uses inline styles - works without any dependencies!</p>
      </div>
      
      {/* Header */}
      <div>
        <h1 style={styles.title}>Manager Dashboard</h1>
        <p style={styles.subtitle}>Welcome to management tools</p>
      </div>
      
      {/* Cards Grid */}
      <div style={styles.cardsGrid}>
        
        {/* Team Card */}
        <a href="/dashboard/manager/team" style={styles.card}>
          <div style={styles.cardContent}>
            <div style={{...styles.cardIcon, ...styles.iconTeam}}>👥</div>
            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>Team Management</h3>
              <p style={styles.cardDescription}>View and manage team members</p>
            </div>
          </div>
        </a>
        
        {/* Schedule Card */}
        <a href="/dashboard/manager/schedule" style={styles.card}>
          <div style={styles.cardContent}>
            <div style={{...styles.cardIcon, ...styles.iconSchedule}}></div>
            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>Schedule Planning</h3>
              <p style={styles.cardDescription}>Create and manage schedules</p>
            </div>
          </div>
        </a>
        
        {/* Timesheets Card */}
        <a href="/dashboard/manager/timesheets" style={styles.card}>
          <div style={styles.cardContent}>
            <div style={{...styles.cardIcon, ...styles.iconTimesheets}}></div>
            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>Timesheets</h3>
              <p style={styles.cardDescription}>Review and approve timesheets</p>
            </div>
          </div>
        </a>
        
        {/* Vacation Card */}
        <a href="/dashboard/manager/vacation-requests" style={styles.card}>
          <div style={styles.cardContent}>
            <div style={{...styles.cardIcon, ...styles.iconVacation}}>🏖️</div>
            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>Vacation Requests</h3>
              <p style={styles.cardDescription}>Manage vacation and time off</p>
            </div>
          </div>
        </a>
      </div>
      
      {/* Performance Info */}
      <div style={styles.performanceBox}>
        <p style={styles.performanceTitle}> This page loads instantly!</p>
        <small style={styles.performanceText}>Inline styles work without CSS dependencies</small>
      </div>
      
      {/* CSS Test */}
      <div style={styles.cssTest}>
        <h3 style={styles.cssTestTitle}> Inline Styles Test</h3>
        <p style={styles.cssTestText}>If you see colors and gradients, inline styles are working!</p>
        
        <div style={styles.glassCards}>
          <div style={styles.glassCard}>Card 1</div>
          <div style={styles.glassCard}>Card 2</div>
          <div style={styles.glassCard}>Card 3</div>
        </div>
      </div>
    </div>
  )
}

//  ALL STYLES AS JAVASCRIPT OBJECTS - NO CSS FILES NEEDED!
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '2rem 1rem',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  
  alertBox: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '1.5rem'
  },
  
  alertTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: '0.5rem'
  },
  
  alertText: {
    color: '#b45309'
  },
  
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  
  subtitle: {
    color: '#6b7280',
    marginBottom: '1.5rem'
  },
  
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  
  card: {
    display: 'block',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },
  
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  cardIcon: {
    width: '3rem',
    height: '3rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: '0'
  },
  
  iconTeam: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8'
  },
  
  iconSchedule: {
    backgroundColor: '#dcfce7',
    color: '#059669'
  },
  
  iconTimesheets: {
    backgroundColor: '#f3e8ff',
    color: '#7c3aed'
  },
  
  iconVacation: {
    backgroundColor: '#ffedd5',
    color: '#ea580c'
  },
  
  cardText: {
    flex: '1'
  },
  
  cardTitle: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.25rem',
    fontSize: '1.125rem'
  },
  
  cardDescription: {
    color: '#6b7280',
    fontSize: '0.875rem',
    lineHeight: '1.4'
  },
  
  performanceBox: {
    backgroundColor: '#d1fae5',
    border: '1px solid #10b981',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginTop: '2rem'
  },
  
  performanceTitle: {
    color: '#065f46',
    fontWeight: '500',
    marginBottom: '0.25rem'
  },
  
  performanceText: {
    color: '#047857',
    fontSize: '0.875rem'
  },
  
  cssTest: {
    marginTop: '2rem',
    background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
    borderRadius: '1rem',
    padding: '1.5rem',
    color: 'white'
  },
  
  cssTestTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  
  cssTestText: {
    opacity: '0.9',
    marginBottom: '1rem'
  },
  
  glassCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem'
  },
  
  glassCard: {
    padding: '1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '0.5rem',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    fontWeight: '500'
  }
}

// Add hover effects with JavaScript
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const cards = document.querySelectorAll('[style*="cardsGrid"] a');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        this.style.transform = 'translateY(-2px)';
        this.style.borderColor = '#3b82f6';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        this.style.transform = 'translateY(0)';
        this.style.borderColor = '#e5e7eb';
      });
    });
  }, 100);
}
