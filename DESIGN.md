---
name: Ether Music Platform
description: A monochrome, artwork-led music community interface with old-web catalog character.
colors:
  black: "#090909"
  near-black: "#101010"
  charcoal: "#141414"
  graphite: "#262626"
  line: "#4b4b47"
  paper: "#deded8"
  ink: "#f4f4f0"
  muted: "#a4a49d"
  signal: "#ff4d3d"
typography:
  display:
    fontFamily: '"Trebuchet MS", "Arial Narrow", Arial, sans-serif'
    fontSize: "clamp(24px, 5vw, 32px)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: '"Trebuchet MS", "Arial Narrow", Arial, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Courier New", Courier, monospace'
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0"
  circle: "999px"
spacing:
  xs: "0.375rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.875rem"
    height: "2.75rem"
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.875rem"
    height: "2.75rem"
  field:
    backgroundColor: "{colors.near-black}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.625rem"
    height: "2.75rem"
  panel:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem"
  track-card:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem"
---

# Design System: Ether Music Platform

## Overview

**Creative North Star: "The Independent Catalog"**

Ether is now a monochrome, artwork-led music catalog with the texture of early web music communities and the clarity of a modern player. The interface should feel assembled from printed labels, ruled lists, image thumbnails, and practical controls rather than from glossy SaaS panels. Black is the field, off-white is the voice, and one restrained signal red marks action or playback state.

The tracks page remains a vertical listening feed: one track follows another, artwork is visible inside every track surface, and metadata stays close to the play control. The visual identity is intentionally boxy. Corners, gradients, blue chrome, and decorative surface gloss are not the source of personality; alignment, artwork, typography, and decisive borders are.

**Key Characteristics:**
- Mostly black, white, gray, and one restrained red signal
- Stacked track listing instead of a dashboard card grid
- Artwork is the strongest visual element inside each track
- Square controls and ruled borders
- Compact monospace labels paired with a friendly utility sans
- Minimal motion; state is communicated by color, contrast, and position

## Colors

The palette is deliberately narrow. Public UI stays achromatic so album and track artwork can supply the color and cultural texture; the signal red is reserved for action, focus, and playback emphasis.

### Primary
- **Paper** (`{colors.paper}`): Primary button fill, active navigation fill, borders that need maximum clarity, and high-contrast control surfaces.
- **Signal Red** (`{colors.signal}`): Focus rings, active playback emphasis, hover emphasis, and the occasional status marker. It should remain rare.

### Neutral
- **Black** (`{colors.black}`): Global canvas and deepest surface.
- **Near Black** (`{colors.near-black}`): Fields, menus, and inset control surfaces.
- **Charcoal** (`{colors.charcoal}`): Panels, feedback surfaces, and secondary containers.
- **Graphite** (`{colors.graphite}`): Track card fallback surface behind artwork.
- **Line** (`{colors.line}`): Quiet dividers and borders.
- **Ink** (`{colors.ink}`): Primary text.
- **Muted** (`{colors.muted}`): Secondary metadata and supporting copy.

### Named Rules
**The Artwork-First Rule.** Keep the interface mostly monochrome so the track's artwork, not the chrome, supplies the emotional color.

**The Signal-Ration Rule.** Signal Red is a state marker, not a theme color. Use it where a listener needs to notice action or focus, not as a decorative fill across the page.

## Typography

**Display Font:** `"Trebuchet MS", "Arial Narrow", Arial, sans-serif`

**Body Font:** The same utility sans stack for continuity and readable UI copy.

**Label/Mono Font:** `"Courier New", Courier, monospace` for navigation labels, compact metadata, and old-web utility texture.

**Character:** The sans is familiar and practical; the mono layer supplies the underground catalog / message-board character without turning all text into costume typography.

### Hierarchy
- **Display** (700, `clamp(24px, 5vw, 32px)`, approximately 1.2 line-height): Public page titles.
- **Headline** (700, approximately `1.125rem`): Track titles and prominent content labels.
- **Title** (600, approximately `1rem`): Artist names and navigation brand text.
- **Body** (400, `16px`, approximately 1.5 line-height): Descriptions and page copy.
- **Label** (400-600, approximately `0.8rem`, uppercase): Navigation, compact metadata, durations, and utility actions.

### Named Rules
**The Two-Voice Rule.** Use sans for reading and mono for indexing. Do not make every paragraph look like code.

## Layout

The public shell remains a centered, framed application canvas with a persistent left rail on desktop and a drawer on mobile. The shell is capped near 1200px, uses a 20px desktop gap between rail and content, and keeps the main content column flexible. The root still redirects to `/tracks`, making the stacked tracks feed the effective homepage.

