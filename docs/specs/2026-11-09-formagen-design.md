# Formagen: Design Spec

**Date:** 2026-11-09 · **Owner:** Allen Binu Thomas · **Status:** draft for review

## 1. Why this project exists

Allen's resume already matches the core of Bengaluru frontend postings (React, TypeScript, architecture, design systems).
A market scan of 50 relevant postings (`portfolio/market-gap-analysis-2026-11-09.md`) found six gaps that a project can close honestly:

| Gap | Share of postings | How Formagen covers it |
|---|---|---|
| Performance optimisation, proven | 48% | Public form page tuned and measured (Lighthouse, bundle size), before/after recorded |
| Accessibility (WCAG) | ~50% | Forms built to WCAG 2.2 AA; axe checks in CI |
| E2E testing | 28% | Playwright covers the full flow in CI |
| Next.js | 28% | Built on the Next.js App Router |
| Cloud (AWS) | 28% | Deployed to AWS (Lambda, CloudFront, S3) with SST |
| GraphQL | 28% | Admin API is GraphQL |

It also fills the employment gap since May 2026 with a real, dated project ("Jun 2026 – Present" is only valid if work actually spans that period; otherwise use the true start date), and it extends Allen's strongest work story: server-driven UI at LeadSquared.

**Success criteria**
1. Live on a public URL, source on github.com/Allencrspy, with a README, an architecture diagram and screenshots.
2. All six gaps used for real and visible in the code.
3. Measured numbers recorded in the repo (Lighthouse, JS size, axe results, test counts) to use as resume metrics.
4. Allen can explain every part in an interview.
5. v1 shipped within about 3 weeks.

## 2. Product scope (v1)

Formagen is a small B2B-style form builder. A form is stored as a JSON schema, and every view of the form is rendered from it.

1. **Sign in** with GitHub. Each user owns their forms. No teams in v1.
2. **Form builder**
   - Field types: short text, long text, email, number, select, checkbox, date.
   - Validation: required; min/max for numbers; min/max length for text.
   - Conditional logic, one rule type: show field B only when field A equals a value.
   - Reorder fields by drag and drop and by keyboard (move up/down buttons).
   - Live preview beside the editor, rendered by the same renderer as the public page.
   - Draft is saved to the server; unsaved changes are flagged.
3. **Publishing and versions**
   - Publish freezes the current draft as an immutable version (v1, v2, …).
   - The public page always serves the latest published version.
   - Each response stores the version it was submitted against.
4. **Public form page** at `/f/[slug]`
   - Server-rendered; works with JavaScript disabled (plain HTML form posting to a Server Action).
   - With JavaScript on, it adds inline validation and conditional fields without a reload.
   - Conditional fields without JavaScript: all fields render, hidden-by-rule fields are ignored by server validation.
   - Errors: summary at the top, linked to each field, plus a message next to the field (`aria-describedby`, focus moved to the summary).
5. **Responses dashboard**
   - Paginated table (25 per page), newest first, with a version filter.
   - Columns come from the selected version's schema.
   - CSV export of the filtered set.

**Out of scope for v1:** teams and roles, file uploads, multi-page forms, theming, integrations/webhooks, payments, spam protection beyond a basic rate limit, AI form generation (candidate for v2).

## 3. Architecture

```
Admin app (builder, dashboard)            Public page /f/[slug]
  React client components                   React Server Component
  Zustand: builder state                    Server Action: submit
  TanStack Query + GraphQL Codegen          (no GraphQL, minimal JS)
            │ GraphQL over HTTP                     │
            ▼                                       ▼
  /api/graphql: GraphQL Yoga + Pothos      lib/forms service functions
            └──────────────┬────────────────────────┘
                     lib/schema (Zod)  ← shared form-schema + validation
                           │
                     Drizzle ORM → Neon Postgres
Auth: Auth.js (GitHub)     Deploy: SST → AWS Lambda + CloudFront + S3
```

**Why GraphQL is admin-only:** the admin side works with nested, related data (form → versions → responses) and benefits from typed queries.
The public page needs one read and one write, and must be as small and fast as possible, so it calls the service layer directly from the server.
Both paths go through the same service functions, so rules live in one place.

### Units

