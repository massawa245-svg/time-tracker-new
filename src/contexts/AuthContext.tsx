"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  _id?: string
  userId?: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Beim ersten Laden: User aus localStorage holen
  useEffect(() => {
    console.log(' AuthProvider initializing...')
    
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        console.log(' Found user in localStorage:', storedUser)
        setUser(JSON.parse(storedUser))
      } else {
        console.log('ℹ No user in localStorage')
      }
    } catch (error) {
      console.error(' Error loading user from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // User in localStorage speichern wenn sich ändert
  useEffect(() => {
    if (user) {
      console.log(' Saving user to localStorage:', user)
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      console.log(' Removing user from localStorage')
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log(' Attempting login for:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      console.log(' Login successful, user data:', data.user)
      
      // WICHTIG: Stelle sicher dass alle nötigen Felder vorhanden sind
      const userData: User = {
        id: data.user._id || data.user.id || data.user.userId || data.user.email,
        _id: data.user._id,
        userId: data.user.userId || data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      }
      
      console.log('👤 Processed user data:', userData)
      setUser(userData)
      
      // Auch in localStorage speichern
      localStorage.setItem('user', JSON.stringify(userData))
      
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 Logging out user:', user?.email)
    setUser(null)
    localStorage.removeItem('user')
  }

  // Manuelle User Setzung (für Debugging)
  const manualSetUser = (userData: User | null) => {
    console.log('🔧 Manually setting user:', userData)
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      setUser: manualSetUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    console.error('❌ useAuth must be used within an AuthProvider')
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
