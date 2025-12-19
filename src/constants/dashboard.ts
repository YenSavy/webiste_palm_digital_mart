import { BarChart3, Calendar, FileText, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  path?: string
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'users', label: 'Users', icon: Users, path: '/dashboard/user' },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'user-guide', label: "User Guide", icon: FileText, path: '/dashboard/user-guide'}
]