import type { SubmissionStatus } from "@/lib/demo-data";

const labels: Record<SubmissionStatus, string> = {
  verified: "Verified",
  review: "Needs review",
  processing: "Processing",
};

export function StatusPill({ status }: { status: SubmissionStatus }) {
  return <span className={`status status-${status}`}><i />{labels[status]}</span>;
}
