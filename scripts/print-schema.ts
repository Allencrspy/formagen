/** Writes schema.graphql from the code-first schema; Codegen reads it. Usage: npm run codegen */
import { writeFileSync } from "node:fs";
import { printSortedSchema } from "@/graphql/print";

writeFileSync("schema.graphql", printSortedSchema());
console.log("Wrote schema.graphql");
