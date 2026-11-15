import { z } from "zod";

export const categoryEnum = z.enum([
  "ROADS_AND_POTHOLES",
  "GARBAGE_AND_WASTE",
  "WATER_SUPPLY_AND_LEAKAGE",
  "STREETLIGHTS_AND_ELECTRICITY",
  "DRAINAGE_AND_SANITATION",
  "PUBLIC_INFRASTRUCTURE",
  "OTHER",
]);

export const severityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const complaintStatusEnum = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
]);

export const complaintFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .min(20, "Please provide a detailed description (at least 20 characters)")
    .max(3000, "Description is too long"),
  category: categoryEnum,
  severity: severityEnum,
  address: z
    .string()
    .min(5, "Please specify an accurate address or landmark")
    .max(250),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  aiSummary: z.string().nullable().optional(),
  images: z
    .array(
      z.object({
        s3Key: z.string(),
        url: z.string().url(),
        originalFilename: z.string(),
        mimeType: z.string(),
        fileSize: z.number(),
      })
    )
    .optional()
    .default([]),
});

export const updateStatusSchema = z.object({
  complaintId: z.string().min(1, "Complaint ID is required"),
  status: complaintStatusEnum,
  remarks: z.string().optional(),
});

export const adminRemarkSchema = z.object({
  complaintId: z.string().min(1, "Complaint ID is required"),
  remark: z.string().min(2, "Remark must be at least 2 characters").max(1000),
});

export const aiEnhanceSchema = z.object({
  prompt: z
    .string()
    .min(10, "Please provide at least a brief sentence about the civic issue")
    .max(1000),
});

export type ComplaintFormInput = z.infer<typeof complaintFormSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type AdminRemarkInput = z.infer<typeof adminRemarkSchema>;
export type AIEnhanceInput = z.infer<typeof aiEnhanceSchema>;
