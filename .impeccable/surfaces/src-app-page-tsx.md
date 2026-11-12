---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope
Landing page `/` (Persuade). Visitors: small-team builders deciding whether to try Formagen; secondary: recruiters (served by the "How it's built" section). Action: Start building (GitHub sign-in → /app). Proof: the working mechanism itself, no social proof (none exists; never invent). Avoid: fake social proof, generic SaaS template (gradient hero, three icon cards, pricing table). Interaction rule: fewest clicks, obvious use.

## Direction contract
THESIS: Formagen is a modern card catalogue. A form is a typed index card; publishing files a new card (v1, v2); responses are filed behind the version they answered and never mix. Refuses the category default: headline + screenshot + three feature cards.

OWN-WORLD: Cool white card stock (#ffffff on a #eef1f3 room) with pale blue ruling and one red header rule; a grey-green steel drawer strip (#5b6b63 family) with a label holder; guide-card tabs for versions; typed entries in Courier Prime; headings in Libre Franklin (institutional signage); small red date stamps for "filed" and server verdicts. Calm, crisp, never yellowed or nostalgic.

STORY: In one viewport the visitor sees a form defined as a card, fills in the real form generated from it, files it, and watches the response land in its version's drawer row with a date stamp. Switching the tab to v2 adds a field; v1 responses keep their own columns. They understand "versioned, never breaks", believe it because they did it, and click Start building.

FIRST VIEWPORT: Steel drawer strip as nav (label holder "Formagen", links How it works / GitHub, pull handle "Sign in"). Headline left-aligned above the card at ~3.5rem: "Build a form once. Every response stays filed against the version it answered." One primary action "Start building" beside a quiet "Sign in with GitHub" note. Below, the large index card spans the content width: guide tabs v1 · v2 on its top edge; left column the typed schema entries on ruled lines; right column the live form; under the card, the filed-responses rows grouped by version.

FORM: The Card Catalogue, candidate 5 of 7 on my ordered list (library catalogue cards and index files). Seed key 1976bcc5. Raises: strict row grid for live state (split-flap); visible provenance on every piece (quilt); one ruling grid for the whole page (ASCII); three typographic voices — builder typed mono, respondent sans, server red stamp (Massin).

SIGNATURE INTERACTION: Filing. Submitting the demo form slides a slim response card into its version row and a red date stamp lands on it (one authored motion, ease-out, respects reduced motion).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Operate surfaces (public form, builder, dashboard) inherit this world in Tasks 10, 13, 14; public form stays system-font only for performance.
