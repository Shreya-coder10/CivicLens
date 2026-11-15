import { getServerAuthSession } from "@/lib/auth";
import { ComplaintService } from "@/lib/services/complaint.service";
import { ComplaintCard } from "@/components/complaints/complaint-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyReportsPage() {
  const session = await getServerAuthSession();
  const userId = (session?.user as any)?.id;

  const complaints = await ComplaintService.getUserComplaints(userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Submitted Complaints ({complaints.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time status updates, field engineer audit events, and resolution logs.
          </p>
        </div>
        <Link href="/dashboard/report">
          <Button size="sm" className="bg-[#172554] hover:bg-[#1e3a8a] text-white">
            <PlusCircle className="mr-1.5 h-4 w-4 text-teal-400" />
            File New Issue
          </Button>
        </Link>
      </div>

      {complaints.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {complaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c as any} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-800">
            No complaints submitted yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Submit your first report to start tracking municipal action and improving your local neighborhood.
          </p>
          <Link href="/dashboard/report">
            <Button size="sm" className="bg-[#172554] text-white">
              Report an Issue Now
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
