import { expect, test } from "@playwright/test";
import { publishSimpleForm, signIn, uniqueEmail } from "./helpers";

test("the public form works without JavaScript", async ({ page, browser }) => {
  await signIn(page, uniqueEmail("nojs"));
  const { path } = await publishSimpleForm(page, "No script RSVP");

  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const pub = await ctx.newPage();
  await pub.goto(path);

  // Empty submit: full page round trip, error summary at the top, field error inline.
  await Promise.all([pub.waitForLoadState("load"), pub.getByRole("button", { name: "Submit" }).click()]);
  await expect(pub.getByRole("alert").filter({ hasText: "There is a problem" })).toBeVisible();
  await expect(pub.getByText("This field is required").first()).toBeVisible();

  await pub.getByLabel(/Name/).fill("Grace");
  await Promise.all([pub.waitForURL(/\/thanks$/), pub.getByRole("button", { name: "Submit" }).click()]);
  await expect(pub.getByRole("heading", { name: "Thanks, your response was recorded." })).toBeVisible();
  await ctx.close();
});
