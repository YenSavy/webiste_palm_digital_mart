import React from 'react'
import { BarChart3, Users } from 'lucide-react'
import { useThemeStore } from '../../../store/themeStore'

const ChartsSection: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <div
        className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-xl sm:rounded-2xl p-4 sm:p-6`}
      >
        <h3 className={`text-base sm:text-lg font-bold ${theme.text} mb-3 sm:mb-4 flex items-center gap-2`}>
          <BarChart3 size={18} className="sm:w-5 sm:h-5" style={{ color: theme.accent }} />
          Revenue Overview
        </h3>
        <div
          className={`h-48 sm:h-64 flex items-center justify-center ${theme.textSecondary} text-sm`}
        >
          Chart Placeholder - Integrate your chart library here
        </div>
      </div>

      <div
        className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-xl sm:rounded-2xl p-4 sm:p-6`}
      >
        <h3 className={`text-base sm:text-lg font-bold ${theme.text} mb-3 sm:mb-4 flex items-center gap-2`}>
          <Users size={18} className="sm:w-5 sm:h-5" style={{ color: theme.accent }} />
          User Activity
        </h3>
        <div
          className={`h-48 sm:h-64 flex items-center justify-center ${theme.textSecondary} text-sm`}
        >
          Chart Placeholder - Integrate your chart library here
        </div>
      </div>
    </div>
  )
}

export default ChartsSection