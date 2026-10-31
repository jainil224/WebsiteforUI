import type { ReactNode } from 'react'

export type IconName =
  | 'dashboard'
  | 'library'
  | 'heart'
  | 'folder'
  | 'categories'
  | 'settings'
  | 'search'
  | 'plus'
  | 'menu'
  | 'close'
  | 'arrow-right'
  | 'spark'
  | 'image'
  | 'cube'
  | 'cursor'
  | 'hero'
  | 'background'
  | 'button'
  | 'card'
  | 'navigation'
  | 'typography'
  | 'layout'
  | 'scroll'
  | 'transition'
  | 'more'
  | 'shield'
  | 'database'
  | 'edit'
  | 'trash'
  | 'sun'
  | 'moon'

const paths: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  library: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m3 15 5-5 4 4 3-3 6 6" />
      <circle cx="16" cy="8" r="1.5" />
    </>
  ),
  heart: (
    <path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  folder: (
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
  ),
  categories: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>
  ),
  settings: (
    <>
      <path d="M4 6h5M15 6h5M4 12h9M17 12h3M4 18h3M13 18h7" />
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="15" cy="12" r="2.5" />
      <circle cx="10" cy="18" r="2.5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'arrow-right': <path d="M5 12h14m-5-5 5 5-5 5" />,
  spark: (
    <path
      d="M12 2.25l2.2 7.55L21.75 12l-7.55 2.2L12 21.75l-2.2-7.55L2.25 12l7.55-2.2L12 2.25Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m3 15 5-5 4 4 3-3 6 6" />
      <circle cx="16" cy="8" r="1.5" />
    </>
  ),
  cube: (
    <>
      <path d="m12 2.8 8.5 4.7v9L12 21.2l-8.5-4.7v-9L12 2.8Z" />
      <path d="m3.8 7.7 8.2 4.6 8.2-4.6M12 12.3v8.7" />
    </>
  ),
  cursor: (
    <>
      <path d="m5 3 14 8-6 2-2 6L5 3Z" />
      <path d="m13 13 5 5" />
    </>
  ),
  hero: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  background: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 17 17 7M8 8h.01M16 16h.01" />
    </>
  ),
  button: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M9 12h6" />
    </>
  ),
  card: (
    <>
      <rect x="7" y="4" width="14" height="16" rx="2" />
      <path d="M4 7v10.5A2.5 2.5 0 0 0 6.5 20H17" />
    </>
  ),
  navigation: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </>
  ),
  typography: <path d="M4 6V4h16v2M12 4v16M8 20h8" />,
  layout: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12" />
    </>
  ),
  scroll: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="5" />
      <path d="M12 6v4M10 8l2 2 2-2" />
    </>
  ),
  transition: <path d="M4 8h14m0 0-3-3m3 3-3 3M20 16H6m0 0 3-3m-3 3 3 3" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 19 6v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      <path d="M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </>
  ),
  moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
}

type IconProps = {
  name: IconName
  className?: string
  size?: number
}

export function Icon({ name, className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
