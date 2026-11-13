import { auth } from "@/auth";
import { getFormsService } from "@/lib/forms";
import { buildExport } from "@/lib/forms/export";

/** GET /api/forms/:id/export?versionId=… → CSV download of the form's responses (owner only). */
export async function GET(request: Request, { params }: RouteContext<"/api/forms/[id]/export">) {
  const { id } = await params;
  const versionId = new URL(request.url).searchParams.get("versionId") ?? undefined;
  const session = await auth();
  const result = await buildExport({ service: getFormsService(), userId: session?.user?.id ?? null, formId: id, versionId });

  if (result.status !== 200) {
    return new Response(result.status === 401 ? "Sign in to export responses." : "Form not found.", {
      status: result.status,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return new Response(result.body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${result.filename}"`,
      "cache-control": "no-store",
    },
  });
}
