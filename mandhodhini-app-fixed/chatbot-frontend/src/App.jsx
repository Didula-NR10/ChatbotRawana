import { useEffect, useState } from 'react'
import Sidebar from './components/sidebar/Sidebar.jsx'
import ChatWindow from './components/chat/ChatWindow.jsx'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [activeTab, setActiveTab] = useState('chat')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        activeTab={activeTab}
        onSelectTab={(id) => {
          setActiveTab(id)
          setMobileMenuOpen(false)
        }}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />
      <main className="main-area">
        <ChatWindow onOpenMenu={() => setMobileMenuOpen(true)} />
      </main>
    </div>
  )
}
