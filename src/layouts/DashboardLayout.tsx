import React, { useState } from 'react'
import { useThemeStore } from '../store/themeStore'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Sidebar from '../components/shared/dashboard/Sidebar'
import Header from '../components/shared/dashboard/Header'
import useDashboardStore from '../store/dashboardStore'
import type { navItems } from '../constants/dashboard'




const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [activeNav, setActiveNav] = useState<typeof navItems[number]["id"]>("dashboard")
  const theme = useThemeStore(state => state.getTheme())
  const { isMinimized } = useDashboardStore()

  const navigate = useNavigate();
  const handleNavClick = (id: string, path?: string) => {
    setActiveNav(id)
    if (path) navigate(path)
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }
  const { logout } = useAuthStore()
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        activeNav={activeNav} 
        onNavClick={handleNavClick} 
        onToggleSidebar={toggleSidebar} 
      />
      
      <div 
        className={`transition-all duration-300 ${
          isMinimized ? 'lg:ml-[80px]' : 'lg:ml-64'
        }`}
      >
        <Header toggleSidebar={toggleSidebar} onLogout={() => logout()} />
        
        <main className='p-4 sm:p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden'
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}

export default DashboardLayout