import { revalidateTag } from "next/cache";
import { createYoga } from "graphql-yoga";
import { auth } from "@/auth";
import { formTag } from "@/app/f/[slug]/data";
import type { GraphQLContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";
import { getFormsService } from "@/lib/forms";

/**
 * Admin GraphQL API (builder and dashboard). The public form page doesn't use it:
 * it reads and writes through the same service directly from the server.
 */
const yoga = createYoga<Record<string, never>, GraphQLContext>({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  graphiql: process.env.NODE_ENV !== "production",
  landingPage: false,
  context: async () => {
    const session = await auth();
    return {
      userId: session?.user?.id ?? null,
      forms: getFormsService(),
      // A new version must be visible on the public page right away: no stale window.
      onPublished: (slug) => revalidateTag(formTag(slug), { expire: 0 }),
    };
  },
});

export async function GET(request: Request) {
  return yoga.handleRequest(request, {});
}

export async function POST(request: Request) {
  return yoga.handleRequest(request, {});
}
