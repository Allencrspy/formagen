import { expect, type Page } from "@playwright/test";

/** A unique email per test, so parallel tests never share a user. */
export const uniqueEmail = (tag: string) => `${tag}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;

/** Signs in with the E2E-only test login and lands on the forms list. */
export async function signIn(page: Page, email: string) {
  await page.goto("/api/auth/signin");
  await page.getByLabel("Email").fill(email);
  await Promise.all([page.waitForURL((url) => !url.pathname.startsWith("/api/auth")), page.getByRole("button", { name: "Test login" }).click()]);
  await page.goto("/app");
  await expect(page.getByRole("heading", { name: "Your forms" })).toBeVisible();
}

/** One click from the forms list into a new form's builder. Returns the form id. */
export async function newForm(page: Page): Promise<string> {
  await Promise.all([page.waitForURL(/\/app\/forms\/[0-9a-f-]{36}$/), page.getByRole("button", { name: "New form" }).first().click()]);
  await expect(page.locator("#form-title")).toBeVisible();
  return page.url().split("/").pop()!;
}

export async function addField(page: Page, type: string, label: string) {
  await page.getByRole("button", { name: `Add ${type} field` }).click();
  await page.locator("#prop-label").fill(label);
}

export async function waitForSaved(page: Page) {
  await expect(page.getByText("All changes saved")).toBeVisible({ timeout: 10_000 });
}

/** Publishes and returns the public path, e.g. /f/feedback-1ab2cd. */
export async function publish(page: Page, version = 1): Promise<string> {
  await page.getByRole("button", { name: version === 1 ? "Publish" : "Publish new version" }).click();
  await expect(page.getByText(`v${version} live`)).toBeVisible({ timeout: 10_000 });
  return (await page.locator("a[href^='/f/']").getAttribute("href"))!;
}

/** Builds and publishes a one-field form ("Name", required). Returns its public path. */
export async function publishSimpleForm(page: Page, title: string): Promise<{ id: string; path: string }> {
  const id = await newForm(page);
  await page.locator("#form-title").fill(title);
  await addField(page, "Short text", "Name");
  await page.locator("#prop-required").check();
  await waitForSaved(page);
  return { id, path: await publish(page) };
}
