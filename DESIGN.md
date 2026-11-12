---
name: Formagen
description: Build a form once. Every response stays tied to the version it answered.
colors:
  primary: "#5e5ce6"
  primary-hover: "#4f4dd6"
  primary-text: "#5250d4"
  primary-soft: "#eeeefd"
  on-primary: "#ffffff"
  bg: "#f7f8f9"
  surface: "#ffffff"
  surface-raised: "#f1f2f4"
  text: "#16171a"
  text-muted: "#62666d"
  border: "#e4e5e9"
  border-strong: "#8b9098"
  danger: "#c42b1c"
  success: "#1f7a4a"
  primary-dark: "#8c8bf7"
  primary-hover-dark: "#a09ff9"
  primary-text-dark: "#a3a2ff"
  primary-soft-dark: "#23233f"
  on-primary-dark: "#0e0f11"
  bg-dark: "#0e0f11"
  surface-dark: "#17181b"
  surface-raised-dark: "#1e1f23"
  text-dark: "#ededef"
  text-muted-dark: "#9a9da5"
  border-dark: "#2a2b30"
  border-strong-dark: "#6c7079"
  danger-dark: "#ff7b72"
  success-dark: "#5fd393"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 1.6rem + 3vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
    fontFeature: "\"cv11\", \"ss01\", \"tnum\""
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
    fontFeature: "\"cv11\", \"ss01\", \"tnum\""
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"cv11\", \"ss01\", \"tnum\""
  title-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
    fontFeature: "\"cv11\", \"ss01\", \"tnum\""
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
    fontFeature: "\"cv11\", \"ss01\", \"tnum\""
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "normal"
    fontFeature: "\"cv11\", \"ss01\", \"tnum\""
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "normal"
    fontFeature: "\"cv11\", \"ss01\", \"tnum\""
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "8": "48px"
  "10": "64px"
  "12": "96px"
  "16": "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "38px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-primary-large:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "38px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "38px"
  segmented-control:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.md}"
    padding: "2px"
  segment-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4.8px 11.2px"
  badge-new:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "1.6px 8px"
  badge-version:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "1.6px 8px"
  badge-status:
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "1.6px 8px"
  field-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  product-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
---

# Design System: Formagen

## Overview

**Creative North Star: "The Quiet Instrument"**

Formagen is the category standard executed impeccably, with Linear as the craft bar. It is a product UI that looks like a product UI: one typeface used with discipline, cool near-white ground, white surfaces drawn with hairline borders, soft layered depth, and a single indigo accent that means "act here" or "this one is selected". Nothing is themed. The interface earns its premium feel through precise spacing, tight display tracking, tabular numerals and restraint, not through ornament.

Density is calm-productive: compact controls (38px), small labels at weight 500, generous section rhythm on marketing surfaces (64–96px) and tighter rhythm inside the app (12–24px). Light and dark themes are both first-class and follow `prefers-color-scheme`; every token has a dark counterpart.

The interaction principle comes from the product: fewest clicks, obvious use. Controls are shown where the work happens (direct manipulation, inline switching, real buttons for real actions), and the next step is always visible. Confirmed rejection: the themed "Card Catalogue" world (multiple faces, typewriter mono, stamps, steel, ruled cards, cut tabs) was rejected as cheap and incohesive. No themed costume replaces it.

**Key Characteristics:**
- Inter only, weights 400/500/600, tabular numerals, `cv11` and `ss01` on everywhere.
- Cool neutral ground (bg) with white surfaces; depth from hairlines plus soft shadows.
- One indigo accent family, reserved for primary action, focus, selection and "new" markers.
- One filled primary button per view; everything else is a quiet bordered surface button.
- Lucide icons only, 16px, stroke 1.75.
- Text ≥ 5:1 in both themes; control borders and focus ≥ 3:1.

## Colors

Quiet cool neutrals carry the whole interface; a single indigo family is the only chroma, plus semantic danger and success.

### Primary
- **Signal Indigo** (`primary`; dark `primary-dark`): the fill of the one primary action in a view, the focus ring, the caret, checkbox accent. White text on it reads 5.06:1 light; near-black text on the dark-theme indigo reads 6.53:1.
- **Indigo Pressed** (`primary-hover`; dark `primary-hover-dark`): hover fill for primary buttons only.
- **Indigo Ink** (`primary-text`; dark `primary-text-dark`): accent used as text: links, the selected segment label, the active version key, "New in v2" badge text. 6.07:1 on surface light, 7.75:1 dark.
- **Indigo Wash** (`primary-soft`; dark `primary-soft-dark`): "new" badge background, text selection, the input focus halo, and the start frame of the new-row highlight that settles to neutral.

