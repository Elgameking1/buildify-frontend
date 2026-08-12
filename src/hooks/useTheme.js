import { useContext } from 'react'
import { ThemeContext } from '../context/themeContextValue'

/**
 * Read and change the theme.
 *
 * Returns `theme` (the stored preference: system | light | dark),
 * `resolvedTheme` (what is actually on screen: light | dark), `setTheme` and
 * `toggleTheme`. Components that need to know how the page *looks* - to pick
 * an icon, say - want `resolvedTheme`; a settings control wants `theme`.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return context
}
