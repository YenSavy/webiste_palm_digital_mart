import { Bell, Search, Menu, User, ChevronDown, LogOut, Palette, SquareMenu } from 'lucide-react'
import { useState } from 'react'
import { themes, useThemeStore, type ThemeType } from '../../../store/themeStore'
import { useAuthStore } from '../../../store/authStore'
import useMainStore from '../../../store/mainStore'
import useDashboardStore from '../../../store/dashboardStore'

interface HeaderProps {
  toggleSidebar: () => void
  onLogout: () => void
}

const Header = ({ toggleSidebar, onLogout }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const theme = useThemeStore((state) => state.getTheme())
  const currentThemeKey = useThemeStore((state) => state.currentTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const user = useAuthStore(state => state.user)
  const setSearch = useMainStore(state => state.setSearch)
  const toggleMinimize = useDashboardStore().toggleMinimize
  return (
    <header
      className={`h-16 w-full lg:h-20 bg-gradient-to-br ${theme?.primary} backdrop-blur-sm border-b ${theme?.border} sticky top-0 z-20`}
    >
      <div className='h-full px-4 lg:px-6 flex items-center justify-between gap-4'>
        <button
          onClick={toggleSidebar}
          className={`lg:hidden p-2 ${theme?.textSecondary} rounded-lg ${theme?.primaryHover} transition-colors`}
          style={{
            '--hover-color': theme?.accent
          } as React.CSSProperties}
          onMouseEnter={(e) => e.currentTarget.style.color = theme?.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = ''}
        >
          <Menu size={24} />
        </button>

        <div className='flex-1 max-w-xl flex items-center gap-4'>
          <button className={` bg-gradient-to-tr ${theme.gradient} p-2 border rounded-lg ${theme.border} hidden lg:block`} onClick={toggleMinimize}>
            <SquareMenu className={`${theme.textSecondary}`} />
          </button>
          <div className='relative w-full'>
            <Search
              className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 ${theme?.textSecondary}`}
              size={18}
            />
            <input
              type='text'
              placeholder='Search...'
              className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-gray-300/40 placeholder:text-gray-400 border ${theme?.border} rounded-lg ${theme?.text} placeholder-gray-500 focus:outline-none transition-all text-sm`}
              style={{
                '--focus-border': `${theme?.accent}80`,
                '--focus-ring': `${theme?.accent}80`
              } as React.CSSProperties}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `${theme?.accent}80`
                e.currentTarget.style.boxShadow = `0 0 0 1px ${theme?.accent}80`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
              }}
              onChange={({ target }) => setSearch(target.value)}
            />
          </div>
        </div>

        <div className='flex items-center gap-2 sm:gap-4'>
          <div className='relative'>
            <button
              onClick={() => {
                setIsThemeOpen(!isThemeOpen)
                setIsProfileOpen(false)
              }}
              className={`p-2 ${theme?.textSecondary} rounded-lg ${theme?.primaryHover} transition-colors`}
              style={{
                '--hover-color': theme?.accent
              } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = theme?.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              <Palette size={20} />
            </button>

            {isThemeOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 bg-gradient-to-br ${theme?.cardBg} backdrop-blur-sm border ${theme?.border} rounded-xl shadow-2xl overflow-hidden`}
              >
                <div className={`p-4 border-b ${theme?.border}`}>
                  <p className={`text-sm font-medium ${theme?.text}`}>Choose Theme</p>
                </div>
                <div className='py-2 max-h-96 overflow-y-auto'>
                  {Object.entries(themes).map(([key, themeOption]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key as ThemeType)
                        setIsThemeOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${currentThemeKey === key
                          ? `bg-opacity-20`
                          : `hover:${theme?.primaryHover}`
                        }`}
                      style={currentThemeKey === key ? {
                        backgroundColor: `${themeOption.accent}20`,
                      } : {}}
                    >
                      <div
                        className='w-8 h-8 rounded-lg flex-shrink-0'
                        style={{
                          background: `linear-gradient(to bottom right, ${themeOption.accent}, ${themeOption.accent}dd)`
                        }}
                      />
                      <div className='text-left flex-1'>
                        <p
                          className={`text-sm font-medium ${currentThemeKey === key ? '' : theme?.text}`}
                          style={currentThemeKey === key ? { color: themeOption.accent } : {}}
                        >
                          {themeOption.name}
                        </p>
                      </div>
                      {currentThemeKey === key && (
                        <div
                          className='w-2 h-2 rounded-full'
                          style={{ backgroundColor: themeOption.accent }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button
            className={`relative p-2 ${theme?.textSecondary} rounded-lg ${theme?.primaryHover} transition-colors`}
            style={{
              '--hover-color': theme?.accent
            } as React.CSSProperties}
            onMouseEnter={(e) => e.currentTarget.style.color = theme?.accent}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            <Bell size={20} />
            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
          </button>

          {/* Profile Dropdown */}
          <div className='relative'>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen)
                setIsThemeOpen(false)
              }}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg ${theme?.primaryHover} transition-all`}
            >
              <div
                className='w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0'
                style={{
                  background: `linear-gradient(to bottom right, ${theme?.accent}, ${theme?.accent}dd)`
                }}
              >
                <User size={18} className='text-slate-900' />
              </div>
              <div className='text-left hidden md:block'>
                <p className={`text-sm font-medium ${theme?.text}`}>{user?.full_name || user?.name}</p>
                <p className={`text-xs ${theme?.textSecondary}`}>Administrator</p>
              </div>
              <ChevronDown
                size={16}
                className={`${theme?.textSecondary} transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 bg-gradient-to-br ${theme?.cardBg} backdrop-blur-sm border ${theme?.border} rounded-xl shadow-2xl overflow-hidden`}
              >
                <div className={`p-4 border-b ${theme?.border}`}>
                  <p className={`text-sm font-medium ${theme?.text}`}>{user?.full_name || user?.name}</p>
                  <p className={`text-xs ${theme?.textSecondary}`}>{user?.email}</p>
                </div>
                {/* <div className='py-2'>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-2 ${theme?.textSecondary} ${theme?.primaryHover} transition-colors`}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme?.text}
                  >
                    <User size={18} />
                    <span className='text-sm'>Profile</span>
                  </button>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-2 ${theme?.textSecondary} ${theme?.primaryHover} transition-colors`}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme?.text}
                  >
                    <Settings size={18} />
                    <span className='text-sm'>Settings</span>
                  </button>
                </div> */}
                <div className={`border-t ${theme?.border} py-2`}>
                  <button
                    onClick={onLogout}
                    className='w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors'
                  >
                    <LogOut size={18} />
                    <span className='text-sm'>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header