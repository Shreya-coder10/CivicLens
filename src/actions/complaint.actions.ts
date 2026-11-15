"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { ComplaintService } from "@/lib/services/complaint.service";
import {
  complaintFormSchema,
  updateStatusSchema,
  adminRemarkSchema,
} from "@/lib/validations/complaint.schema";

export async function submitComplaintAction(data: any) {
  try {
    const user = await requireAuth();
    const validated = complaintFormSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Validation failed",
      };
    }

    const complaint = await ComplaintService.createComplaint(
      validated.data,
      user.id,
      user.name || "Citizen"
    );

    revalidatePath("/dashboard");
    revalidatePath("/issues");
    revalidatePath("/map");
    revalidatePath("/admin/complaints");

    return {
      success: true,
      referenceId: complaint.referenceId,
      id: complaint.id,
    };
  } catch (error: any) {
    console.error("submitComplaintAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to submit civic complaint",
    };
  }
}

export async function updateComplaintStatusAction(data: any) {
  try {
    const admin = await requireAdmin();
    const validated = updateStatusSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid status payload",
      };
    }

    const { complaintId, status, remarks } = validated.data;
    await ComplaintService.updateStatus(
      complaintId,
      status as any,
      admin.name || "Administrator",
      remarks
    );

    revalidatePath("/admin/complaints");
    revalidatePath(`/issues/${complaintId}`);
    revalidatePath("/issues");

    return { success: true };
  } catch (error: any) {
    console.error("updateComplaintStatusAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to update complaint status",
    };
  }
}

export async function addAdminRemarkAction(data: any) {
  try {
    const admin = await requireAdmin();
    const validated = adminRemarkSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid remark",
      };
    }

    const { complaintId, remark } = validated.data;
    await ComplaintService.addRemark(complaintId, admin.id, remark);

    revalidatePath(`/issues/${complaintId}`);
    revalidatePath("/admin/complaints");

    return { success: true };
  } catch (error: any) {
    console.error("addAdminRemarkAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to add administrative remark",
    };
  }
}
