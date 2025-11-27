import React from 'react'
import { Users, BarChart3, FileText, MessageSquare, type LucideIcon } from 'lucide-react'
import { useThemeStore } from '../../../store/themeStore'

interface StatCard {
  label: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

const statsData: StatCard[] = [
  {
    label: 'Total Users',
    value: '2,543',
    change: '+12%',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Revenue',
    value: '$45,231',
    change: '+8%',
    icon: BarChart3,
    color: 'from-[#DAA520] to-[#8f7c15]',
  },
  {
    label: 'Active Projects',
    value: '128',
    change: '+23%',
    icon: FileText,
    color: 'from-green-500 to-green-600',
  },
  {
    label: 'Messages',
    value: '432',
    change: '+5%',
    icon: MessageSquare,
    color: 'from-purple-500 to-purple-600',
  },
]

const StatsCards: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme())

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 group cursor-pointer`}
            style={{
              ['--hover-border' as string]: `${theme.accent}80`,
              ['--hover-shadow' as string]: `0 0 30px ${theme.accentGlow}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${theme.accent}80`
              e.currentTarget.style.boxShadow = `0 0 30px ${theme.accentGlow}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div
                className={`p-2 sm:p-3 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <span className="text-green-400 text-xs sm:text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold ${theme.text} mb-1`}>{stat.value}</h3>
            <p className={`${theme.textSecondary} text-xs sm:text-sm`}>{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards