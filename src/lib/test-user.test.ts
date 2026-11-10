// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createTestDb } from "./db/test-db";
import { users } from "./db/schema";
import { upsertTestUser } from "./test-user";

describe("upsertTestUser", () => {
  it("creates a user the first time and reuses it after", async () => {
    const db = await createTestDb();

    const first = await upsertTestUser(db, "e2e@example.com");
    const second = await upsertTestUser(db, "e2e@example.com");

    expect(first).toEqual({ id: expect.any(String), email: "e2e@example.com", name: "e2e" });
    expect(second.id).toBe(first.id);
    expect(await db.select().from(users)).toHaveLength(1);
  });
});
