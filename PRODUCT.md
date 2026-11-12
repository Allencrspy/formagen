# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary:** people on small teams (founders, ops, HR, community leads) who need a form live quickly: a sign-up, an intake, a feedback survey. They build it, share a link, and read responses.
- **Respondents:** anyone who opens a public form link, often on a phone, sometimes with assistive technology or without JavaScript. They want to finish fast and know it worked.
- **Secondary:** recruiters and interviewers evaluating the author's engineering. Served by a short "How it's built" section and the GitHub link, not by the product's main story (Allen, 2026-11-12: product first).

## Product Purpose
Build a form, publish it as a fixed version, share a public link, and see every response, without responses breaking when the form changes later.
Success: a form goes from idea to shareable link in minutes, and every response stays readable against the exact version the respondent saw.

## Positioning
Every form is a versioned, server-driven schema. Publishing freezes a version; responses are tied to the version they were submitted against; the same schema drives the builder preview, the public page and server-side validation, so what you build is exactly what people fill in and what the server accepts. Public forms work without JavaScript.

## Operating Context
- Builders work at a desk: build, preview, publish, copy the link, come back later to read responses and export CSV.
- Respondents arrive from a shared link on any device and complete the form once.
- Sign-in is GitHub only (v1). One owner per form; no teams yet.

## Capabilities and Constraints
- Field types: short text, long text, email, number, select, checkbox, date. Validation: required, length, range. One conditional rule type: show a field when an earlier field equals a value.
- Publishing creates immutable versions (v1, v2…). Responses table: 25 per page, filter by version, CSV export.
- Stack: Next.js 16 App Router (Cache Components), TypeScript, CSS Modules with tokens in `src/components/ui/tokens.css`, Postgres (Neon), Auth.js, deployed to AWS with SST.
- Public form page must work with JavaScript disabled and ship minimal client JS.
- Not in v1: teams/roles, file uploads, multi-page forms, theming, integrations, payments. AI form generation is a possible v2.

## Brand Commitments
- Name: **Formagen**. No logo, palette or voice exists yet; open (Allen, 2026-11-12).
- Direction chosen by Allen for the visual pass: calm and premium.

## Evidence on Hand
- A live dev deployment and a public GitHub repo (github.com/Allencrspy/formagen).
- No customers, testimonials, usage numbers or benchmarks exist. Never invent them. Measured numbers will live in `docs/metrics.md` and may only be quoted from there.

## Product Principles
1. What you build is what people fill in: one schema, rendered and validated the same everywhere.
2. Old responses never break: versions are immutable and responses keep their version.
3. Respondents first: fast, accessible, works without JavaScript.
4. Honest product: no fabricated proof, no dark patterns.
5. Fewest clicks, obvious use (Allen, 2026-11-12): every core action takes the minimum number of clicks, and a first-time user can tell how to use each screen without instructions. Prefer direct manipulation and inline editing over menus, dialogs and settings pages; show the next step instead of hiding it.

## Accessibility & Inclusion
WCAG 2.2 AA for every surface; 0 axe violations on builder, public page and dashboard; visible keyboard focus; errors announced and linked to fields.
