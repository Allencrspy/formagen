import { parseFormSchema } from "@/lib/schema/parse";
import { columnsFor, toCsv, type VersionSchema } from "./csv";
import { ForbiddenError, NotFoundError } from "./errors";
import type { FormsService } from "./service";

export type ExportResult = { status: 200; filename: string; body: string } | { status: 401 | 404 };

/**
 * Builds the CSV export of a form's responses. Another user's form answers 404 (not 403)
 * so form ids can't be probed. Columns follow the chosen version, or all versions.
 */
export async function buildExport({
  service,
  userId,
  formId,
  versionId,
}: {
  service: FormsService;
  userId: string | null;
  formId: string;
  versionId?: string;
}): Promise<ExportResult> {
  if (!userId) return { status: 401 };
  try {
    const form = await service.getForm(userId, formId);
    const versions: VersionSchema[] = (await service.listVersions(userId, formId)).flatMap((v) => {
      const parsed = parseFormSchema(v.schema);
      return parsed.ok ? [{ id: v.id, version: v.version, schema: parsed.schema }] : [];
    });
    const rows = await service.listAllResponses(userId, formId, versionId);
    const safeSlug = form.slug.replace(/[^a-z0-9-]/gi, "");
    return { status: 200, filename: `${safeSlug}-responses.csv`, body: toCsv(columnsFor(versions, versionId), rows) };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) return { status: 404 };
    throw error;
  }
}
