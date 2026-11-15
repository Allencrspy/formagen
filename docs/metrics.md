# Metrics

Every number here was measured, with the commit it was measured on. Only numbers in this file go on a resume.

| Date | Commit | Metric | Value | How measured |
|---|---|---|---|---|
| 2026-11-15 | 5ecaa55 | Unit and integration tests (Vitest) | 167 passing | `npm test` |
| 2026-11-15 | 5ecaa55 | End-to-end tests (Playwright) | 5 passing in CI | `npm run e2e`: full build → publish → respond → dashboard flow, ownership (404 for another user), no-JS submit, 2 axe suites |
| 2026-11-15 | 5ecaa55 | Axe WCAG 2.2 AA violations | 0 across 8 page states (0 before fixes, 0 after) | `@axe-core/playwright` tags wcag2a, wcag2aa, wcag21aa, wcag22aa on landing, forms list (empty and filled), builder, public form (clean and with errors), thanks, responses |
| 2026-11-15 | 5ecaa55 | E2E stability | 50/50 passed, retries off | `npx playwright test --repeat-each=10 --retries=0`, local |
