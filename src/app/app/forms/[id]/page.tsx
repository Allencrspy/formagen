import { BuilderPage } from "@/features/builder/BuilderPage";

export default async function FormBuilderPage({ params }: PageProps<"/app/forms/[id]">) {
  const { id } = await params;
  return <BuilderPage id={id} />;
}
