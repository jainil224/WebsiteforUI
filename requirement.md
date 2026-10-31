# Website Requirements: InspoVault

## 1. Project Overview

**Project name:** InspoVault (working name)

**Project type:** Personal website inspiration and visual bookmark manager

**Purpose:** Build a private, easy-to-use website for saving website links that contain useful UI inspiration—such as animations, backgrounds, hero sections, buttons, cards, layouts, typography, and interactions. Each saved reference should preserve not only the URL but also a visual preview and the reason it was saved.

**Primary user:** One person using the website for personal design and development research, especially while finding inspiration for UI HUB.

**Authentication:** Not required. Do not build login, signup, password reset, user profiles, or social authentication.

## 2. Problem Statement

When browsing websites, the user often finds an inspiring component or animation but later:

- Cannot remember which website it came from.
- Loses the saved URL or forgets where it was stored.
- Cannot remember why the link was saved.
- Has no visual preview to recognize the design quickly.
- Must reopen several websites to find the effect or component they wanted.

The website should turn plain bookmarks into a searchable, visual library of inspiration.

## 3. Goals

1. Save a website URL with a clear title and optional description.
2. Show a visual preview for each saved reference.
3. Record a note explaining what is inspiring about the reference.
4. Organize references with categories, tags, favorites, and collections.
5. Find saved references quickly with search and filters.
6. Open the original website with one click.
7. Keep the application simple and usable by one person without an account.
8. Provide a persistent Light and Dark theme using the documented palettes.

## 4. Non-Goals for the First Version

Do not include these in the MVP:

- User authentication or user management.
- Public profiles, sharing feeds, comments, or likes.
- Paid plans or subscriptions.
- Team collaboration.
- AI-generated descriptions or automatic component analysis.
- A browser extension (can be considered for a later version).
- Guaranteed live previews of external websites inside the app.

## 5. Target Workflow

1. The user discovers an interesting website while browsing.
2. The user opens InspoVault and selects **Add Inspiration**.
3. The user pastes the website URL.
4. The user enters or edits the title, adds a reason/note, chooses a category, and adds tags.
5. The user adds a screenshot or preview image. The app may attempt to retrieve page metadata or a screenshot when a suitable capture service is configured, but it must provide a manual image-upload option if automatic capture fails.
6. The saved reference appears in the dashboard as a visual card.
7. Later, the user searches or filters the library, recognizes the reference from its thumbnail and note, and clicks **Open Website** to visit the original URL in a new tab.

## 6. Core Functional Requirements

### 6.1 Dashboard

- Display a clear page heading, such as **My Inspiration Library**.
- Show an **Add Inspiration** primary action.
- Display saved references in a responsive card grid.
- Include a search input and category filters.
- Provide quick access to Favorites and Collections.
- Show useful empty states when no references have been saved or when a search has no results.
- Optionally show small statistics such as total saved references, favorites, and categories.

### 6.2 Add Inspiration

The add form should support these fields:

- **Website URL** — required; validate that it is a valid HTTP or HTTPS URL.
- **Title** — required; use the page title as a suggested value when metadata retrieval is available.
- **Preview image** — optional; support upload from the user's device.
- **Reason / Notes** — optional text explaining why the reference matters. Example: “I like the glowing cursor effect and the transition between sections.”
- **Category** — select one primary category.
- **Tags** — allow multiple tags and custom tag values.
- **Favorite** — optional toggle.
- **Collection** — optionally assign the reference to a named collection.

Actions:

- Save the reference.
- Cancel without saving.
- Show clear validation messages.
- Warn about a likely duplicate URL and offer to open or edit the existing reference instead of silently creating a duplicate.

### 6.3 Inspiration Cards

Each card should display, when available:

- Screenshot or preview thumbnail.
- Website or reference title.
- Website domain.
- Category and a few tags.
- A short note preview.
- Favorite indicator.
- A clear **Open Website** action.
- An edit action and a delete action, with confirmation before deletion.

Use the thumbnail and note as the main visual cues so the user can quickly remember why a reference was saved.

### 6.4 Inspiration Details

Selecting a card should open a detail view or modal showing:

- A larger preview image.
- Title and original URL.
- **Open Website** action that opens the original site in a new tab.
- Full notes / reason for saving.
- Category and all tags.
- Collection assignment.
- Created date and last-updated date, if available.
- Edit, favorite, and delete actions.
- Optional GIF or video attachment for a motion reference in a later phase.

The application must not depend on embedding every external website in an iframe. Some websites block embedding. The screenshot is the reference preview; the original website link is the way to inspect the live site.

