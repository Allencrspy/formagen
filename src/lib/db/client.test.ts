import { describe, expect, it } from "vitest";
import { isNeonUrl } from "./client";

describe("isNeonUrl", () => {
  it("recognises Neon hosts, pooled or direct", () => {
    expect(isNeonUrl("postgresql://u:p@ep-cool-1-pooler.ap-southeast-2.aws.neon.tech/db?sslmode=require")).toBe(true);
    expect(isNeonUrl("postgresql://u:p@ep-cool-1.ap-south-1.aws.neon.tech/db")).toBe(true);
  });
  it("treats any other host as plain Postgres", () => {
    expect(isNeonUrl("postgresql://postgres@localhost:5432/formagen_e2e")).toBe(false);
    expect(isNeonUrl("postgresql://u@db.neon.tech.evil.com/db")).toBe(false);
  });
});
