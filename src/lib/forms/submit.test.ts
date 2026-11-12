// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { responses, users } from "@/lib/db/schema";
import { createTestDb } from "@/lib/db/test-db";
import type { Db } from "@/lib/db/client";
import { createRateLimiter } from "@/lib/rate-limit";
import type { FormSchema } from "@/lib/schema/types";
import { createFormsService } from "./service";
import { handleSubmission } from "./submit";

const schema: FormSchema = {
  schemaVersion: 1,
  title: "Contact",
  fields: [
    { id: "name", type: "shortText", label: "Name", required: true },
    { id: "news", type: "checkbox", label: "Send news", required: false },
  ],
};

let db: Db;
let service: ReturnType<typeof createFormsService>;
let slug: string;

beforeEach(async () => {
  db = await createTestDb();
  await db.insert(users).values({ id: "u1", email: "a@example.com" });
  service = createFormsService(db);
  const form = await service.createForm("u1", "Contact");
  await service.updateDraft("u1", form.id, schema);
  await service.publishForm("u1", form.id);
  slug = form.slug;
});

const post = (entries: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.set(k, v);
  return fd;
};

const roomy = () => createRateLimiter({ limit: 100, windowMs: 60_000 });

describe("handleSubmission", () => {
  it("stores a valid post from a plain HTML form", async () => {
    const result = await handleSubmission({ service, slug, formData: post({ name: "Al", news: "on" }), clientKey: "ip", limiter: roomy() });
    expect(result).toEqual({ status: "ok" });
    const [stored] = await db.select().from(responses);
    expect(stored?.answers).toEqual({ name: "Al", news: true });
  });

  it("returns field errors and echoes what was typed", async () => {
    const result = await handleSubmission({ service, slug, formData: post({ news: "on" }), clientKey: "ip", limiter: roomy() });
    expect(result).toEqual({ status: "invalid", errors: { name: "This field is required" }, values: { news: true } });
    expect(await db.select().from(responses)).toEqual([]);
  });

  it("reports an unknown or unpublished form as not found", async () => {
    const result = await handleSubmission({ service, slug: "nope", formData: post({ name: "Al" }), clientKey: "ip", limiter: roomy() });
    expect(result).toEqual({ status: "not-found" });
  });

  it("rate-limits a client before touching the database", async () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    await handleSubmission({ service, slug, formData: post({ name: "Al" }), clientKey: "ip", limiter });
    const second = await handleSubmission({ service, slug, formData: post({ name: "Bo" }), clientKey: "ip", limiter });
    expect(second).toEqual({ status: "rate-limited" });
    expect(await db.select().from(responses)).toHaveLength(1);
  });
});
