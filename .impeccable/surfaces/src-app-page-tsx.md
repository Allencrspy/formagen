---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope
Landing page `/` (Persuade). Visitors: small-team builders deciding whether to try Formagen; secondary: recruiters ("How it's built"). Action: Start building (GitHub sign-in → /app). Proof: the working mechanism itself; no social proof (none exists). Avoid: fake social proof; generic SaaS template (gradient hero, three icon cards, pricing). Interaction: fewest clicks, obvious use.

## Direction contract
THESIS: The category standard executed impeccably, Linear as the craft bar. The page sells versioned forms by showing the product working inside a crisp app frame. Refuses themed costume (the rejected Card Catalogue) and the template hero with three icon cards.

OWN-WORLD: One typeface (Inter, self-hosted) for everything, weights 400/500/600 only, tabular numerals. Cool near-white ground, white surfaces, hairline borders, 8–12px radii, soft layered shadows. One accent (indigo #5e5ce6 family) for primary actions, focus and the selected version; everything else neutral. Status shown with small neutral badges. Full light and dark themes.

STORY: The visitor reads one precise promise, then uses a real app frame: an editor listing the fields with a v1/v2 switcher, a live preview form beside it, and a responses table below where each row carries its version. Switching to v2 shows the new field; submitting adds a row tagged v2 while v1 rows keep their columns. They believe it and click Start building.

FIRST VIEWPORT: Slim top nav (wordmark left; How it works, GitHub, Sign in; small primary "Start building"). Left-aligned headline ~3.5–4rem semibold, tight tracking, max two to three lines; one-sentence subhead in muted text; primary + secondary action. The app frame begins inside the first viewport, full content width.

FORM: Canon (the category standard), taken through the standing exit after Allen rejected the assigned Card Catalogue; craft bar Linear. Seed key 1976bcc5.

SIGNATURE INTERACTION: Submitting the preview inserts a new row at the top of the responses table with a brief accent highlight that settles to neutral; respects reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Operate surfaces (public form, builder, dashboard) inherit this system in Tasks 10, 13, 14.
