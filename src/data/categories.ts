import type { IconName } from '../components/icons'

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

export function getCategory(id: string) {
  return categories.find((category) => category.id === id)
}

export function getCategoryLabel(id: string) {
  return getCategory(id)?.label ?? 'Uncategorised'
}
