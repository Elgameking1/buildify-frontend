import { createContext } from 'react'

export const ThemeContext = createContext(null)

export const THEME_STORAGE_KEY = 'buildify.theme'

/**
 * Three preferences, two appearances.
 *
 * `system` is the default and is not the same as picking whichever appearance
 * the device happens to be showing right now: it keeps following the device,
 * so a phone that flips to dark at sunset takes the app with it.
 */
export const THEMES = ['system', 'light', 'dark']
