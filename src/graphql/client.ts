/**
 * Tiny typed GraphQL fetcher for the admin UI (used with TanStack Query).
 * Documents come from GraphQL Codegen's `graphql()` (string mode), so results and
 * variables are typed end to end without a GraphQL client library.
 */

/** Matches Codegen's TypedDocumentString: a string carrying its result/variables types. */
export type TypedDocument<TResult, TVariables> = { toString(): string } & {
  __apiType?: (variables: TVariables) => TResult;
};

export type GqlErrorCode = "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "BAD_USER_INPUT" | "NETWORK" | "INTERNAL";

export class GqlError extends Error {
  constructor(
    message: string,
    readonly code: GqlErrorCode,
    readonly issues: unknown[] = [],
  ) {
    super(message);
    this.name = "GqlError";
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string; extensions?: { code?: string; issues?: unknown[] } }[];
};

export async function gql<TResult, TVariables>(
  document: TypedDocument<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ query: document.toString(), variables }),
  });

  let body: GraphQLResponse<TResult>;
  try {
    body = (await response.json()) as GraphQLResponse<TResult>;
  } catch {
    throw new GqlError(`Request failed (${response.status})`, "NETWORK");
  }

  const first = body.errors?.[0];
  if (first) {
    const code = (first.extensions?.code ?? "INTERNAL") as GqlErrorCode;
    throw new GqlError(first.message, code, first.extensions?.issues ?? []);
  }
  if (!body.data) throw new GqlError("Empty response", "INTERNAL");
  return body.data;
}
