// Authentication Context for SomoPal
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabase.ts'

export interface Profile {
  id: string
  display_name: string
  language: 'en' | 'sw'
  exam_date: string | null
  created_at?: string
}

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  isGuest: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>
  signInAsGuest: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const GUEST_STORAGE_KEY = 'somopal_guest_user'
const PROFILE_STORAGE_KEY = 'somopal_user_profile'

function createLocalGuestUser(): { user: User; profile: Profile } {
  const existingUser = typeof window !== 'undefined' ? localStorage.getItem(GUEST_STORAGE_KEY) : null
  const existingProfile = typeof window !== 'undefined' ? localStorage.getItem(PROFILE_STORAGE_KEY) : null
  const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('somopal_lang') : null) as 'sw' | 'en' | null

  if (existingUser && existingProfile) {
    try {
      const parsedProfile = JSON.parse(existingProfile) as Profile
      if (savedLang) parsedProfile.language = savedLang
      return {
        user: JSON.parse(existingUser) as User,
        profile: parsedProfile,
      }
    } catch {
      // ignore and recreate
    }
  }

  const id = 'guest-' + (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15))
  const user = {
    id,
    app_metadata: { provider: 'anonymous' },
    user_metadata: { name: 'African Learner (Guest)', is_anonymous: true },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    is_anonymous: true,
  } as unknown as User

  const profile: Profile = {
    id,
    display_name: 'Guest Learner',
    language: savedLang || 'en',
    exam_date: null,
    created_at: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  }

  return { user, profile }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isGuest = Boolean(user?.is_anonymous || user?.id.startsWith('guest-'))

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null)
      return
    }

    // If local offline guest
    if (user.id.startsWith('guest-')) {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (stored) {
        try {
          setProfile(JSON.parse(stored) as Profile)
          return
        } catch {
          // ignore
        }
      }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!error && data) {
        setProfile(data as Profile)
      } else if (!profile) {
        const metadata = user.user_metadata as Record<string, unknown>
        const defaultProfile: Profile = {
          id: user.id,
          display_name: (metadata.full_name as string | undefined) || (metadata.name as string | undefined) || 'Learner',
          language: 'en',
          exam_date: null,
        }
        setProfile(defaultProfile)
      }
    } catch {
      // offline fallback
      if (!profile) {
        setProfile({
          id: user.id,
          display_name: 'Learner',
          language: 'en',
          exam_date: null,
        })
      }
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
        } else {
          // Check if there is an active guest session in localStorage
          const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY)
          if (storedGuest) {
            try {
              const guestUser = JSON.parse(storedGuest) as User
              setUser(guestUser)
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.warn('Error loading auth session:', err)
      } finally {
        setIsLoading(false)
      }
    }

    void initAuth()

    try {
      const supabase = getSupabaseClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user)
          localStorage.removeItem(GUEST_STORAGE_KEY)
        } else {
          const storedGuest = typeof window !== 'undefined' ? localStorage.getItem(GUEST_STORAGE_KEY) : null
          if (storedGuest) {
            try {
              setUser(JSON.parse(storedGuest) as User)
            } catch {
              setUser(null)
            }
          } else {
            setUser(null)
            setProfile(null)
          }
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch {
      return () => {}
    }
  }, [])

  useEffect(() => {
    if (user) {
      void refreshProfile()
    } else {
      setProfile(null)
    }
  }, [user?.id])

  const signInWithGoogle = async () => {
    try {
      const supabase = getSupabaseClient()
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/app` : undefined
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })
      return { error: error ? new Error(error.message) : null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signInWithMagicLink = async (email: string) => {
    try {
      const supabase = getSupabaseClient()
      const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/app` : undefined
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo,
        },
      })
      return { error: error ? new Error(error.message) : null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signInAsGuest = async () => {
    try {
      const supabase = getSupabaseClient()
      // Attempt anonymous sign in on Supabase
      const { data, error } = await supabase.auth.signInAnonymously()
      if (!error && data.user) {
        setUser(data.user)
        return { error: null }
      }
    } catch (err) {
      console.warn('Supabase anonymous sign-in unavailable, creating local guest session:', err)
    }

    // Local guest session fallback
    const { user: guestUser, profile: guestProfile } = createLocalGuestUser()
    setUser(guestUser)
    setProfile(guestProfile)
    return { error: null }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_STORAGE_KEY)
      localStorage.removeItem(PROFILE_STORAGE_KEY)
    }
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    let currentUser = user
    if (!currentUser) {
      const guest = createLocalGuestUser()
      currentUser = guest.user
      setUser(guest.user)
    }

    if (updates.language && typeof window !== 'undefined') {
      localStorage.setItem('somopal_lang', updates.language)
    }

    const updatedProfile = {
      ...(profile || { id: currentUser.id, display_name: 'Learner', language: 'en' as const, exam_date: null }),
      ...updates,
    }

    if (currentUser.id.startsWith('guest-')) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile))
      }
      setProfile(updatedProfile)
      return { error: null }
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          display_name: updatedProfile.display_name,
          language: updatedProfile.language,
          exam_date: updatedProfile.exam_date,
        })

      if (error) {
        return { error: new Error(error.message) }
      }

      setProfile(updatedProfile)
      return { error: null }
    } catch (err) {
      // fallback local update
      setProfile(updatedProfile)
      return { error: err as Error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isGuest,
        isLoading,
        signInWithGoogle,
        signInWithMagicLink,
        signInAsGuest,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
