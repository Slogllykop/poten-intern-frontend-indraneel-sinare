# Milestones - Civic Issue Reporter PWA

> A multilingual (EN/HI), mobile-first, offline-capable PWA for reporting civic issues.
> Three screens: Category > Details > Confirmation. Installable. Slow-3G tolerant. Taste-driven.

---

## Milestone 1: Project Foundation & Design System

**Goal:** Strip boilerplate, establish the design system, set up bilingual i18n infrastructure, and create the app shell.

### 1.1 Design Tokens & Global CSS

- [ ] Refine `globals.css` color tokens for a civic trust palette (zinc/slate neutrals + single emerald accent)
- [ ] Add custom CSS easing variables per Emil Kowalski's philosophy:
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`
- [ ] Ensure all radius, spacing, and typography values use `rem` (no `px` anywhere)
- [ ] Set corner-radius scale: soft (0.75rem for cards, 0.5rem for inputs, full for buttons)
- [ ] Define dark mode tokens
- [ ] Remove all boilerplate CSS that shipped with create-next-app

### 1.2 Font & Layout Configuration

- [ ] Configure Geist Sans + Geist Mono via `next/font` in `layout.tsx`
- [ ] Remove Inter font import (not needed)
- [ ] Add viewport export with `width: device-width`, `initialScale: 1`, `themeColor`
- [ ] Update root metadata: title, description for Civic Reporter
- [ ] Set `<html lang="en">` (dynamic based on locale later)
- [ ] Body: `min-h-[100dvh]` (never `h-screen`), flex column layout

### 1.3 Internationalization Layer

- [ ] Create `src/i18n/translations/en.ts` with ALL English strings:
  - App title, screen titles, category names, button labels, placeholders
  - Error messages, confirmation text, accessibility labels
  - Format: flat key-value object, typed with `Record<string, string>`
- [ ] Create `src/i18n/translations/hi.ts` with ALL Hindi translations:
  - Every single key from `en.ts` must have a Hindi equivalent
  - Use proper Devanagari script, not transliteration
- [ ] Create `src/i18n/context.tsx`:
  - `LanguageContext` with `locale: 'en' | 'hi'`
  - `setLocale(locale)` function
  - `t(key: string)` translation helper
  - Persist locale preference to `localStorage`
  - Read initial locale from `localStorage` or default to `'en'`
- [ ] Create `src/i18n/use-language.ts`:
  - Custom hook consuming `LanguageContext`
  - Returns `{ t, locale, toggleLocale, isHindi }`

### 1.4 App Shell & Providers

- [ ] Create `src/components/providers/app-providers.tsx`:
  - `'use client'` component
  - Wraps `LanguageProvider` (and future providers)
  - Single point of context composition
- [ ] Create `src/components/shared/app-shell.tsx`:
  - Mobile-first container: `max-w-lg mx-auto` centered
  - Header bar: app title (bilingual), language toggle button
  - Content area with padding, safe-area insets
  - Sticky header, scrollable content
- [ ] Create `src/components/shared/language-toggle.tsx`:
  - Button displaying "EN" or "HI" with smooth crossfade on switch
  - Accessible: `aria-label` describing the action
  - Uses `useLanguage()` hook

### 1.5 Clean Up Boilerplate

- [ ] Strip `page.tsx` of all Next.js starter content
- [ ] Render `AppShell` with a placeholder "Hello World" in both languages
- [ ] Delete unused SVG files from `public/` (next.svg, vercel.svg)
- [ ] Verify `pnpm dev` runs cleanly with no warnings
- [ ] Verify `biome check` passes

### Acceptance Criteria

- App renders a clean mobile shell with header + language toggle
- Clicking EN/HI toggle switches ALL visible text between English and Hindi
- No `px` values in any CSS or Tailwind class
- `pnpm build` succeeds
- `biome check` passes

---

## Milestone 2: Storage Layer & Step Navigation

**Goal:** Build the IndexedDB persistence layer and the 3-screen flow state machine with directional transitions.

### 2.1 Storage Layer

- [ ] Create `src/layers/storage.ts`:
  - Pure TypeScript module, no React dependencies
  - IndexedDB wrapper using raw `indexedDB` API (no library dependencies)
  - Database name: `civic-reporter-db`, version 1
  - Object store: `submissions` with auto-increment key
  - Indexes: `status`, `createdAt`
  - Functions:
    - `initDB(): Promise<IDBDatabase>` - open/create DB
    - `saveSubmission(data: SubmissionData): Promise<string>` - save and return ID
    - `getSubmissions(): Promise<Submission[]>` - get all
    - `getSubmissionById(id: string): Promise<Submission | null>`
    - `getPendingSubmissions(): Promise<Submission[]>` - status === 'pending'
    - `updateSubmissionStatus(id: string, status: Status): Promise<void>`
  - Fallback: if IndexedDB unavailable, use `localStorage` with JSON serialization
  - All functions are async, return Promises
- [ ] Define TypeScript types in `src/types/submission.ts`:
  - `SubmissionData` (form input)
  - `Submission` (saved, with id, referenceId, timestamp, status)
  - `SubmissionStatus`: `'pending' | 'submitted' | 'under-review' | 'in-progress' | 'resolved'`
  - `Category` type with id, label keys

### 2.2 Step Navigation State Machine

- [ ] Create `src/hooks/use-step-navigation.ts`:
  - Steps enum: `'category' | 'details' | 'confirmation'`
  - State: `currentStep`, `direction` (`'forward' | 'backward'`)
  - Functions: `goNext()`, `goBack()`, `reset()`, `goToStep(step)`
  - Guard: cannot go forward past confirmation, cannot go back past category
  - Tracks direction for animation (forward = slide left, backward = slide right)
- [ ] Create `src/hooks/step-context.tsx`:
  - `StepContext` wrapping step navigation state
  - Also holds submission draft data (selected category, description, photo)
  - `setCategory()`, `setDescription()`, `setPhoto()`, `clearDraft()`
  - Provider component with `'use client'`

### 2.3 Screen Transition Component

- [ ] Create `src/components/shared/screen-transition.tsx`:
  - `'use client'` component using `AnimatePresence` from `motion/react`
  - The ONE thoughtful micro-interaction: direction-aware slide
  - Forward navigation: content slides left out, new slides left in
  - Backward navigation: content slides right out, new slides right in
  - Uses `mode="wait"` on AnimatePresence
  - Duration: 250ms with custom `--ease-out` curve
  - Respects `prefers-reduced-motion`: falls back to simple fade
  - Key prop tied to current step for proper mounting/unmounting

### 2.4 Step Indicator

- [ ] Create `src/components/shared/step-indicator.tsx`:
  - 3 dots/segments showing progress
  - Active dot has accent color + subtle scale animation
  - Completed dots filled, upcoming dots outlined
  - Bilingual step labels below dots (optional, depends on space)
  - Accessible: `aria-current="step"` on active

### 2.5 Integration

- [ ] Update `app-providers.tsx` to include `StepProvider`
- [ ] Update `page.tsx` to render step-based screen switching
- [ ] Add step indicator to app shell header

### Acceptance Criteria

- Placeholder screens can be navigated forward and backward
- Transitions animate directionally (left for forward, right for backward)
- Step indicator updates correctly
- IndexedDB database initializes on first load (verify in DevTools > Application)
- `reduced-motion` preference disables slide, shows fade instead

---

## Milestone 3: Category Selection Screen

**Goal:** Build Screen 1 where users pick an issue category.

### 3.1 Category Data

- [ ] Create `src/hooks/use-categories.ts`:
  - Returns static array of categories, each with:
    - `id: string` (e.g., `'roads'`, `'water'`, `'electricity'`)
    - `labelKey: string` (translation key for `t()`)
    - `icon: string` (Tabler icon name)
    - `color: string` (subtle accent tint per category)
  - Categories:
    1. Roads & Footpaths (`IconRoad`)
    2. Water Supply (`IconDroplet`)
    3. Electricity (`IconBolt`)
    4. Sanitation & Waste (`IconTrash`)
    5. Public Safety (`IconShield`)
    6. Other (`IconDots`)
  - Returns `{ categories, selectedCategory, selectCategory }`
  - Reads/writes selection to `StepContext`

### 3.2 Category Screen Component

- [ ] Create `src/components/screens/category-screen.tsx`:
  - `'use client'` component
  - Consumes `useCategories()` and `useLanguage()`
  - Renders 2-column grid on mobile, 3-column on tablet+
  - Each card: icon (Tabler, 1.5rem), bilingual label, subtle border
  - Selected card: accent border + background tint + scale(0.97) press feedback
  - "Next" button at bottom, disabled until category selected
  - Button uses modified shadcn Button component
  - All text from `t()` function
- [ ] Add category name strings to both `en.ts` and `hi.ts`

### 3.3 Polish

- [ ] Card hover: subtle lift on `@media (hover: hover) and (pointer: fine)`
- [ ] Card press: `scale(0.97)` via `whileTap` on Motion
- [ ] Selected card: smooth border-color transition (200ms ease-out)
- [ ] Stagger entrance: cards appear with 50ms stagger on mount (via Motion variants)
- [ ] All grid gaps and padding in `rem`

### Acceptance Criteria

- 6 category cards render in responsive grid
- Selecting a category highlights it, enables Next button
- Clicking Next navigates to Details screen with slide transition
- All labels switch correctly between EN and HI
- Press feedback feels physical (scale 0.97)

---

## Milestone 4: Issue Details Screen (Text + Photo + Voice)

**Goal:** Build Screen 2 with text input, photo capture, and voice input via Web Speech API.

### 4.1 Speech Layer

- [ ] Create `src/layers/speech.ts`:
  - Pure TS module wrapping `SpeechRecognition` / `webkitSpeechRecognition`
  - `isSupported(): boolean` - checks API availability
  - `createRecognition(lang: string): SpeechRecognition` - factory
  - `startListening(recognition, callbacks)` - begin capture
  - `stopListening(recognition)` - end capture
  - Callbacks: `onResult(transcript)`, `onError(error)`, `onEnd()`
  - Language mapping: `'en'` -> `'en-IN'`, `'hi'` -> `'hi-IN'`
  - Handles browser differences (webkit prefix)

### 4.2 Camera Layer

- [ ] Create `src/layers/camera.ts`:
  - Pure TS module wrapping file input for image capture
  - `createFileInput(accept: string): HTMLInputElement` - creates hidden input
  - `triggerCapture(input): Promise<File>` - opens camera/gallery
  - `compressImage(file: File, maxWidth: number, quality: number): Promise<string>` - canvas-based compression
    - Compresses to JPEG, max 800px width, 0.7 quality (Slow-3G tolerance)
    - Returns base64 data URL
  - `revokeObjectURL(url)` - cleanup
  - `getImageDimensions(file): Promise<{w, h}>` - for aspect ratio

### 4.3 Voice Input Hook

- [ ] Create `src/hooks/use-voice-input.ts`:
  - Consumes `speech.ts` layer
  - State machine: `'idle' | 'listening' | 'processing' | 'error' | 'unsupported'`
  - Initializes with `isSupported()` check
  - `startVoice()`: begin listening, set state to `'listening'`
  - `stopVoice()`: stop listening, set state to `'idle'`
  - `transcript: string` - accumulated text from voice
  - `error: string | null` - error message if any
  - `isListening: boolean` - derived from state
  - `isSupported: boolean` - browser support flag
  - Auto-stops after silence (uses `SpeechRecognition` native timeout)
  - Uses current locale from `useLanguage()` for recognition language

### 4.4 Camera Hook

- [ ] Create `src/hooks/use-camera.ts`:
  - Consumes `camera.ts` layer
  - `capturePhoto()`: triggers file input, compresses, stores result
  - `removePhoto()`: clears stored photo, revokes object URL
  - `photo: string | null` - base64 data URL of captured/selected image
  - `isProcessing: boolean` - true during compression
  - Cleanup: revokes URLs on unmount

### 4.5 Details Screen Component

- [ ] Create `src/components/screens/details-screen.tsx`:
  - `'use client'` component
  - Consumes `useVoiceInput()`, `useCamera()`, `useLanguage()`, step context
  - Layout (top to bottom):
    1. Selected category badge (showing what was picked in screen 1)
    2. Text area for description:
       - Placeholder from `t()`, min 3 rows
       - Character counter (optional)
       - Label ABOVE input (never placeholder-as-label)
    3. Voice input button:
       - Microphone icon (Tabler `IconMicrophone`)
       - Pulse animation when listening (the subtle Motion pulse)
       - Click to start/stop
       - Shows "Listening..." / "Unsupported" label from `t()`
       - Appends transcript to textarea content
       - If unsupported, show graceful message, don't hide button
    4. Photo capture area:
       - "Add Photo" button with camera icon (Tabler `IconCamera`)
       - If photo taken: thumbnail preview with remove button
       - Photo compressed for Slow-3G (max 800px, 0.7 quality JPEG)
    5. Back / Next buttons:
       - Back: outline style
       - Next: primary, disabled if description empty
  - Form validation: description required (min 10 chars), photo optional

### 4.6 Voice Input Micro-interaction

- [ ] Listening indicator: microphone icon pulses gently when active
  - `motion.div` with `animate={{ scale: [1, 1.15, 1] }}` repeating
  - Duration: 1.5s, ease-in-out
  - Red accent color when listening
  - Respects `prefers-reduced-motion`: shows static "recording" indicator instead

### Acceptance Criteria

- Text area accepts typed input in both EN and HI
- Voice input button starts/stops Web Speech API recognition
- Voice transcript appends to textarea
- Voice language switches with locale (en-IN / hi-IN)
- Photo can be captured from camera or gallery
- Photo preview shows thumbnail with remove option
- Photo is compressed (verify file size < 200KB typically)
- Unsupported browser shows graceful fallback message
- Back returns to category screen, Next goes to confirmation
- Form validates: description must have content

---

## Milestone 5: Submission & Confirmation Screen

**Goal:** Build the submission logic and Screen 3 showing reference ID and summary.

### 5.1 Submission Hook

- [ ] Create `src/hooks/use-submission.ts`:
  - Consumes `storage.ts` layer and step context
  - `submit()`: packages all form data, generates ref ID, saves to IndexedDB
  - Reference ID format: `CIV-` + 6 uppercase alphanumeric chars (e.g., `CIV-A3K9X2`)
    - Generated client-side using `crypto.getRandomValues()`
  - `isSubmitting: boolean` - loading state during save
  - `referenceId: string | null` - set after successful submission
  - `error: string | null` - error during save
  - Submission data structure:
    ```ts
    {
      referenceId: string
      category: string
      description: string
      photo: string | null
      locale: 'en' | 'hi'
      status: 'submitted'
      createdAt: number // Date.now()
    }
    ```

### 5.2 Confirmation Screen Component

- [ ] Create `src/components/screens/confirmation-screen.tsx`:
  - `'use client'` component
  - Consumes `useSubmission()`, `useLanguage()`, step context
  - Layout:
    1. Success icon (Tabler `IconCircleCheck`) with subtle scale-in entrance
    2. "Issue Reported" heading from `t()`
    3. Reference ID display:
       - Large monospace text (Geist Mono)
       - Copy-to-clipboard button (Tabler `IconCopy`)
       - Subtle background card to make it stand out
    4. Summary section:
       - Category shown with icon
       - Description preview (truncated to 100 chars)
       - Photo thumbnail if present
       - Timestamp
    5. "Report Another Issue" button to reset flow
  - Stagger entrance: elements appear 50ms apart using Motion staggerChildren
  - Copy button: shows brief "Copied!" feedback on click

### 5.3 Integration

- [ ] Wire submission into step flow: auto-submit when reaching confirmation
- [ ] After submission, clear draft data
- [ ] Reset flow returns to category screen with clean state

### Acceptance Criteria

- Submitting stores data in IndexedDB (verify in DevTools > Application > IndexedDB)
- Reference ID is unique and displayed prominently
- Copy button copies ref ID to clipboard
- Summary accurately shows what was submitted
- "Report Another Issue" resets to Screen 1 with clean form
- All text bilingual
- Stagger entrance animation feels considered, not playful

---

## Milestone 6: PWA - Manifest, Service Worker, Installability

**Goal:** Make the app installable, add service worker for caching, pass Lighthouse PWA audit.

### 6.1 Web App Manifest

- [ ] Create `src/app/manifest.ts`:
  - Uses `MetadataRoute.Manifest` return type (Next.js convention)
  - Properties:
    - `name`: "Civic Issue Reporter" 
    - `short_name`: "CivicReport"
    - `description`: Bilingual description
    - `start_url`: "/"
    - `display`: "standalone"
    - `background_color`: matches theme
    - `theme_color`: matches accent
    - `icons`: array of sizes (192x192, 512x512)
    - `orientation`: "portrait"
    - `scope`: "/"
    - `categories`: ["utilities", "government"]

### 6.2 App Icons

- [ ] Create `src/app/icon.tsx`:
  - Dynamic icon generation using `next/og` ImageResponse
  - Simple, clean civic icon (shield + checkmark motif)
  - Sizes: 192x192 and 512x512
  - Matches app color palette
- [ ] Create `src/app/apple-icon.tsx`:
  - Apple touch icon, 180x180
  - Same design as main icon

### 6.3 Service Worker

- [ ] Create `public/sw.js`:
  - Cache name versioned: `civic-reporter-v1`
  - Install event: precache app shell (HTML, CSS, JS bundles)
  - Fetch event strategy:
    - Static assets (fonts, icons, CSS): Cache-first
    - Navigation requests: Network-first with cache fallback
    - API/data: Network-only (or network-first for future)
  - Activate event: clean old caches
  - Handle offline: serve cached shell for navigation
- [ ] Create `src/layers/service-worker.ts`:
  - `registerSW()`: checks support, registers `/sw.js`
  - `onUpdateAvailable(callback)`: notify when new SW is waiting
  - Called from a `useEffect` in app providers or layout

### 6.4 Viewport & Meta

- [ ] Add `viewport` export in `layout.tsx`:
  - `width: 'device-width'`
  - `initialScale: 1`
  - `maximumScale: 1` (prevent zoom on form focus on iOS)
  - `themeColor` matching design
- [ ] Ensure `apple-mobile-web-app-capable` and `apple-mobile-web-app-status-bar-style` are set via metadata

### 6.5 Performance for Slow 3G

- [ ] Verify all fonts load with `font-display: swap` via `next/font`
- [ ] Images: use `next/image` with `quality={75}` and responsive sizes
- [ ] Photo compression: max 800px width, JPEG 0.7 quality
- [ ] Minimal JS bundle: audit imports, ensure no unnecessary dependencies
- [ ] Service worker caches critical path assets

### Acceptance Criteria

- Chrome shows "Install" prompt for the app
- App is installable to home screen (Android Chrome, iOS Safari)
- `manifest.json` is served correctly (DevTools > Application > Manifest)
- Service worker registers and caches assets (DevTools > Application > Service Workers)
- App loads on Slow 3G throttle within reasonable time (< 5s first load)
- Offline: app shell loads from cache, form is usable
- Lighthouse PWA badge passes

---

## Milestone 7: Offline-First with Sync Queue (Stretch)

**Goal:** Full offline support. Form usable without network. Submissions queued and synced when back online.

### 7.1 Network Layer

- [ ] Create `src/layers/network.ts`:
  - `isOnline(): boolean` - returns `navigator.onLine`
  - `onStatusChange(callback: (online: boolean) => void)` - subscribes to events
  - `offStatusChange(callback)` - unsubscribes
  - Uses `online` and `offline` window events

### 7.2 Offline Sync Hook

- [ ] Create `src/hooks/use-offline-sync.ts`:
  - Consumes `network.ts` and `storage.ts` layers
  - `isOnline: boolean` - reactive online status
  - `pendingCount: number` - submissions waiting to sync
  - `syncPending()` - attempts to sync all pending submissions
  - Auto-syncs when connection restores (via event listener)
  - Since no backend: simulate sync by updating status to `'submitted'`
  - Shows toast/notification on sync completion

### 7.3 UI Integration

- [ ] Add offline banner: thin bar at top when offline ("You are offline. Submissions will be saved locally.")
  - Bilingual text from `t()`
  - Amber/yellow accent to indicate warning
  - Slides down with Motion animation
- [ ] Modify submission flow: always save to IndexedDB first, queue for sync
- [ ] Confirmation screen: show "Saved locally" badge when offline vs "Submitted" when online

### Acceptance Criteria

- Toggle network off in DevTools: app continues to work
- Form can be filled and submitted offline
- Submissions persist in IndexedDB
- Offline banner appears/disappears on network change
- When network restored, pending submissions auto-sync (status changes)
- Confirmation shows appropriate status based on connectivity

---

## Milestone 8: Status Tracker View (Stretch)

**Goal:** Add a view that visualizes 4 submission states with a clean timeline UI.

### 8.1 Tracker Hook

- [ ] Create `src/hooks/use-tracker.ts`:
  - Reads all submissions from storage layer
  - Groups by status
  - 4 states: `Submitted` -> `Under Review` -> `In Progress` -> `Resolved`
  - Returns `{ submissions, getStatusForSubmission, refresh }`
  - Each status has: label (bilingual), icon, color, timestamp

### 8.2 Tracker Screen

- [ ] Create `src/components/screens/tracker-screen.tsx`:
  - Vertical timeline UI:
    - Left: vertical line connecting status dots
    - Each dot: filled (completed), ring (current), outlined (upcoming)
    - Right: status label + timestamp
  - Shows list of all submissions as cards:
    - Ref ID, category, date submitted
    - Tap to expand: full timeline for that submission
  - Empty state: "No submissions yet" with illustration placeholder
  - Bilingual labels throughout

### 8.3 Navigation Integration

- [ ] Add "View My Reports" link on confirmation screen
- [ ] Add tab/button on app shell header to access tracker
- [ ] Handle navigation between main flow and tracker view

### Acceptance Criteria

- Tracker shows all past submissions from IndexedDB
- Timeline visualizes 4 states with correct dot states
- Tapping a submission shows its detailed timeline
- Empty state handles gracefully
- All text bilingual
- Timeline dots and lines are cleanly aligned

---

## Milestone 9: Polish, Performance & Accessibility Audit

**Goal:** Final pass for production quality. WCAG 2.2 AA. Performance on Slow 3G.

### 9.1 Accessibility Audit

- [ ] Verify all interactive elements have accessible names (`aria-label`, visible text)
- [ ] Verify focus management: focus moves to new screen content on navigation
- [ ] Verify keyboard navigation: Tab order follows visual order
- [ ] Verify screen reader announcements for:
  - Screen transitions (live region announcing new screen)
  - Voice input status changes
  - Form errors
  - Submission confirmation
- [ ] Color contrast: all text meets WCAG AA (4.5:1 body, 3:1 large text)
- [ ] Touch targets: minimum 2.75rem (44px equivalent) for all interactive elements
- [ ] Verify `prefers-reduced-motion` disables all transform animations

### 9.2 Performance Audit

- [ ] Chrome DevTools Slow 3G test:
  - App shell renders within 3 seconds
  - Fonts load with swap, no invisible text flash
  - Images lazy-load below fold
  - Form is interactive within 5 seconds
- [ ] Bundle analysis: check for unnecessary dependencies
- [ ] Lighthouse Performance score target: 80+
- [ ] Lighthouse Accessibility score target: 90+
- [ ] Lighthouse PWA badge: pass

### 9.3 Edge Cases

- [ ] Empty form submission: proper validation messages (bilingual)
- [ ] Very long text in description: textarea scrolls, no overflow
- [ ] Very long category name in Hindi: no truncation/overflow issues
- [ ] Photo capture cancelled: no error, state resets cleanly
- [ ] Voice input interrupted: graceful stop, partial transcript preserved
- [ ] Browser without Web Speech API: graceful fallback, no crash
- [ ] Browser without IndexedDB: falls back to localStorage
- [ ] Multiple rapid submissions: no duplicate entries
- [ ] Page refresh mid-flow: draft not lost (persisted in context/storage)

### 9.4 Final CSS Audit

- [ ] Zero `px` values in entire codebase (grep verification)
- [ ] All em dashes removed (grep for `\u2014`)
- [ ] All en dashes removed (grep for `\u2013`)
- [ ] Consistent corner radius throughout
- [ ] Single accent color used consistently

### Acceptance Criteria

- Lighthouse PWA audit passes (screenshot in README)
- Lighthouse Accessibility 90+ (screenshot in README)
- No `px` values anywhere in source
- No em/en dashes anywhere in source
- All edge cases handled gracefully
- Slow 3G: app is usable (no broken layouts, no hanging states)

---

## Milestone 10: Documentation & README

**Goal:** Professional README with run instructions, design decisions, limitations, and AI use log.

### 10.1 README Content

- [ ] **How to run:**
  - `pnpm install`
  - `pnpm dev`
  - `pnpm build && pnpm start` for production
  - Browser requirements (Chrome recommended for voice input)
- [ ] **Design decisions:**
  - Why Geist font (modern, clean, civic-appropriate)
  - Why emerald accent (civic trust, "approved" connotation)
  - Why direction-aware transitions as the micro-interaction
  - Why IndexedDB over localStorage for submissions
  - Why canvas-based image compression for Slow 3G
  - Architecture: layered approach explanation
  - Why Context API over external state management
- [ ] **What is broken or unfinished:**
  - Honest list of known limitations
  - Browser compatibility notes (Web Speech API Chrome-only)
  - No actual backend sync (simulated)
- [ ] **What would be built next:**
  - Real backend API integration
  - Push notifications for status updates
  - Geolocation for issue pinning
  - Photo annotation (draw on photo)
  - Multi-photo support
  - Admin dashboard
- [ ] **AI Use Log:**
  - Tool used, approximate token/message count, purpose

### 10.2 Code Comments

- [ ] Comment non-obvious logic:
  - IndexedDB fallback mechanism
  - Speech API browser detection
  - Image compression algorithm
  - Ref ID generation
  - Step navigation guard logic
- [ ] Skip obvious comments (imports, simple state, basic JSX)

### 10.3 Lighthouse Screenshots

- [ ] Run Lighthouse in Chrome DevTools
- [ ] Screenshot PWA audit results
- [ ] Screenshot Accessibility audit results
- [ ] Add screenshots to README

### Acceptance Criteria

- README is comprehensive and well-structured
- A new developer can set up the project from README alone
- Design decisions are articulated clearly
- AI Use Log is honest and complete
- Code comments are non-obvious and helpful
