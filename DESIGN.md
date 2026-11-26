---
name: Formagen
description: Build a form once. Every response stays tied to the version it answered.
colors:
  brand: "#5a1f4b"
  on-brand: "#ffffff"
  on-brand-muted: "#e5cbdd"
  brand-line: "rgb(255 255 255 / 0.22)"
  primary: "#5a1f4b"
  primary-hover: "#451638"
  primary-text: "#7a2c67"
  primary-soft: "#f6ecf3"
  on-primary: "#ffffff"
  focus: "#7a2c67"
  bg: "#ffffff"
  surface: "#ffffff"
  surface-raised: "#f6f3f5"
  text: "#2b282c"
  text-muted: "#67626a"
  border: "#ebe7ea"
  border-strong: "#8e8890"
  danger: "#b8261a"
  on-danger: "#ffffff"
  success: "#17724a"
  live-signal: "#7ee2b0"
  brand-dark: "#4d1a40"
  on-brand-muted-dark: "#e2c6da"
  primary-dark: "#e3a8d3"
  primary-hover-dark: "#eebee0"
  primary-text-dark: "#e8b4da"
  primary-soft-dark: "#2c1a27"
  on-primary-dark: "#1d0f19"
  bg-dark: "#141214"
  surface-raised-dark: "#1f1b1f"
  text-dark: "#eeeaed"
  text-muted-dark: "#aaa3a9"
  border-dark: "#2d282d"
  border-strong-dark: "#746c74"
  danger-dark: "#ff8a7f"
  success-dark: "#63d39a"
typography:
  display:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.6rem, 1.4rem + 4.2vw, 4.75rem)"
    fontWeight: 640
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 640
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 640
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title-sm:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 640
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 420
    lineHeight: 1.55
  body-sm:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 420
    lineHeight: 1.5
  label:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 530
    lineHeight: 1.4
  label-caps:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 530
    lineHeight: 1.4
    letterSpacing: "0.07em"
  caption:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 420
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "8": "3rem"
  "10": "4rem"
  "12": "6rem"
  "16": "8rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-raised}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    rounded: "{rounded.md}"
    height: "40px"
  cta-pill-on-brand:
    backgroundColor: "{colors.on-brand}"
    textColor: "{colors.brand}"
    rounded: "{rounded.pill}"
    padding: "0 2rem"
    height: "48px"
  cta-pill-on-white:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "0 2rem"
    height: "48px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    height: "44px"
  chip-filter:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.875rem"
  chip-filter-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  live-bar:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.body-sm}"
    padding: "0.5rem 1.5rem"
  brand-band:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
  badge-new:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "0.1rem 0.5rem"
  sparkline:
    width: "112px"
    height: "28px"
---

# Design System: Formagen

## Overview

**Creative North Star: "The Plum Ledger"**

Formagen is a flat white ledger with one owned colour. Plum does not sprinkle; it fills whole regions: the landing nav and hero band, the public form's header band, the builder's live bar, the builder preview's header band and the demo's live bar. Everywhere else the page is plain white, held together by 1px solid rules and 1px dashed row dividers, with warm graphite text. Nothing floats: there are no shadows anywhere, and the old shadow tokens resolve to `none`.

The decoration is the data. A forms list carries a 14-day sparkline of real daily response counts per form; the live bar carries a green live dot and a dated strip of every published version. One typeface, Mona Sans, at in-between variable weights (420, 530, 640) keeps the UI soft rather than stark. The owner's craft bar is Groww's web app: flat, confident, one brand colour owning regions. It is a bar to meet, not a look to copy: no Groww green, no Groww type.

The confirmed rejection is the generic AI SaaS template this world replaced: Inter, an indigo accent, a cool grey-50 ground, soft-shadow cards.

**Key Characteristics:**
- One brand colour, plum, filling regions edge to edge rather than tinting small accents.
- Flat white everywhere else; depth by 1px lines, never by shadow.
- Mona Sans only, at 420 / 530 / 640.
- Small uppercase labels for pane titles and table headers.
- 8px-cornered controls; pills reserved for landing CTAs and filter chips.
- Real data (sparklines, dated versions, live state) as the ornament.

## Colors

A white and warm-graphite ground with a single deep plum that owns regions and doubles as the one action colour.

### Primary
- **Deep Plum** (brand / primary): the region colour for every band and bar, and the fill of primary buttons, selected chips and the closing CTA. Plum on white measures 12.1:1. In dark mode the bands deepen (brand-dark) and the action colour flips to a light orchid (primary-dark, 9.6:1 on the dark ground) with dark plum ink on it.
- **Plum Ink** (primary-text): the readable plum for links, active version keys, hover text and the focus ring on white.
- **Plum Wash** (primary-soft): the faint tint behind "new" badges, text selection, the sparkline's area fill and the outer focus halo on inputs.
- **Plum Pressed** (primary-hover): primary button and closing CTA hover.

