export type SubmissionStatus = "verified" | "review" | "processing";
export type DisplayType = "primary" | "secondary" | "additional";

export type ShelfPhoto = {
  id: string;
  label: string;
  category: string;
  shelfArea: string;
  angle: string;
  displayType: DisplayType;
  accent: string;
  aiConfidence: number;
  brands: { name: string; confidence: number; humanVerified?: boolean }[];
  skus: { name: string; brand: string; confidence: number; humanVerified?: boolean }[];
  facings: number;
  estimatedShare: number;
};

export type Submission = {
  id: string;
  store: string;
  area: string;
  submittedBy: string;
  collectedBy: string;
  capturedAt: string;
  photos: ShelfPhoto[];
  status: SubmissionStatus;
  accent: string;
};

// Shelf visits will be loaded from Postgres once capture persistence is connected.
export const submissions: Submission[] = [];
