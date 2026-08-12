import { useCallback, useEffect, useMemo, useState } from 'react'
import { THEME_STORAGE_KEY, THEMES, ThemeContext } from './themeContextValue'

/**
 * Light/dark theming.
 *
 * The stored preference is one of `system` | `light` | `dark`, and only the two
 * explicit ones write `data-theme` onto <html>. `system` deliberately removes
 * the attribute rather than resolving to a value, because index.css already
 * follows `prefers-color-scheme` when no attribute is present - so the page
 * keeps tracking the device instead of freezing at whatever it read on load.
 *
 * The first paint is handled before React exists, by public/theme-init.js. See
 * index.html for why that has to be a separate file.
 */

const MEDIA_QUERY = '(prefers-color-scheme: dark)'

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return THEMES.includes(stored) ? stored : 'system'
  } catch {
    // Safari in private mode throws on localStorage rather than returning null.
    return 'system'
  }
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia(MEDIA_QUERY).matches
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme)
  // Tracked as state, not read on demand, so that a change to the OS setting
  // re-renders the toggle's icon while `system` is selected.
  const [systemIsDark, setSystemIsDark] = useState(systemPrefersDark)

  useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY)
    const onChange = (event) => setSystemIsDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Not being able to persist is survivable - the session still themes
      // correctly, it just will not be remembered.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(THEMES.includes(next) ? next : 'system')
  }, [])

  const resolvedTheme = theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme

  /** Flip to the opposite of what is currently on screen. */
  const toggleTheme = useCallback(() => {
    setThemeState(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
