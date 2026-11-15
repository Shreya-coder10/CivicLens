import { AnalyticsService } from "@/lib/services/analytics.service";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { StatusBarChart } from "@/components/charts/status-bar-chart";
import { ReportingTrendChart } from "@/components/charts/reporting-trend-chart";
import { SeverityBarChart } from "@/components/charts/severity-bar-chart";
import { BedrockInsightsCard } from "@/components/ai/bedrock-insights-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [stats, topLocations] = await Promise.all([
    AnalyticsService.getPlatformStats(),
    AnalyticsService.getTopLocations(6),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-700" />
          Administrative Analytics &amp; Bedrock GenAI Intelligence
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Comprehensive municipal reporting metrics, frequency trends, and AI-synthesized bottleneck summaries.
        </p>
      </div>

      {/* Bedrock Insights Card */}
      <BedrockInsightsCard />

      {/* Top Location Pressure Points */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-900">
            Top Infrastructure Bottleneck Localities
          </CardTitle>
          <CardDescription className="text-xs">
            Geographic areas with the highest density of citizen submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topLocations.map((loc: any, idx: number) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Rank #{idx + 1}
                  </span>
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-800">
                    {loc.count} reports
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  📍 {loc.address}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-900">
              Domain Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Relative distribution by municipal infrastructure domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={stats.categoryCounts} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-900">
              Status Progression
            </CardTitle>
            <CardDescription className="text-xs">
              Complaints currently in field dispatch vs. resolved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusBarChart stats={stats} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-900">
              Reporting Trajectory
            </CardTitle>
            <CardDescription className="text-xs">
              Trend of submitted grievances over the reporting period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportingTrendChart data={stats.recentTrends} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-900">
              Severity Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Complaints classified by public safety urgency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeverityBarChart data={stats.severityCounts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
