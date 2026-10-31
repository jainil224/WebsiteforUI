import { useCallback, useEffect, useState } from 'react'
import { defaultRoute, resolveRoutePath, type RoutePath } from './routes'

type HashRoute = {
  path: RoutePath
  category: string
}

type NavigateOptions = {
  replace?: boolean
}

function parseHash(hash: string): HashRoute {
  const value = hash.startsWith('#') ? hash.slice(1) : hash

  if (!value.startsWith('/')) {
    return { path: defaultRoute, category: '' }
  }

  const [rawPath, rawQuery = ''] = value.split('?')
  const params = new URLSearchParams(rawQuery)

  return {
    path: resolveRoutePath(rawPath),
    category: params.get('category') ?? '',
  }
}

function getInitialRoute(): HashRoute {
  if (typeof window === 'undefined') {
    return { path: defaultRoute, category: '' }
  }

  return parseHash(window.location.hash)
}

export function useHashRoute() {
  const [route, setRoute] = useState<HashRoute>(getInitialRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash(window.location.hash))

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((to: string, options: NavigateOptions = {}) => {
    const normalized = to.startsWith('/') ? to : `/${to}`
    const hash = `#${normalized}`

    if (options.replace) {
      window.history.replaceState(null, '', hash)
      setRoute(parseHash(hash))
      return
    }

    window.location.hash = normalized
  }, [])

  return {
    ...route,
    navigate,
  }
}
