import type { SchemaIssue } from "@/lib/schema/types";

/** The form doesn't exist (or the id is malformed). Maps to 404 / NOT_FOUND. */
export class NotFoundError extends Error {
  constructor(message = "Form not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/** The form exists but belongs to someone else. Maps to 403 / FORBIDDEN. */
export class ForbiddenError extends Error {
  constructor(message = "You don't have access to this form") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** The request is understood but can't be carried out as is. Maps to BAD_USER_INPUT. */
export class ValidationError extends Error {
  constructor(
    message: string,
    readonly issues: SchemaIssue[] = [],
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
