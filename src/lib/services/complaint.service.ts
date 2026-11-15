import { getDb } from "../db";
import { ComplaintFormInput } from "../validations/complaint.schema";
import { IssueCategory, IssueSeverity, ComplaintStatus, ComplaintItem } from "@/types";

// In-memory demo fallback for immediate inspection before database is connected
const IN_MEMORY_SAMPLE_COMPLAINTS = [
  {
    id: "cmp_01",
    referenceId: "CIV-2026-10492",
    title: "Severe Pothole Cluster and Road Subsidence on 4th Main Avenue",
    description:
      "Multiple deep potholes spanning over 6 meters have formed following recent monsoon showers. Two-wheelers frequently swerve dangerously into oncoming lanes to avoid axle damage. Water collects here whenever it rains, completely concealing the hazard.",
    aiSummary:
      "Hazardous pothole cluster causing acute traffic disruption and accident risk for two-wheelers.",
    category: "ROADS_AND_POTHOLES" as IssueCategory,
    severity: "HIGH" as IssueSeverity,
    status: "IN_PROGRESS" as ComplaintStatus,
    address: "4th Main Avenue, Near Metro Pillar 142, Indiranagar",
    latitude: 12.9784,
    longitude: 77.6408,
    userId: "usr_citizen_01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [
      {
        id: "img_01",
        complaintId: "cmp_01",
        s3Key: "demo/pothole.jpg",
        url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        originalFilename: "pothole_evidence.jpg",
        mimeType: "image/jpeg",
        fileSize: 420000,
        createdAt: new Date().toISOString(),
      },
    ],
    history: [
      {
        id: "h_01",
        complaintId: "cmp_01",
        previousStatus: "SUBMITTED" as ComplaintStatus,
        newStatus: "IN_PROGRESS" as ComplaintStatus,
        remarks: "Asphalt patching crew and steamroller scheduled on site",
        changedBy: "City Infrastructure Commissioner",
        createdAt: new Date().toISOString(),
      },
    ],
    adminRemarks: [
      {
        id: "rem_01",
        complaintId: "cmp_01",
        adminId: "usr_admin_01",
        remark: "Priority assigned by Municipal Dispatch. Work order referenced: WO-CIV-2026-10492.",
        createdAt: new Date().toISOString(),
        admin: { id: "usr_admin_01", name: "City Infrastructure Commissioner" },
      },
    ],
    user: { id: "usr_citizen_01", name: "Aarav Sharma", email: "aarav.sharma@example.com" },
  },
  {
    id: "cmp_02",
    referenceId: "CIV-2026-10834",
    title: "Overflowing Garbage Dump and Biomass Accumulation near Vegetable Market",
    description:
      "The municipal trash dumpster has not been cleared for over 5 days. Organic waste and plastic packaging have spilled onto pedestrian walkways, attracting stray animals and generating a severe health hazard for adjoining residential apartments.",
    aiSummary:
      "Chronic municipal waste accumulation causing pedestrian obstruction and sanitary risks near market.",
    category: "GARBAGE_AND_WASTE" as IssueCategory,
    severity: "CRITICAL" as IssueSeverity,
    status: "UNDER_REVIEW" as ComplaintStatus,
    address: "Old Subzi Mandi Road, Sector 12 Market Complex",
    latitude: 12.9856,
    longitude: 77.6124,
    userId: "usr_citizen_02",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [
      {
        id: "img_02",
        complaintId: "cmp_02",
        s3Key: "demo/garbage.jpg",
        url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
        originalFilename: "garbage_market.jpg",
        mimeType: "image/jpeg",
        fileSize: 580000,
        createdAt: new Date().toISOString(),
      },
    ],
    history: [],
    adminRemarks: [],
    user: { id: "usr_citizen_02", name: "Priya Patel", email: "priya.patel@example.com" },
  },
];

export class ComplaintService {
  static generateReferenceId(): string {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(10000 + Math.random() * 90000);
    return `CIV-${year}-${randomHex}`;
  }

