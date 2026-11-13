import type { FormsService } from "@/lib/forms/service";

/** Per-request GraphQL context. Built from the Auth.js session in the route handler. */
export type GraphQLContext = {
  /** Signed-in user id, or null when there is no session. */
  userId: string | null;
  forms: FormsService;
  /** Called after a publish so the public page's cached copy is refreshed (revalidateTag). */
  onPublished: (slug: string) => void;
};
