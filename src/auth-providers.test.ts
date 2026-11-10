// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildProviders } from "./auth-providers";

// Auth.js resolves a provider's id as `options.id ?? id` (a custom id lives in options).
const ids = (env: Record<string, string | undefined>) =>
  buildProviders(env, async () => null).map((p) => {
    const provider = typeof p === "function" ? p() : p;
    return (provider as { options?: { id?: string } }).options?.id ?? provider.id;
  });

describe("buildProviders", () => {
  it("offers only GitHub by default", () => {
    expect(ids({})).toEqual(["github"]);
  });

  it("offers only GitHub in production even if other flags are set", () => {
    expect(ids({ NODE_ENV: "production", E2E_TEST_LOGIN: "0" })).toEqual(["github"]);
  });

  it("adds the test login only when E2E_TEST_LOGIN is exactly 1", () => {
    expect(ids({ E2E_TEST_LOGIN: "1" })).toEqual(["github", "test-login"]);
    expect(ids({ E2E_TEST_LOGIN: "true" })).toEqual(["github"]);
  });
});