  static async createComplaint(
    data: ComplaintFormInput,
    userId: string,
    creatorName: string
  ) {
    const referenceId = this.generateReferenceId();
    const complaintId = `cmp_${Math.random().toString(36).substring(2, 10)}`;
    const sql = getDb();

    if (!sql) {
      // In-memory demo push
      const newMock = {
        id: complaintId,
        referenceId,
        title: data.title,
        description: data.description,
        aiSummary: data.aiSummary || null,
        category: data.category as IssueCategory,
        severity: data.severity as IssueSeverity,
        status: "SUBMITTED" as ComplaintStatus,
        address: data.address,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: (data.images || []).map((img, i) => ({
          id: `img_${i}_${Date.now()}`,
          complaintId,
          s3Key: img.s3Key,
          url: img.url,
          originalFilename: img.originalFilename,
          mimeType: img.mimeType,
          fileSize: img.fileSize,
          createdAt: new Date().toISOString(),
        })),
        history: [
          {
            id: `h_${Date.now()}`,
            complaintId,
            previousStatus: "SUBMITTED" as ComplaintStatus,
            newStatus: "SUBMITTED" as ComplaintStatus,
            remarks: "Complaint submitted by citizen",
            changedBy: creatorName,
            createdAt: new Date().toISOString(),
          },
        ],
        adminRemarks: [],
        user: { id: userId, name: creatorName, email: "citizen@example.com" },
      };
      IN_MEMORY_SAMPLE_COMPLAINTS.unshift(newMock as any);
      return newMock;
    }

    // Save to NeonDB
    await sql`
      INSERT INTO complaints (
        id, reference_id, title, description, ai_summary, category, severity, status, address, latitude, longitude, user_id
      ) VALUES (
        ${complaintId}, ${referenceId}, ${data.title}, ${data.description}, ${data.aiSummary || null},
        ${data.category}, ${data.severity}, 'SUBMITTED', ${data.address},
        ${data.latitude ?? null}, ${data.longitude ?? null}, ${userId}
      );
    `;

    // Save images
    for (let i = 0; i < (data.images || []).length; i++) {
      const img = data.images![i];
      const imgId = `img_${Math.random().toString(36).substring(2, 10)}`;
      await sql`
        INSERT INTO complaint_images (
          id, complaint_id, s3_key, url, original_filename, mime_type, file_size
        ) VALUES (
          ${imgId}, ${complaintId}, ${img.s3Key}, ${img.url}, ${img.originalFilename}, ${img.mimeType}, ${img.fileSize}
        );
      `;
    }

    // Save initial history
    const historyId = `hist_${Math.random().toString(36).substring(2, 10)}`;
    await sql`
      INSERT INTO complaint_history (
        id, complaint_id, previous_status, new_status, remarks, changed_by
      ) VALUES (
        ${historyId}, ${complaintId}, 'SUBMITTED', 'SUBMITTED', 'Complaint submitted by citizen', ${creatorName}
      );
    `;

    return { id: complaintId, referenceId };
  }

  static async getById(id: string): Promise<ComplaintItem | null> {
    const sql = getDb();
    if (!sql) {
      return (
        IN_MEMORY_SAMPLE_COMPLAINTS.find((c) => c.id === id || c.referenceId === id) || null
      );
    }

    try {
      const rows: any = await sql`
        SELECT 
          c.id, c.reference_id as "referenceId", c.title, c.description, c.ai_summary as "aiSummary",
          c.category, c.severity, c.status, c.address, c.latitude, c.longitude,
          c.user_id as "userId", c.created_at as "createdAt", c.updated_at as "updatedAt",
          u.name as "userName", u.email as "userEmail"
        FROM complaints c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = ${id} OR c.reference_id = ${id}
        LIMIT 1;
      `;

      if (!rows || rows.length === 0) return null;
      const c = rows[0];

      // Fetch images, history, remarks
      const [images, history, remarks]: any = await Promise.all([
        sql`SELECT id, complaint_id as "complaintId", s3_key as "s3Key", url, original_filename as "originalFilename", mime_type as "mimeType", file_size as "fileSize", created_at as "createdAt" FROM complaint_images WHERE complaint_id = ${c.id};`,
        sql`SELECT id, complaint_id as "complaintId", previous_status as "previousStatus", new_status as "newStatus", remarks, changed_by as "changedBy", created_at as "createdAt" FROM complaint_history WHERE complaint_id = ${c.id} ORDER BY created_at DESC;`,
        sql`SELECT r.id, r.complaint_id as "complaintId", r.admin_id as "adminId", r.remark, r.created_at as "createdAt", u.name as "adminName" FROM admin_remarks r LEFT JOIN users u ON r.admin_id = u.id WHERE r.complaint_id = ${c.id} ORDER BY r.created_at DESC;`,
      ]);

      return {
        ...c,
        user: { id: c.userId, name: c.userName || "Citizen", email: c.userEmail || "" },
        images,
        history,
        adminRemarks: remarks.map((r: any) => ({
          ...r,
          admin: { id: r.adminId, name: r.adminName || "Administrator" },
        })),
      };
    } catch (err) {
      console.warn("DB getById error, using fallback:", err);
      return IN_MEMORY_SAMPLE_COMPLAINTS.find((c) => c.id === id) || null;
    }
  }

