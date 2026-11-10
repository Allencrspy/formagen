import type { TestUser } from "@/auth-providers";
import type { Db } from "./db/client";
import { users } from "./db/schema";

/** Finds or creates the user for an email. Only used by the E2E-only test login. */
export async function upsertTestUser(db: Db, email: string): Promise<TestUser> {
  const [row] = await db
    .insert(users)
    .values({ email, name: email.split("@")[0] ?? email })
    .onConflictDoUpdate({ target: users.email, set: { email } })
    .returning({ id: users.id, email: users.email, name: users.name });

  return { id: row!.id, email: row!.email!, name: row!.name };
}
