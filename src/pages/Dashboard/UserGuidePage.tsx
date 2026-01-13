import { type FC } from 'react'
import { useThemeStore } from '../../store/themeStore'
import { cn } from '../../lib/utils'

const UserGuidePage: FC = () => {
    const theme = useThemeStore(state => state.getTheme())
    return (
        <div className={cn('', theme.textSecondary)}>UserGuidePage</div>
    )
}

export default UserGuidePage