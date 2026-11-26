# Metrics

Every number here was measured, with the commit it was measured on. Only numbers in this file go on a resume.

| Date | Commit | Metric | Value | How measured |
|---|---|---|---|---|
| 2026-11-15 | 5ecaa55 | Unit and integration tests (Vitest) | 167 passing | `npm test` |
| 2026-11-15 | 5ecaa55 | End-to-end tests (Playwright) | 5 passing in CI | `npm run e2e`: full build → publish → respond → dashboard flow, ownership (404 for another user), no-JS submit, 2 axe suites |
| 2026-11-15 | 5ecaa55 | Axe WCAG 2.2 AA violations | 0 across 8 page states (0 before fixes, 0 after) | `@axe-core/playwright` tags wcag2a, wcag2aa, wcag21aa, wcag22aa on landing, forms list (empty and filled), builder, public form (clean and with errors), thanks, responses |
| 2026-11-15 | 5ecaa55 | E2E stability | 50/50 passed, retries off | `npx playwright test --repeat-each=10 --retries=0`, local |
| 2026-11-16 | 54ed0af → 38407fe | Public form Lighthouse performance (mobile) | 99 → 100 (median of 3; before included a 71 cold-start run, after 100/100/100) | `npx lighthouse` mobile preset ×3 on the live dev stage `/f/volunteer-sign-up-1ktopm`, from India |
| 2026-11-16 | 54ed0af → 38407fe | Public form server response time | 1,068 ms → 16 ms (Lighthouse observed, median of 3) | same Lighthouse runs, `server-response-time` audit |
| 2026-11-16 | 54ed0af → 38407fe | Public form time to first byte (curl) | 0.27–1.09 s → 0.04–0.06 s (8 requests each) | `curl -w %{time_starttransfer}` from India; before: every request ran the Lambda in Sydney; after: served from the CloudFront edge |
| 2026-11-16 | 54ed0af → 38407fe | Public form total transfer | 224 KB → 195 KB | Lighthouse `total-byte-weight` (dropped landing-page prefetch and the 15 KB favicon) |
| 2026-11-16 | 54ed0af → 38407fe | Public form JavaScript transfer | 146 KB → 135 KB | Lighthouse network requests, scripts only |
| 2026-11-16 | 54ed0af → 38407fe | Public form LCP (simulated slow 4G) | 1.91 s → 1.90 s (unchanged: dominated by simulated CSS and font, not the server) | Lighthouse `largest-contentful-paint`, median of 3 |
| 2026-11-16 | 38407fe | Lighthouse CI budgets | perf ≥ 95, a11y 100, CLS ≤ 0.01, JS ≤ 150 KB, total ≤ 215 KB; passing in CI | `lighthouserc.json`, GitHub Actions e2e job |
| 2026-11-16 | 38407fe | End-to-end tests (Playwright) | 7 passing in CI | adds publish-freshness and retry-page checks |
| 2026-11-16 | 38407fe | Unit and integration tests (Vitest) | 174 passing | `npm test` |
| 2026-11-26 | d6acf9c | Unit and integration tests (Vitest) | 177 passing | `npm test` (adds responses-per-day and Sparkline tests) |
| 2026-11-26 | d6acf9c | End-to-end tests (Playwright) | 7 passing, axe 0 violations | `npm run e2e` after the plum redesign |
