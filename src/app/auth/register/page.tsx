"use client";

import React, { useState } from "react";
import { Eye, EyeOff, UserPlus, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Bitte geben Sie Ihren vollständigen Namen ein");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("Bitte geben Sie Ihre E-Mail Adresse ein");
      return false;
    }
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError("Bitte geben Sie eine gültige E-Mail Adresse ein");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log("🔄 Sende Registrierungsdaten...");
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("📨 Registrierungs-Response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Registrierung fehlgeschlagen');
      }

      if (data.success) {
        console.log("✅ Registrierung erfolgreich, leite zum Dashboard...");
        
        // User in localStorage speichern
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Zum Dashboard weiterleiten
        router.push('/dashboard');
        
      } else {
        throw new Error(data.message || 'Registrierung fehlgeschlagen');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registrierung fehlgeschlagen';
      console.error("❌ Registrierungsfehler:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <Link href="/" className="back">
            <Clock size={16} /> Zurück zur Startseite
          </Link>

          <div className="logo">
            <Clock size={32} color="#2563eb" />
            <span>TimeTracker Pro</span>
          </div>

          <h1>Konto erstellen</h1>
          <p>Registrieren Sie sich für ein neues Konto</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label className="label">Vollständiger Name</label>
            <input
              name="name"
              placeholder="Max Mustermann"
              value={formData.name}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">E-Mail Adresse</label>
            <input
              name="email"
              placeholder="ihre.email@company.com"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Passwort</label>
            <div className="password-container">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mindestens 6 Zeichen"
                value={formData.password}
                onChange={handleChange}
                className="input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="label">Passwort bestätigen</label>
            <div className="password-container">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Passwort wiederholen"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Wird registriert...
              </>
            ) : (
              <>
                <UserPlus size={18} /> 
                Konto erstellen
              </>
            )}
          </button>
        </form>

        <div className="footer">
          <p>
            Bereits ein Konto?{" "}
            <Link href="/auth/login" className="login-link">
              Zur Anmeldung
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #eff6ff, #f0fdf4);
          padding: 20px;
          font-family: system-ui, sans-serif;
        }

        .card {
          width: 100%;
          max-width: 440px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          margin: 0 auto;
        }

        .header {
          padding: 32px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          text-decoration: none;
          margin-bottom: 16px;
        }

        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: #1f2937;
        }

        .header p {
          color: #6b7280;
          margin-top: 4px;
        }

        .form {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
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

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s;
          box-sizing: border-box;
          text-align: left;
        }

        .input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
        }

        .input::placeholder {
          color: #9ca3af;
          text-align: left;
        }

        .password-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
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
          background: #2563eb;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .submit-button:hover:not(:disabled) {
          background: #1e40af;
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.loading {
          background: #93c5fd;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .footer {
          padding: 24px 32px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          background: #fafafa;
        }

        .footer p {
          color: #6b7280;
          margin: 0;
          font-size: 15px;
        }

        .login-link {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
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

        @media (max-width: 480px) {
          .card {
            border-radius: 16px;
          }
          
          .header {
            padding: 24px;
          }
          
          .form {
            padding: 24px;
          }
          
          .footer {
            padding: 20px 24px;
          }
        }
      `}</style>
    </div>
  );
}