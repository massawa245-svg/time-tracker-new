"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Eye, EyeOff, Clock, CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Ungültiger Reset-Link. Bitte fordere einen neuen Passwort-Reset an.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!token) {
      setError('Ungültiger Reset-Token')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein')
      setLoading(false)
      return
    }

    try {
      // Simuliere API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Erfolgreiche Simulation
      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login?message=Passwort erfolgreich zurückgesetzt! Bitte mit dem neuen Passwort anmelden.')
      }, 3000)
      
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="wrapper">
        <div className="card">
          <div className="logo">
            <Clock size={32} color="#0b9b50" />
            <span className="title">TimeTracker Pro</span>
          </div>

          <div className="success-content">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">Passwort zurückgesetzt!</h2>
            <p className="success-message">
              Dein Passwort wurde erfolgreich zurückgesetzt. 
              Du wirst in Kürze zum Login weitergeleitet...
            </p>
            <div className="success-indicator"></div>
          </div>
        </div>

        <style jsx>{`
          .wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f3f5f7 0%, #e8f5e8 100%);
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
          }

          .card {
            background: white;
            padding: 40px;
            width: 100%;
            max-width: 440px;
            border-radius: 16px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            text-align: center;
            border: 1px solid #e0e0e0;
          }

          .logo {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
          }

          .title {
            font-size: 26px;
            font-weight: bold;
            color: #1a1a1a;
          }

          .success-content {
            padding: 20px 0;
          }

          .success-icon {
            width: 64px;
            height: 64px;
            color: #0b9b50;
            margin: 0 auto 16px auto;
          }

          .success-title {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 12px;
          }

          .success-message {
            color: #666;
            margin-bottom: 24px;
            line-height: 1.5;
          }

          .success-indicator {
            width: 48px;
            height: 4px;
            background: #0b9b50;
            border-radius: 2px;
            margin: 0 auto;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="wrapper">
      <div className="card">
        <Link href="/auth/login" className="back-link">
          <ArrowLeft size={16} />
          Zurück zum Login
        </Link>

        <div className="logo">
          <Clock size={32} color="#0b9b50" />
          <span className="title">TimeTracker Pro</span>
        </div>

        <div className="header">
          <h1 className="main-title">Neues Passwort setzen</h1>
          <p className="description">Gib dein neues Passwort unten ein</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="password" className="label">
              Neues Passwort
            </label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value})
                  if (error) setError('')
                }}
                className="input"
                placeholder="Mindestens 6 Zeichen"
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="label">
              Passwort bestätigen
            </label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({...formData, confirmPassword: e.target.value})
                  if (error) setError('')
                }}
                className="input"
                placeholder="Passwort wiederholen"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className={`submit-button ${loading ? 'loading' : ''} ${!token ? 'disabled' : ''}`}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Passwort wird zurückgesetzt...
              </>
            ) : (
              'Passwort zurücksetzen'
            )}
          </button>
        </form>

        <div className="footer">
          <p className="footer-text">
            Neuen Reset-Link benötigt?{' '}
            <Link href="/auth/forgot-password" className="footer-link">
              Erneut anfordern
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f5f7 0%, #e8f5e8 100%);
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .card {
          background: white;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          text-align: center;
          border: 1px solid #e0e0e0;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #333;
        }

        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .title {
          font-size: 26px;
          font-weight: bold;
          color: #1a1a1a;
        }

        .header {
          margin-bottom: 32px;
        }

        .main-title {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .description {
          color: #666;
          margin: 0;
          font-size: 15px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #fecaca;
          text-align: left;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          text-align: left;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #9ca3af;
          width: 20px;
          height: 20px;
          z-index: 1;
        }

        .input {
          width: 100%;
          padding: 14px 52px 14px 48px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.2s;
          box-sizing: border-box;
          text-align: left;
          font-family: inherit;
        }

        .input:focus {
          outline: none;
          border-color: #0b9b50;
          box-shadow: 0 0 0 3px rgba(11, 155, 80, 0.1);
        }

        .input::placeholder {
          color: #9ca3af;
          text-align: left;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #374151;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          background: #0b9b50;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          font-family: inherit;
        }

        .submit-button:hover:not(:disabled) {
          background: #0a8644;
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.disabled {
          background: #9ca3af;
        }

        .submit-button.loading {
          background: #4ade80;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
        }

        .footer-text {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .footer-link {
          color: #0b9b50;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #0a8644;
          text-decoration: underline;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .card {
            padding: 32px 24px;
            border-radius: 12px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .title {
            font-size: 24px;
          }
          
          .main-title {
            font-size: 22px;
          }
          
          .input-icon {
            left: 14px;
            width: 18px;
            height: 18px;
          }
          
          .input {
            padding: 14px 48px 14px 44px;
          }
          
          .password-toggle {
            right: 14px;
          }
        }
      `}</style>
    </div>
  )
}