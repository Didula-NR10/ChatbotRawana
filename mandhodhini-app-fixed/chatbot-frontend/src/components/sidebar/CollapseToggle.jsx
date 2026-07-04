import { ChevronLeftIcon, ChevronRightIcon } from '../icons.jsx'

export default function CollapseToggle({ collapsed, onToggle }) {
  return (
    <button
      className="collapse-toggle"
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </button>
  )
}
