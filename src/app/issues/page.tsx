import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComplaintCard } from "@/components/complaints/complaint-card";
import { ComplaintService } from "@/lib/services/complaint.service";
import { IssueCategory, ComplaintStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Filter, PlusCircle, AlertCircle } from "lucide-react";

interface IssuesPageProps {
  searchParams: {
    category?: string;
    status?: string;
    q?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  let complaints: any[] = [];
  try {
    complaints = await ComplaintService.getPublicComplaints({
      category: searchParams.category as IssueCategory | undefined,
      status: searchParams.status as ComplaintStatus | undefined,
      search: searchParams.q,
    });
  } catch (error) {
    console.error("Failed to load public complaints:", error);
  }

  const categories = [
    { key: "", label: "All Categories" },
    { key: "ROADS_AND_POTHOLES", label: "Roads & Potholes" },
    { key: "GARBAGE_AND_WASTE", label: "Garbage & Waste" },
    { key: "WATER_SUPPLY_AND_LEAKAGE", label: "Water Leakage" },
    { key: "STREETLIGHTS_AND_ELECTRICITY", label: "Streetlights" },
    { key: "DRAINAGE_AND_SANITATION", label: "Drainage" },
    { key: "PUBLIC_INFRASTRUCTURE", label: "Infrastructure" },
    { key: "OTHER", label: "Other" },
  ];

  const statuses = [
    { key: "", label: "All Statuses" },
    { key: "SUBMITTED", label: "Submitted" },
    { key: "UNDER_REVIEW", label: "Under Review" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "RESOLVED", label: "Resolved" },
    { key: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Public Civic Issues
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Browse verified complaints logged by residents across municipal sectors.
              </p>
            </div>
            <Link href="/dashboard/report">
              <Button className="bg-[#172554] hover:bg-[#1e3a8a] text-white">
                <PlusCircle className="mr-2 h-4 w-4 text-teal-400" />
                Report New Problem
              </Button>
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <form method="GET" className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  name="q"
                  defaultValue={searchParams.q || ""}
                  placeholder="Search by keyword, address, or reference ID..."
                  className="pl-9 text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <select
                  name="category"
                  defaultValue={searchParams.category || ""}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <select
                  name="status"
                  defaultValue={searchParams.status || ""}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {statuses.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4 flex justify-end gap-2 pt-1">
                <Link href="/issues">
                  <Button variant="ghost" size="sm" type="button">
                    Clear Filters
                  </Button>
                </Link>
                <Button size="sm" type="submit" className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
                  <Filter className="mr-1.5 h-3.5 w-3.5" />
                  Apply Filter
                </Button>
              </div>
            </form>
          </div>

          {/* Complaints Grid */}
          {complaints.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {complaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                No civic issues match your filter criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing active category or status filters, or be the first citizen to report an infrastructure concern in this area.
              </p>
              <Link href="/dashboard/report">
                <Button size="sm" className="mt-2 bg-[#172554] text-white">
                  Report an Issue Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
