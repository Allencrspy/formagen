import { expect, test } from "@playwright/test";
import { addField, publish, publishSimpleForm, signIn, uniqueEmail, waitForSaved } from "./helpers";

test("a new version replaces the cached public page on the next visit", async ({ page, request }) => {
  await signIn(page, uniqueEmail("fresh"));
  const { path } = await publishSimpleForm(page, "Cached form");

  // Visit twice so v1 is in the page cache (the second response comes from it).
  await request.get(path);
  const cached = await request.get(path);
  expect(cached.headers()["cache-control"]).toMatch(/s-maxage=\d+/);
  expect(await cached.text()).not.toContain("Dietary needs");

  await addField(page, "Long text", "Dietary needs");
  await waitForSaved(page);
  await publish(page, 2);

  const after = await request.get(path);
  expect(after.status()).toBe(200);
  expect(await after.text()).toContain("Dietary needs");
});

test("a failed submit shows errors on the retry page, which is never cached", async ({ page, context }) => {
  await signIn(page, uniqueEmail("retry"));
  const { path } = await publishSimpleForm(page, "Retry form");

  const pub = await context.newPage();
  await pub.goto(path);
  await Promise.all([pub.waitForURL(/\/retry$/), pub.getByRole("button", { name: "Submit" }).click()]);
  await expect(pub.getByRole("alert").filter({ hasText: "There is a problem" })).toBeVisible();
  const retry = await pub.request.get(`${path}/retry`, { maxRedirects: 0 });
  expect(retry.headers()["cache-control"]).toMatch(/no-store/);
});
