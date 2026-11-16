import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { StatusBarChart } from "@/components/charts/status-bar-chart";
import { ReportingTrendChart } from "@/components/charts/reporting-trend-chart";
import { SeverityBarChart } from "@/components/charts/severity-bar-chart";
import { BedrockInsightsCard } from "@/components/ai/bedrock-insights-card";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { CommunityStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  let stats: CommunityStats = {
    totalReports: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    categoryCounts: [],
    severityCounts: [],
    recentTrends: [],
  };

  try {
    stats = await AnalyticsService.getPlatformStats();
  } catch (error) {
    console.warn("Could not query DB stats on insights page:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-50 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-teal-800 mb-2">
              <span>Municipal Telemetry Engine</span>
              <span>·</span>
              <span>14 Wards Aggregated</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-teal-600" />
              Public Civic Analytics &amp; Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Transparent, real-time performance indicators and infrastructure trends across our municipality.
            </p>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="card-elevated border-slate-200 bg-white shadow-subtle">
              <CardContent className="p-5">
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Total Complaints
                </span>
                <p className="font-heading text-3xl font-bold text-slate-950 mt-1">
                  {stats.totalReports}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Logged across all wards
                </span>
              </CardContent>
            </Card>

            <Card className="card-elevated border-slate-200 bg-white shadow-subtle">
              <CardContent className="p-5">
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Resolved Issues
                </span>
                <p className="font-heading text-3xl font-bold text-emerald-600 mt-1">
                  {stats.resolved}
                </p>
                <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
                  {stats.totalReports > 0
                    ? `${Math.round((stats.resolved / stats.totalReports) * 100)}% resolution rate`
                    : "0%"}
                </span>
              </CardContent>
            </Card>

            <Card className="card-elevated border-slate-200 bg-white shadow-subtle">
              <CardContent className="p-5">
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Active in Field
                </span>
                <p className="font-heading text-3xl font-bold text-amber-600 mt-1">
                  {stats.inProgress}
                </p>
                <span className="text-[11px] text-amber-700 mt-1 block font-medium">
                  Field crews deployed
                </span>
              </CardContent>
            </Card>

            <Card className="card-elevated border-slate-200 bg-white shadow-subtle">
              <CardContent className="p-5">
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Review
                </span>
                <p className="font-heading text-3xl font-bold text-teal-600 mt-1">
                  {stats.underReview}
                </p>
                <span className="text-[11px] text-teal-700 mt-1 block font-medium">
                  Awaiting engineering dispatch
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Amazon Bedrock GenAI Intelligence Brief */}
          <BedrockInsightsCard />

          {/* 4 Interactive Visualizations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Category Distribution */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-slate-900">
                  Category Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Proportion of civic complaints by monitored domain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryPieChart data={stats.categoryCounts} />
              </CardContent>
            </Card>

            {/* Status Breakdown */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-slate-900">
                  Workflow Resolution Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Current volume across the lifecycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatusBarChart stats={stats} />
              </CardContent>
            </Card>

            {/* Reporting Trends */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-slate-900">
                  Reporting Trajectory Trends
                </CardTitle>
                <CardDescription className="text-xs">
                  Daily submission frequency over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportingTrendChart data={stats.recentTrends} />
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-slate-900">
                  Hazard Severity Breakdown
                </CardTitle>
                <CardDescription className="text-xs">
                  Report volume graded by risk and municipal urgency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SeverityBarChart data={stats.severityCounts} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
