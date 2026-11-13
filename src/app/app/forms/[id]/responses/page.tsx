import { ResponsesPage } from "@/features/responses/ResponsesPage";

export default async function FormResponsesPage({ params }: PageProps<"/app/forms/[id]/responses">) {
  const { id } = await params;
  return <ResponsesPage id={id} />;
}
