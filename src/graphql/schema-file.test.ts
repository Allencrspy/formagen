// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { printSortedSchema } from "./print";

describe("schema.graphql", () => {
  it("matches the schema built from code (run `npm run codegen` after changing the API)", () => {
    const committed = readFileSync(path.join(process.cwd(), "schema.graphql"), "utf8");
    expect(committed).toBe(printSortedSchema());
  });
});
