/**
 * Regenerates the README screenshots in docs/screenshots. Not part of CI.
 *   npx playwright test --config scripts/screenshots/playwright.config.ts
 * Needs the same local Postgres as the E2E suite (E2E_DATABASE_URL).
 */
import { expect, test, type Page } from "@playwright/test";
import { Client } from "pg";
import { addField, newForm, publish, signIn, waitForSaved } from "../../e2e/helpers";

const OUT = "docs/screenshots";

async function respond(page: Page, path: string, email: string, plan: "Free" | "Team", company?: string) {
  await page.goto(path);
  await page.getByLabel(/Work email/).fill(email);
  await page.getByLabel(/Plan/).selectOption({ label: plan });
  if (company) await page.getByLabel(/Company/).fill(company);
  await Promise.all([page.waitForURL(/\/thanks$/), page.getByRole("button", { name: "Submit" }).click()]);
}

test("README screenshots", async ({ page, context }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  // A readable name in the header. Re-running adds another form to this user's list.
  await signIn(page, "allen@example.com");
  const id = await newForm(page);

  await page.locator("#form-title").fill("Beta sign-up");
  await addField(page, "Email", "Work email");
  await page.locator("#prop-required").check();
  await addField(page, "Choice", "Plan");
  await page.getByRole("button", { name: "Add option" }).click();
  await page.getByRole("textbox", { name: "Option 1" }).fill("Free");
  await page.getByRole("textbox", { name: "Option 2" }).fill("Team");
  await addField(page, "Short text", "Company");
  await page.locator("#prop-required").check();
  await page.locator("#prop-condition").check();
  await page.locator("#prop-condition-value").selectOption({ label: "Team" });
  await waitForSaved(page);
  const path = await publish(page);

  const pub = await context.newPage();
  await pub.setViewportSize({ width: 1440, height: 900 });
  await respond(pub, path, "ada@example.com", "Team", "Analytical Engines");
  await respond(pub, path, "grace@example.com", "Free");
  await respond(pub, path, "alan@example.com", "Team", "Bletchley Labs");

  // Public form after choosing Team (conditional field revealed), plus the error summary.
  await pub.goto(path);
  await pub.getByLabel(/Plan/).selectOption({ label: "Team" });
  await pub.getByRole("button", { name: "Submit" }).click();
  await expect(pub.getByRole("alert").filter({ hasText: "Company" })).toBeVisible();
  await expect(pub.getByRole("button", { name: "Submit" })).toBeEnabled();
  await pub.screenshot({ path: `${OUT}/public-form-errors.png` });

  // Publish a v2 so the version strip and the responses filter have more than one entry.
  await page.goto(`/app/forms/${id}`);
  await addField(page, "Short text", "How did you hear about us?");
  await waitForSaved(page);
  await publish(page, 2);

  // Builder with the conditional field selected, so the rule shows in the panel.
  await page.goto(`/app/forms/${id}`);
  await page.getByText("Company", { exact: true }).first().click();
  await expect(page.locator("#prop-condition")).toBeChecked();
  await page.mouse.move(0, 0);
  await page.screenshot({ path: `${OUT}/builder.png` });

  await page.goto(`/app/forms/${id}/responses`);
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await page.screenshot({ path: `${OUT}/responses.png` });

  // Spread synthetic sample responses over the last two weeks so the list's sparkline
  // shows a realistic shape. Screenshot data only, never production.
  const db = new Client({ connectionString: process.env.E2E_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/formagen_e2e" });
  await db.connect();
  await db.query(
    `insert into responses (form_id, version_id, answers, submitted_at)
     select r.form_id, r.version_id, r.answers, now() - (d || ' days')::interval
     from (select * from responses where form_id = $1 limit 1) r,
          unnest(array[1,1,2,3,3,3,5,6,6,8,9,9,9,9,11,12,13]) d`,
    [id],
  );
  await db.end();

  await page.goto("/app");
  await expect(page.getByRole("link", { name: "Beta sign-up" }).first()).toBeVisible();
  await page.screenshot({ path: `${OUT}/forms-list.png` });

  // Landing, desktop and phone.
  await page.goto("/");
  await page.screenshot({ path: `${OUT}/landing.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${OUT}/landing-mobile.png`, fullPage: true });
  await pub.setViewportSize({ width: 390, height: 844 });
  await pub.goto(path);
  await pub.screenshot({ path: `${OUT}/public-form-mobile.png`, fullPage: true });
});
