import { SubmissionWorkspace } from "@/components/submission-workspace";
import { submissions } from "@/lib/demo-data";
import { notFound } from "next/navigation";

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = submissions.find((item) => item.id === id);
  if (!submission) notFound();
  return <SubmissionWorkspace submission={submission} />;
}