### 6.5 Search, Filters, and Sorting

- Search by title, URL/domain, notes, category, tags, and collection name.
- Filter by category, tags, favorites, and collection.
- Support sorting by newest saved, oldest saved, title, and recently updated.
- Allow filters to be combined.
- Provide an obvious way to clear filters.

### 6.6 Categories

Include sensible default categories, while allowing the user to add or rename categories:

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

Categories should be easy to change when editing a saved reference.

### 6.7 Tags

- Support multiple tags per reference.
- Suggest existing tags while typing.
- Allow custom tags.
- Use tags for more detailed concepts, such as `planet`, `glow`, `liquid`, `cursor`, `parallax`, `shader`, or `hover`.

### 6.8 Favorites and Collections

- Allow references to be marked and unmarked as favorites.
- Allow custom collections such as “Ideas for UI HUB”, “3D Planet References”, or “Portfolio Redesign”.
- A reference may belong to a collection without losing its category or tags.
- Allow the user to rename and delete collections without accidentally deleting the underlying references.

### 6.9 Preview Image Handling

- Support manual upload of an image from the user's device.
- Display a helpful placeholder when no preview exists.
- Allow the user to replace or remove a preview image.
- If automatic website screenshot capture is implemented, handle failures gracefully. Some sites may block automated requests, require authentication, use bot protection, or render content only after interaction.
- Do not falsely indicate that an automatic screenshot was captured when it was not.
- Keep preview images reasonably optimized so the library remains responsive.

### 6.10 Data Management

- Save changes automatically or provide clear Save actions; never discard an edit without warning.
- Provide export of saved records to JSON.
- Provide import from a previously exported JSON file, with validation and duplicate handling.
- Provide a way to export the reference list as CSV where practical.
- Provide a clear warning before deleting a reference or clearing all local data.

## 7. Storage and Privacy Requirements

Because this is a personal website with no authentication, the MVP should use **local-first storage** rather than a publicly writable shared database.

- Use IndexedDB for structured records and locally stored preview files where appropriate; localStorage may be used only for small preferences.
- Keep all references in the user's browser by default.
- Clearly explain in Settings or an info message that local data belongs to the current browser/device and may not automatically sync to other devices.
- Support JSON export and import so the user can create backups or move the library.
- Do not upload private screenshots or notes to a third-party service without an explicit configuration and clear disclosure.
- If cloud sync is added later, design access controls carefully. Do not expose a privileged database key or create unrestricted public write access merely to avoid authentication.
- Do not claim that a no-login site is globally private if data is placed in a public database or publicly hosted storage bucket.

## 8. Visual Design Requirements

### 8.1 Required Color Palette

Provide a complete Light Mode and preserve the original Dark Mode:

- **Light background:** `#F5F8F7`; cards: `#FFFFFF`; secondary surface: `#EAF3F1`.
- **Light primary text:** `#17312F`; secondary text: `#647875`.
- **Light accent:** `#008C91`; hover: `#006F75`.
- **Light border:** `#DCE7E4`; highlight: `#D8F0ED`.
- **Dark background:** `#031211`; warm cream: `#E8E4D3`; electric teal: `#00AEBB`.

Keep theme-specific values centralized in CSS tokens. Apply the system-preferred theme on first visit, persist explicit choices separately from library records, and provide an accessible header toggle. Use restrained teal accents and maintain readable contrast in both themes.

### 8.2 Style Direction

- Modern, developer-focused, premium, and minimal.
- Dark-first interface with generous spacing.
- Rounded cards with subtle borders and restrained shadows.
- High-quality thumbnail presentation; images should be the main attraction of the gallery.
- Clear typography and strong visual hierarchy.
- Smooth, subtle transitions rather than excessive animation.
- Consistent spacing, icon sizes, button states, and border radii.
- Responsive from mobile through desktop.
- Avoid visual clutter, excessive gradients, neon overload, or large decorative elements that compete with saved previews.

### 8.3 Color Use and Accessibility

- Use warm cream on the dark background and dark green text on light surfaces.
- Use teal for emphasis and actions; do not rely on color alone to communicate status.
- Ensure text, icons, focus rings, form fields, and disabled states remain clear.
- Verify contrast for normal text and interactive controls in both themes.
- Provide visible keyboard focus and accessible labels for icon-only buttons.

## 9. Recommended Page Structure

### Page 1: Dashboard / All Inspirations

