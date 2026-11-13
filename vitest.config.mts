import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // Bundle Pothos and Yoga through Vite so every `graphql` import resolves to the same copy
    // (graphql 17 ships separate dev/prod and ESM/CJS builds; two copies break instanceof checks).
    server: { deps: { inline: ["@pothos/core", "graphql-yoga"] } },
  },
});
