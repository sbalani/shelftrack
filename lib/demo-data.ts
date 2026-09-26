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

export const submissions: Submission[] = [
  {
    id: "SH-0284",
    store: "Grand Lucky SCBD",
    area: "South Jakarta",
    submittedBy: "Sharan",
    collectedBy: "Dimas Pratama",
    capturedAt: "Today, 09:42",
    photos: [
      { id: "P-284-01", label: "Full beverage bay", category: "Beverages", shelfArea: "Soft drinks · Aisle 4", angle: "Front / full bay", displayType: "primary", accent: "orange", aiConfidence: 94, brands: [{ name: "Coca-Cola", confidence: 98 }, { name: "Pepsi", confidence: 96 }, { name: "Fanta", confidence: 91 }, { name: "Sprite", confidence: 95 }], skus: [{ name: "Coca-Cola Original 330ml", brand: "Coca-Cola", confidence: 96 }, { name: "Pepsi Black 330ml", brand: "Pepsi", confidence: 88 }, { name: "Fanta Orange 390ml", brand: "Fanta", confidence: 84 }], facings: 48, estimatedShare: 34 },
      { id: "P-284-02", label: "Left side · cola", category: "Beverages", shelfArea: "Soft drinks · Aisle 4", angle: "Left section", displayType: "primary", accent: "red", aiConfidence: 91, brands: [{ name: "Coca-Cola", confidence: 99, humanVerified: true }, { name: "Pepsi", confidence: 97 }], skus: [{ name: "Coca-Cola Zero 330ml", brand: "Coca-Cola", confidence: 93 }, { name: "Coca-Cola Original 1.5L", brand: "Coca-Cola", confidence: 95 }, { name: "Pepsi 1.5L", brand: "Pepsi", confidence: 90 }], facings: 27, estimatedShare: 43 },
      { id: "P-284-03", label: "End-cap promotion", category: "Beverages", shelfArea: "Front end-cap · Aisle 4", angle: "Front / close", displayType: "secondary", accent: "mint", aiConfidence: 89, brands: [{ name: "Coca-Cola", confidence: 97 }, { name: "Sprite", confidence: 86 }], skus: [{ name: "Coca-Cola Original 1.5L", brand: "Coca-Cola", confidence: 92 }, { name: "Sprite 1.5L", brand: "Sprite", confidence: 80 }], facings: 18, estimatedShare: 72 },
      { id: "P-284-04", label: "Chilled checkout display", category: "Beverages", shelfArea: "Checkout chiller · Lane 3", angle: "Right oblique", displayType: "additional", accent: "blue", aiConfidence: 82, brands: [{ name: "Pocari Sweat", confidence: 89 }, { name: "Coca-Cola", confidence: 81 }, { name: "Aqua", confidence: 78 }], skus: [{ name: "Pocari Sweat 500ml", brand: "Pocari Sweat", confidence: 87 }, { name: "Aqua 600ml", brand: "Aqua", confidence: 76 }], facings: 14, estimatedShare: 21 },
    ],
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
    photos: [
      { id: "P-283-01", label: "Water bay overview", category: "Water", shelfArea: "Mineral water · Aisle 6", angle: "Front / full bay", displayType: "primary", accent: "mint", aiConfidence: 87, brands: [{ name: "Aqua", confidence: 96 }, { name: "Le Minerale", confidence: 94 }, { name: "Cleo", confidence: 83 }], skus: [{ name: "Aqua 600ml", brand: "Aqua", confidence: 92 }, { name: "Le Minerale 600ml", brand: "Le Minerale", confidence: 91 }], facings: 35, estimatedShare: 31 },
      { id: "P-283-02", label: "Center shelves", category: "Water", shelfArea: "Mineral water · Aisle 6", angle: "Front / center", displayType: "primary", accent: "blue", aiConfidence: 85, brands: [{ name: "Aqua", confidence: 95 }, { name: "Le Minerale", confidence: 92 }], skus: [{ name: "Aqua 1.5L", brand: "Aqua", confidence: 89 }], facings: 22, estimatedShare: 36 },
      { id: "P-283-03", label: "Pallet display", category: "Water", shelfArea: "Entrance promotional zone", angle: "Left oblique", displayType: "secondary", accent: "orange", aiConfidence: 76, brands: [{ name: "Le Minerale", confidence: 91 }], skus: [{ name: "Le Minerale 1.5L", brand: "Le Minerale", confidence: 84 }], facings: 16, estimatedShare: 100 },
    ],
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
    photos: [
      { id: "P-282-01", label: "Tea category overview", category: "Ready-to-drink tea", shelfArea: "RTD tea · Aisle 3", angle: "Front / full bay", displayType: "primary", accent: "blue", aiConfidence: 81, brands: [{ name: "Teh Botol Sosro", confidence: 94 }, { name: "Frestea", confidence: 86 }, { name: "Pucuk Harum", confidence: 92 }], skus: [{ name: "Teh Botol Sosro 450ml", brand: "Teh Botol Sosro", confidence: 88 }, { name: "Pucuk Harum 350ml", brand: "Pucuk Harum", confidence: 83 }], facings: 39, estimatedShare: 29 },
      { id: "P-282-02", label: "Right section", category: "Ready-to-drink tea", shelfArea: "RTD tea · Aisle 3", angle: "Right section", displayType: "primary", accent: "orange", aiConfidence: 79, brands: [{ name: "Pucuk Harum", confidence: 89 }, { name: "Frestea", confidence: 81 }], skus: [{ name: "Pucuk Harum Less Sugar", brand: "Pucuk Harum", confidence: 72 }], facings: 20, estimatedShare: 35 },
      { id: "P-282-03", label: "Checkout cooler", category: "Ready-to-drink tea", shelfArea: "Checkout chiller · Lane 1", angle: "Front / close", displayType: "additional", accent: "mint", aiConfidence: 73, brands: [{ name: "Teh Botol Sosro", confidence: 86 }], skus: [{ name: "Teh Botol Sosro 450ml", brand: "Teh Botol Sosro", confidence: 78 }], facings: 8, estimatedShare: 44 },
    ],
    status: "review",
    accent: "blue",
  },
];
