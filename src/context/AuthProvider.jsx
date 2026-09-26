import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { supabase } from '../lib/supabase'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Fetch active session on initial load
    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('[Auth] Error getting initial session:', error.message)
        }
        if (isMounted) {
          setSession(data?.session ?? null)
          setUser(data?.session?.user ?? null)
        }
      } catch (err) {
        console.error('[Auth] Unexpected error during session initialization:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED, USER_UPDATED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Sign up new user with student role default and user metadata
  const signUp = async ({ fullName, email, password }) => {
    const trimmedEmail = email?.trim()
    const trimmedName = fullName?.trim()

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
          role: 'student',
        },
      },
    })

    if (error) {
      return { data: null, error }
    }

    // Check for existing user when email confirmation is enabled (identities array is empty)
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        data: null,
        error: new Error('An account with this email already exists. Please log in instead.'),
      }
    }

    return { data, error: null }
  }

  // Sign in existing user with email and password
  const signIn = async ({ email, password }) => {
    const trimmedEmail = email?.trim()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    return { data, error }
  }

  // Sign in with Google OAuth using the official Supabase flow
  const signInWithGoogle = async () => {
    try {
      sessionStorage.setItem('supabase_oauth_pending', 'true')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })

      if (error) {
        sessionStorage.removeItem('supabase_oauth_pending')
      }

      return { data, error }
    } catch (err) {
      sessionStorage.removeItem('supabase_oauth_pending')
      return { data: null, error: err }
    }
  }

  // Sign out user and clear session
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setSession(null)
      setUser(null)
    }
    return { error }
  }

  const role = user?.user_metadata?.role || (user ? 'student' : null)
  const isAdmin = role === 'admin'

  const value = {
    user,
    session,
    loading,
    role,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
