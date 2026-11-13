import SchemaBuilder from "@pothos/core";
import { GraphQLError, Kind, valueFromASTUntyped } from "graphql";
import type { GraphQLContext } from "./context";

/**
 * Code-first schema: GraphQL types are declared from TypeScript types, so the API and
 * the service layer can't drift apart silently.
 */
export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  // Fields are non-null unless marked `nullable: true`, so clients don't null-check everything.
  DefaultFieldNullability: false;
  Scalars: {
    JSON: { Input: unknown; Output: unknown };
    DateTime: { Input: Date; Output: Date };
  };
}>({ defaultFieldNullability: false });

builder.scalarType("JSON", {
  description: "Arbitrary JSON (form schemas and answers).",
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => valueFromASTUntyped(ast),
});

builder.scalarType("DateTime", {
  description: "ISO-8601 timestamp.",
  serialize: (value) => value.toISOString(),
  parseValue: (value) => {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) throw new GraphQLError("Invalid DateTime", { extensions: { code: "BAD_USER_INPUT" } });
    return date;
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) throw new GraphQLError("DateTime must be a string", { extensions: { code: "BAD_USER_INPUT" } });
    return new Date(ast.value);
  },
});

builder.queryType({});
builder.mutationType({});
