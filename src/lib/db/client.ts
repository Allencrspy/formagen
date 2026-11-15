import { Pool as NeonPool } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { Pool as PgPool } from "pg";
import * as schema from "./schema";

/**
 * The database type every service works with. The Neon client (production), the pg
 * client (E2E in CI) and the PGlite client (unit tests) all satisfy it, so services
 * never know which one they get.
 */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

let instance: Db | undefined;

/** Neon's driver talks WebSocket, which a plain Postgres (the CI service container) doesn't. */
export function isNeonUrl(url: string): boolean {
  return new URL(url).hostname.endsWith(".neon.tech");
}

/**
 * Production database, created on first use so builds and tests never need DATABASE_URL.
 * On Neon it uses the WebSocket pool (not HTTP) because publishing needs transactions.
 */
export function getDb(): Db {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    instance = isNeonUrl(url)
      ? drizzleNeon({ client: new NeonPool({ connectionString: url }), schema })
      : drizzlePg({ client: new PgPool({ connectionString: url }), schema });
  }
  return instance;
}
