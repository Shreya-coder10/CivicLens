import Link from "next/link";
import { formatCategoryName, formatDate, getSeverityColor, getStatusColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, ArrowRight, Image as ImageIcon, Sparkles } from "lucide-react";

interface ComplaintCardProps {
  complaint: {
    id: string;
    referenceId: string;
    title: string;
    description: string;
    aiSummary?: string | null;
    category: string;
    severity: string;
    status: string;
    address: string;
    createdAt: Date | string;
    images?: { url: string }[];
  };
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const hasImages = complaint.images && complaint.images.length > 0;
  const firstImage = hasImages ? complaint.images![0].url : null;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-slate-200 bg-white">
      {firstImage && (
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={firstImage}
            alt={complaint.title}
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
          />
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm border ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      )}

      <CardContent className="p-5 space-y-3">
        {!firstImage && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-slate-500">
              {complaint.referenceId}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status.replace(/_/g, " ")}
            </span>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {formatCategoryName(complaint.category)}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${getSeverityColor(
                complaint.severity
              )}`}
            >
              {complaint.severity}
            </span>
          </div>
          <h3 className="font-semibold text-base text-slate-900 line-clamp-1 hover:text-teal-700 transition-colors">
            <Link href={`/issues/${complaint.id}`}>{complaint.title}</Link>
          </h3>
        </div>

        {complaint.aiSummary ? (
          <div className="rounded bg-slate-50 p-2.5 border-l-2 border-teal-500">
            <p className="text-xs text-slate-600 line-clamp-2 flex items-start gap-1">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>{complaint.aiSummary}</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-600 line-clamp-2">
            {complaint.description}
          </p>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 truncate max-w-[200px]">
            <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{complaint.address}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatDate(complaint.createdAt).split(",")[0]}</span>
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <Link
            href={`/issues/${complaint.id}`}
            className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-900 group"
          >
            Track &amp; View Audit Trail
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
