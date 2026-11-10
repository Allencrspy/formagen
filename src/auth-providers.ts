import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

export type TestUser = { id: string; email: string; name: string | null };

/**
 * Sign-in providers. GitHub always; the email-only "test-login" exists only when
 * E2E_TEST_LOGIN is exactly "1" (Playwright in CI). It must never be set in production,
 * because anyone could sign in as any email with it.
 */
export function buildProviders(
  env: Record<string, string | undefined>,
  authorizeTestLogin: (email: string) => Promise<TestUser | null>,
): Provider[] {
  const providers: Provider[] = [GitHub];

  if (env.E2E_TEST_LOGIN === "1") {
    providers.push(
      Credentials({
        id: "test-login",
        name: "Test login",
        credentials: { email: { label: "Email", type: "email" } },
        authorize: async (credentials) => {
          const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
          return email ? authorizeTestLogin(email) : null;
        },
      }),
    );
  }

  return providers;
}
