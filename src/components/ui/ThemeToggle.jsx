import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../hooks/useTheme'

/**
 * Cycles System -> Light -> Dark.
 *
 * A cycle rather than a plain on/off switch because "follow my device" is a
 * real third choice, not the absence of one - dropping it would strand anyone
 * whose phone switches theme on a schedule. It stays a single button because
 * the nav bar has no room for a menu, so the current state is carried by the
 * icon and named in full for screen readers.
 */

const NEXT = { system: 'light', light: 'dark', dark: 'system' }

const APPEARANCE = {
  system: { Icon: FiMonitor, label: 'System theme' },
  light: { Icon: FiSun, label: 'Light theme' },
  dark: { Icon: FiMoon, label: 'Dark theme' },
}

function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme()
  const { Icon, label } = APPEARANCE[theme] ?? APPEARANCE.system
  const next = NEXT[theme] ?? 'light'

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      // The accessible name states both where you are and where the press
      // goes; an icon-only control that says only "theme" tells a screen
      // reader user nothing about what pressing it will do.
      aria-label={`${label}. Switch to ${APPEARANCE[next].label.toLowerCase()}`}
      title={label}
      className={`grid size-10 place-items-center rounded-control text-secondary transition-colors duration-200 hover:bg-primary-50 hover:text-secondary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  )
}

export default ThemeToggle
