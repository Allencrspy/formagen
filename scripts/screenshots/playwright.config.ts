import path from "node:path";
import { defineConfig } from "@playwright/test";
import base from "../../playwright.config";

/** Same server and env as the E2E suite, pointed at the screenshot script only. */
export default defineConfig({
  ...base,
  testDir: ".",
  testMatch: "screenshots.spec.ts",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  // Run `next start` from the repo root, not this folder.
  webServer: { ...(base.webServer as object), cwd: path.resolve(__dirname, "../..") } as typeof base.webServer,
});