| Unit | Responsibility | Depends on |
|---|---|---|
| `lib/schema` | Zod definition of a form schema (discriminated union of field types), and `buildSubmissionValidator(schema)` that turns a schema into a Zod validator for answers, applying conditional rules | Zod only |
| `components/renderer` | Renders a form from a schema: one component per field type, from a registry keyed by field type. Unknown types render a fallback instead of crashing | `lib/schema`, UI kit |
| `components/ui` | Small design-system kit: tokens (CSS variables), Button, TextField, Select, Checkbox, Dialog (Radix), ErrorSummary | Radix for Dialog/Popover only |
| `lib/db` | Drizzle schema and client | Neon |
| `lib/forms` | Service functions: create/update draft, publish, get published version, submit response, list responses, export CSV. Enforces ownership | `lib/db`, `lib/schema` |
| `app/api/graphql` | Pothos schema over `lib/forms`; auth from the Auth.js session | `lib/forms`, Auth.js |
| `features/builder` | Builder UI: Zustand store (fields, selection, dirty flag), field list with dnd-kit, property panel, preview | renderer, GraphQL client |
| `features/responses` | Dashboard table, version filter, CSV download | GraphQL client |
| `app/f/[slug]` | Public page and submit Server Action | `lib/forms`, renderer |

## 4. Data model (Postgres)

- `users`, `accounts`, `sessions`: Auth.js tables.
- `forms`: id, owner_id, title, slug (unique), draft_schema (jsonb), created_at, updated_at.
- `form_versions`: id, form_id, version (int, unique per form), schema (jsonb), published_at.
- `responses`: id, form_id, version_id, answers (jsonb), submitted_at.

The schema JSON carries a `schemaVersion` number so the format itself can change later and old versions can still be read.

## 5. GraphQL API (admin)

- Queries: `me`, `forms`, `form(id)` (with `versions` and `responses(versionId, page)`).
- Mutations: `createForm`, `updateDraft(id, schema)`, `publishForm(id)`, `deleteForm(id)`.
- Every resolver checks the session user owns the form. Schemas are validated with `lib/schema` before saving.
- CSV export is a plain route handler (`/api/forms/[id]/export`) because GraphQL is a poor fit for file downloads.

## 6. Error handling

- **Invalid submission:** server returns field errors; the page shows the error summary and inline messages. Values entered are kept.
- **Invalid schema on save or publish:** rejected with the list of problems; shown in the builder next to the offending field.
- **Unknown or broken field in a stored schema:** that field renders a fallback; the rest of the form works. Logged.
- **Form not found or never published:** 404 page.
- **Not signed in / not owner:** admin routes redirect to sign-in; GraphQL returns an auth error.
- **Unexpected server errors:** Next.js error boundary page; error logged (CloudWatch via Lambda).
- **Abuse:** basic per-IP rate limit on the submit action.

## 7. Testing and quality

| Layer | Tool | What it covers |
|---|---|---|
| Unit | Vitest | `lib/schema` validation and conditional rules; builder store actions |
| Component | Vitest + React Testing Library | Renderer field types, error summary, keyboard reorder |
| End to end | Playwright | Sign-in (test login in CI), build → publish → submit → see response; no-JS submission |
| Accessibility | @axe-core/playwright in the E2E run | Builder, public page, dashboard: target 0 violations |
| Performance | Lighthouse CI on `/f/[slug]` | Score, LCP, total JS; baseline recorded before tuning |

CI (GitHub Actions) on every push: typecheck, lint, unit, E2E with axe, Lighthouse CI.
Measured results are kept in `docs/metrics.md` with date and commit so resume numbers are traceable.

## 8. Deployment

- SST deploys the Next.js app to AWS (Lambda for server code, CloudFront CDN, S3 for static assets).
- Neon Postgres (free tier). Secrets via SST secrets.
- Expected cost: about $0–2 per month at portfolio traffic. Set an AWS budget alert at $5.
- Separate stages: `dev` (personal) and `prod`.

## 9. Way of working

- Repo: `~/code/formagen`, public at github.com/Allencrspy/formagen.
- Small commits under Allen's name. A `CLAUDE.md` in the repo documents how AI is used.
- Claude writes most code; Allen reviews each step and should be able to explain it back. Allen writes parts of `lib/schema`, the GraphQL schema and the SST config with help, since those are the most likely interview topics.

## 10. Build order

1. Skeleton: Next.js, Auth.js, Drizzle + Neon, SST deploy to AWS, CI with typecheck and lint. Live URL.
2. `lib/schema`, renderer and UI kit, public page with Server Action submit. A hand-written form works end to end.
3. Builder: store, field list, property panel, reorder, conditional rule, preview, publish and versions; GraphQL API.
4. Responses dashboard and CSV export.
5. Quality pass: Playwright + axe, accessibility fixes, Lighthouse baseline, performance tuning, record metrics.
6. README, architecture diagram, screenshots, design notes. Add to resume.
