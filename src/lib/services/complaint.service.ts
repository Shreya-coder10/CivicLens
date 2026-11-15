import prisma from "../prisma";
import { ComplaintFormInput } from "../validations/complaint.schema";
import {
  IssueCategory,
  IssueSeverity,
  ComplaintStatus,
} from "@/types";

export class ComplaintService {
  /**
   * Generates a unique, human-friendly reference ID: CIV-2026-XXXXX
   */
  static generateReferenceId(): string {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(10000 + Math.random() * 90000);
    return `CIV-${year}-${randomHex}`;
  }

  /**
   * Submit a new complaint record with initial status SUBMITTED and audit history
   */
  static async createComplaint(
    data: ComplaintFormInput,
    userId: string,
    creatorName: string
  ) {
    let referenceId = this.generateReferenceId();
    let isUnique = false;
    let attempts = 0;

    // Guarantee referenceId uniqueness
    while (!isUnique && attempts < 5) {
      const existing = await prisma.complaint.findUnique({
        where: { referenceId },
      });
      if (!existing) {
        isUnique = true;
      } else {
        referenceId = this.generateReferenceId();
        attempts++;
      }
    }

    return await prisma.complaint.create({
      data: {
        referenceId,
        title: data.title,
        description: data.description,
        aiSummary: data.aiSummary || null,
        category: data.category as any,
        severity: data.severity as any,
        status: "SUBMITTED",
        address: data.address,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        userId,
        images: {
          create: (data.images || []).map((img: any) => ({
            s3Key: img.s3Key,
            url: img.url,
            originalFilename: img.originalFilename,
            mimeType: img.mimeType,
            fileSize: img.fileSize,
          })),
        },
        history: {
          create: {
            previousStatus: "SUBMITTED",
            newStatus: "SUBMITTED",
            remarks: "Complaint submitted by citizen",
            changedBy: creatorName,
          },
        },
      },
      include: {
        images: true,
        history: true,
      },
    });
  }

  /**
   * Retrieve complaint by internal ID
   */
  static async getById(id: string) {
    return await prisma.complaint.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        images: true,
        history: { orderBy: { createdAt: "desc" } },
        adminRemarks: {
          include: { admin: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Retrieve complaint by public reference ID (e.g. CIV-2026-94821)
   */
  static async getByReferenceId(referenceId: string) {
    return await prisma.complaint.findUnique({
      where: { referenceId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        images: true,
        history: { orderBy: { createdAt: "desc" } },
        adminRemarks: {
          include: { admin: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Retrieve public complaints for community catalog & map (filtered)
   */
  static async getPublicComplaints(filters?: {
    category?: IssueCategory;
    status?: ComplaintStatus;
    search?: string;
    hasCoords?: boolean;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.hasCoords) {
      where.latitude = { not: null };
      where.longitude = { not: null };
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
        { referenceId: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return await prisma.complaint.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: { createdAt: "desc" },
      take: filters?.limit ?? 100,
    });
  }

  /**
   * Retrieve user complaints for Citizen Dashboard
   */
  static async getUserComplaints(userId: string) {
    return await prisma.complaint.findMany({
      where: { userId },
      include: {
        images: true,
        history: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Admin: Get all complaints with pagination, filtering & sorting
   */
  static async getAdminComplaints(params?: {
    category?: IssueCategory;
    status?: ComplaintStatus;
    severity?: IssueSeverity;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 15;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (params?.category) where.category = params.category;
    if (params?.status) where.status = params.status;
    if (params?.severity) where.severity = params.severity;
    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { referenceId: { contains: params.search, mode: "insensitive" } },
        { address: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          images: true,
          adminRemarks: { take: 1, orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Update complaint status with audit logging
   */
  static async updateStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    adminName: string,
    remarks?: string
  ) {
    const current = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { status: true },
    });

    if (!current) throw new Error("Complaint not found");

    return await prisma.$transaction([
      prisma.complaint.update({
        where: { id: complaintId },
        data: { status: newStatus as any },
      }),
      prisma.complaintHistory.create({
        data: {
          complaintId,
          previousStatus: current.status,
          newStatus: newStatus as any,
          remarks: remarks || `Status updated to ${newStatus}`,
          changedBy: adminName,
        },
      }),
    ]);
  }

  /**
   * Add administrative remark
   */
  static async addRemark(complaintId: string, adminId: string, remark: string) {
    return await prisma.adminRemark.create({
      data: {
        complaintId,
        adminId,
        remark,
      },
      include: {
        admin: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Detect potential duplicate submissions nearby in the same category
   */
  static async findPotentialDuplicates(
    category: IssueCategory,
    address: string,
    excludeId?: string
  ) {
    const firstWord = address.split(" ")[0]?.trim() || "";
    return await prisma.complaint.findMany({
      where: {
        category: category as any,
        id: excludeId ? { not: excludeId } : undefined,
        address: { contains: firstWord, mode: "insensitive" },
        status: { in: ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "APPROVED"] },
      },
      select: {
        id: true,
        referenceId: true,
        title: true,
        status: true,
        address: true,
        createdAt: true,
      },
      take: 5,
    });
  }
}
