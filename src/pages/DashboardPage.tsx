import React, { useState } from 'react'
// Edit
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Palmtree,
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Changed to false for mobile-first
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // edit-------------------------------------------------------
    { id: 'users', label: 'Users', icon: Users, path: "/user" },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#102A43] via-[#0D3C73] to-[#102A43]'>
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#102A43] to-slate-900 border-r border-slate-700/50 transition-all duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-64`}
        style={{ width: isSidebarOpen ? '256px' : '256px' }}
      >
        <div className='h-20 flex items-center justify-center border-b border-slate-700/50 px-4'>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-[#DAA520] to-[#8f7c15] rounded-lg flex items-center justify-center'>
              <Palmtree size={24} className='text-slate-900' />
            </div>
            <div>
              <h1 className='text-[#DAA520] font-bold text-lg'>Palm Biz</h1>
              <p className='text-xs text-gray-400'>Digital Solutions</p>
            </div>
          </div>
        </div>

        <nav className='flex-1 py-6 px-3 space-y-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  if (item.path) navigate(item.path);
                  // ------------------Edite
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false)
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#D5A520]/20 text-[#DAA520] shadow-[0_0_20px_rgba(218,165,32,0.3)]'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon
                  size={22}
                  className={`flex-shrink-0 ${
                    isActive ? 'drop-shadow-[0_0_8px_rgba(218,165,32,0.6)]' : ''
                  }`}
                />
                <span className='font-medium text-sm'>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className='p-4 border-t border-slate-700/50 lg:hidden'>
          <button
            onClick={toggleSidebar}
            className='w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-[#DAA520] transition-colors'
          >
            <X size={20} />
            <span className='text-sm'>Close Menu</span>
          </button>
        </div>
      </aside>

      <div className='lg:ml-64'>
        <header className='h-16 lg:h-20 bg-[#0D3C73]/30 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-20'>
          <div className='h-full px-4 lg:px-6 flex items-center justify-between gap-4'>
            <button
              onClick={toggleSidebar}
              className='lg:hidden p-2 text-gray-400 hover:text-[#DAA520] transition-colors rounded-lg hover:bg-slate-700/50'
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className='flex-1 max-w-xl'>
              <div className='relative'>
                <Search className='absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                <input
                  type='text'
                  placeholder='Search...'
                  className='w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520]/50 focus:ring-1 focus:ring-[#DAA520]/50 transition-all text-sm'
                />
              </div>
            </div>

            <div className='flex items-center gap-2 sm:gap-4'>
              <button className='relative p-2 text-gray-400 hover:text-[#DAA520] transition-colors rounded-lg hover:bg-slate-700/50'>
                <Bell size={20} />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>

              {/* Profile Dropdown */}
              <div className='relative'>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className='flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all'
                >
                  <div className='w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#DAA520] to-[#8f7c15] rounded-full flex items-center justify-center flex-shrink-0'>
                    <User size={18} className='text-slate-900' />
                  </div>
                  <div className='text-left hidden md:block'>
                    <p className='text-sm font-medium text-white'>John Doe</p>
                    <p className='text-xs text-gray-400'>Administrator</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform hidden md:block ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className='absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden'>
                    <div className='p-4 border-b border-slate-700'>
                      <p className='text-sm font-medium text-white'>John Doe</p>
                      <p className='text-xs text-gray-400'>john.doe@example.com</p>
                    </div>
                    <div className='py-2'>
                      <button className='w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors'>
                        <User size={18} />
                        <span className='text-sm'>Profile</span>
                      </button>
                      <button className='w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors'>
                        <Settings size={18} />
                        <span className='text-sm'>Settings</span>
                      </button>
                    </div>
                    <div className='border-t border-slate-700 py-2'>
                      <button className='w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors'>
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

        <main className='p-4 sm:p-6 lg:p-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6'>
            {[
              { label: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
              { label: 'Revenue', value: '$45,231', change: '+8%', icon: BarChart3, color: 'from-[#DAA520] to-[#8f7c15]' },
              { label: 'Active Projects', value: '128', change: '+23%', icon: FileText, color: 'from-green-500 to-green-600' },
              { label: 'Messages', value: '432', change: '+5%', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className='bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#DAA520]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.2)] group'
                >
                  <div className='flex items-start justify-between mb-3 sm:mb-4'>
                    <div className={`p-2 sm:p-3 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className='text-white sm:w-6 sm:h-6' />
                    </div>
                    <span className='text-green-400 text-xs sm:text-sm font-medium'>{stat.change}</span>
                  </div>
                  <h3 className='text-xl sm:text-2xl font-bold text-white mb-1'>{stat.value}</h3>
                  <p className='text-gray-400 text-xs sm:text-sm'>{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Charts Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6'>
            {/* Chart Card 1 */}
            <div className='bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6'>
              <h3 className='text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2'>
                <BarChart3 size={18} className='text-[#DAA520] sm:w-5 sm:h-5' />
                Revenue Overview
              </h3>
              <div className='h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm'>
                Chart Placeholder - Integrate your chart library here
              </div>
            </div>

            {/* Chart Card 2 */}
            <div className='bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6'>
              <h3 className='text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2'>
                <Users size={18} className='text-[#DAA520] sm:w-5 sm:h-5' />
                User Activity
              </h3>
              <div className='h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm'>
                Chart Placeholder - Integrate your chart library here
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className='bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6'>
            <h3 className='text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2'>
              <FileText size={18} className='text-[#DAA520] sm:w-5 sm:h-5' />
              Recent Activities
            </h3>
            <div className='overflow-x-auto -mx-4 sm:mx-0'>
              <div className='inline-block min-w-full align-middle'>
                <table className='min-w-full'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm'>User</th>
                      <th className='text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden sm:table-cell'>Action</th>
                      <th className='text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm'>Date</th>
                      <th className='text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { user: 'John Smith', action: 'Created new project', date: '2 hours ago', status: 'completed' },
                      { user: 'Sarah Johnson', action: 'Updated profile', date: '4 hours ago', status: 'completed' },
                      { user: 'Mike Davis', action: 'Uploaded document', date: '1 day ago', status: 'pending' },
                      { user: 'Emma Wilson', action: 'Sent message', date: '2 days ago', status: 'completed' },
                    ].map((activity, index) => (
                      <tr key={index} className='border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors'>
                        <td className='py-2 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm'>{activity.user}</td>
                        <td className='py-2 sm:py-3 px-3 sm:px-4 text-gray-300 text-xs sm:text-sm hidden sm:table-cell'>{activity.action}</td>
                        <td className='py-2 sm:py-3 px-3 sm:px-4 text-gray-400 text-xs'>{activity.date}</td>
                        <td className='py-2 sm:py-3 px-3 sm:px-4'>
                          <span
                            className={`inline-flex px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                              activity.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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