import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LandingPageContent } from "@/components/landing/landing-page-content";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { ComplaintService } from "@/lib/services/complaint.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let stats = {
    totalReports: 0,
    resolved: 0,
    inProgress: 0,
    underReview: 0,
  };

  let recentComplaints: any[] = [];

  try {
    const [platformStats, complaints] = await Promise.all([
      AnalyticsService.getPlatformStats(),
      ComplaintService.getPublicComplaints({ limit: 6 }),
    ]);
    stats = {
      totalReports: platformStats.totalReports,
      resolved: platformStats.resolved,
      inProgress: platformStats.inProgress,
      underReview: platformStats.underReview,
    };
    recentComplaints = complaints;
  } catch (error) {
    console.warn("Could not query DB stats on homepage load:", error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingPageContent stats={stats} recentComplaints={recentComplaints} />
      </main>
      <Footer />
    </div>
  );
}
