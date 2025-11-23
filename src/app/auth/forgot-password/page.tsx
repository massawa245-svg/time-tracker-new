"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Clock, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email) {
      setError('Bitte gib deine E-Mail Adresse ein')
      setLoading(false)
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Bitte gib eine gültige E-Mail Adresse ein')
      setLoading(false)
      return
    }

    try {
      // Simuliere API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Erfolgreiche Simulation
      setSuccess(true)
      
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
          <Link href="/auth/login" className="back-link">
            <ArrowLeft size={16} />
            Zurück zum Login
          </Link>

          <div className="logo">
            <Clock size={32} color="#0b9b50" />
            <span className="title">TimeTracker Pro</span>
          </div>

          <div className="success-content">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">E-Mail gesendet!</h2>
            <p className="success-message">
              Falls ein Konto mit der E-Mail <strong>{email}</strong> existiert, wurde ein Reset-Link gesendet.
            </p>
            <p className="success-note">
              Bitte überprüfe deinen Posteingang und den Spam-Ordner.
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
            margin-bottom: 8px;
            line-height: 1.5;
          }

          .success-note {
            color: #888;
            font-size: 14px;
            margin-bottom: 24px;
          }

          .success-indicator {
            width: 48px;
            height: 4px;
            background: #0b9b50;
            border-radius: 2px;
            margin: 0 auto;
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
          <h1 className="main-title">Passwort vergessen</h1>
          <p className="description">Gib deine E-Mail Adresse ein um einen Reset-Link zu erhalten</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email" className="label">
              E-Mail Adresse
            </label>
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                className="input"
                placeholder="deine.email@company.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Link wird gesendet...
              </>
            ) : (
              'Reset-Link senden'
            )}
          </button>
        </form>

        <div className="footer">
          <p className="footer-text">
            Du erhältst einen Link zum Zurücksetzen deines Passworts.
            Der Link ist 1 Stunde gültig.
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
          width: 24px;
          height: 24px;
          z-index: 1;
        }

        .input {
          width: 100%;
          padding: 16px 16px 16px 52px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
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
          line-height: 1.5;
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
            width: 22px;
            height: 22px;
          }
          
          .input {
            padding: 14px 14px 14px 48px;
          }
        }
      `}</style>
    </div>
  )
}