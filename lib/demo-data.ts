export type SubmissionStatus = "verified" | "review" | "processing";

export type Submission = {
  id: string;
  store: string;
  area: string;
  submittedBy: string;
  collectedBy: string;
  capturedAt: string;
  photos: number;
  status: SubmissionStatus;
  accent: string;
};

export const submissions: Submission[] = [
  {
    id: "SH-0284",
    store: "Grand Lucky SCBD",
    area: "South Jakarta",
    submittedBy: "Sharan",
    collectedBy: "Dimas Pratama",
    capturedAt: "Today, 09:42",
    photos: 8,
    status: "verified",
    accent: "orange",
  },
  {
    id: "SH-0283",
    store: "Ranch Market Pondok Indah",
    area: "South Jakarta",
    submittedBy: "Sharan",
    collectedBy: "Maya Sari",
    capturedAt: "Today, 08:17",
    photos: 5,
    status: "processing",
    accent: "mint",
  },
  {
    id: "SH-0282",
    store: "Super Indo Dago",
    area: "Bandung",
    submittedBy: "Sharan",
    collectedBy: "Sharan",
    capturedAt: "Yesterday, 16:03",
    photos: 11,
    status: "review",
    accent: "blue",
  },
];
