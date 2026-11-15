export type UserRole = "CITIZEN" | "ADMIN";

export type IssueCategory =
  | "ROADS_AND_POTHOLES"
  | "GARBAGE_AND_WASTE"
  | "WATER_SUPPLY_AND_LEAKAGE"
  | "STREETLIGHTS_AND_ELECTRICITY"
  | "DRAINAGE_AND_SANITATION"
  | "PUBLIC_INFRASTRUCTURE"
  | "OTHER";

export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ComplaintImageItem {
  id: string;
  complaintId: string;
  s3Key: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date | string;
}

export interface ComplaintHistoryItem {
  id: string;
  complaintId: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  remarks?: string | null;
  changedBy: string;
  createdAt: Date | string;
}

export interface AdminRemarkItem {
  id: string;
  complaintId: string;
  adminId: string;
  remark: string;
  createdAt: Date | string;
  admin?: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface ComplaintItem {
  id: string;
  referenceId: string;
  title: string;
  description: string;
  aiSummary?: string | null;
  category: IssueCategory;
  severity: IssueSeverity;
  status: ComplaintStatus;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  images?: ComplaintImageItem[];
  history?: ComplaintHistoryItem[];
  adminRemarks?: AdminRemarkItem[];
}

export interface AIEnhanceResult {
  title: string;
  description: string;
  suggestedCategory: IssueCategory;
  suggestedSeverity: IssueSeverity;
  shortSummary: string;
}

export interface CommunityStats {
  totalReports: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  categoryCounts: { category: IssueCategory; count: number }[];
  severityCounts: { severity: IssueSeverity; count: number }[];
  recentTrends: { date: string; count: number }[];
}
