// src/components/Header.tsx
"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Clock, BarChart3, Home, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen)
  
  const closeAllMenus = () => {
    setIsMenuOpen(false)
    setUserMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setIsMenuOpen(false)
  }

  const menuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" }
  }

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  }

  const userMenuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -10 },
    open: { opacity: 1, scale: 1, y: 0 }
  }

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={headerContentStyle}>
          {/* Logo */}
          <Link href="/" style={logoStyle} onClick={closeAllMenus}>
            <Clock style={logoIconStyle} />
            <span style={logoTextStyle}>TimeTracker Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={desktopNavStyle}>
            <Link href="/" style={navLinkStyle}>
              <Home size={20} />
              Home
            </Link>
            <Link href="/dashboard" style={navLinkStyle}>
              <BarChart3 size={20} />
              Dashboard
            </Link>
          </nav>

          {/* User Bereich */}
          <div style={userAreaStyle}>
            {user ? (
              // EINGELOGGT
              <div style={userInfoDesktopStyle}>
                <span style={welcomeTextStyle}>
                  Hallo, <strong>{user.name}</strong>! 👋
                </span>
                <div style={userMenuContainerStyle}>
                  <button onClick={toggleUserMenu} style={userMenuButtonStyle}>
                    <User size={20} />
                  </button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        variants={userMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={userDropdownStyle}
                      >
                        <div style={userDropdownHeaderStyle}>
                          <div style={userNameStyle}>{user.name}</div>
                          <div style={userEmailStyle}>{user.email}</div>
                          <div style={userRoleStyle}>
                            {user.role === 'manager' ? '👑 Manager' : '👨‍💼 Mitarbeiter'}
                          </div>
                        </div>
                        
                        <div style={dropdownDividerStyle}></div>
                        
                        <button onClick={handleLogout} style={logoutButtonStyle}>
                          <LogOut size={16} />
                          Abmelden
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              // NICHT EINGELOGGT
              <div style={authButtonsStyle}>
                <Link href="/auth/login" style={loginBtnStyle}>
                  Login
                </Link>
                <Link href="/auth/register" style={registerBtnStyle}>
                  Registrieren
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} style={mobileMenuBtnStyle}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={mobileMenuStyle}
            >
              <motion.div style={mobileMenuContentStyle}>
                {/* User Info im Mobile Menu */}
                {user && (
                  <div style={mobileUserInfoStyle}>
                    <div style={mobileUserAvatarStyle}>
                      <User size={24} />
                    </div>
                    <div style={mobileUserDetailsStyle}>
                      <div style={mobileUserNameStyle}>{user.name}</div>
                      <div style={mobileUserRoleStyle}>
                        {user.role === 'manager' ? 'Manager' : 'Mitarbeiter'}
                      </div>
                    </div>
                  </div>
                )}

                <motion.div variants={itemVariants}>
                  <Link href="/" style={mobileNavLinkStyle} onClick={closeAllMenus}>
                    <Home size={22} />
                    <span>Home</span>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/dashboard" style={mobileNavLinkStyle} onClick={closeAllMenus}>
                    <BarChart3 size={22} />
                    <span>Dashboard</span>
                  </Link>
                </motion.div>
                
                {/* Auth im Mobile Menu */}
                {user ? (
                  <motion.div variants={itemVariants}>
                    <button onClick={handleLogout} style={mobileLogoutButtonStyle}>
                      <LogOut size={22} />
                      <span>Abmelden</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div style={mobileAuthButtonsStyle} variants={itemVariants}>
                    <Link href="/auth/login" style={mobileLoginBtnStyle} onClick={closeAllMenus}>
                      Login
                    </Link>
                    <Link href="/auth/register" style={mobileRegisterBtnStyle} onClick={closeAllMenus}>
                      Registrieren
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

// CSS Styles mit JavaScript Objects
const headerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
  color: 'white',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.15)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  height: '70px'
}

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  height: '100%'
}

const headerContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%'
}

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  textDecoration: 'none'
}

