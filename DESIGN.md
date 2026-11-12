---
name: Formagen
description: Versioned forms, filed like a modern card catalogue.
colors:
  room: "#eef1f3"
  card-stock: "#ffffff"
  card-stock-raised: "#f5f7f8"
  drawer-steel: "#4f5d57"
  drawer-steel-deep: "#3f4b46"
  on-steel: "#f3f5f4"
  on-steel-muted: "#d3dbd7"
  ink: "#1b2329"
  ink-muted: "#56636b"
  hairline: "#d9e1e6"
  control-edge: "#6b7a82"
  ruling-blue: "#d3e2ef"
  header-rule-red: "#c8453b"
  primary: "#24507a"
  primary-hover: "#1b3f61"
  on-primary: "#ffffff"
  stamp-red: "#b3261e"
  success: "#11713a"
  focus-amber: "#ffbf47"
typography:
  display:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.3rem + 2.6vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  typed:
    fontFamily: "Courier Prime, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "2rem"
  stamp:
    fontFamily: "Courier Prime, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.04em"
  label-holder:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  slip: "2px"
  label: "3px"
  card: "4px"
  control: "6px"
  pull: "999px"
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
  rule-gap: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.card-stock-raised}"
  button-danger:
    backgroundColor: "{colors.stamp-red}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
  index-card:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  drawer-strip:
    backgroundColor: "{colors.drawer-steel}"
    textColor: "{colors.on-steel}"
    padding: "0.75rem 2.5rem"
  label-holder:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    typography: "{typography.label-holder}"
    rounded: "{rounded.label}"
    padding: "0.35rem 0.9rem"
  guide-tab:
    backgroundColor: "{colors.card-stock-raised}"
    textColor: "{colors.ink-muted}"
    padding: "0.5rem 2rem 0.75rem"
    width: "9.5rem"
  guide-tab-selected:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
  filing-slip:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slip}"
    padding: "0.55rem 1rem"
  stamp:
    textColor: "{colors.stamp-red}"
    typography: "{typography.stamp}"
    rounded: "{rounded.label}"
    padding: "0 0.4rem"
  pull-handle:
    textColor: "{colors.on-steel}"
    rounded: "{rounded.pull}"
    padding: "0.4rem 1rem"
---

# Design System: Formagen

## Overview

**Creative North Star: "The Card Catalogue"**

Formagen is a modern card catalogue. A form is a typed index card; publishing files a new card behind a version guide (v1, v2); responses are filed behind the version they answered and never mix. The material world is cool white card stock lying in a pale grey room, pale blue ruling on the card face, a single red rule across each card's header, grey-green steel drawer strips with paper label holders, and small red date stamps where something is filed or the server rules on it. It is calm, crisp and institutional: a well-run reading room in daylight, never yellowed, sepia or nostalgic.

The system is quiet by default and only becomes expressive at the moment of filing. Density is moderate: content sits on a 2rem ruling, rows are evenly spaced like index lines, and colour is held back so that the red rule, the red stamp and the ink-blue action each mean one thing. Depth comes from paper on a surface (soft ambient shadow, hairline edge), never from glossy or floating chrome.

Three typographic voices carry provenance: the institution speaks in Libre Franklin signage, the builder's card is typed in Courier Prime, and the respondent's form is plain system sans. A reader should be able to tell who "wrote" any piece of text by its face alone.

**Key Characteristics:**
- Cool white card stock (card-stock) on a pale room (room); steel drawer strips frame navigation and drawers.
- One red header rule per card; red stamps for filing and server verdicts; ink blue for the action.
- Three voices: Libre Franklin signage, Courier Prime typed entries, system sans for forms and app UI.
- Card faces ruled on a 2rem gap; typed entries sit on the lines.
- Versions are guide-card tabs with cut shoulders; responses are slim upright slips filed behind them.
- One signature motion: filing (slip drops in, stamp lands), off under reduced motion.

## Colors

A restrained institutional palette: cool neutrals and steel, one ink blue for action, and red kept for marks of record.

### Primary
- **Ink Blue** (primary): the only action colour. Primary buttons, the landing "Start building" call, links, checkbox accent, caret and (in light mode) the focus ring. Hover deepens to Deep Ink Blue (primary-hover). On white it reads at 8.4:1.