  static async getByReferenceId(referenceId: string): Promise<ComplaintItem | null> {
    return this.getById(referenceId);
  }

  static async getPublicComplaints(filters?: {
    category?: IssueCategory;
    status?: ComplaintStatus;
    search?: string;
    hasCoords?: boolean;
    limit?: number;
  }): Promise<ComplaintItem[]> {
    const sql = getDb();
    if (!sql) {
      let filtered = [...IN_MEMORY_SAMPLE_COMPLAINTS];
      if (filters?.category) filtered = filtered.filter((c) => c.category === filters.category);
      if (filters?.status) filtered = filtered.filter((c) => c.status === filters.status);
      if (filters?.hasCoords) filtered = filtered.filter((c) => c.latitude !== null && c.longitude !== null);
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(s) ||
            c.address.toLowerCase().includes(s) ||
            c.referenceId.toLowerCase().includes(s)
        );
      }
      return filtered.slice(0, filters?.limit || 100);
    }

    try {
      let queryStr = `
        SELECT 
          c.id, c.reference_id as "referenceId", c.title, c.description, c.ai_summary as "aiSummary",
          c.category, c.severity, c.status, c.address, c.latitude, c.longitude,
          c.created_at as "createdAt"
        FROM complaints c
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filters?.category) {
        queryStr += ` AND c.category = $${params.length + 1}`;
        params.push(filters.category);
      }
      if (filters?.status) {
        queryStr += ` AND c.status = $${params.length + 1}`;
        params.push(filters.status);
      }
      if (filters?.hasCoords) {
        queryStr += ` AND c.latitude IS NOT NULL AND c.longitude IS NOT NULL`;
      }
      if (filters?.search) {
        queryStr += ` AND (c.title ILIKE $${params.length + 1} OR c.description ILIKE $${params.length + 1} OR c.address ILIKE $${params.length + 1} OR c.reference_id ILIKE $${params.length + 1})`;
        params.push(`%${filters.search}%`);
      }

      queryStr += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
      params.push(filters?.limit || 100);

      const res: any = await (sql as any).query(queryStr, params);
      const rows: any = res.rows || res;

      // Attach first image for cards
      const complaintIds = rows.map((r: any) => r.id);
      let imagesMap: Record<string, any[]> = {};
      if (complaintIds.length > 0) {
        const images: any = await sql`
          SELECT id, complaint_id as "complaintId", url FROM complaint_images WHERE complaint_id = ANY(${complaintIds});
        `;
        for (const img of images) {
          if (!imagesMap[img.complaintId]) imagesMap[img.complaintId] = [];
          imagesMap[img.complaintId].push(img);
        }
      }

      return rows.map((r: any) => ({
        ...r,
        images: imagesMap[r.id] || [],
      }));
    } catch (err) {
      console.warn("DB getPublicComplaints error, falling back to sample data:", err);
      return IN_MEMORY_SAMPLE_COMPLAINTS;
    }
  }

  static async getUserComplaints(userId: string): Promise<ComplaintItem[]> {
    const sql = getDb();
    if (!sql) {
      return IN_MEMORY_SAMPLE_COMPLAINTS.filter((c) => c.userId === userId || true) as any;
    }

    try {
      const rows: any = await sql`
        SELECT 
          c.id, c.reference_id as "referenceId", c.title, c.description, c.ai_summary as "aiSummary",
          c.category, c.severity, c.status, c.address, c.latitude, c.longitude,
          c.created_at as "createdAt"
        FROM complaints c
        WHERE c.user_id = ${userId}
        ORDER BY c.created_at DESC;
      `;
      return rows as ComplaintItem[];
    } catch (err) {
      console.warn("DB getUserComplaints error, returning sample:", err);
      return IN_MEMORY_SAMPLE_COMPLAINTS as any;
    }
  }

  static async getAdminComplaints(params?: {
    category?: IssueCategory;
    status?: ComplaintStatus;
    severity?: IssueSeverity;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    items: ComplaintItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 15;
    const offset = (page - 1) * pageSize;
    const sql = getDb();

    if (!sql) {
      return {
        items: IN_MEMORY_SAMPLE_COMPLAINTS,
        total: IN_MEMORY_SAMPLE_COMPLAINTS.length,
        page,
        pageSize,
        totalPages: 1,
      };
    }

    try {
      let queryStr = `
        SELECT 
          c.id, c.reference_id as "referenceId", c.title, c.description, c.ai_summary as "aiSummary",
          c.category, c.severity, c.status, c.address, c.created_at as "createdAt",
          u.name as "userName", u.email as "userEmail"
        FROM complaints c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE 1=1
      `;
      const sqlParams: any[] = [];

      if (params?.category) {
        queryStr += ` AND c.category = $${sqlParams.length + 1}`;
        sqlParams.push(params.category);
      }
      if (params?.status) {
        queryStr += ` AND c.status = $${sqlParams.length + 1}`;
        sqlParams.push(params.status);
      }
      if (params?.severity) {
        queryStr += ` AND c.severity = $${sqlParams.length + 1}`;
        sqlParams.push(params.severity);
      }
      if (params?.search) {
        queryStr += ` AND (c.title ILIKE $${sqlParams.length + 1} OR c.reference_id ILIKE $${sqlParams.length + 1} OR c.address ILIKE $${sqlParams.length + 1})`;
        sqlParams.push(`%${params.search}%`);
      }

      queryStr += ` ORDER BY c.created_at DESC LIMIT $${sqlParams.length + 1} OFFSET $${sqlParams.length + 2}`;
      sqlParams.push(pageSize, offset);

      const itemsRes: any = await (sql as any).query(queryStr, sqlParams);
      const items: any = itemsRes.rows || itemsRes;
      const countRes: any = await sql`SELECT count(*)::int as count FROM complaints;`;
      const total = countRes[0]?.count || items.length;

      return {
        items: items.map((i: any) => ({
          ...i,
          user: { name: i.userName, email: i.userEmail },
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (err) {
      console.warn("DB getAdminComplaints error, returning fallback:", err);
      return {
        items: IN_MEMORY_SAMPLE_COMPLAINTS,
        total: IN_MEMORY_SAMPLE_COMPLAINTS.length,
        page,
        pageSize,
        totalPages: 1,
      };
    }
  }

  static async updateStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    adminName: string,
    remarks?: string
  ) {
    const sql = getDb();
    if (!sql) {
      const found = IN_MEMORY_SAMPLE_COMPLAINTS.find((c) => c.id === complaintId);
      if (found) {
        found.status = newStatus;
        found.history.unshift({
          id: `h_${Date.now()}`,
          complaintId,
          previousStatus: found.status,
          newStatus,
          remarks: remarks || `Status changed to ${newStatus}`,
          changedBy: adminName,
          createdAt: new Date().toISOString(),
        });
      }
      return;
    }

    const currentRows: any = await sql`SELECT status FROM complaints WHERE id = ${complaintId} LIMIT 1;`;
    const prevStatus = currentRows[0]?.status || "SUBMITTED";

    await sql`UPDATE complaints SET status = ${newStatus}, updated_at = CURRENT_TIMESTAMP WHERE id = ${complaintId};`;

    const histId = `hist_${Math.random().toString(36).substring(2, 10)}`;
    await sql`
      INSERT INTO complaint_history (
        id, complaint_id, previous_status, new_status, remarks, changed_by
      ) VALUES (
        ${histId}, ${complaintId}, ${prevStatus}, ${newStatus}, ${remarks || `Status updated to ${newStatus}`}, ${adminName}
      );
    `;
  }

  static async addRemark(complaintId: string, adminId: string, remark: string) {
    const sql = getDb();
    if (!sql) return;

    const remarkId = `rem_${Math.random().toString(36).substring(2, 10)}`;
    await sql`
      INSERT INTO admin_remarks (id, complaint_id, admin_id, remark)
      VALUES (${remarkId}, ${complaintId}, ${adminId}, ${remark});
    `;
  }

  static async findPotentialDuplicates(
    category: IssueCategory,
    address: string,
    excludeId?: string
  ): Promise<any[]> {
    const firstWord = address.split(" ")[0]?.trim() || "";
    const sql = getDb();
    if (!sql) {
      return IN_MEMORY_SAMPLE_COMPLAINTS.filter(
        (c) => c.category === category && c.id !== excludeId
      ).slice(0, 3);
    }

    try {
      const rows: any = await sql`
        SELECT id, reference_id as "referenceId", title, status, address, created_at as "createdAt"
        FROM complaints
        WHERE category = ${category}
          AND id != ${excludeId || ""}
          AND address ILIKE ${`%${firstWord}%`}
          AND status IN ('SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'APPROVED')
        LIMIT 5;
      `;
      return rows;
    } catch {
      return [];
    }
  }
}