- Top navigation with logo/name and links to Library, Favorites, Collections, and Settings.
- Welcome or page heading.
- Search bar and filter/sort controls.
- Responsive visual card grid.
- Add Inspiration action.
- Empty state for first-time use.

### Page 2: Add / Edit Inspiration

- URL input and title.
- Preview-image upload area.
- Notes field.
- Category selector and tag input.
- Optional collection and favorite controls.
- Save and Cancel actions.

### Page 3: Inspiration Details

- Large image preview.
- Title, domain, category, tags, and notes.
- Open Website action.
- Edit, favorite, and delete actions.

### Page 4: Collections

- List or grid of user-created collections.
- Collection title, optional description, and count of saved references.
- Create, rename, and delete collection actions.

### Page 5: Settings / Data Management

- Export library as JSON and CSV.
- Import JSON backup.
- Explain local storage and backup limitations.
- Clear-all-data action with confirmation.

## 10. Technical Recommendations

Suggested stack for the first version:

- **Frontend:** React + Vite + TypeScript.
- **Styling:** Tailwind CSS; use reusable components and CSS variables for theme colors.
- **Icons:** Lucide icons or a consistent equivalent.
- **Storage:** IndexedDB, using a small wrapper library if useful.
- **Deployment:** Vercel or another static hosting provider.

Keep the first version self-contained and avoid adding a server, account system, or external database unless a real requirement appears. If the project later needs cross-device sync or reliable automatic screenshot capture, evaluate a backend or dedicated screenshot service as a separate phase.

### Suggested Data Model

Each inspiration record should support fields similar to:

- `id`: unique local identifier
- `url`: original website URL
- `title`: user-facing reference title
- `domain`: parsed hostname
- `notes`: reason for saving
- `categoryId`: selected category
- `tags`: list of tag strings or tag IDs
- `collectionIds`: list of collection IDs
- `previewImage`: local image reference or stored file/blob
- `isFavorite`: boolean
- `createdAt`: timestamp
- `updatedAt`: timestamp

Also maintain category and collection records. Use migrations or versioned database handling if the local data structure changes in future releases.

## 11. UX and Error Handling

- Make adding a reference quick and frictionless.
- Show clear feedback when a record is saved, updated, imported, or deleted.
- Validate URLs and avoid crashing on malformed or unsupported input.
- Handle missing images, inaccessible metadata, broken links, and failed screenshot capture gracefully.
- Make external links open in a new tab with safe link attributes.
- Confirm destructive actions.
- Keep important actions available without requiring hover, especially on touchscreens.
- Support keyboard navigation through forms, filters, dialogs, and cards.

## 12. Performance and Quality Requirements

- Render a useful interface even when the library is empty.
- Keep filtering and searching responsive for a personal library containing at least hundreds of references.
- Lazy-load thumbnails where practical.
- Avoid unnecessary large dependencies.
- Test on current Chrome and common desktop/mobile viewport sizes.
- Ensure refreshing the page does not erase saved records.
- Test export/import with records containing notes, tags, collections, and preview images where the chosen export format supports them.

## 13. MVP Acceptance Criteria

The first version is considered complete when:

1. The user can add a valid website URL and save an inspiration without signing in.
2. Saved references remain available after refreshing or reopening the app in the same browser, subject to that browser's local-data retention.
3. A user can upload, view, replace, and remove a preview image.
4. Every saved reference can store a title, notes, category, tags, and favorite state.
5. The dashboard displays references as visual cards.
6. Search finds references by title, URL/domain, notes, category, and tags.
7. Filters, sorting, favorites, and collections work correctly.
8. The **Open Website** action opens the original URL in a new tab.
9. The user can edit and delete a reference, with confirmation before deletion.
10. JSON export and import work with validation and duplicate handling.
11. The layout works on desktop and mobile.
12. Light and Dark themes are consistent across the full application and persist independently of library data.
13. No authentication, login, signup, or account system is included.
14. No feature falsely claims to provide a live website preview when only a screenshot is available.

## 14. Future Enhancements (Not Required for MVP)

- Chrome/Chromium browser extension to save the active tab.
- Select and capture a specific page section.
- Automated screenshots using a dedicated capture service.
- GIF or short video attachments for animation references.
- AI-assisted title, tag, or note suggestions, optional and user-controlled.
- Connect an inspiration record to a corresponding UI HUB component.
- Optional encrypted or authenticated cloud backup if cross-device access becomes necessary.

## 15. Final Product Principle

**Save more than a link: save the visual, the reason, and the path back to the original source.** The product should optimize for quick capture, visual recognition, and fast retrieval—not for social features or account management.