### Secondary
- **Drawer Steel** (drawer-steel → drawer-steel-deep): grey-green steel, applied as a top-to-bottom gradient from drawer-steel to drawer-steel-deep. Frames navigation (the drawer-strip nav), the front of every drawer, and the footer (drawer-steel-deep flat). Text on steel uses On-Steel (on-steel, 6.3:1 on the light end) or On-Steel Muted (on-steel-muted) for secondary marks and the label-holder ring.

### Tertiary
- **Header Rule Red** (header-rule-red): decorative only, never text. The 2px rule under a card head, the 2px top edge of index and colophon cards and of each filing slip, and the 3px inset top of the selected guide tab.
- **Stamp Red** (stamp-red): the red of record. Filing stamps, the call number on a card head, and server verdicts (errors, ErrorSummary border, danger button share this value as `--color-danger`). 6.5:1 on white.

### Neutral
- **Reading Room** (room): page background.
- **Card Stock** (card-stock): card faces, slips, label holders, inputs.
- **Raised Stock** (card-stock-raised): unselected guide tabs, drawer bodies, secondary-button hover.
- **Catalogue Ink** (ink): all primary text (15.9:1 on white).
- **Faded Ink** (ink-muted): help text, meta, notes (≥ 5.4:1 on every light surface).
- **Hairline** (hairline): card edges, row dividers, pane dividers. Decorative; never the only boundary of a control.
- **Control Edge** (control-edge): 2px borders on inputs and secondary buttons (4.4:1 on white, above the 3:1 non-text floor).
- **Ruling Blue** (ruling-blue): the card-face ruling, index/colophon row rules, text selection. Decorative only.
- **Success Green** (success): confirmations (6.1:1 on white).
- **Signal Amber** (focus-amber): focus ring on steel, and the focus colour for the whole dark theme.

Dark mode (prefers-color-scheme) re-maps every token in `tokens.css`; the landing page pins itself light with `data-theme="light"` because its scene is a daytime desk. Values for dark live in the sidecar.

### Named Rules
**The Red Is Record Rule.** Red appears only as the card header rule and as marks of record: filing stamps, call numbers and server verdicts. It is never a button fill for ordinary actions, a highlight, or decoration.

**The One Action Colour Rule.** Ink Blue is the only colour that means "do this". If two things on a screen are ink blue and filled, one of them is wrong.

**The Ruling Carries No Text Rule.** Ruling Blue, Header Rule Red and Hairline are decorative; no text or control boundary may depend on them for contrast.

## Typography

**Display Font:** Libre Franklin (with system-ui, sans-serif), loaded by next/font on the landing page only
**Body Font:** system sans (system-ui, -apple-system, Segoe UI, Roboto)
**Label/Mono Font:** Courier Prime (with ui-monospace, SF Mono, Menlo), loaded by next/font on the landing page only; other surfaces fall back to the system monospace through `--font-typed`

**Character:** Franklin Gothic signage for the institution, a typewriter for the card, and the reader's own system face for the form. The pairing is about provenance, not decoration.

### Hierarchy
- **Display** (800, clamp(2.25rem, 1.3rem + 2.6vw, 3.4rem), 1.05, -0.03em): the landing hero headline only. The closing line uses the shared `--text-display` step (clamp(2.25rem, 1.4rem + 3.2vw, 3.75rem)) at the same weight and tracking.
- **Headline** (800, 2.5rem, -0.025em): section titles on the landing page.
- **Title** (700–800, 1.25rem): card titles, index terms. App-wide h1 is 1.75rem/1.15 and h2 1.25rem/1.25 in the display face variable (system sans outside the landing page), tracking -0.015em, balanced wrapping.
- **Body** (400, 1rem, 1.5, tabular numerals): forms, app UI and running text. Landing ledes run 1.125rem in Faded Ink at ≤ 40rem; prose at ≤ 38rem.
- **Typed** (400/700, 1rem on a 2rem line): schema entries, version keys, call numbers, slip names and summaries, colophon records.
- **Stamp** (700, 0.8125rem, uppercase, 0.04em): filing stamps only, rotated -2deg inside a 1.5px currentColor border.
- **Label Holder** (700, 0.875rem, uppercase, 0.08em; 0.8125rem for drawer labels): the paper label slotted into a steel strip. Uppercase tracking lives only here and on stamps.

### Named Rules
**The Three Voices Rule.** Libre Franklin is the institution (headings, label holders), Courier Prime is the builder's typed record (entries, call numbers, version keys, filed records, stamps), system sans is the respondent and the app. Never cross them: no Courier for decoration or body copy, no Franklin inside a respondent's form.

