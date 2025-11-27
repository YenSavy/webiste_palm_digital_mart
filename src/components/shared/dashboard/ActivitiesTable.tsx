import React from 'react'
import { FileText } from 'lucide-react'
import { useThemeStore } from '../../../store/themeStore'

interface Activity {
  user: string
  action: string
  date: string
  status: 'completed' | 'pending'
}

const activities: Activity[] = [
  { user: 'John Smith', action: 'Created new project', date: '2 hours ago', status: 'completed' },
  { user: 'Sarah Johnson', action: 'Updated profile', date: '4 hours ago', status: 'completed' },
  { user: 'Mike Davis', action: 'Uploaded document', date: '1 day ago', status: 'pending' },
  { user: 'Emma Wilson', action: 'Sent message', date: '2 days ago', status: 'completed' },
]

const ActivitiesTable: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme())

  return (
    <div
      className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-xl sm:rounded-2xl p-4 sm:p-6`}
    >
      <h3 className={`text-base sm:text-lg font-bold ${theme.text} mb-3 sm:mb-4 flex items-center gap-2`}>
        <FileText size={18} className="sm:w-5 sm:h-5" style={{ color: theme.accent }} />
        Recent Activities
      </h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className={`border-b ${theme.border}`}>
                <th
                  className={`text-left py-2 sm:py-3 px-3 sm:px-4 ${theme.textSecondary} font-medium text-xs sm:text-sm`}
                >
                  User
                </th>
                <th
                  className={`text-left py-2 sm:py-3 px-3 sm:px-4 ${theme.textSecondary} font-medium text-xs sm:text-sm hidden sm:table-cell`}
                >
                  Action
                </th>
                <th
                  className={`text-left py-2 sm:py-3 px-3 sm:px-4 ${theme.textSecondary} font-medium text-xs sm:text-sm`}
                >
                  Date
                </th>
                <th
                  className={`text-left py-2 sm:py-3 px-3 sm:px-4 ${theme.textSecondary} font-medium text-xs sm:text-sm`}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr
                  key={index}
                  className={`border-b ${theme.border} transition-colors cursor-pointer`}
                  style={{
                    ['--hover-bg' as string]: `${theme.accent}10`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.accent}10`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                  }}
                >
                  <td className={`py-2 sm:py-3 px-3 sm:px-4 ${theme.text} text-xs sm:text-sm`}>
                    {activity.user}
                  </td>
                  <td
                    className={`py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm hidden sm:table-cell ${theme.text}`}
                    style={{ color: theme.textSecondary.replace('text-', '') }}
                  >
                    {activity.action}
                  </td>
                  <td className={`py-2 sm:py-3 px-3 sm:px-4 ${theme.textSecondary} text-xs`}>
                    {activity.date}
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">
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
  )
}

export default ActivitiesTable