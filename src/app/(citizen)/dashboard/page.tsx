import { getServerAuthSession } from "@/lib/auth";
import { ComplaintService } from "@/lib/services/complaint.service";
import { ComplaintCard } from "@/components/complaints/complaint-card";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, FileText, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CitizenDashboardPage() {
  const session = await getServerAuthSession();
  const userId = (session?.user as any)?.id;

  const myComplaints = await ComplaintService.getUserComplaints(userId);

  const total = myComplaints.length;
  const inProgress = myComplaints.filter((c) => c.status === "IN_PROGRESS").length;
  const resolved = myComplaints.filter((c) => c.status === "RESOLVED").length;
  const underReview = myComplaints.filter(
    (c) => c.status === "UNDER_REVIEW" || c.status === "SUBMITTED"
  ).length;

  // Category counts
  const categoryMap: Record<string, number> = {};
  myComplaints.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Personalized Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent p-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Track your submitted civic issues, inspect field work, or file new neighborhood reports.
          </p>
        </div>
        <Link href="/dashboard/report">
          <Button className="bg-[#172554] hover:bg-[#1e3a8a] text-white">
            <PlusCircle className="mr-1.5 h-4 w-4 text-teal-400" />
            File New Complaint
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              My Submissions
            </span>
            <p className="text-2xl font-bold text-[#172554] mt-1">{total}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Under Review
            </span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{underReview}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              In Progress
            </span>
            <p className="text-2xl font-bold text-purple-600 mt-1">{inProgress}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Resolved
            </span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{resolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Chart if user has reports */}
      {categoryData.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-900">
              My Issues by Category
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of infrastructure domains you have reported
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryData} />
          </CardContent>
        </Card>
      )}

      {/* Recent Submissions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            My Recent Complaints
          </h2>
          {myComplaints.length > 3 && (
            <Link
              href="/dashboard/my-reports"
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              View all ({myComplaints.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {myComplaints.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myComplaints.slice(0, 3).map((c) => (
              <ComplaintCard key={c.id} complaint={c as any} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-3">
            <FileText className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800">
              You haven&apos;t filed any complaints yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Notice a pothole, leaking pipe, or dark street? Report it directly to municipal authorities.
            </p>
            <Link href="/dashboard/report">
              <Button size="sm" className="bg-[#172554] text-white">
                Report an Issue Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