**The System Font Floor Rule.** The public form page (/f/[slug]) and app screens ship system fonts only; sourced faces load on the landing page via next/font and nowhere else unless performance budgets are re-measured.

## Layout

Content sits in a 72rem column with a fluid gutter (clamp(1rem, 4vw, 2.5rem)); app pages default to a 48rem reading column. Spacing follows one 8px-based scale (0.25rem to 6rem).

The ruling is the rhythm. Card faces are ruled every `rule-gap` (2rem), and typed entries take `line-height: rule-gap` so text sits on the lines. Index and colophon rows use a compressed ruling: line height 0.75 × rule-gap (1.5rem) with rule-gap / 2 (1rem) block padding on index rows, ruled with Ruling Blue between rows.

The hero is left-aligned: headline and lede share a 1.6fr / 1fr grid aligned to the baseline, actions below, then the full-width demo card. The demo card splits 5fr (typed card) / 6fr (live form) with a hairline between panes. Drawer rows are a 7rem guide column beside the slips. Section dividers are 1px hairlines inset to the content column, not the padded box edge.

Breakpoints: at 52rem every two-column grid (hero, card body, drawer rows, split sections, index rows) collapses to one column and the pane divider turns horizontal; at 30rem guide tabs narrow to 7.5rem, card padding drops to 1rem and secondary nav links hide.

### Named Rules
**The On The Line Rule.** Anything typed on a card face sits on the 2rem ruling; any listing of records uses the 0.75 × rule-gap line with half-gap padding. Do not invent a third row rhythm.

## Elevation & Depth

Paper on a desk: flat surfaces with a hairline edge and a soft ambient shadow, never glossy layers or hard offsets. Cards lift a little off the room; slips cast a faint upward shadow onto the slip in front of them; steel strips get a 1px inner highlight to read as pressed metal.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 2px rgb(27 35 41 / 0.06), 0 8px 24px -8px rgb(27 35 41 / 0.14)`): index cards, index and colophon lists, paired with a 1px hairline ring.
- **Card lift** (`box-shadow: 0 2px 4px rgb(27 35 41 / 0.08), 0 16px 32px -12px rgb(27 35 41 / 0.22)`): only during motion, as a slip is being filed.
- **Slip edge** (`box-shadow: 0 -1px 0 var(--color-border), 0 -6px 12px -10px rgb(27 35 41 / 0.35)`): slips standing in a drawer.
- **Steel sheen** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08)`): drawer strips and drawer fronts.

### Named Rules
**The Paper Not Plastic Rule.** Shadows are ambient and soft and only describe paper resting or moving. No hard offset shadows, no coloured glows as a system device, no stacked elevation tiers.

## Shapes

Nearly square. Cards and drawers take a 4px corner (card), slips 2px on top only, label holders and stamps 3px, controls 6px. The only round form is the pull handle (999px) on the steel strip, read as a drawer pull.

Guide-card tabs have cut shoulders: a trapezoid clip (0.9rem inset at each top corner), staggered 2rem further right per version like guides in a drawer, the selected tab raised 4px with a red inset top. Card heads close with a 2px red rule; index, colophon and slip edges carry a 2px red top edge. Edges are top rules, never side stripes.

## Components

### Buttons
Plain, firm, filed-paper weight.
- **Shape:** gently squared (6px), 2px border slot, minimum 2.75rem tall (44px touch target).
- **Primary:** Ink Blue fill, white text, weight 600, 0.5rem × 1rem padding. One per view where possible; on the landing page the primary call is the larger "Start building" (3rem tall, 2rem inline padding, weight 700).
- **Hover / Focus:** hover deepens to primary-hover; focus is a 3px solid ring in the focus colour at 2px offset; active nudges 1px down; disabled drops to 0.6 opacity.
- **Secondary:** card stock with a 2px Control Edge border, hover to raised stock.
- **Danger:** Stamp Red fill; reserved for destructive, server-consequential actions.

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** card stock on the room.
- **Shadow Strategy:** Card rest plus a 1px hairline ring (see Elevation & Depth).
- **Border:** hairline; the head or top edge carries the 2px red header rule.
- **Internal Padding:** 1rem block / 2rem inline on card heads and panes, 3rem bottom on card faces.
- **Call number:** version key in typed 700 Stamp Red at the right of the card head.

