import type { IconName } from '../components/icons'
import { STORAGE_KEYS } from '../lib/storageTypes'

export type Category = {
  id: string
  label: string
  icon: IconName
}

export const categories: Category[] = [
  { id: '3d-animations', label: '3D Animations', icon: 'cube' },
  { id: 'micro-interactions', label: 'Micro-interactions', icon: 'cursor' },
  { id: 'hero-sections', label: 'Hero Sections', icon: 'hero' },
  { id: 'backgrounds', label: 'Backgrounds', icon: 'background' },
  { id: 'buttons', label: 'Buttons', icon: 'button' },
  { id: 'cards', label: 'Cards', icon: 'card' },
  { id: 'navigation', label: 'Navigation', icon: 'navigation' },
  { id: 'typography', label: 'Typography', icon: 'typography' },
  { id: 'layouts', label: 'Layouts', icon: 'layout' },
  { id: 'scroll-effects', label: 'Scroll Effects', icon: 'scroll' },
  { id: 'page-transitions', label: 'Page Transitions', icon: 'transition' },
  { id: 'other', label: 'Other', icon: 'more' },
]

export function getLoadedCategories(): Category[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return categories
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    if (!raw) return categories
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // fallback
  }
  return categories
}

export function getCategory(id: string) {
  const all = getLoadedCategories()
  return all.find((category) => category.id === id) || categories.find((category) => category.id === id)
}

export function getCategoryLabel(id: string) {
  return getCategory(id)?.label ?? 'Uncategorised'
}
