"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateComplaintStatusAction, addAdminRemarkAction } from "@/actions/complaint.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { ComplaintStatus } from "@/types";

interface AdminStatusControlProps {
  complaintId: string;
  currentStatus: string;
}

export function AdminStatusControl({
  complaintId,
  currentStatus,
}: AdminStatusControlProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ComplaintStatus>(
    currentStatus as ComplaintStatus
  );
  const [remarks, setRemarks] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await updateComplaintStatusAction({
        complaintId,
        status,
        remarks: remarks.trim() || undefined,
      });

      if (res.success) {
        toast.success(`Complaint status transitioned to ${status}`);
        setRemarks("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="border-indigo-200 bg-indigo-50/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-indigo-950">
              Administrator Triage &amp; Status Control
            </CardTitle>
            <CardDescription className="text-xs text-indigo-900/70">
              Authorized personnel only. State transitions are logged in the public audit trail.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Target Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved for Action</option>
                <option value="IN_PROGRESS">In Progress (Field Crew Dispatched)</option>
                <option value="RESOLVED">Resolved (Issue Fixed)</option>
                <option value="REJECTED">Rejected (Ineligible / Out of Scope)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Administrative Remarks / Work Order #:
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g., Dispatched Asphalt Patching Team #2"
                className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={updating}
              className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Commit Status Transition
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
