# InspoVault — Design System & Experience Specification

> **Design direction:** A calm, tactile archive with a soft electric accent.  
> **Tagline:** Save the spark. Find it when you need it.  
> **Product:** Personal visual inspiration library for web designers and developers.  
> **Design mode:** Dark-first electrified teal with a complete soft Light Mode.

---

## 1. Design Vision

InspoVault should feel like a creative workspace with electricity running through it: focused, fast, responsive, and full of visual inspiration. The interface is not a generic bookmark manager. It should feel like a personal archive of ideas waiting to become the next UI HUB component.

The product's visual character combines:

- **Deep, immersive darkness** as the canvas for saved website previews.
- **Warm cream** for clear typography and moments of visual calm in Dark Mode.
- **Electric teal** for actions, active states, focus, and restrained glow.
- **Soft off-white and pale green** for comfortable long sessions in Light Mode.
- **Editorial gallery design** so screenshots and references lead the experience.
- **Precise motion** that makes interactions feel alive without slowing down the work.

### Experience keywords

`Electrified` · `Visual-first` · `Premium` · `Focused` · `Tactile` · `Fast` · `Developer-minded`

### Product promise

Every saved reference should answer three questions at a glance:

1. **What does it look like?** — the screenshot or preview.
2. **Why did I save it?** — a short personal note.
3. **Where can I see it again?** — one obvious action to open the original website.

---

## 2. Core Design Principles

### 2.1 The inspiration is the hero

Keep saved screenshots visually prominent. Avoid placing large decorative graphics, oversized charts, or unnecessary widgets above the library.

### 2.2 Energy through precision, not clutter

Use teal highlights and small motion details sparingly. Do not make every border glow or every element animate at once.

### 2.3 One-click retrieval

Search, filters, opening the source, editing, and favoriting must be easy to find. A user should not need to remember which folder contains a reference.

### 2.4 Save the reason, not only the URL

Notes and tags are core product features. Make the note preview visible on each card when one exists.

### 2.5 Local-first and personal

The interface should never imply that the library is synced to an account or cloud if the app stores data only in the current browser. Explain local storage and backups in Settings.

---

## 3. Brand Color System

The interface supports two complete themes. Light Mode is a soft off-white and teal workspace; Dark Mode preserves InspoVault's established deep-green, warm-cream, and electric-teal identity.

### 3.1 Light Mode

| Role | Color | Usage |
|---|---|---|
| Main background | `#F5F8F7` | Soft off-white page canvas |
| Card background | `#FFFFFF` | Cards, dialogs, and raised surfaces |
| Secondary surface | `#EAF3F1` | Inputs, inset areas, and gentle separation |
| Primary text | `#17312F` | Headings, labels, and body text |
| Secondary text | `#647875` | Supporting copy and metadata |
| Primary accent | `#008C91` | Links, selected states, and highlights |
| Accent hover | `#006F75` | High-contrast action and hover state |
| Borders | `#DCE7E4` | Dividers and control boundaries |
| Subtle highlight | `#D8F0ED` | Selected chips and calm accent surfaces |

Keep the surfaces soft rather than using pure white everywhere. Use the darker teal hover color for white text on primary actions to preserve contrast.

### 3.2 Dark Mode

| Role | Color | Usage |
|---|---|---|
| Main background | `#031211` | Deep green canvas |
| Warm cream | `#E8E4D3` | Primary readable text |
| Electric teal | `#00AEBB` | Actions, focus, and restrained glow |

Retain the dark-first electrified character with dark-green raised surfaces, cream typography, and restrained teal highlights.

### 3.3 Theme tokens and persistence

All components consume semantic CSS custom properties from `src/styles/tokens.css`. The root element uses `data-theme="light"` or `data-theme="dark"`; shared layout, spacing, radii, and motion tokens remain common. The selected theme is stored under `inspovault_theme_v1`, separate from inspiration and collection records. When no selection exists, initialize from the operating-system preference. An early inline bootstrap in `index.html` applies it before the app renders to avoid a flash of the wrong theme.

---

## 4. Typography

### Recommended type pairing

- **Headings:** Space Grotesk, with a sans-serif fallback.
- **Body and UI:** Inter, with a sans-serif fallback.
- **URLs or small technical labels:** a restrained monospace face such as JetBrains Mono, only where useful.

If external font loading is undesirable, use a high-quality system sans-serif fallback.

### Type scale

