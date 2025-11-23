"use client"
import { useState } from 'react'

const MOCK_USER_ID = '65a1b2c3d4e5f67890123456'

export default function TestSimple() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const createSimplePlan = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/weekly-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: MOCK_USER_ID,
          weeklyPlan: {
            monday: { start: '07:00', end: '16:00', pause: 45, hours: 8.25, enabled: true },
            tuesday: { start: '07:00', end: '16:00', pause: 45, hours: 8.25, enabled: true },
            wednesday: { start: '07:00', end: '16:00', pause: 45, hours: 8.25, enabled: true },
            thursday: { start: '07:00', end: '16:00', pause: 45, hours: 8.25, enabled: true },
            friday: { start: '07:00', end: '16:00', pause: 45, hours: 8.25, enabled: true },
            saturday: { start: '00:00', end: '00:00', pause: 0, hours: 0, enabled: false },
            sunday: { start: '00:00', end: '00:00', pause: 0, hours: 0, enabled: false }
          }
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const checkPlan = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/weekly-plan')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Simple Weekly Plan Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={createSimplePlan} 
          disabled={loading}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          Create Test Plan
        </button>
        
        <button 
          onClick={checkPlan} 
          disabled={loading}
          style={{ padding: '0.5rem 1rem' }}
        >
          Check Plan
        </button>
      </div>

      {result && (
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      <div style={{ marginTop: '2rem' }}>
        <a href="/dashboard/schedule" style={{ color: 'blue' }}>
          ➡️ Go to Schedule Page
        </a>
      </div>
    </div>
  )
}