import { getDb } from "../db";
import { IssueCategory, IssueSeverity, CommunityStats } from "@/types";

export class AnalyticsService {
  static async getPlatformStats(): Promise<CommunityStats> {
    const sql = getDb();

    // Fallback baseline metrics for initial startup or demo mode
    if (!sql) {
      return {
        totalReports: 7,
        underReview: 1,
        inProgress: 3,
        resolved: 1,
        rejected: 1,
        categoryCounts: [
          { category: "ROADS_AND_POTHOLES" as IssueCategory, count: 2 },
          { category: "GARBAGE_AND_WASTE" as IssueCategory, count: 1 },
          { category: "WATER_SUPPLY_AND_LEAKAGE" as IssueCategory, count: 1 },
          { category: "STREETLIGHTS_AND_ELECTRICITY" as IssueCategory, count: 1 },
          { category: "DRAINAGE_AND_SANITATION" as IssueCategory, count: 1 },
          { category: "PUBLIC_INFRASTRUCTURE" as IssueCategory, count: 1 },
        ],
        severityCounts: [
          { severity: "LOW" as IssueSeverity, count: 1 },
          { severity: "MEDIUM" as IssueSeverity, count: 1 },
          { severity: "HIGH" as IssueSeverity, count: 2 },
          { severity: "CRITICAL" as IssueSeverity, count: 3 },
        ],
        recentTrends: [
          { date: "Day 1", count: 2 },
          { date: "Day 2", count: 3 },
          { date: "Day 3", count: 2 },
        ],
      };
    }

    try {
      const [
        totalRes,
        underReviewRes,
        inProgressRes,
        resolvedRes,
        rejectedRes,
        categoryRes,
        severityRes,
        complaintsRes,
      ]: any = await Promise.all([
        sql`SELECT count(*)::int as count FROM complaints;`,
        sql`SELECT count(*)::int as count FROM complaints WHERE status = 'UNDER_REVIEW';`,
        sql`SELECT count(*)::int as count FROM complaints WHERE status = 'IN_PROGRESS';`,
        sql`SELECT count(*)::int as count FROM complaints WHERE status = 'RESOLVED';`,
        sql`SELECT count(*)::int as count FROM complaints WHERE status = 'REJECTED';`,
        sql`SELECT category, count(*)::int as count FROM complaints GROUP BY category;`,
        sql`SELECT severity, count(*)::int as count FROM complaints GROUP BY severity;`,
        sql`SELECT created_at as "createdAt" FROM complaints ORDER BY created_at ASC LIMIT 500;`,
      ]);

      const totalReports = totalRes[0]?.count || 0;
      const underReview = underReviewRes[0]?.count || 0;
      const inProgress = inProgressRes[0]?.count || 0;
      const resolved = resolvedRes[0]?.count || 0;
      const rejected = rejectedRes[0]?.count || 0;

      const categoryCounts = categoryRes.map((r: any) => ({
        category: r.category as IssueCategory,
        count: r.count,
      }));

      const severityCounts = severityRes.map((r: any) => ({
        severity: r.severity as IssueSeverity,
        count: r.count,
      }));

      const trendMap = new Map<string, number>();
      complaintsRes.forEach((c: any) => {
        const dateStr = new Date(c.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
      });

      const recentTrends = Array.from(trendMap.entries()).map(([date, count]) => ({
        date,
        count,
      }));

      return {
        totalReports,
        underReview,
        inProgress,
        resolved,
        rejected,
        categoryCounts,
        severityCounts,
        recentTrends,
      };
    } catch (err) {
      console.warn("DB getPlatformStats error, returning default stats:", err);
      return {
        totalReports: 0,
        underReview: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
        categoryCounts: [],
        severityCounts: [],
        recentTrends: [],
      };
    }
  }

  static async getTopLocations(limit = 5) {
    const sql = getDb();
    if (!sql) {
      return [
        { address: "4th Main Avenue, Indiranagar", count: 3 },
        { address: "Sector 12 Market Complex", count: 2 },
        { address: "Crossroad 7, Koramangala", count: 2 },
      ];
    }

    try {
      const rows: any = await sql`
        SELECT address, count(*)::int as count 
        FROM complaints 
        GROUP BY address 
        ORDER BY count DESC 
        LIMIT ${limit};
      `;
      return rows;
    } catch {
      return [];
    }
  }
}
