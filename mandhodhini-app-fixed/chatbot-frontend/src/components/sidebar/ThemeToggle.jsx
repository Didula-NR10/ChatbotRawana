import { SunIcon, MoonIcon } from '../icons.jsx'

export default function ThemeToggle({ theme, onToggle, collapsed }) {
  return (
    <div className={`theme-row ${collapsed ? 'is-collapsed' : ''}`}>
      {!collapsed && (
        <span className="theme-label">
          <SunIcon />
        </span>
      )}
      <button
        className="theme-switch"
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label="Toggle dark mode"
        onClick={onToggle}
      >
        <span className="theme-knob" />
      </button>
      {!collapsed && (
        <span className="theme-label">
          <MoonIcon />
        </span>
      )}
    </div>
  )
}
