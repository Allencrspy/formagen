import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";
import type { Db } from "./client";
import * as schema from "./schema";

/**
 * A fresh, empty, in-memory Postgres with all migrations applied.
 * Tests run the real SQL (constraints, cascades, jsonb) without a network or Docker.
 */
export async function createTestDb(): Promise<Db> {
  const db = drizzle({ client: new PGlite(), schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  return db;
}