| Token | Desktop size | Weight | Typical use |
|---|---:|---:|---|
| Display | 40–48 px | 600–700 | Dashboard title or empty-state headline |
| H1 | 32 px | 600–700 | Main page title |
| H2 | 24 px | 600 | Section heading |
| H3 | 18–20 px | 600 | Card and modal heading |
| Body | 14–16 px | 400–500 | Notes, descriptions, form content |
| Label | 12–13 px | 500–600 | Categories, tags, helper text |
| Micro | 11–12 px | 500 | Domain, timestamps, subtle metadata |

### Typography rules

- Keep the dashboard title expressive, but do not let it push the saved library below the fold.
- Use sentence case for labels and buttons.
- Use short, plain-language descriptions.
- Truncate long URLs and notes in cards; expose the full value in the detail view.
- Use muted text sparingly—important controls and metadata must remain readable.

---

## 5. Layout & Spatial System

### App shell

**Desktop:**
- A slim left sidebar, approximately 220–248 px wide.
- A flexible main content area with a comfortable maximum content width.
- A consistent top bar for page title context, search, and the primary action when appropriate.
- The gallery should receive the most horizontal space.

**Tablet:**
- Collapse the sidebar to an icon rail or compact drawer.
- Keep search, filters, and add actions easy to reach.

**Mobile:**
- Use a compact top bar and bottom navigation or a slide-in navigation drawer.
- Show one or two inspiration cards per row based on available width.
- Put filters in a sheet/drawer rather than squeezing all controls into one row.
- Keep primary touch targets approximately 44 × 44 px or larger.

### Grid and spacing

Use a consistent 4 px spacing base. Suggested steps: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

- Main content horizontal padding: 24–40 px desktop, 16–20 px mobile.
- Gap between inspiration cards: 16–20 px.
- Card internal padding: 14–18 px.
- Section spacing: 28–40 px.
- Form field spacing: 16–20 px.

### Responsive inspiration grid

- Wide desktop: 3–4 columns.
- Standard laptop: 2–3 columns.
- Tablet: 2 columns when the card remains legible.
- Mobile: 1 column on narrow screens; 2 columns only where thumbnails and text still have sufficient room.

Avoid fixed card widths that cause horizontal scrolling.

---

## 6. Main Navigation & Information Architecture

### Brand mark

Use a simple custom wordmark: **InspoVault**. The mark can include a tiny teal spark, pulse, or angled slash, but should remain readable at small sizes. Avoid overcomplicated mascots or large decorative logos.

### Navigation items

1. **Library** — all saved inspirations; default landing destination.
2. **Favorites** — saved items marked as favorites.
3. **Collections** — custom groups of references.
4. **Categories** — quick access to design types.
5. **Settings** — local data, import/export, and storage information.

The active item uses a soft accent-tinted background and a slim teal indicator, with readable text in either theme. Do not use color as the only indicator; retain an icon or text label.

### Header

The header should contain:
- Current page name or breadcrumb.
- A global search field when appropriate.
- A clear primary **Add Inspiration** action.
- An optional compact library count, if it helps orientation.

Do not clutter the header with decorative statistics that do not help retrieval.

---

## 7. Dashboard Design

### Above-the-fold hierarchy

1. Page title: **My Inspiration Library**.
2. Short helper line, such as “Keep the ideas. Remember the details.”
3. Search field and **Add Inspiration** button.
4. Compact category chips and sort/filter controls.
5. Visual inspiration grid.

Use a subtle teal light streak or low-opacity radial glow behind a small portion of the header as a visual signature. It must remain decorative and must not reduce text contrast.

### Library toolbar

- Search by title, URL/domain, notes, tags, category, and collection.
- Category chips should horizontally scroll on small screens if needed.
- Filters should show clear selected states.
- Sorting options: Newest, Oldest, Title, Recently updated.
- Include a visible **Clear filters** action when any filters are active.

### Optional metrics

If included, display only compact, useful counts such as Saved, Favorites, and Collections. Use simple text or understated mini-stat blocks. Do not introduce an analytics dashboard for the MVP.

---

## 8. Inspiration Card Specification

Cards are the most important reusable component in the product.

### Card anatomy

1. **Preview image** — 16:10 or 3:2 aspect ratio, cropped carefully.
2. **Favorite control** — compact, accessible, with an obvious active state.
3. **Title** — one or two lines.
4. **Domain** — small, readable metadata line.
5. **Note preview** — up to two or three lines when available.
6. **Category and tags** — show one category and a few tags; avoid a wall of chips.
7. **Actions** — open source, view details, edit, and delete; destructive actions should not dominate the card.

### Card visual treatment