### Neutral
- **Cool Paper** (`bg`): page ground, the editor's fields pane, the translucent sticky header base.
- **White Surface** (`surface`): cards, product frame, inputs, secondary buttons, selected segment.
- **Raised Grey** (`surface-raised`): segmented-control track, version badge, icon tiles, secondary-button hover.
- **Ink** (`text`): primary text.
- **Slate Muted** (`text-muted`): secondary text, help text, table headers, nav links. ≥ 5.15:1 on every light surface, ≥ 6.07:1 dark.
- **Hairline** (`border`): dividers, card outlines, table rules, frame bar. Decorative only; never the sole boundary of an interactive control.
- **Control Edge** (`border-strong`): the border of inputs and selects, and the scrollbar thumb. 3.21:1 on white light, 3.58:1 on surface dark.

### Semantic
- **Danger** (`danger`; dark `danger-dark`): field error text, invalid-input border, error-summary border and links. 5.66:1 light, 7.04:1 dark.
- **Success** (`success`; dark `success-dark`): defined for confirmation states; not yet used on any surface.

### Named Rules
**The One Accent Rule.** Indigo appears only on primary actions, focus, selected state and "new" markers. Status, counts and version tags stay neutral.

**The Contrast Floor Rule.** Text pairs hold ≥ 5:1 in both themes; control borders (3.21:1 / 3.58:1) and focus (4.76:1 on bg light / 6.53:1 on bg dark) hold ≥ 3:1. A new color earns its place by meeting these, never by adjustment to pass a check.

## Typography

**Display Font:** Inter (self-hosted via next/font, fallback ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Inter
**Label/Mono Font:** none. Inter with tabular numerals covers dates, counts and versions.

**Character:** One family, three weights. Hierarchy comes from size, weight and tracking, never from a second face.

### Hierarchy
- **Display** (600, clamp(2.5rem → 4rem), 1.05, -0.035em): the hero promise and the closing call; max ~18–22ch, two to three lines.
- **Headline** (600, 2.25rem, 1.15, -0.03em): marketing section titles.
- **Title** (600, 1.5rem, 1.2, -0.02em): page `h1` inside the app.
- **Title-sm** (600, 1.125rem, 1.3, -0.02em): `h2` and error-summary titles. The hero lede uses this size at weight 400, muted, 1.5 line height.
- **Body** (400, 0.9375rem, 1.55): running text and input values; prose max ~36–38rem.
- **Label** (500, 0.875rem): form labels, buttons, pane titles (600), nav links (400, muted), table cells (400).
- **Caption** (500 or 400, 0.75rem): badges, table headers, dates, counts.

### Named Rules
**The One Typeface Rule.** Inter only, at 400/500/600. No decorative monospace, no second family, no 700+.

**The Tight Display Rule.** Tracking tightens as size grows: -0.035em display, -0.03em headline, -0.02em titles and wordmark, normal at body and below. Headings use `text-wrap: balance`, paragraphs `pretty`.

## Layout

A single centered column, max 68rem with a fluid gutter (clamp(1rem, 4vw, 2rem)); app pages use a 48rem reading column. Spacing follows a 4px-based scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). Marketing sections breathe at 64–96px block padding with hairline dividers drawn on the content column, not the full bleed. Inside product UI, panes pad at 24px and rows at 12px × 16px.

Headers are sticky, translucent bars: bg at ~82–85% opacity with `saturate(1.4) blur(10–12px)` and a hairline bottom border, 56px tall on marketing.

Responsive behavior: at ≤ 56rem the two-pane editor stacks to one column with the preview (what people try) first, multi-column grids drop to two or one, and horizontally scrolling tables get a right-edge fade mask as a scroll cue. At ≤ 36rem secondary nav links hide except the last, frame bars wrap, and panes pad at 16px. Tables keep cells on one line (`nowrap`); only the free-text column wraps (14–18rem).

## Elevation & Depth

A hybrid: hairline borders define edges, and a three-step soft shadow vocabulary gives lift. Shadows are diffuse and low-alpha; in dark mode they deepen and the frame gains a faint white hairline instead of relying on shadow.

### Shadow Vocabulary
- **Rest** (`0 1px 2px rgb(16 17 26 / 0.06)`; dark `0 1px 2px rgb(0 0 0 / 0.4)`): buttons, inputs, field rows, selected segment. Usually paired with a 1px border-color ring.
- **Lift** (`0 1px 2px rgb(16 17 26 / 0.05), 0 4px 12px -2px rgb(16 17 26 / 0.08)`): defined in tokens, not yet used on any surface. Reserve it for floating layers (menus, popovers) when they arrive.
- **Frame** (`0 0 0 1px rgb(16 17 26 / 0.04), 0 2px 4px rgb(16 17 26 / 0.04), 0 24px 48px -16px rgb(16 17 26 / 0.18)`; dark `0 0 0 1px rgb(255 255 255 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.7)`): the one large app frame per page.

### Named Rules
**The Hairline-First Rule.** An edge is a 1px border or inset ring first; shadow only adds lift. Primary buttons add a 1px inner top highlight (`inset 0 1px 0 rgb(255 255 255 / 0.12–0.14)`), nothing more.

## Shapes

Gently rounded throughout: 6px for small inner elements (segments, icon tiles), 8px for every control, row and button, 12px for cards, frames and summaries, full pill for badges. No cut corners, no sharp-edged containers, no decorative silhouettes.

## Components

