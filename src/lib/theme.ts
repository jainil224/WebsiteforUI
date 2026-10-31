export type AppTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'inspovault_theme_v1'

const THEME_COLORS: Record<AppTheme, string> = {
  light: '#F5F8F7',
  dark: '#031211',
}

export function getInitialTheme(): AppTheme {
  if (typeof document !== 'undefined') {
    const appliedTheme = document.documentElement.dataset.theme
    if (appliedTheme === 'light' || appliedTheme === 'dark') {
      return appliedTheme
    }
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
  } catch {
    // Theme selection still works for the current page when storage is unavailable.
  }

  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

export function applyTheme(theme: AppTheme, persist = false): void {
  document.documentElement.dataset.theme = theme

  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (themeColorMeta) {
    themeColorMeta.content = THEME_COLORS[theme]
  }

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // The selected theme remains applied even if this browser cannot persist it.
    }
  }
}
