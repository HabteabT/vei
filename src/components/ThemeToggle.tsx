import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../app/hooks'
import type { Theme } from '../services/settings/ThemeSetting'
import { IconButton } from '../ui/Button'

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<Theme, string> = {
  system: 'Theme: follows your device. Switch to light',
  light: 'Theme: light. Switch to dark',
  dark: 'Theme: dark. Switch to system',
}

export function ThemeToggle() {
  const [theme, setTheme] = useTheme()
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  return (
    <IconButton label={LABEL[theme]} onClick={() => setTheme(NEXT[theme])}>
      <Icon aria-hidden="true" />
    </IconButton>
  )
}
