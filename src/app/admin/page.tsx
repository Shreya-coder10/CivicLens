import { AnalyticsService } from "@/lib/services/analytics.service";
import { ComplaintService } from "@/lib/services/complaint.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCategoryName, formatDate, getSeverityColor, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await AnalyticsService.getPlatformStats();
  const recent = await ComplaintService.getAdminComplaints({ pageSize: 5 });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Administrative Command &amp; Triage Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time municipal complaints queue, field dispatches, and work order allocations.
          </p>
        </div>
        <Link href="/admin/complaints">
          <Button size="sm" className="bg-[#172554] hover:bg-[#1e3a8a] text-white">
            <FileCheck2 className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
            Triage All Complaints
          </Button>
        </Link>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Reports
            </span>
            <p className="text-2xl font-extrabold text-[#172554] mt-1">
              {stats.totalReports}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/20 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              Pending Review
            </span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">
              {stats.underReview}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/20 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
              In Progress
            </span>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">
              {stats.inProgress}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/20 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Resolved
            </span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {stats.resolved}
            </p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/20 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
              Rejected
            </span>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">
              {stats.rejected}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Triage Table */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Recent Submissions Requiring Triage
            </CardTitle>
            <CardDescription className="text-xs">
              Latest incoming complaints filed by citizens across all municipal wards
            </CardDescription>
          </div>
          <Link
            href="/admin/complaints"
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
          >
            View all ({stats.totalReports})
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Reference ID</th>
                  <th className="px-4 py-3">Issue Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.items.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">
                      {c.referenceId}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate">
                      {c.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatCategoryName(c.category)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${getSeverityColor(
                          c.severity
                        )}`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(
                          c.status
                        )}`}
                      >
                        {c.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(c.createdAt).split(",")[0]}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/issues/${c.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Triage &amp; Update
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
