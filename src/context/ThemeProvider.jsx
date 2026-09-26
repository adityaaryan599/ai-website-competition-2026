import { useEffect, useState, useMemo } from 'react'
import { ThemeContext } from './themeContext'

const THEME_STORAGE_KEY = 'sports_portal_theme'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    // 1. Check localStorage for user explicit preference
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
    } catch {
      // localStorage may fail in restricted/private modes
    }

    // 2. Respect system preference if no stored preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // Default fallback
    return 'dark'
  })

  // Synchronize <html> root classes and color-scheme
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors
    }
  }, [theme])

  // Listen to system changes if user hasn't explicitly set preference
  useEffect(() => {
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (!stored) {
          setThemeState(e.matches ? 'dark' : 'light')
        }
      } catch {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme)
    }
  }

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme,
      setTheme,
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
