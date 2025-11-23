'use client'
import { useState, useEffect } from 'react'
import { Play, Square, Clock, BarChart3, Calendar, Settings, LogOut, Plus, Pause, TrendingUp, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [activeProject, setActiveProject] = useState('')
  const [description, setDescription] = useState('')

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (!activeProject || !description) {
      alert('Bitte wähle ein Projekt und gib eine Beschreibung ein')
      return
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = () => {
    setIsRunning(false)
    console.log('Time entry saved:', { time, activeProject, description })
    setTime(0)
    setDescription('')
  }

  // Feature Boxes Data
  const featureBoxes = [
    {
      title: 'Timer Starten',
      description: 'Beginne mit der Zeiterfassung',
      icon: Play,
      href: '#timer',
      color: '#059669',
      bgColor: '#f0fdf4'
    },
    {
      title: 'Überstunden',
      description: 'Überstunden erfassen und verwalten',
      icon: TrendingUp,
      href: '/dashboard/overtime',
      color: '#2563eb',
      bgColor: '#eff6ff'
    },
    {
      title: 'Urlaub',
      description: 'Urlaubsanträge stellen',
      icon: Calendar,
      href: '/dashboard/vacation',
      color: '#dc2626',
      bgColor: '#fef2f2'
    },
    {
      title: 'Projekte',
      description: 'Projekte verwalten',
      icon: Briefcase,
      href: '/dashboard/projects',
      color: '#7c3aed',
      bgColor: '#faf5ff'
    },
    {
      title: 'Analytics',
      description: 'Reports und Statistiken',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: '#ea580c',
      bgColor: '#fff7ed'
    },
    {
      title: 'Einstellungen',
      description: 'App-Einstellungen',
      icon: Settings,
      href: '/dashboard/settings',
      color: '#6b7280',
      bgColor: '#f9fafb'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>
                TimeTracker Pro
              </span>
            </div>
            
            <nav style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem' 
            }}>
              <Link href="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                <Clock style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Dashboard</span>
              </Link>
              <Link href="/dashboard/overtime" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6b7280',
                textDecoration: 'none'
              }}>
                <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Überstunden</span>
              </Link>
              <Link href="/dashboard/vacation" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6b7280',
                textDecoration: 'none'
              }}>
                <Calendar style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Urlaub</span>
              </Link>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280' 
              }}>
                Welcome back!
              </span>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer'
              }}>
                <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Welcome Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Willkommen zurück!
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280'
          }}>
            Wähle eine Funktion aus um zu beginnen
          </p>
        </div>

        {/* Feature Boxes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {featureBoxes.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Link 
                key={index}
                href={feature.href}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{
                  background: feature.bgColor,
                  border: `2px solid ${feature.color}20`,
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.background = `${feature.bgColor}dd`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = feature.bgColor
                }}
                >
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    background: feature.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <IconComponent style={{ 
                      width: '2rem', 
                      height: '2rem', 
                      color: 'white' 
                    }} />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Timer Section */}
        <div id="timer" style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginTop: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Time Tracker
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            Track your work hours efficiently
          </p>

          {/* Timer Display */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '3.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              {formatTime(time)}
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: isRunning ? '#059669' : '#6b7280'
            }}>
              {isRunning ? 'Tracking time...' : 'Timer stopped'}
            </div>
          </div>

          {/* Project Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Project
              </label>
              <select
                value={activeProject}
                onChange={(e) => setActiveProject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  background: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select a project</option>
                <option value="project1">Web Development</option>
                <option value="project2">Mobile App</option>
                <option value="project3">Client Meeting</option>
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
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
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

            {/* Timer Controls */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              {!isRunning ? (
                <button
                  onClick={handleStart}
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
                    cursor: 'pointer',
                    flex: '1',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#047857'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#059669'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Play style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Start Timer</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePause}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: '#d97706',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: '1',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#b45309'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#d97706'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <Pause style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>Pause</span>
                  </button>
                  <button
                    onClick={handleStop}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: '#dc2626',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: '1',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#b91c1c'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#dc2626'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <Square style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>Stop</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}