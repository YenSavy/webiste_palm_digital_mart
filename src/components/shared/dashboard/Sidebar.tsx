import React from 'react'
import {
  Palmtree,
  X,

} from 'lucide-react'
import { useThemeStore } from '../../../store/themeStore'
import useDashboardStore from '../../../store/dashboardStore'
import { navItems } from '../../../constants/dashboard'

interface SidebarProps {
  isSidebarOpen: boolean
  activeNav: string
  onNavClick: (id: string, path?: string) => void
  onToggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  activeNav,
  onNavClick,
  onToggleSidebar,
}) => {
  const theme = useThemeStore((state) => state.getTheme())
  const { isMinimized } = useDashboardStore()

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-b ${theme.primary} ${theme.border} border-r transition-all duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      style={{ width: isMinimized ? '80px' : '256px' }}
    >
      {/* Header */}
      <div
        className={`h-20 flex items-center ${isMinimized ? 'justify-center' : 'justify-between'
          } border-b ${theme.border} px-4 transition-all duration-300`}
      >
        {!isMinimized && (
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.accent}dd)`,
              }}
            >
              <Palmtree size={24} className="text-slate-900" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg whitespace-nowrap" style={{ color: theme.accent }}>
                Palm Biz
              </h1>
              <p className={`text-xs ${theme.textSecondary} whitespace-nowrap`}>
                Digital Solutions
              </p>
            </div>
          </div>
        )}

        {isMinimized && (
          <div
            className="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.accent}dd)`,
            }}
          >
            <Palmtree size={24} className="text-slate-900" />
          </div>
        )}

      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id, item.path)}
              className={`w-full flex items-center ${isMinimized ? 'justify-center' : 'gap-3'
                } px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                  ? `${theme.primaryHover} shadow-[0_0_20px_${theme.accentGlow}]`
                  : `${theme.textSecondary} hover:${theme.primaryHover} hover:${theme.text}`
                }`}
              style={
                isActive
                  ? {
                    backgroundColor: `${theme.accent}33`,
                    color: theme.accent,
                  }
                  : undefined
              }
              title={isMinimized ? item.label : ''}
            >
              <Icon
                size={22}
                className={`flex-shrink-0 ${isActive ? `drop-shadow-[0_0_8px_${theme.accentGlow}]` : ''
                  }`}
              />
              {!isMinimized && <span className="font-medium text-sm">{item.label}</span>}

              {/* Tooltip for minimized state */}
              {isMinimized && (
                <div
                  className={`absolute left-full ml-2 px-3 py-2 rounded-lg ${theme.primary} ${theme.border} border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50`}
                  style={{ backgroundColor: theme.accent + '22' }}
                >
                  <span className={`text-sm font-medium ${theme.text}`}>{item.label}</span>
                </div>
              )}
            </button>
          )
        })}
      </nav>

      <div className={`p-4 border-t ${theme.border} lg:hidden`}>
        <button
          onClick={onToggleSidebar}
          className={`w-full flex items-center ${isMinimized ? 'justify-center' : 'gap-2'
            } py-2 ${theme.textSecondary} transition-colors`}
          style={{ ['--hover-color' as string]: theme.accent }}
          onMouseEnter={(e) => (e.currentTarget.style.color = theme.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = '')}
        >
          <X size={20} />
          {!isMinimized && <span className="text-sm">Close Menu</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar