export const defaultRoute = '/'

export type RoutePath =
  | '/'
  | '/features'
  | '/about'
  | '/dashboard'
  | '/inspirations'
  | '/favorites'
  | '/collections'
  | '/categories'
  | '/settings'

export type RouteMeta = {
  title: string
  navLabel: string
  eyebrow: string
  description: string
}

export const routeMeta: Record<RoutePath, RouteMeta> = {
  '/': {
    title: 'Save the spark. Find it when you need it.',
    navLabel: 'Welcome',
    eyebrow: 'Your visual vault',
    description:
      'A calm, local-first home for the websites, interactions, and details that made you stop scrolling.',
  },
  '/features': {
    title: 'Everything the vault remembers for you',
    navLabel: 'Features',
    eyebrow: 'Features',
    description:
      'Screenshots, notes, tags, and search built around the reason you saved a reference.',
  },
  '/about': {
    title: 'Built for the ideas you almost forgot',
    navLabel: 'About',
    eyebrow: 'About',
    description:
      'A personal, local-first archive for the websites that made you stop scrolling.',
  },
  '/dashboard': {
    title: 'My Inspiration Library',
    navLabel: 'Dashboard',
    eyebrow: 'Your workspace',
    description: 'Keep the ideas. Remember the details.',
  },
  '/inspirations': {
    title: 'All inspirations',
    navLabel: 'All Inspirations',
    eyebrow: 'The full vault',
    description: 'Every reference you save, gathered in one visual place.',
  },
  '/favorites': {
    title: 'Favorites',
    navLabel: 'Favorites',
    eyebrow: 'Kept close',
    description: 'The sparks you want within reach.',
  },
  '/collections': {
    title: 'Collections',
    navLabel: 'Collections',
    eyebrow: 'Organise the spark',
    description: 'Group references around the projects and ideas they serve.',
  },
  '/categories': {
    title: 'Categories',
    navLabel: 'Categories',
    eyebrow: 'Browse by type',
    description: 'Jump into the design details you collect most.',
  },
  '/settings': {
    title: 'Settings',
    navLabel: 'Settings',
    eyebrow: 'Your library',
    description: 'Local-first details and future backup tools.',
  },
}

export const navGroups = [
  {
    label: 'Workspace',
    paths: ['/dashboard', '/inspirations', '/favorites'] as RoutePath[],
  },
  {
    label: 'Organize',
    paths: ['/collections', '/categories'] as RoutePath[],
  },
]

export function resolveRoutePath(value: string): RoutePath {
  if (value in routeMeta) {
    return value as RoutePath
  }

  return defaultRoute
}
