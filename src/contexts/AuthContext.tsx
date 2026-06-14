import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { User, UserRole } from '@/types'
import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile from database based on auth UID
  const fetchProfile = useCallback(async (userId: string, email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error.message)
        return null
      }

      return data as User
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      return null
    }
  }, [])

  // Listen for auth state changes on mount
  useEffect(() => {
    let active = true

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      if (session) {
        fetchProfile(session.user.id, session.user.email || '').then((profile) => {
          if (active && profile) {
            setUser(profile)
          }
          setIsLoading(false)
        })
      } else {
        setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true)
        const profile = await fetchProfile(session.user.id, session.user.email || '')
        if (active && profile) {
          setUser(profile)
        }
        setIsLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setIsLoading(false)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setIsLoading(false)
      throw error
    }
    setUser(null)
    setIsLoading(false)
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
