import { expect, test } from "@playwright/test";
import { addField, newForm, publish, signIn, uniqueEmail, waitForSaved } from "./helpers";

test("build, publish, respond and see the response", async ({ page, context }) => {
  await signIn(page, uniqueEmail("flow"));
  const id = await newForm(page);

  await page.locator("#form-title").fill("Beta sign-up");
  await addField(page, "Email", "Work email");
  await page.locator("#prop-required").check();

  await addField(page, "Choice", "Plan");
  await page.getByRole("button", { name: "Add option" }).click();
  await page.getByRole("textbox", { name: "Option 1" }).fill("Free");
  await page.getByRole("textbox", { name: "Option 2" }).fill("Team");

  // Company only shows when Plan is Team.
  await addField(page, "Short text", "Company");
  await page.locator("#prop-required").check();
  await page.locator("#prop-condition").check();
  await expect(page.locator("#prop-condition-field option:checked")).toHaveText("Plan");
  await page.locator("#prop-condition-value").selectOption({ label: "Team" });
  await waitForSaved(page);

  const path = await publish(page);
  expect(path).toMatch(/^\/f\/beta-sign-up-[a-z0-9]+$/);

  // Respondent, in a separate tab.
  const pub = await context.newPage();
  await pub.goto(path);
  await expect(pub.getByRole("heading", { name: "Beta sign-up" })).toBeVisible();
  const company = pub.getByLabel(/Company/);
  await expect(company).toBeHidden();
  await pub.getByLabel(/Work email/).fill("ada@example.com");
  await pub.getByLabel(/Plan/).selectOption({ label: "Team" });
  await expect(company).toBeVisible();

  // The now-visible conditional field is required.
  await pub.getByRole("button", { name: "Submit" }).click();
  await expect(pub.getByRole("alert").filter({ hasText: "Company" })).toBeVisible();
  await company.fill("Analytical Engines");
  await Promise.all([pub.waitForURL(/\/thanks$/), pub.getByRole("button", { name: "Submit" }).click()]);
  await expect(pub.getByText("Thanks, your response was recorded.")).toBeVisible();

  // Owner sees it.
  await page.goto(`/app/forms/${id}/responses`);
  const row = page.locator("tbody tr");
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("ada@example.com");
  await expect(row).toContainText("Team");
  await expect(row).toContainText("Analytical Engines");
});

test("another user can't open someone else's form", async ({ page, browser }) => {
  await signIn(page, uniqueEmail("owner"));
  const id = await newForm(page);

  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await signIn(otherPage, uniqueEmail("intruder"));
  await otherPage.goto(`/app/forms/${id}`);
  await expect(otherPage.getByRole("heading", { name: "Form not found" })).toBeVisible();
  const csv = await otherPage.request.get(`/api/forms/${id}/export`);
  expect(csv.status()).toBe(404);
  await other.close();
});
