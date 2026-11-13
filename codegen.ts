import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["src/**/*.{ts,tsx}", "!src/graphql/generated/**"],
  ignoreNoDocuments: true,
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      config: {
        documentMode: "string",
        useTypeImports: true,
        enumsAsTypes: true,
        scalars: { JSON: "unknown", DateTime: "string" },
      },
    },
  },
};

export default config;