### On-brand
- **White on Plum** (on-brand): headlines, wordmark, live badge and selected version keys inside plum regions.
- **Tinted Plum** (on-brand-muted): secondary text inside plum regions (lede, nav links, version dates, form notes); 8.0:1 on plum.
- **Plum Hairline** (brand-line): the 22% white border of ghost CTAs on plum and the connector rules in the version strip.

### Neutral
- **White** (bg, surface): the ground and every surface. They are the same value; surfaces are separated by rules, not tone.
- **Pale Mauve Grey** (surface-raised): hover fill for secondary buttons and rows only.
- **Warm Graphite** (text): body text, 14.6:1 on white.
- **Muted Graphite** (text-muted): help text, metadata, labels; 5.95:1 on white, 5.4:1 on surface-raised.
- **Hairline** (border): every structural 1px rule and the dashed row dividers.
- **Control Edge** (border-strong): input, secondary button and chip outlines, and dashed empty-state and "add field" borders; 3.46:1 so controls meet WCAG 1.4.11.

### Status
- **Signal Red** (danger): errors, invalid inputs, destructive buttons.
- **Ledger Green** (success): the small live dot beside a published form on white.
- **Live Mint** (live-signal): the live dot inside a plum bar only, where success green would sink.

### Named Rules
**The Region Rule.** Plum fills a whole region edge to edge (a band, a bar, a header) or a single control (primary button, selected chip). It is never a border accent, a gradient, or a tinted card.

**The One Ground Rule.** Background and surface are both white. Never introduce a grey page ground to make cards read; use a 1px rule instead.

**The Contrast Floor Rule.** Text pairs stay at or above 5:1 and control edges and focus at or above 3:1, in both schemes.

## Typography

**Display Font:** Mona Sans (with ui-sans-serif, system-ui fallback)
**Body Font:** Mona Sans
**Label Font:** Mona Sans

**Character:** One variable grotesque at in-between weights. Headlines get weight and tight negative tracking; everything else stays at 420 or 530 so the page reads calm.

Mona Sans is self-hosted through next/font as the variable `--font-mona`.

### Hierarchy
- **Display** (640, fluid 2.6rem to 4.75rem, 1.04, -0.03em): the landing hero headline only, white on plum, max ~17ch.
- **Headline** (640, 2.25rem, 1.1 to 1.15, -0.025em): landing section titles and the closing line.
- **Title** (640, 1.5rem, 1.2): page h1 in the app; the preview band title. The public form title runs fluid 1.625rem to 2.125rem in the same weight.
- **Title Small** (640, 1.125rem, 1.3): h2, error summary title, builder form-name input.
- **Body** (420, 0.9375rem, 1.55): default text. Body Small (0.875rem) for tables, fields, nav.
- **Label** (530, 0.875rem): field labels, button text, chip text, form names in lists.
- **Label Caps** (530, 0.6875rem, 0.07em tracking, uppercase, muted): pane titles in the builder and demo, and table column headers. These are structural headings for a pane or column, not eyebrows over a headline.
- **Caption** (420, 0.75rem): status text, metadata, version dates, badges.

### Named Rules
**The Three Weights Rule.** Only 420, 530 and 640. Never 400/500/600/700; the in-between weights are the identity.

**The Proportional Figures Rule.** Numbers render `lining-nums proportional-nums`. Do not turn on tabular figures: Mona Sans's `tnum` draws a slashed zero.

**The Caps Are Furniture Rule.** Uppercase Label Caps names a pane or a column. It never sits above a headline as a kicker.

## Layout

Content columns are centred with fluid gutters (`clamp(1rem, 4vw, 2rem)`): the landing wraps at 68rem, the responses view at 72rem, the public form at 38rem, the builder preview card at 36rem, generic pages at 48rem. Spacing follows the 0.25rem-based scale in the frontmatter; section rhythm on the landing is 4rem blocks, panes pad 1.5rem.

The landing demo frame rises out of the plum band: it overlaps the band's bottom edge by a negative top margin so it sits half on colour, half on white. The app header is sticky, 3.5rem tall, white with a bottom rule. Landing sections are separated by a 1px rule drawn to the content column, not the box edge.

Responsive behaviour: at 56rem the demo editor collapses to one column and the preview moves first; at 36rem secondary nav links, the sparkline caption and the share path hide. Wide tables scroll horizontally with a right-edge fade mask as the scroll cue; only free-text columns wrap.

## Elevation & Depth

The system is flat. No surface uses a shadow; `--shadow-sm`, `--shadow-md` and `--shadow-frame` all resolve to `none`. Depth and grouping come from 1px solid rules (structure: pane edges, table header rules, frame borders, app header) and 1px dashed rules (rhythm: row dividers in tables, field lists, definition lists, the public form footer). The only `box-shadow` values in the build are focus halos (3px plum wash) and the live dot's pulse ring, which are state signals, not elevation.

### Named Rules
**The Line, Not Lift Rule.** Separate with a 1px rule; never with a shadow or a tonal card. Solid for structure, dashed for repeated rows.

