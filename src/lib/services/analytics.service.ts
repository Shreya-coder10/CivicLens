import prisma from "../prisma";
import { IssueCategory, IssueSeverity, CommunityStats } from "@/types";

export class AnalyticsService {
  /**
   * Aggregate community-wide metrics for the public dashboard and admin analytics
   */
  static async getPlatformStats(): Promise<CommunityStats> {
    const [
      totalReports,
      underReview,
      inProgress,
      resolved,
      rejected,
      categoryGroups,
      severityGroups,
      recentComplaints,
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
      prisma.complaint.count({ where: { status: "RESOLVED" } }),
      prisma.complaint.count({ where: { status: "REJECTED" } }),
      prisma.complaint.groupBy({
        by: ["category"],
        _count: { id: true },
      }),
      prisma.complaint.groupBy({
        by: ["severity"],
        _count: { id: true },
      }),
      prisma.complaint.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
        take: 500,
      }),
    ]);

    // Format category distribution
    const categoryCounts = categoryGroups.map((group) => ({
      category: group.category as IssueCategory,
      count: group._count.id,
    }));

    // Format severity distribution
    const severityCounts = severityGroups.map((group) => ({
      severity: group.severity as IssueSeverity,
      count: group._count.id,
    }));

    // Group complaints by date for reporting trends
    const trendMap = new Map<string, number>();
    recentComplaints.forEach((c) => {
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
  }

  /**
   * Aggregate top location hotspots for Bedrock analysis
   */
  static async getTopLocations(limit = 5) {
    const complaints = await prisma.complaint.findMany({
      select: { address: true },
    });

    const counts: Record<string, number> = {};
    for (const c of complaints) {
      const loc = c.address.trim();
      counts[loc] = (counts[loc] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([address, count]) => ({ address, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
