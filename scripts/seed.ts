/**
 * Creates (or reuses) a demo user and publishes a demo form with every field type
 * and one conditional field. Prints the public URL path. Usage: npm run seed
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { createFormsService } from "@/lib/forms/service";
import type { FormSchema } from "@/lib/schema/types";

const schema: FormSchema = {
  schemaVersion: 1,
  title: "Volunteer sign-up",
  fields: [
    { id: "name", type: "shortText", label: "Full name", required: true, maxLength: 80 },
    { id: "email", type: "email", label: "Email", required: true, helpText: "We'll only use it to confirm your shift." },
    {
      id: "shift",
      type: "select",
      label: "Preferred shift",
      required: true,
      options: [
        { value: "morning", label: "Morning, 8–12" },
        { value: "afternoon", label: "Afternoon, 12–4" },
        { value: "evening", label: "Evening, 4–8" },
      ],
    },
    { id: "date", type: "date", label: "Available from", required: false },
    { id: "hours", type: "number", label: "Hours per week", required: false, min: 1, max: 40 },
    { id: "returning", type: "checkbox", label: "I've volunteered with you before", required: false },
    {
      id: "lastEvent",
      type: "shortText",
      label: "Which event did you help at?",
      required: true,
      showIf: { fieldId: "returning", equals: true },
    },
    { id: "notes", type: "longText", label: "Anything we should know?", required: false, maxLength: 500 },
  ],
};

async function main() {
  const db = getDb();
  const email = "seed@formagen.local";
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  const user = existing ?? (await db.insert(users).values({ email, name: "Seed user" }).returning())[0]!;

  const svc = createFormsService(db);
  const form = await svc.createForm(user.id, schema.title);
  const saved = await svc.updateDraft(user.id, form.id, schema);
  if (!saved.ok) throw new Error(JSON.stringify(saved.issues));
  const version = await svc.publishForm(user.id, form.id);
  console.log(`Published v${version.version}: /f/${form.slug}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