## Shapes

Gentle, consistent corners: 6px for small inline controls (icon buttons, text buttons, title input), 8px for every standard control (buttons, inputs, selects, option inputs, add-field button), 12px for containers (demo frame, preview card, empty states, error summary). Pills (999px) are reserved for the landing CTAs, the version-filter chips and the small "new" badge. The brand mark is a plum tile with 8/32 rounded corners and a white geometric F; on plum it inverts to a white tile with a plum F. Dashed outlines mark places that invite an action or hold nothing yet (empty states, "add field").

## Components

### Buttons
Quiet and solid; one fill colour.
- **Shape:** gently rounded (8px), 40px tall, 1rem side padding, label weight 530 at 0.875rem.
- **Primary:** plum fill, white text; hover deepens to Plum Pressed.
- **Secondary:** white with a Control Edge 1px outline; hover fills Pale Mauve Grey.
- **Danger:** Signal Red fill.
- **States:** focus is a 2px Plum Ink outline offset 2px; active nudges down 1px; disabled drops to 55% opacity.
- **Text button:** no border, Plum Ink text, 6px corners.

### Landing CTAs (pill)
- **On plum:** white pill, plum ink, 48px, weight 640; hover takes the Plum Wash. The ghost partner is a transparent pill with a Plum Hairline border and white text, hover 12% white.
- **On white:** the closing CTA is a plum pill with white text.
- Pills appear only here and in filter chips; app buttons stay 8px.

### Chips (version filter)
- **Style:** transparent pill, Control Edge outline, Label type.
- **State:** hover turns the border plum and the text Plum Ink; the selected chip (`aria-pressed`) fills plum with white text.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** white.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline; empty states use a 1px dashed Control Edge.
- **Internal Padding:** 1.5rem to 2rem.

### Inputs / Fields
- **Style:** white, 1px Control Edge, 8px corners, 44px minimum height, 0.5rem / 0.75rem padding. Selects carry a drawn double chevron.
- **Hover:** border darkens to Muted Graphite.
- **Focus:** border turns Plum Ink with a 3px Plum Wash halo plus a 1px plum ring.
- **Error:** border and message in Signal Red; an error summary box (12px, red 1px border) links to each field.
- Labels are Label weight above the control; help text is muted Body Small.

### Navigation
- **Landing nav:** part of the plum region, 3.5rem tall; wordmark white at 640; links in Tinted Plum turning white on hover; a ghost pill "open app" link. Focus outlines turn white on plum.
- **App header:** sticky white bar, 3.5rem, bottom Hairline, mark plus wordmark at 640, account in muted Body Small.

### Tables
- Header cells in Label Caps over a solid Hairline; body rows separated by dashed rules; row hover tints Pale Mauve Grey; first and last columns sit flush with the column edge. Counts align end.

### Live Bar (signature)
The plum strip that states what respondents get right now. A bold "Live" badge with a mint dot (pulsing in the builder, static in the demo, stilled under reduced motion), the share path in Tinted Plum, and the version strip: every publish on one dated line, keys in white at 530, the live version at 640, joined by short Plum Hairline connectors. In the demo the strip items act as tabs, the selected one underlined in white.

### Sparkline (signature)
A 112 by 28 SVG of the last 14 days of real daily response counts, oldest first. Plum 1.5px line, Plum Wash area, a 2.25px plum dot on today, over a dashed Control Edge baseline. With no responses only the dashed baseline draws; it never invents a curve. It carries a text label for assistive tech.

### Brand Bands
The public form header and the builder preview header are the same plum band: title in white at 640, note in Tinted Plum, the flat white form directly below.

## Do's and Don'ts

### Do:
- **Do** fill whole regions with plum (bands, bars, headers) and keep everything else white.
- **Do** separate with 1px rules: solid for structure, dashed for repeated rows.
- **Do** use Mona Sans at 420, 530 or 640 only.
- **Do** use Label Caps (0.6875rem, 0.07em, uppercase, muted) for pane titles and table headers.
- **Do** keep controls at 8px corners, inputs 44px and buttons 40px tall.
- **Do** let real data decorate: sparklines from actual counts, dated versions, live state.
- **Do** switch focus outlines to white inside plum regions.

### Don't:
- **Don't** add shadows to any surface; the shadow tokens are `none` on purpose.
- **Don't** use a grey page ground, tinted cards or gradients.
- **Don't** introduce a second accent hue; green appears only as the small live dot.
- **Don't** use tabular figures (`tnum`); Mona Sans draws a slashed zero.
- **Don't** put an uppercase kicker or eyebrow above a headline.
- **Don't** use pills for app buttons; pills belong to landing CTAs, filter chips and the "new" badge.
- **Don't** draw a sparkline from placeholder data; empty is a dashed baseline.
- **Don't** return to Inter, indigo, cool grey-50 grounds or soft-shadow cards.
- **Don't** copy Groww's green or typeface; Groww is a craft bar, not a palette.
