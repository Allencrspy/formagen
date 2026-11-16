# Formagen

@AGENTS.md

A server-driven form builder: build a form, publish a version, share a public link, see responses.
Spec: `docs/specs/2026-11-09-formagen-design.md`. Plan: `docs/plans/2026-11-09-formagen.md`.

## Commands
- `npm run dev` / `npm run build`
- `npm run typecheck`, `npm run lint`, `npm test`

## How we work
- Built AI-first with Claude Code. Allen Binu Thomas reviews every task before the next starts.
- Test first (Vitest), small commits, explain non-obvious decisions in the commit body.
- Never add a number to `docs/metrics.md` that wasn't measured.

## How AI was used
Claude Code wrote most of the code from a written spec (`docs/specs`) and a task-by-task plan (`docs/plans`). Allen reviewed each task's design and diff before the next one started, and made the product and design calls. Examples of where review or testing changed the result:

- **UI direction.** The first design system was a themed "card catalogue" look. Allen rejected it as costume, and it was rebuilt as a calm product UI with one typeface (`c9340ad`). Allen also set the interaction rule: as few clicks as possible, and obvious without instructions. That's why "New form" opens the builder directly and drafts autosave.
- **Stale share link.** Running the E2E suite repeatedly exposed a bug: right after the first publish, the share link still used the placeholder slug and returned 404. The fix makes the publish mutation return the slug (`5ecaa55`).
- **Deploy that looked fine but wasn't.** The OpenNext version SST bundles served Next 16's prerendered shell without the request-time content. It was found on the live site and fixed by pinning OpenNext 4.1.16 (`36eacd8`).
- **Regression from a speed-up.** Edge caching made the HTML arrive faster, which exposed a layout shift (CLS 0.02) when JavaScript hid conditional fields. It was fixed with CSS, and CI now enforces a CLS budget (`38407fe`).
- **Numbers.** Every claim about performance or quality comes from `docs/metrics.md`, which records the commit it was measured on. When an LCP change didn't show up in the measurements, the metrics file says so ("unchanged") rather than leaving the row out.
