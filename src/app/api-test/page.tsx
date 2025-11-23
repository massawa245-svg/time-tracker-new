'use client'
import { useState } from 'react'

export default function ApiTest() {
  const [testResults, setTestResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testApi = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true)
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(`/api/${endpoint}`, options)
      const data = await response.json()

      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          success: response.ok,
          data: data
        }
      }))

      return data
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'ERROR',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  // Test Data
  const testUserId = '65a1b2c3d4e5f67890123456' // Mock User ID
  const testProjectId = '65a1b2c3d4e5f67890123457' // Mock Project ID

  const runAllTests = async () => {
    setTestResults({})
    
    // Test Timer API
    await testApi('timer', 'GET', { userId: testUserId })
    
    // Test Overtime API
    await testApi('overtime', 'GET', { userId: testUserId })
    
    // Test Vacation API
    await testApi('vacation', 'GET', { userId: testUserId })
  }

  const testTimerStart = async () => {
    await testApi('timer', 'POST', {
      userId: testUserId,
      projectId: testProjectId,
      description: 'Test Timer - API Testing'
    })
  }

  const testOvertimeCreate = async () => {
    await testApi('overtime', 'POST', {
      userId: testUserId,
      date: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '20:00',
      type: 'regular',
      project: 'API Test Project',
      description: 'Test overtime entry from API test'
    })
  }

  const testVacationCreate = async () => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 5)

    await testApi('vacation', 'POST', {
      userId: testUserId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      type: 'vacation',
      reason: 'Test vacation request from API test',
      notes: 'This is a test request'
    })
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '2rem' }}>API Test Client</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={runAllTests}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '1rem'
          }}
        >
          {loading ? 'Testing...' : 'Run All Tests'}
        </button>

        <button 
          onClick={testTimerStart}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '0.5rem'
          }}
        >
          Test Timer Start
        </button>

        <button 
          onClick={testOvertimeCreate}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '0.5rem'
          }}
        >
          Test Overtime
        </button>

        <button 
          onClick={testVacationCreate}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Vacation
        </button>
      </div>

      {/* Results Display */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {Object.entries(testResults).map(([endpoint, result]: [string, any]) => (
          <div 
            key={endpoint}
            style={{
              padding: '1rem',
              border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`,
              borderRadius: '0.5rem',
              background: result.success ? '#f0fdf4' : '#fef2f2'
            }}
          >
            <h3 style={{ 
              color: result.success ? '#059669' : '#dc2626',
              margin: '0 0 0.5rem 0'
            }}>
              {endpoint} - {result.success ? 'SUCCESS' : 'FAILED'}
            </h3>
            <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
              <strong>Status:</strong> {result.status}
            </p>
            {result.error ? (
              <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#dc2626' }}>
                <strong>Error:</strong> {result.error}
              </p>
            ) : (
              <pre style={{ 
                background: 'white', 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                overflow: 'auto'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* API Documentation */}
      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
        <h2>API Endpoints Overview</h2>
        
        <h3>Timer API (/api/timer)</h3>
        <ul>
          <li><strong>GET</strong> - Get running timer and today's entries</li>
          <li><strong>POST</strong> - Start new timer</li>
          <li><strong>PUT</strong> - Stop running timer</li>
        </ul>

        <h3>Overtime API (/api/overtime)</h3>
        <ul>
          <li><strong>GET</strong> - Get overtime entries</li>
          <li><strong>POST</strong> - Create new overtime entry</li>
        </ul>

        <h3>Vacation API (/api/vacation)</h3>
        <ul>
          <li><strong>GET</strong> - Get vacation requests</li>
          <li><strong>POST</strong> - Create new vacation request</li>
        </ul>

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '0.25rem' }}>
          <strong>Note:</strong> The APIs require a valid userId. Currently using mock ID for testing.
        </div>
      </div>
    </div>
  )
}