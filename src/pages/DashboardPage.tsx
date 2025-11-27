import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,

} from 'lucide-react'
import Sidebar from '../components/shared/dashboard/Sidebar';
import Header from '../components/shared/dashboard/Header';
import ActivitiesTable from '../components/shared/dashboard/ActivitiesTable';
import ChartsSection from '../components/shared/dashboard/ChartsSection';
import {  useThemeStore } from '../store/themeStore';
import StepsToUseSystem from '../components/shared/dashboard/StepsToUseSystem';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users, path: "/user" },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]
const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false) 
  const [activeNav, setActiveNav] = useState<typeof navItems[number]["id"]>("dashboard")

  const theme = useThemeStore(state => state.getTheme())

  const navigate = useNavigate();
  const handleNavClick = (id: string, path?: string) => {
    setActiveNav(id)
    if (path) navigate(path)
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
    }
    const {logout} = useAuthStore()
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} activeNav={activeNav} onNavClick={handleNavClick} onToggleSidebar={toggleSidebar} />

      <div className='lg:ml-64'>
       <Header toggleSidebar={toggleSidebar} onLogout={() => logout()}/>

        <main className='p-4 sm:p-6 lg:p-8'>

          <StepsToUseSystem />


          <ChartsSection />

          <ActivitiesTable /> 
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

export default DashboardPage