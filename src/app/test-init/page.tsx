'use client'
import { useState } from 'react'

export default function TestInit() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const initSchedules = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/work-schedule/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '65a1b2c3d4e5f67890123456'
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

  return (
    <div style={{ padding: '2rem' }}>
      <h1>WorkSchedule Initialisierung</h1>
      <button 
        onClick={initSchedules}
        disabled={loading}
        style={{ 
          padding: '1rem 2rem', 
          background: '#2563eb', 
          color: 'white', 
          border: 'none', 
          borderRadius: '0.5rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Initialisiere...' : 'WorkSchedules erstellen'}
      </button>
      
      {result && (
        <pre style={{ marginTop: '2rem', background: '#f3f4f6', padding: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}