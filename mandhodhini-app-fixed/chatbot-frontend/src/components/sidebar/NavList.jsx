import {
  ChatIcon,
  CrownIcon,
  MaskIcon,
  TempleIcon,
  ShieldIcon,
  MoonIcon,
  ScrollIcon,
} from '../icons.jsx'

export const NAV_ITEMS = [
  { id: 'chat', icon: ChatIcon, label: 'Chat', sub: 'Ask Mandhodhini' },
  { id: 'about', icon: CrownIcon, label: 'About Ravana', sub: 'King of Lanka' },
  { id: 'legacy', icon: MaskIcon, label: 'His Legacy', sub: 'Beyond the Myths' },
  { id: 'lanka', icon: TempleIcon, label: 'Lanka', sub: 'The Golden Kingdom' },
  { id: 'wisdom', icon: ShieldIcon, label: 'Wisdom', sub: 'Teachings & Philosophy' },
  { id: 'timeline', icon: MoonIcon, label: 'Timeline', sub: 'The Life & Times' },
 
]

export default function NavList({ activeTab, onSelectTab, collapsed }) {
  return (
    <nav className="nav-list">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'is-active' : ''} ${collapsed ? 'is-collapsed' : ''}`}
            onClick={() => onSelectTab(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">
              <Icon />
            </span>
            {!collapsed && (
              <span className="nav-text">
                <span className="nav-label">{item.label}</span>
                <span className="nav-sub">{item.sub}</span>
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
