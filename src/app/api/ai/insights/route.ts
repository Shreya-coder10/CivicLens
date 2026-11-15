import { NextResponse } from "next/server";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { AIService } from "@/lib/services/ai.service";

export async function GET() {
  try {
    if (!AIService.isAvailable()) {
      return NextResponse.json(
        {
          error:
            "OpenRouter API key is not configured. Community intelligence generation is currently offline.",
          isAvailable: false,
        },
        { status: 503 }
      );
    }

    const [stats, topLocations] = await Promise.all([
      AnalyticsService.getPlatformStats(),
      AnalyticsService.getTopLocations(5),
    ]);

    const insight = await AIService.generateCommunityInsights({
      totalReports: stats.totalReports,
      resolved: stats.resolved,
      inProgress: stats.inProgress,
      underReview: stats.underReview,
      categoryBreakdown: stats.categoryCounts.map((c) => ({
        category: c.category,
        count: c.count,
      })),
      topLocations,
    });

    return NextResponse.json({
      success: true,
      insight,
    });
  } catch (error: any) {
    console.error("AI Insights error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate community intelligence." },
      { status: 500 }
    );
  }
}