const logoIconStyle: React.CSSProperties = {
  height: '32px',
  width: '32px',
  color: '#34d399'
}

const logoTextStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}

// Desktop Navigation
const desktopNavStyle: React.CSSProperties = {
  display: 'none',
  alignItems: 'center',
  gap: '1rem'
}

const navLinkStyle: React.CSSProperties = {
  color: 'white',
  fontWeight: 600,
  textDecoration: 'none',
  borderRadius: '0.5rem',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem'
}

// User Area
const userAreaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
}

// Desktop User Info
const userInfoDesktopStyle: React.CSSProperties = {
  display: 'none',
  alignItems: 'center',
  gap: '1rem'
}

const welcomeTextStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'white'
}

const userMenuContainerStyle: React.CSSProperties = {
  position: 'relative'
}

const userMenuButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}

const userDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  background: 'white',
  borderRadius: '0.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  padding: '1rem',
  minWidth: '200px',
  marginTop: '0.5rem',
  zIndex: 1001
}

const userDropdownHeaderStyle: React.CSSProperties = {
  paddingBottom: '0.75rem'
}

const userNameStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '0.25rem'
}

const userEmailStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginBottom: '0.25rem'
}

const userRoleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#059669',
  fontWeight: 600,
  background: '#f0fdf4',
  padding: '0.25rem 0.5rem',
  borderRadius: '0.375rem',
  display: 'inline-block'
}

const dropdownDividerStyle: React.CSSProperties = {
  height: '1px',
  background: '#e5e7eb',
  margin: '0.75rem 0'
}

const logoutButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'transparent',
  border: 'none',
  borderRadius: '0.5rem',
  color: '#dc2626',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '0.875rem'
}

// Auth Buttons
const authButtonsStyle: React.CSSProperties = {
  display: 'none',
  alignItems: 'center',
  gap: '0.75rem'
}

const loginBtnStyle: React.CSSProperties = {
  background: 'white',
  color: '#1e40af',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  fontSize: '0.9rem'
}

const registerBtnStyle: React.CSSProperties = {
  background: '#059669',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  textDecoration: 'none',
  border: '2px solid #60a5fa',
  transition: 'all 0.3s ease',
  fontSize: '0.9rem'
}

// Mobile Menu Button
const mobileMenuBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
}

// Mobile Menu
const mobileMenuStyle: React.CSSProperties = {
  background: '#1e3a8a',
  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
  position: 'absolute',
  left: 0,
  right: 0,
  top: '70px',
  zIndex: 1000,
  overflow: 'hidden'
}

const mobileMenuContentStyle: React.CSSProperties = {
  padding: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}

const mobileUserInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem',
  background: 'rgba(255, 255, 255, 0.1)',
  margin: '0 1rem 1rem 1rem',
  borderRadius: '0.5rem'
}

const mobileUserAvatarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  color: 'white'
}

const mobileUserDetailsStyle: React.CSSProperties = {
  flex: 1
}

const mobileUserNameStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'white',
  marginBottom: '0.25rem'
}

const mobileUserRoleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#34d399',
  fontWeight: 600
}

const mobileNavLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  color: 'white',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  borderRadius: '0.5rem',
  margin: '0 1rem',
  padding: '1rem'
}

const mobileLogoutButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  color: '#fca5a5',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  borderRadius: '0.5rem',
  margin: '0 1rem',
  padding: '1rem',
  fontSize: '1rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  width: 'calc(100% - 2rem)'
}

const mobileAuthButtonsStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '0.5rem'
}

const mobileLoginBtnStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  background: 'white',
  color: '#1e40af',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.3s ease'
}

const mobileRegisterBtnStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  background: '#059669',
  color: 'white',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  textDecoration: 'none',
  border: '2px solid #60a5fa',
  transition: 'all 0.3s ease'
}