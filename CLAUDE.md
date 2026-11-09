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
