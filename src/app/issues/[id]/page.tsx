import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StatusTimeline } from "@/components/complaints/status-timeline";
import { AdminStatusControl } from "@/components/complaints/admin-status-control";
import { ComplaintService } from "@/lib/services/complaint.service";
import { getServerAuthSession } from "@/lib/auth";
import { formatCategoryName, formatDate, getSeverityColor, getStatusColor } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  User,
  ShieldAlert,
  Image as ImageIcon,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface ComplaintDetailsPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ComplaintDetailsPage({
  params,
}: ComplaintDetailsPageProps) {
  const session = await getServerAuthSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // Support lookup by UUID or referenceId
  let complaint = await ComplaintService.getById(params.id);
  if (!complaint) {
    complaint = await ComplaintService.getByReferenceId(params.id);
  }

  if (!complaint) {
    notFound();
  }

  // Find duplicates if any
  const duplicates = await ComplaintService.findPotentialDuplicates(
    complaint.category,
    complaint.address,
    complaint.id
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between">
            <Link
              href="/issues"
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Back to Public Issues
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">
                {complaint.referenceId}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* Admin Triage Control (visible only to authenticated administrators) */}
          {isAdmin && (
            <AdminStatusControl
              complaintId={complaint.id}
              currentStatus={complaint.status}
            />
          )}

          {/* Potential Duplicate Warning banner */}
          {duplicates.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Cluster Intelligence: {duplicates.length} Potential Duplicate or Co-located Reports Detected Nearby
              </div>
              <p className="text-amber-800">
                Other citizens have submitted reports for this vicinity under{" "}
                <strong>{formatCategoryName(complaint.category)}</strong>:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {duplicates.map((d) => (
                  <Link
                    key={d.id}
                    href={`/issues/${d.id}`}
                    className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-semibold text-amber-900 border border-amber-300 hover:bg-amber-100"
                  >
                    <span>{d.referenceId}</span>
                    <span className="text-[10px] text-amber-600">({d.status})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Main Complaint Header */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="teal">
                  {formatCategoryName(complaint.category)}
                </Badge>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${getSeverityColor(
                    complaint.severity
                  )}`}
                >
                  {complaint.severity} SEVERITY
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Reported {formatDate(complaint.createdAt)}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {complaint.title}
              </h1>
              <div className="flex items-center text-xs text-slate-600 gap-1.5">
                <MapPin className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <span className="font-medium text-slate-800">{complaint.address}</span>
                {complaint.latitude && complaint.longitude && (
                  <span className="text-slate-400 font-mono text-[11px]">
                    ({complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)})
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Bedrock AI Executive Summary Callout if available */}
              {complaint.aiSummary && (
                <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-teal-600" />
                    Amazon Bedrock AI Summary
                  </span>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &quot;{complaint.aiSummary}&quot;
                  </p>
                </div>
              )}

              {/* Full Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Citizen Grievance Description
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {/* Photographic Evidence Gallery */}
              {complaint.images && complaint.images.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    Photographic Attachments ({complaint.images.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {complaint.images.map((img) => (
                      <a
                        key={img.id}
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative h-48 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 block"
                      >
                        <img
                          src={img.url}
                          alt={img.originalFilename}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[11px] text-white truncate">
                          {img.originalFilename}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Official Administrative Remarks */}
          {complaint.adminRemarks && complaint.adminRemarks.length > 0 && (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-teal-600" />
                  Official Municipal Directives &amp; Field Remarks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {complaint.adminRemarks.map((remark) => (
                  <div
                    key={remark.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">
                        {remark.admin?.name || "Municipal Administrator"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(remark.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap">
                      {remark.remark}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Resolution Progress Timeline */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">
                Resolution Workflow &amp; Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <StatusTimeline
                currentStatus={complaint.status}
                history={complaint.history as any[]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
