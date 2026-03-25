import { redirect } from "next/navigation";

type Props = { params: Promise<{ form_id: string }> };

export default async function LegacyFormResponsesPage({ params }: Props) {
  const { form_id } = await params;
  redirect(`/admin/forms/${form_id}`);
}