- Use a lifted theme surface and a subtle theme-appropriate border.
- Keep image corners rounded at the top of the card; maintain a consistent crop ratio.
- The image should occupy roughly 40–55% of the card's visible height, depending on card density.
- Use a low-contrast border at rest.
- On hover, raise the card slightly and brighten the border. Add a restrained teal edge glow only on the active card.
- The favorite icon can fill with the theme accent when selected, with an accessible label such as “Remove from favorites.”
- Keep card height consistent within a row where practical, but do not hide important text just to force uniformity.

### Image states

**Image available:** Show the supplied or captured preview.

**No image yet:** Show a designed placeholder using the dark surface, a simple image/link icon, and the text “Add a preview”. This should still look intentional.

**Capture failed:** Do not imply a screenshot exists. Show a neutral status and offer image upload or retry.

**Image loading:** Use a quiet skeleton that matches the card dimensions and does not pulse aggressively.

### Card interactions

- Clicking the card body opens the detail view, except when clicking an explicit control.
- **Open Website** always opens the stored source in a new tab.
- Favorite toggles without navigating away.
- Edit opens a prefilled form or edit dialog.
- Delete requires confirmation.
- On touchscreens, expose key actions without relying on hover.

---

## 9. Add / Edit Inspiration Experience

The save flow should feel quick and satisfying—not like completing a long database form.

### Layout

Use a centered modal or a dedicated page with a clear title: **Save an inspiration**. On desktop, a two-column composition can show fields on one side and the preview/image upload on the other. On mobile, stack everything vertically.

### Field order

1. Website URL — required.
2. Title — required.
3. Preview image — optional upload/drop area.
4. “Why save this?” — notes field.
5. Category — one primary category.
6. Tags — editable chips with autocomplete suggestions from existing tags.
7. Collection — optional selector.
8. Favorite — optional toggle.

### Primary interactions

- Primary button: **Save Inspiration**.
- Secondary button: **Cancel**.
- Validate a URL as HTTP or HTTPS.
- Detect likely duplicate URLs and offer to open or edit the existing record.
- Keep field labels persistent; do not use placeholders as the only labels.
- After a successful save, show a small confirmation toast and return focus to a sensible place.
- If the user cancels with unsaved changes, ask before discarding them.

### Upload design

Use a dotted or thin dashed border with a small teal icon and clear text: “Drop a screenshot here or browse files.” The hover/focus state gains a quiet teal border highlight. Include file type and size guidance once limits are defined.

---

## 10. Inspiration Detail View

The detail view gives the reference room without losing the quick path back to the original site.

### Recommended desktop layout

- **Left / main area:** large preview image or saved motion attachment.
- **Right / detail panel:** title, domain, category, tags, notes, timestamps, favorite, and actions.

On mobile, show the image first, then the metadata and notes.

### Required visible actions

- **Open Website** — primary action, opens the original URL in a new tab.
- **Edit** — secondary action.
- **Favorite** — toggle.
- **Delete** — visually separated from ordinary actions and confirmed before deletion.

Use the original URL as selectable text and allow copying it. Do not rely on an iframe for live website content because some external sites prohibit embedding.

---

## 11. Collections, Categories & Tags

### Collections

- Display collections as compact visual tiles with a small sample of saved preview images where available.
- Show collection title, short optional description, and reference count.
- Support creating, renaming, and deleting collections.
- Deleting a collection should not delete the references inside it.

### Categories

Use an icon and label for each default category. Keep icons consistent and simple. Suggested defaults:

- 3D Animations
- Micro-interactions
- Hero Sections
- Backgrounds
- Buttons
- Cards
- Navigation
- Typography
- Layouts
- Scroll Effects
- Page Transitions
- Other

Allow users to add or rename categories where supported by the requirements.

### Tags

- Use slim, low-contrast chips.
- Keep tags visually secondary to the title and note.
- On cards, limit the visible tags and show a `+N` overflow indicator when needed.
- In detail views and filters, display all tags.

---

## 12. Empty, Loading, Success & Error States

These states are part of the experience and should receive the same care as the default dashboard.

### Empty library

Headline: **Your next idea starts here.**  
Description: “Save a website, animation, or component so you can find the spark again.”  
Primary action: **Add your first inspiration**.

Use a minimal illustrated spark/current motif, not a large generic stock illustration.

### No search results

Headline: **No matches in your vault.**  
Description: “Try another keyword or clear your filters.”  
Action: **Clear filters**.

### Saving success

Use a small toast with a check icon and text such as “Inspiration saved.” A short teal accent can appear, but avoid large celebratory animations.

### Loading

Use skeleton cards and a static layout so the page does not jump when content arrives.

### Errors

- State what went wrong in plain language.
- Preserve entered fields where possible.
- Provide a clear recovery action such as Retry, Upload preview, or Edit URL.
- Never silently lose a reference if a preview capture fails.

