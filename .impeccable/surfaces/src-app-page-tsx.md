---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/f/[slug]/page.tsx","src/features/builder/BuilderPage.tsx","src/features/builder/FormsList.tsx","src/features/responses/ResponsesPage.tsx"]
---

## Scope
Whole product, one world: landing `/` (Persuade), forms list, builder, responses (Operate), public form `/f/[slug]`, thanks, retry, 404, sign-in. Visitors: small-team builders; respondents on phones; recruiters. Action: Start building. Proof: the working product and real data; no social proof exists. Constraints: one typeface, no themed costume, WCAG 2.2 AA, no-JS public form, Lighthouse budgets in CI.

## Direction contract
THESIS: Formagen stops looking like the default AI SaaS template (Inter, indigo, grey-50, soft-shadow cards, four-column "how it works"). It takes Groww's craft as the bar (Allen, 2026-11-26): flat white product UI, one owned typeface at in-between weights, one confident brand colour that owns whole regions, and data as the decoration.
OWN-WORLD: Plum #5A1F4B fills regions (landing hero band, public-form header band, builder live bar) with white and tinted-plum text. Everything else is flat white: no shadows, 1px borders, dashed row dividers, warm graphite text, small uppercase pane and table labels. Mona Sans only, weights 420/530/640. 8px controls, pill CTA on the landing only.
STORY: A builder sees a real product: their forms with a 14-day response sparkline each, a live bar with the dated version strip, a respondent form that looks branded and calm.
FIRST VIEWPORT: Landing: full-bleed plum band, centred large white headline, a one-sentence lede in tinted plum (one line at desktop), white pill "Start building"; the live demo frame sits on white, overlapping the band's bottom edge.
FORM: User-pinned reference, so the concept roll was waived: Allen, 2026-11-26, answering the direction question: "its so generic looking. thats the problem. can you see groww web app. its ui is nice." A pinned direction beats the roll (new-work.md). No seed key. Code-led; no image generation in this run.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Dark theme keeps plum regions; accent text lightens to stay ≥ 5:1.
