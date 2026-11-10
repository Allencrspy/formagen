import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/**
 * The database type every service works with. Both the Neon client (production)
 * and the PGlite client (tests) satisfy it, so services never know which one they get.
 */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

let instance: Db | undefined;

/**
 * Production database, created on first use so builds and tests never need DATABASE_URL.
 * Uses Neon's WebSocket pool (not HTTP) because publishing needs transactions.
 */
export function getDb(): Db {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    instance = drizzle({ client: new Pool({ connectionString: url }), schema });
  }
  return instance;
}
