import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { addField, publishSimpleForm, signIn, uniqueEmail } from "./helpers";

const scan = (page: Page) => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();

/** Readable failure output: rule, impact and the offending selectors. */
const summary = (violations: Awaited<ReturnType<typeof scan>>["violations"]) =>
  violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);

test.describe("WCAG 2.2 AA (axe)", () => {
  test("landing page", async ({ page }) => {
    await page.goto("/");
    expect(summary((await scan(page)).violations)).toEqual([]);
  });

  test("forms list, builder, public form and responses", async ({ page, context }) => {
    await signIn(page, uniqueEmail("a11y"));
    await expect(page.getByRole("heading", { name: "Build your first form" })).toBeVisible();
    expect(summary((await scan(page)).violations), "empty forms list").toEqual([]);

    const { id, path } = await publishSimpleForm(page, "Accessibility check");
    await addField(page, "Choice", "Size");
    await page.locator("#prop-condition").check();
    expect(summary((await scan(page)).violations), "builder").toEqual([]);

    const pub = await context.newPage();
    await pub.goto(path);
    expect(summary((await scan(pub)).violations), "public form").toEqual([]);
    await pub.getByRole("button", { name: "Submit" }).click();
    await expect(pub.getByText("This field is required").first()).toBeVisible();
    expect(summary((await scan(pub)).violations), "public form with errors").toEqual([]);
    await pub.getByLabel(/Name/).fill("Lin");
    await Promise.all([pub.waitForURL(/\/thanks$/), pub.getByRole("button", { name: "Submit" }).click()]);
    expect(summary((await scan(pub)).violations), "thanks page").toEqual([]);

    await page.goto(`/app/forms/${id}/responses`);
    await expect(page.locator("tbody tr")).toHaveCount(1);
    expect(summary((await scan(page)).violations), "responses").toEqual([]);

    await page.goto("/app");
    await expect(page.getByRole("link", { name: "Accessibility check" })).toBeVisible();
    expect(summary((await scan(page)).violations), "forms list").toEqual([]);
  });
});
