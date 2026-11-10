import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { buildProviders } from "./auth-providers";
import { getDb } from "./lib/db/client";
import { accounts, sessions, users, verificationTokens } from "./lib/db/schema";
import { upsertTestUser } from "./lib/test-user";

/**
 * Auth.js config, built lazily so `next build` never needs DATABASE_URL.
 *
 * Sessions are JWTs (signed cookies), not database rows: the test-login Credentials
 * provider only works with JWTs, and checking a session then needs no database query.
 * The adapter still stores users and linked GitHub accounts in Postgres.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const db = getDb();
  return {
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    session: { strategy: "jwt" },
    providers: buildProviders(process.env, (email) => upsertTestUser(db, email)),
    callbacks: {
      session({ session, token }) {
        if (token.sub) session.user.id = token.sub;
        return session;
      },
    },
  };
});