### Inputs / Fields
- **Style:** card stock, 2px Control Edge border, 6px corner, 0.5rem × 0.75rem padding, max 32rem wide; labels 600 above, "(required)" in Faded Ink, help text 0.875rem Faded Ink.
- **Focus:** 3px focus ring at 2px offset.
- **Error / Disabled:** border turns Stamp Red with `aria-invalid`; the error message (600, 0.875rem, Stamp Red) and help are linked through `aria-describedby`. ErrorSummary sits above the form with a 4px Stamp Red border, takes focus when errors appear, and links each error to its field.

### Navigation
- **Drawer strip:** steel gradient bar; left a label holder (card stock label, 3px corner, uppercase Franklin, ringed in on-steel-muted) naming the product; links in on-steel at 0.875rem, underlined on hover; right a pill pull handle with an on-steel-muted border. Focus on steel uses Signal Amber. On narrow screens secondary links hide; the label holder and pull handle stay.
- **Footer:** flat drawer-steel-deep strip, on-steel-muted text, on-steel links.

### Guide-Card Tabs
Version switcher. Cut-shoulder tabs (min 9.5rem) on the top edge of the card, each holding the version key (typed 700) and its publish date (0.8125rem). Unselected: raised stock, Faded Ink, lift 3px on hover. Selected: card stock, ink, raised 4px, red inset top. Keyboard: roving tabindex with arrow keys; focus fills the tab with Ruling Blue.

### Drawer and Filing Slips
A drawer is a steel front (label holder plus count) over a raised-stock body. Each row pairs a guide (version key, field count) with its slips. Slips are slim upright cards: 2px red top edge, typed name, typed one-line summary truncated with an ellipsis, and a stamp at the end. Slips overlap slightly so only their top edges and stamps read.

### Stamp
Red typed mark of record: uppercase 0.8125rem, 1.5px border in currentColor, 3px corner, rotated -2deg. Reads "filed 12 Nov 2026" (with "sample ·" on sample data). Used for filing and server verdicts only.

### Filing (signature motion)
The one authored motion. A new slip drops 1.25rem into its row with Card lift easing to rest (560ms); its stamp lands 280ms later from rotate(-9deg) scale(1.8) (420ms). A newly added schema entry types in left to right (520ms clip). All use ease-out cubic-bezier(0.16, 1, 0.3, 1); the filed slip scrolls into view. Under `prefers-reduced-motion: reduce` all animation and transitions are removed and scrolling is instant; a polite live region announces "Response filed under v1."

## Do's and Don'ts

### Do:
- **Do** keep every text pair at ≥ 4.5:1 (aim for ≥ 6:1) and every control border and focus indicator at ≥ 3:1 against its surface.
- **Do** use Ink Blue (#24507a) for the single primary action and links; keep red for the header rule, stamps, call numbers and server verdicts.
- **Do** frame navigation and grouped records in steel drawer strips with a paper label holder.
- **Do** set typed entries on the 2rem ruling and record listings on the 0.75 × rule-gap line with rule-gap/2 padding.
- **Do** show versions as staggered guide-card tabs and file responses as slips behind their version's guide.
- **Do** link every error to its field with `aria-describedby` and move focus to the ErrorSummary on a failed submit.
- **Do** carry the world into Operate surfaces with metaphors and tokens, not sourced fonts: the public form (/f/[slug]) is a single card-stock card on the room in system sans with the red header rule; the builder is the typed card beside the live form; the responses dashboard is a drawer with steel front, version guides and stamped rows.
- **Do** keep the fewest clicks: show the next step on the surface (inline editing, direct manipulation) instead of menus, dialogs or settings pages.
- **Do** honour `prefers-reduced-motion` for every motion, including filing.

### Don't:
- **Don't** load Libre Franklin or Courier Prime on the public form or app screens; they stay system font.
- **Don't** use Courier Prime as decoration or for body copy; it marks typed records only.
- **Don't** nest cards inside cards; entries live on a card face, slips live in a drawer.
- **Don't** use coloured side borders or side stripes; accent edges are top rules only.
- **Don't** use hard offset shadows, coloured glows or glossy gradients; steel's subtle top-to-bottom gradient is the only gradient.
- **Don't** let the room or card stock warm toward cream, sepia or aged paper.
- **Don't** add uppercase tracked labels outside label holders and stamps (no kickers or eyebrows above headings).
- **Don't** invent social proof, metrics or testimonials to fill a card.
