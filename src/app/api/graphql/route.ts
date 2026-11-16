import { revalidateTag } from "next/cache";
import { createYoga } from "graphql-yoga";
import { auth } from "@/auth";
import { formTag } from "@/app/f/[slug]/data";
import type { GraphQLContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";
import { cloudFrontClient, createCdnInvalidator } from "@/lib/cdn";
import { getFormsService } from "@/lib/forms";

// Set by sst.config.ts on AWS only.
const invalidateCdn = createCdnInvalidator({ enabled: process.env.CDN_INVALIDATION === "cloudfront", client: cloudFrontClient });

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
  context: async ({ request }) => {
    const session = await auth();
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
    return {
      userId: session?.user?.id ?? null,
      forms: getFormsService(),
      // Expire the server's cached page first (no stale window), then the edge copies.
      onPublished: async (slug) => {
        revalidateTag(formTag(slug), { expire: 0 });
        await invalidateCdn(host, slug);
      },
    };
  },
});

export async function GET(request: Request) {
  return yoga.handleRequest(request, {});
}

export async function POST(request: Request) {
  return yoga.handleRequest(request, {});
}
