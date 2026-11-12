import "server-only";
import { getDb } from "@/lib/db/client";
import { createFormsService, type FormsService } from "./service";

let service: FormsService | undefined;

/** The production forms service (Neon), created on first use. */
export function getFormsService(): FormsService {
  service ??= createFormsService(getDb());
  return service;
}