### Buttons
Refined and restrained; one loud, the rest quiet.
- **Shape:** gently curved (8px).
- **Primary:** indigo fill, on-primary text, label type, 38px tall with 16px inline padding (44px / 24px on marketing calls). Rest shadow plus inner top highlight.
- **Hover / Focus / Active:** hover deepens to Indigo Pressed over 120ms on the ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`); focus is a 2px indigo outline at 2px offset; active nudges down 1px. Disabled drops to 55% opacity.
- **Secondary:** white surface, ink text, hairline ring, rest shadow; hover to Raised Grey. Used for every non-primary action, including the nav's "Start building" when a hero primary is in view.
- **Danger:** filled danger red with `on-danger` text (white in light, 5.66:1; near-black in dark, 7.60:1), for destructive confirmation only. Not yet used on any surface.
- Buttons default to `type="button"` so nothing submits by accident.

### Chips / Badges
- **Style:** pill, caption type, 1.6px × 8px. Status badges are muted text with a hairline inset ring; version badges sit on Raised Grey with ink text; the "New in vN" badge is the only accented one (Indigo Wash with Indigo Ink).

### Cards / Containers
- **Corner Style:** 12px for frames and summaries, 8px for rows.
- **Background:** White Surface on Cool Paper; side panes may sit on Cool Paper inside a white frame.
- **Shadow Strategy:** Rest for rows, Frame for the single app frame (see Elevation & Depth).
- **Border:** hairline ring; a newly added row swaps its ring to indigo and arrives with a 4px slide over 480ms.
- **Internal Padding:** 12–16px rows, 24px panes.

### Inputs / Fields
- **Style:** white surface, 1px Control Edge border, 8px radius, 38px min height, 8px × 12px padding, rest shadow; max width 32rem. Labels above in label type; "(required)" in muted 400; help text muted 0.875rem.
- **Focus:** border turns indigo with a 3px Indigo Wash halo plus 1px indigo ring. Hover darkens the border to Slate Muted.
- **Error:** border and message in danger; message weight 500. A failed submit shows an error summary (12px radius, danger border) listing each problem as a link to its field; fields carry `aria-describedby` and `aria-invalid` via shared helpers.
- **Select:** native `<select>` with appearance removed and a drawn Lucide up/down chevron (16px, stroke 1.75) at the right, muted color per theme.
- **Checkbox:** native, 20px, indigo accent-color.

### Navigation
- **Style:** sticky translucent blur bar. Wordmark at 600 with -0.02em tracking on the left; links in label size, muted, turning ink on hover; one compact (32px) bordered surface CTA on the right. App header uses the same bar with the account area muted at label size.

### Segmented Control (signature)
A Raised Grey track with a hairline inset and 2px padding; segments are transparent, muted, label type. The selected segment lifts to White Surface with rest shadow and hairline, its label in Indigo Ink. Used as a `tablist` for version switching; secondary detail (dates) may hide on narrow screens.

### Data Table
Caption-size muted headers, label-size cells, 12px × 24px cell padding, hairline row rules, no zebra. Cells never wrap except free-text columns. Absent values render as a muted dash. A newly inserted row flashes Indigo Wash and settles to neutral over 1.6s; reduced motion removes it.

### List Rows with Icons
Field rows: a 28px Raised Grey icon tile (6px radius) holding a 16px Lucide icon at stroke 1.75 in muted color, a label in label type, a caption-size type line, and an optional trailing badge. Version-history rows are full-width real buttons with a hairline top rule; the active one shows its key in Indigo Ink.

### Surfaces still to come
The public form, builder and responses dashboard inherit this system without new primitives: the public form uses the field components, error summary and a single primary submit on Cool Paper; the builder uses field rows, the segmented control for versions and the two-pane editor/preview split; the dashboard uses the data table with version badges, secondary buttons for filter and export, and the same sticky app header.

## Do's and Don'ts

### Do:
- **Do** use Inter alone at 400, 500 and 600 with tabular numerals and `cv11`/`ss01`.
- **Do** give each view exactly one filled indigo primary; make every other action a bordered White Surface secondary.
- **Do** keep indigo to primary actions, focus, selected state and "new" markers.
- **Do** use Lucide icons only, 16px in UI rows, stroke 1.75, in muted color.
- **Do** hold text ≥ 5:1 and control borders and focus ≥ 3:1 in both themes, and ship every new token with its dark counterpart.
- **Do** show controls where the work is: inline switching, direct manipulation, real buttons; fewest clicks, obvious use.
- **Do** honor `prefers-reduced-motion` for every arrival and highlight animation.

### Don't:
- **Don't** introduce a second typeface, decorative monospace, or weights above 600.
- **Don't** put on a themed costume: no typewriter faces, stamps, ruled index cards, steel, or cut tabs.
- **Don't** use the accent for status, counts or decoration; status badges stay neutral.
- **Don't** place two filled primaries in one view.
- **Don't** let a hairline (`border`) be the only edge of an interactive control; inputs use Control Edge.
- **Don't** wrap table cells other than the free-text column.
