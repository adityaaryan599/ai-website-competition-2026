import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function GoogleSignInButton({
  label = 'Continue with Google',
  onError,
  disabled = false,
  className = '',
}) {
  const { signInWithGoogle } = useAuth()
  const [isPending, setIsPending] = useState(false)

  const handleGoogleClick = async () => {
    setIsPending(true)
    if (onError) onError('')

    try {
      const { data, error } = await signInWithGoogle()
      if (error) {
        setIsPending(false)
        const msg = error.message?.toLowerCase() || ''
        if (msg.includes('popup closed') || msg.includes('cancelled') || msg.includes('canceled')) {
          onError?.('Google authentication was cancelled.')
        } else if (msg.includes('provider is not enabled')) {
          onError?.('Google provider is not enabled in your Supabase project settings.')
        } else {
          onError?.(error.message || 'Failed to initiate Google sign-in. Please try again.')
        }
        return
      }

      // Ensure browser redirection to Supabase authorization endpoint
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setIsPending(false)
      onError?.(err.message || 'An unexpected error occurred during Google sign-in.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={disabled || isPending}
      className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={label}
    >
      {isPending ? (
        <div className="w-5 h-5 border-2 border-slate-400 border-t-emerald-600 rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.36 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.05.01 12s.45 3.8 1.26 5.42l4.01-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      )}
      <span>{isPending ? 'Connecting to Google...' : label}</span>
    </button>
  )
}
