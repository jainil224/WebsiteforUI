# InspoVault

A personal, local-first visual library for the websites, components, and
interactions that inspire your next build. Save the visual, keep the reason, and
find the path back to the source.

**Status:** Phase 2 — Design tokens and electrified visual system.

## Stack---

- React 19
- Vite 8
- TypeScript 6
- Oxlint
- Plain CSS custom properties (no UI framework yet)

IndexedDB persistence, navigation, forms, and the library features arrive in
later phases. Phase 2 ships the shared visual system and applies it to the
existing foundation screen. It contains no library features, navigation, forms,
or storage.

## Design system

Tokens live in `src/styles/tokens.css`. Light Mode uses the soft off-white,
green, and teal palette; Dark Mode preserves the established deep-green,
warm-cream, and electric-teal identity. Theme choice is stored separately from
library data. Other colors are functional surface and state variations. The style
entry point `src/index.css` imports four layers:

| File                         | Purpose                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `src/styles/tokens.css`      | Color, type, spacing, radius, border, shadow, motion, and layer tokens |
| `src/styles/base.css`        | Reset, page canvas, typography, links, selection, and focus      |
| `src/styles/components.css`  | Buttons, links, fields, chips, cards, dialogs, toasts, states    |
| `src/styles/screen.css`      | Foundation screen layout, accents, and responsive rules          |

The app uses a soft off-white canvas with teal accents in Light Mode, and a deep
green canvas with warm cream and electric teal in Dark Mode. Decorative motion
is brief, and transitions collapse when `prefers-reduced-motion: reduce` is active.

## Requirements

- Node.js `>=22.12.0` (Node 24 recommended)
- npm

## Development

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually <http://localhost:5173>.

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the Vite development server    |
| `npm run build`     | Type-check and build for production  |
| `npm run preview`   | Preview the production build locally |
| `npm run lint`      | Run Oxlint                           |
| `npm run typecheck` | Run TypeScript project checks        |
| `npm run test`      | Not configured yet                   |

## Data and privacy

InspoVault is designed as a local-first, no-account app. When persistence is
implemented, saved library data will stay in the current browser unless it is
exported. No backend, login, API key, screenshot service, or public database is
required.

Phase 2 does not store any library data yet.

## Phase 2 scope

- Centralized design tokens for the approved brand palette
- Typography, spacing, radius, border, shadow, and motion tokens
- Reusable button, link, input, chip, card, dialog, and toast styles
- Refined, tokenized foundation screen with a working back-to-top control
- Reduced-motion support, visible focus states, and responsive layout
- No authentication, backend, or external API dependency

See `phase.md` for the full phased implementation plan.