---

## 13. Motion Design — “Electrified” Behavior

Motion should make the interface feel charged and responsive. The site must remain calm enough to use for long browsing sessions.

### Motion principles

- Fast feedback beats decorative animation.
- Animate only what helps the user understand a state change.
- Use transforms and opacity where possible.
- Avoid constant particle backgrounds, heavy animated gradients, and effects that compete with the reference screenshots.
- Respect `prefers-reduced-motion`.

### Suggested motion tokens

| Token | Duration | Easing | Use |
|---|---:|---|---|
| Instant | 100–140 ms | ease-out | Icon and color feedback |
| Fast | 160–200 ms | cubic-bezier(0.2, 0.7, 0.2, 1) | Buttons, chips, input focus |
| Standard | 220–280 ms | cubic-bezier(0.2, 0.7, 0.2, 1) | Cards, menus, modal entry |
| Slow | 320–420 ms | ease-in-out | Page-level transition, only when necessary |

### Allowed electric signatures

- A thin teal line travels a short distance along the border of a focused search field.
- The primary CTA gains a soft teal glow on hover and a subtle press scale on click.
- A card lifts by 2–4 px on hover, with a gentle border brightening.
- The save confirmation emits a brief, tiny spark or line pulse.
- A modal enters with a slight upward movement and fade.
- Selected filter chips transition from outlined to softly accent-tinted.

### Motion to avoid

- Infinite pulsing on every card.
- Aggressive glitch effects, flickering text, or strobe effects.
- Long entrance animations on every page load.
- Cursor trails that make the app harder to operate.
- Auto-playing animations with sound.

### Reduced-motion behavior

When `prefers-reduced-motion: reduce` is active, remove decorative pulses and large transitions. Preserve state feedback using immediate color/border changes.

---

## 14. Buttons, Inputs & Interaction States

### Primary button

- A theme-aware accent fill with readable text.
- Medium-to-bold label weight.
- Clear hover and keyboard focus states.
- Slight glow on hover, not a permanent neon aura.
- Disabled state must remain visibly disabled and must not resemble a primary active button.

### Secondary button

- Transparent or dark surface with a subtle cream border.
- Cream text.
- Hover: surface lightens slightly and border becomes clearer.

### Destructive button

- Keep visually distinct from the main teal action.
- Use explicit wording and confirmation for deletion.
- Do not rely on color alone; pair it with a trash icon and text.

### Inputs

- Charcoal surface, white text, subtle border.
- Placeholder text is muted but still readable.
- Focus state: 2 px theme-aware teal ring with enough offset to remain visible.
- Error state: visible text plus border/state icon; do not communicate errors by color alone.
- Keep accent text on light surfaces dark enough for readable contrast.

### Search field

The search bar is a key navigation element. Give it generous horizontal padding, a search icon, a visible shortcut hint such as `/` or `Ctrl/⌘ K` only if implemented, and a clean focus state. Never show a keyboard shortcut hint that the app does not support.

### Dialogs and popovers

- Use clear titles and concise action labels.
- Trap keyboard focus in modal dialogs and return focus to the trigger when closed.
- Close on Escape where appropriate.
- Use a backdrop with enough opacity to keep the dialog readable.

---

## 15. Iconography & Decorative Language

Use one consistent outline icon family, such as Lucide. Use icons to clarify common actions: search, add, favorite, edit, delete, link, image, tag, folder, settings, and external navigation.

### Electric motif

Use a small spark, line, or pulse motif as a repeated brand detail:

- Around the logo mark.
- In the empty-library illustration.
- On active navigation or focused controls.
- In brief save-success feedback.

Keep the motif small. The website screenshots—not decoration—must remain the center of attention.

Avoid mixing filled, outline, 3D, and emoji icon styles in the same interface.

---

## 16. Accessibility & Usability

- Maintain readable text contrast; validate final UI combinations against WCAG contrast guidance.
- Use the appropriate high-contrast text color on teal-filled buttons.
- Do not use teal alone to indicate selected, favorite, error, or success states; add text, icons, and/or shape differences.
- Provide visible keyboard focus for links, buttons, chips, inputs, and menu items.
- Give all icon-only controls accessible names.
- Ensure all interactive areas work with keyboard and touch.
- Use semantic heading order and form labels.
- Use meaningful alternative text for uploaded previews; decorative images should have empty alt text.
- Support browser zoom and narrow viewport sizes.
- Respect reduced-motion preferences.
- Keep destructive actions separated and clearly worded.

---

## 17. Responsive Behavior

### Desktop

- Persistent sidebar.
- Four-column grid only when card width remains comfortable.
- Large search/filter toolbar.
- Two-column add/edit and detail layouts where useful.

