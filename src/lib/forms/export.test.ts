// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { createTestDb } from "@/lib/db/test-db";
import type { FormSchema } from "@/lib/schema/types";
import { buildExport } from "./export";
import { createFormsService } from "./service";

const schema: FormSchema = {
  schemaVersion: 1,
  title: "Contact",
  fields: [{ id: "name", type: "shortText", label: "Name", required: true }],
};

let db: Db;
let service: ReturnType<typeof createFormsService>;
let formId: string;
let slug: string;

beforeEach(async () => {
  db = await createTestDb();
  await db.insert(users).values([
    { id: "u1", email: "a@example.com" },
    { id: "u2", email: "b@example.com" },
  ]);
  service = createFormsService(db);
  const form = await service.createForm("u1", "Contact");
  await service.updateDraft("u1", form.id, schema);
  const version = await service.publishForm("u1", form.id);
  formId = form.id;
  slug = version.slug;
  await service.submitResponse(slug, { name: "Al" });
});

describe("buildExport", () => {
  it("returns a CSV download named after the form", async () => {
    const result = await buildExport({ service, userId: "u1", formId });
    expect(result.status).toBe(200);
    if (result.status !== 200) return;
    expect(result.filename).toBe(`${slug}-responses.csv`);
    expect(result.body.split("\r\n")).toHaveLength(2);
    expect(result.body).toContain('"Al"');
  });

  it("filters to one version", async () => {
    const result = await buildExport({ service, userId: "u1", formId, versionId: "00000000-0000-0000-0000-000000000000" });
    expect(result.status === 200 && result.body.split("\r\n")).toHaveLength(1);
  });

  it("requires a signed-in user", async () => {
    expect((await buildExport({ service, userId: null, formId })).status).toBe(401);
  });

  it("answers 404 for another user's form, so it can't be probed", async () => {
    expect((await buildExport({ service, userId: "u2", formId })).status).toBe(404);
    expect((await buildExport({ service, userId: "u1", formId: "nope" })).status).toBe(404);
  });
});
