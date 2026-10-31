export type AppTheme = 'light'

export const THEME_STORAGE_KEY = 'inspovault_theme_v1'

const THEME_COLORS: Record<AppTheme, string> = {
  light: '#F5F8F7',
}

export function getInitialTheme(): AppTheme {
  return 'light'
}

export function applyTheme(_theme?: string, persist = false): void {
  document.documentElement.dataset.theme = 'light'

  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (themeColorMeta) {
    themeColorMeta.content = THEME_COLORS.light
  }

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    } catch {
      // Ignore
    }
  }
}