### Tablet

- Compact sidebar or drawer.
- Two- or three-column grid depending on usable width.
- Filters can wrap or move into a sheet.

### Mobile

- Compact navigation with labeled destinations where possible.
- One-column grid on narrow screens.
- Full-width forms with stacked fields.
- Bottom sheet or full-screen view for adding/editing references.
- Touch-friendly buttons and menu items.
- No hover-only interactions.
- Prevent long URLs or tags from causing horizontal overflow.

---

## 18. Local Data, Privacy & Settings UI

Because the product does not require authentication, be transparent about local storage.

Settings should include a small **Your data stays in this browser** information block, with accurate explanation that local data may not automatically appear on another device and can be lost if browser site data is cleared. Offer:

- Export library to JSON.
- Import JSON backup.
- Export list to CSV where implemented.
- Clear all local data, protected by a confirmation step.

Do not display cloud-sync status, account avatars, sign-in buttons, or claims of cross-device synchronization unless those capabilities are actually built.

---

## 19. Frontend Implementation Guidance

Recommended stack: React, Vite, TypeScript, Tailwind CSS, and Lucide icons. Keep the design tokens centralized and compose the UI from reusable components.

### Suggested component library

- `AppShell`
- `Sidebar` / `MobileNavigation`
- `PageHeader`
- `GlobalSearch`
- `FilterChip`
- `FilterBar`
- `InspirationGrid`
- `InspirationCard`
- `PreviewImage`
- `FavoriteButton`
- `AddInspirationDialog` or `InspirationForm`
- `InspirationDetailDialog` or `InspirationDetailPage`
- `TagInput`
- `CategorySelect`
- `CollectionCard`
- `EmptyState`
- `SkeletonCard`
- `Toast`
- `ConfirmDialog`
- `DataManagementPanel`

### Implementation rules

- Use CSS custom properties for the approved palette and derived tokens.
- Keep spacing, radii, shadows, and motion durations consistent.
- Avoid building a different bespoke button/input style for each page.
- Use IndexedDB for reference records and local preview files as established in `requirement.md`.
- Keep screenshot capture optional and clearly indicate when it fails.
- Ensure the core app works without a screenshot service, external API, login, or network call beyond opening the original link.
- Do not use iframes as the only way to preview external websites.

---

## 20. Quality Checklist

### Visual identity
- [ ] Dark Mode retains deep green `#031211`, warm cream `#E8E4D3`, and electric teal `#00AEBB`.
- [ ] Light Mode uses background `#F5F8F7`, white cards, teal accents, and readable dark text.
- [ ] Theme selection persists separately from library records and initializes from the system preference when unset.
- [ ] The UI feels energized without excessive glow, flicker, or visual noise.
- [ ] Preview images remain the visual focus of the library.

### Main flows
- [ ] A user can quickly add an inspiration without authentication.
- [ ] The save form includes URL, title, preview, notes, category, tags, and optional collection/favorite fields.
- [ ] Cards show a preview or a purposeful placeholder, title, domain, and note preview.
- [ ] Search, filters, sorting, favorites, and collections are easy to discover.
- [ ] Original websites open in a new tab.
- [ ] Edit and delete actions behave safely and predictably.

### Motion and accessibility
- [ ] Buttons, cards, filters, and dialogs have consistent interaction states.
- [ ] Motion is brief and purposeful.
- [ ] Reduced-motion preferences are respected.
- [ ] Keyboard focus is always visible.
- [ ] No required action depends on hover.
- [ ] Text and controls remain legible on desktop and mobile.

### Privacy and resilience
- [ ] No login, signup, profile, or social system appears.
- [ ] Local storage and backup behavior are explained honestly.
- [ ] Screenshot failure never prevents a reference from being saved.
- [ ] The UI does not claim a live preview when it only has an image.

---

## Final Direction for the Builder

Create a polished, production-minded personal website called **InspoVault**. Make the experience feel premium through a comfortable light theme and the established deep-green electrified dark theme, refined micro-interactions, and subtle motion—while keeping the saved inspiration gallery clear, calm, and easy to scan.

Use `#F5F8F7`, `#FFFFFF`, `#EAF3F1`, `#17312F`, `#647875`, `#008C91`, `#006F75`, `#DCE7E4`, and `#D8F0ED` for Light Mode. Preserve `#031211`, `#E8E4D3`, and `#00AEBB` for Dark Mode. Prioritize a useful visual library over decoration. No authentication. No social feed. No unnecessary dashboard clutter. Every saved reference should preserve its screenshot, reason for saving, organization, and direct path back to its source.
