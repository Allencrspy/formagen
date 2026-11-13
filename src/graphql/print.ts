import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "./schema";

/** The API schema as SDL, sorted so the committed file diffs cleanly. */
export function printSortedSchema(): string {
  return `${printSchema(lexicographicSortSchema(schema))}\n`;
}
