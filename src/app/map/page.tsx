import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CivicMap } from "@/components/maps/civic-map";
import { ComplaintService } from "@/lib/services/complaint.service";
import { IssueCategory, ComplaintStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Filter, Layers, PlusCircle } from "lucide-react";

interface MapPageProps {
  searchParams: {
    category?: string;
    status?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CommunityMapPage({ searchParams }: MapPageProps) {
  let complaints: any[] = [];
  try {
    complaints = await ComplaintService.getPublicComplaints({
      category: searchParams.category as IssueCategory | undefined,
      status: searchParams.status as ComplaintStatus | undefined,
      hasCoords: true,
      limit: 200,
    });
  } catch (err) {
    console.error("Map data fetch error:", err);
  }

  const mapData = complaints.map((c) => ({
    id: c.id,
    referenceId: c.referenceId,
    title: c.title,
    category: c.category,
    status: c.status,
    address: c.address,
    latitude: c.latitude!,
    longitude: c.longitude!,
  }));

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

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 py-6 flex flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-teal-600" />
                Interactive Community Civic Map
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Geospatial distribution of {mapData.length} active and resolved municipal reports.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/report">
                <Button size="sm" className="bg-[#172554] hover:bg-[#1e3a8a] text-white">
                  <PlusCircle className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
                  Report at Location
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Toolbar */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <form method="GET" className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Filter className="h-3.5 w-3.5 text-teal-600" /> Filter Map:
                </div>
                <select
                  name="category"
                  defaultValue={searchParams.category || ""}
                  className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  name="status"
                  defaultValue={searchParams.status || ""}
                  className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="">All Statuses</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <Button size="sm" type="submit" variant="outline" className="h-8 text-xs">
                  Apply Filter
                </Button>
                <Link href="/map">
                  <Button size="sm" variant="ghost" type="button" className="h-8 text-xs">
                    Reset
                  </Button>
                </Link>

                <div className="ml-auto hidden lg:flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-600 inline-block" /> Road
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600 inline-block" /> Waste
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-600 inline-block" /> Water
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-600 inline-block" /> Light
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-600 inline-block" /> Drainage
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-600 inline-block" /> Infra
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Interactive Map View */}
          <div className="h-[650px] w-full rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <CivicMap complaints={mapData} zoom={13} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
