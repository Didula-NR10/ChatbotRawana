import SidebarBrand from './SidebarBrand.jsx'
import NavList from './NavList.jsx'
import QuoteCard from './QuoteCard.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import CollapseToggle from './CollapseToggle.jsx'
import { CloseIcon } from '../icons.jsx'

export default function Sidebar({
  theme,
  onToggleTheme,
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) {
  return (
    <>
      <div className={`sidebar-scrim ${isMobileOpen ? 'is-visible' : ''}`} onClick={onCloseMobile} />
      <aside
        className={`sidebar ${isMobileOpen ? 'is-open' : ''} ${isCollapsed ? 'is-collapsed' : ''}`}
      >
        <button className="sidebar-close" onClick={onCloseMobile} aria-label="Close menu">
          <CloseIcon />
        </button>

        <CollapseToggle collapsed={isCollapsed} onToggle={onToggleCollapse} />

        <SidebarBrand collapsed={isCollapsed} />
        <NavList activeTab={activeTab} onSelectTab={onSelectTab} collapsed={isCollapsed} />
        <QuoteCard collapsed={isCollapsed} />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} collapsed={isCollapsed} />

        {!isCollapsed && (
          <p className="sidebar-footer">
            © 2026 Mandodari
            <br />
            All rights reserved.
          </p>
        )}
      </aside>
    </>
  )
}