The tracks page remains a single vertical sequence with one track per row. Each track is centered within a max-width of about 900px and separated by a 16px gap. Artwork stays inside the card as a full-bleed visual layer under a darkening overlay, preserving the current listing behavior while increasing image prominence.

The sidebar is a rectangular index rail around 240px wide. Navigation links are stacked rows, not floating pills. The header stays compact and image-backed, with the ASCII Ether mark and account controls preserved as recognizable product assets. At 768px the rail becomes a drawer; at 480px shell padding and card controls tighten.

## Elevation & Depth

Ether uses restrained physical depth: flat charcoal surfaces, thin borders, and one soft ambient shadow on the application shell and track cards. The previous glossy gradients, inset highlights, and blue glow language are intentionally removed. Artwork may create its own tonal depth, but UI chrome should remain quiet around it.

### Shadow Vocabulary
- **Shell ambient:** `0 18px 40px rgb(0 0 0 / 45%)`; use once around the application frame.
- **Track lift:** `0 10px 20px rgb(0 0 0 / 38%)`; use on stacked media cards.
- **No decorative glow:** do not add zero-offset colored halos or gradient sheen to ordinary controls.

### Named Rules
**The Flat Chrome Rule.** Borders, alignment, and contrast carry the interface. Shadows should clarify grouping, not make controls look inflated.

## Shapes

The public shape language is square and deliberate. New public controls, panels, cards, fields, navigation rows, and menus use zero radius. Circular crops are reserved for actual profile imagery; a circle is not a default UI container.

Borders are thin and visible, generally `1px` in `line` or `paper`. The track card clips artwork to a rectangular silhouette. Buttons are rectangular with clear labels and a minimum height around 44px. The only recurring rounded shape is the profile image.

## Components

### Buttons
- **Shape:** Rectangular (`0` radius), minimum height `2.75rem`.
- **Primary:** Paper fill with black text and a 1px paper border.
- **Hover / Focus:** Hover changes the fill and border to Signal Red; focus uses a 2px Signal Red outline with 3px offset.
- **Active / Disabled:** Active shifts down by 1px; disabled reduces opacity without changing shape.
- **Play control:** A square paper button with a simple inline SVG play/pause icon; no glossy treatment and no text glyph substitute.

### Fields
- **Style:** Near-black rectangular field with a 1px line border, compact padding, and a minimum height around 44px.
- **Focus:** Signal Red border and a tight 1px signal ring.
- **Placeholder:** Muted gray; keep it readable against near-black.

### Cards / Containers
- **Panel:** Charcoal rectangular container with a quiet line border.
- **Track card:** Full-bleed artwork, dark overlay, white metadata, square play control, waveform, duration, download action, and optional square overflow menu.
- **Feedback:** Charcoal rectangular message surface with a line border.
- **Internal padding:** Commonly 12px to 16px, reduced on narrow screens.

### Navigation
- **Desktop:** Rectangular black rail, compact wordmark button, and stacked index rows.
- **Default link:** Muted paper text, transparent border, uppercase monospace label.
- **Hover / focus:** Charcoal background and paper border.
- **Active:** Paper fill with black text and a 4px Signal Red inset marker on the left.
- **Mobile:** Fixed rectangular drawer with a dark scrim and a labeled Menu control.

### Header
- **Style:** Darkened artwork-backed rectangle with a paper border, ASCII wordmark, compact descriptor, and account actions.
- **Behavior:** Preserve the existing recognizable header composition; avoid turning it into a large hero or adding extra promotional content.

### Artist Profile and Dashboard
- **Artist profile:** Continue the same stacked track list and shared shell so artist identity comes from name, artwork, and tracks rather than a new card language.
- **Dashboard:** Future dashboard work should use the same rectangular monochrome primitives and track metadata hierarchy. The current admin light-gray Tailwind implementation remains a known migration surface, not the target public visual language.

## Do's and Don'ts

### Do:
- **Do** keep the tracks feed stacked, with one track visually following another.
- **Do** let artwork carry most of the color and emotional expression.
- **Do** use square controls, 1px rules, compact labels, and clear alignment.
- **Do** use Signal Red sparingly for focus, playback, and important state.
- **Do** keep real artwork visible behind readable track metadata.
- **Do** use inline SVG icons for playback and navigation controls.
- **Do** preserve 44px minimum interaction targets and reduced-motion behavior.

### Don't:
- **Don't** use blue as a default product accent.
- **Don't** use gradient-filled sidebar buttons or pill-shaped navigation.
- **Don't** use glossy, inflated, or fake-looking play controls.
- **Don't** turn the tracks page into a grid of equal dashboard cards.
- **Don't** add excessive rounded containers or decorative animations.
- **Don't** make the interface resemble generic purple-gradient AI software.
- **Don't** let the monochrome shell compete with track artwork.
