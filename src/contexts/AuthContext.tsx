import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { User, UserRole } from '@/types'
import { mockUsers } from '@/data/mockData'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  logout: () => void
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_KEY = 'drms_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        // ignore
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, _password: string, remember = false) => {
    setIsLoading(true)
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1000))

    // Mock authentication: any password works, role determined by email
    let loggedInUser: User
    if (email.toLowerCase().includes('teacher')) {
      loggedInUser = mockUsers.teacher
    } else {
      loggedInUser = mockUsers.admin
    }

    const store = remember ? localStorage : sessionStorage
    store.setItem(SESSION_KEY, JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
