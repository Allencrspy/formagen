import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // Each DB test boots an in-memory Postgres (PGlite) and runs migrations; under a full
    // parallel run that occasionally passes the 5s default. Raise the ceiling, don't retry.
    testTimeout: 20_000,
    hookTimeout: 20_000,
    // Bundle Pothos and Yoga through Vite so every `graphql` import resolves to the same copy
    // (graphql 17 ships separate dev/prod and ESM/CJS builds; two copies break instanceof checks).
    server: { deps: { inline: ["@pothos/core", "graphql-yoga"] } },
  },
});
