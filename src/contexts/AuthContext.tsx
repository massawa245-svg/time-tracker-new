'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// User Interface - Angepasst an dein erweitertes User Model
interface User {
  id: string
  name: string
  email: string
  role: 'employee' | 'manager' | 'admin'
  department?: string
  position?: string
  avatar?: string
  timezone?: string
  isActive?: boolean
  lastLogin?: Date
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isManager: boolean
  isAdmin: boolean
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Beim Start: Auth Status prüfen
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    setIsLoading(true)
    try {
      // Fallback: Aus localStorage laden
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // User Daten aktualisieren
  const refreshUser = async () => {
    try {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      console.log(' Using mock login (development mode)')
      // Mock Login verwenden
      return await mockLogin(email, password)
    } catch (error) {
      console.error('Login error:', error)
      // Fallback zu Mock-Login
      return await mockLogin(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock Login für Entwicklung
  const mockLogin = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email && password) {
      const emailLower = email.toLowerCase()
      let role: 'employee' | 'manager' | 'admin' = 'employee'
      let name = 'Demo User'
      let department = 'Development'
      let position = 'Software Engineer'
      
      // Rollen-Erkennung erweitert
      if (emailLower.includes('admin') || emailLower.includes('administrator')) {
        role = 'admin'
        name = 'Admin User'
        department = 'IT'
        position = 'System Administrator'
      } else if (
        emailLower.includes('manager') || 
        emailLower.includes('chef') || 
        emailLower.includes('teamleiter') ||
        emailLower.includes('leitung') ||
        emailLower.includes('lead') ||
        emailLower.includes('david')
      ) {
        role = 'manager'
        name = 'Demo Manager'
        department = 'Operations'
        position = 'Teamleiter'
      } else if (emailLower.includes('hr') || emailLower.includes('personal')) {
        department = 'Human Resources'
        position = 'HR Manager'
      }
      
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        role: role,
        department: department,
        position: position,
        timezone: 'Europe/Berlin',
        isActive: true,
        lastLogin: new Date()
      }
      
      setUser(mockUser)
      localStorage.setItem('currentUser', JSON.stringify(mockUser))
      
      console.log(' Mock login successful:', mockUser)
      return true
    }
    
    return false
  }

  const logout = async () => {
    try {
      // Lokal ausloggen
      setUser(null)
      localStorage.removeItem('currentUser')
      sessionStorage.removeItem('currentUser')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // ERWEITERTE Rollen-Prüfungen
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const isAdmin = user?.role === 'admin'
  
  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  // Berechtigungs-Prüfung für komplexere Szenarien
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    // Permission Mapping basierend auf Rolle
    const permissions: { [key: string]: string[] } = {
      employee: [
        'view_schedule', 
        'track_time', 
        'view_own_data',
        'edit_own_profile'
      ],
      manager: [
        'view_schedule', 
        'track_time', 
        'view_own_data',
        'edit_own_profile',
        'manage_schedule', 
        'view_team_data', 
        'approve_requests',
        'export_reports'
      ],
      admin: [
        'view_schedule', 
        'track_time', 
        'view_own_data',
        'edit_own_profile',
        'manage_schedule', 
        'view_team_data', 
        'approve_requests',
        'export_reports',
        'manage_users', 
        'system_settings',
        'view_analytics',
        'manage_departments'
      ]
    }
    
    const userPermissions = permissions[user.role] || []
    return userPermissions.includes(permission)
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isManager,
    isAdmin,
    hasRole,
    hasPermission,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
