import { ComplaintService } from "@/lib/services/complaint.service";
import { IssueCategory, IssueSeverity, ComplaintStatus } from "@/types";
import { formatCategoryName, formatDate, getSeverityColor, getStatusColor } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Filter, ArrowLeft, ArrowRight, Eye, ShieldCheck } from "lucide-react";

interface AdminComplaintsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    status?: string;
    severity?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function AdminComplaintsPage({
  searchParams,
}: AdminComplaintsPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const result = await ComplaintService.getAdminComplaints({
    search: searchParams.q,
    category: searchParams.category as IssueCategory | undefined,
    status: searchParams.status as ComplaintStatus | undefined,
    severity: searchParams.severity as IssueSeverity | undefined,
    page,
    pageSize: 10,
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Municipal Complaints Management ({result.total})
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Review submissions, assign work orders, transition complaint statuses, and communicate with field crews.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                name="q"
                defaultValue={searchParams.q || ""}
                placeholder="Search by reference ID, title, address..."
                className="pl-9 text-xs"
              />
            </div>

            <div>
              <select
                name="category"
                defaultValue={searchParams.category || ""}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">All Categories</option>
                <option value="ROADS_AND_POTHOLES">Roads &amp; Potholes</option>
                <option value="GARBAGE_AND_WASTE">Garbage &amp; Waste</option>
                <option value="WATER_SUPPLY_AND_LEAKAGE">Water Leakage</option>
                <option value="STREETLIGHTS_AND_ELECTRICITY">Streetlights</option>
                <option value="DRAINAGE_AND_SANITATION">Drainage</option>
                <option value="PUBLIC_INFRASTRUCTURE">Infrastructure</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <select
                name="status"
                defaultValue={searchParams.status || ""}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <select
                name="severity"
                defaultValue={searchParams.severity || ""}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">All Severities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="sm:col-span-5 flex justify-end gap-2 pt-1 border-t border-slate-100">
              <Link href="/admin/complaints">
                <Button variant="ghost" size="sm" type="button" className="text-xs">
                  Reset Filters
                </Button>
              </Link>
              <Button size="sm" type="submit" className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Reference ID</th>
                <th className="px-4 py-3">Issue Title &amp; Address</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.items.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-950">
                    {c.referenceId}
                  </td>
                  <td className="px-4 py-3 max-w-[240px]">
                    <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">📍 {c.address}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
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
                  <td className="px-4 py-3 text-slate-600">
                    <p className="font-medium text-slate-800">{c.user?.name || "Citizen"}</p>
                    <p className="text-[10px] text-slate-400">{c.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {formatDate(c.createdAt).split(",")[0]}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/issues/${c.id}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-indigo-200 text-indigo-900 hover:bg-indigo-50">
                        <Eye className="mr-1 h-3 w-3" />
                        Triage &amp; Update
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-600">
          <span>
            Page {result.page} of {Math.max(1, result.totalPages)} ({result.total} total)
          </span>
          <div className="flex items-center gap-2">
            {result.page > 1 ? (
              <Link
                href={`/admin/complaints?page=${result.page - 1}${
                  searchParams.category ? `&category=${searchParams.category}` : ""
                }${searchParams.status ? `&status=${searchParams.status}` : ""}`}
              >
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <ArrowLeft className="mr-1 h-3 w-3" /> Previous
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" disabled className="h-7 text-xs">
                Previous
              </Button>
            )}

            {result.page < result.totalPages ? (
              <Link
                href={`/admin/complaints?page=${result.page + 1}${
                  searchParams.category ? `&category=${searchParams.category}` : ""
                }${searchParams.status ? `&status=${searchParams.status}` : ""}`}
              >
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Next <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" disabled className="h-7 text-xs">
                Next
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
