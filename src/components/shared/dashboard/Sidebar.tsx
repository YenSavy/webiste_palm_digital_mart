import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Palmtree,
  X 
} from 'lucide-react'
import { useThemeStore } from '../../../store/themeStore'

interface SidebarProps {
  isSidebarOpen: boolean
  activeNav: string
  setActiveNav: (nav: string) => void
  toggleSidebar: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const Sidebar = ({ isSidebarOpen, activeNav, setActiveNav, toggleSidebar }: SidebarProps) => {
  const theme = useThemeStore((state) => state.getTheme())

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-tl ${theme?.primary} transition-all duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-64`}
        style={{ width: isSidebarOpen ? '256px' : '256px' }}
      >
        {/* Logo */}
        <div className={`h-20 flex items-center justify-center border-b ${theme?.border} px-4`}>
          <div className='flex items-center gap-2'>
            <div 
              className='w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center'
              style={{ 
                background: `linear-gradient(to bottom right, ${theme?.accent}, ${theme?.accent}dd)` 
              }}
            >
              <Palmtree size={24} className='text-slate-900' />
            </div>
            <div>
              <h1 
                className='font-bold text-lg'
                style={{ color: theme?.accent }}
              >
                Palm Biz
              </h1>
              <p className={`text-xs ${theme?.textSecondary}`}>Digital Solutions</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 py-6 px-3 space-y-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  if (window.innerWidth < 1024) {
                    toggleSidebar()
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${theme?.primaryHover} shadow-[0_0_20px_${theme?.accentGlow}]`
                    : `${theme?.textSecondary} hover:${theme?.primaryHover} hover:text-white`
                }`}
                style={isActive ? { 
                  backgroundColor: `${theme?.accent}20`, 
                  color: theme?.accent 
                } : {}}
              >
                <Icon
                  size={22}
                  className={`flex-shrink-0 ${
                    isActive ? 'drop-shadow-[0_0_8px_${theme.accentGlow}]' : ''
                  }`}
                />
                <span className='font-medium text-sm'>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className={`p-4 border-t ${theme?.border} lg:hidden`}>
          <button
            onClick={toggleSidebar}
            className={`w-full flex items-center justify-center gap-2 py-2 ${theme?.textSecondary} transition-colors`}
            style={{ 
              '--hover-color': theme?.accent 
            } as React.CSSProperties}
            onMouseEnter={(e) => e.currentTarget.style.color = theme?.accent}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            <X size={20} />
            <span className='text-sm'>Close Menu</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar