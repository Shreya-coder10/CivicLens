import { formatDate, getStatusColor } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, ArrowDown } from "lucide-react";

interface TimelineItem {
  id: string;
  previousStatus: string;
  newStatus: string;
  remarks?: string | null;
  changedBy: string;
  createdAt: Date | string;
}

interface StatusTimelineProps {
  currentStatus: string;
  history: TimelineItem[];
}

const STATUS_STEPS = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Resolved" },
];

export function StatusTimeline({ currentStatus, history }: StatusTimelineProps) {
  const isRejected = currentStatus === "REJECTED";

  // Determine current active step index
  const stepIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-6">
      {/* 1. Horizontal Progress Bar (when not rejected) */}
      {!isRejected ? (
        <div className="relative py-4">
          <div className="grid grid-cols-4 gap-2">
            {STATUS_STEPS.map((step, idx) => {
              const isPassed = stepIndex >= idx;
              const isCurrent = step.key === currentStatus;

              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-[#0D9488] text-white ring-4 ring-teal-100"
                        : isPassed
                        ? "bg-[#172554] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isCurrent
                        ? "text-[#0D9488] font-bold"
                        : isPassed
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-2">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-rose-900">
            Complaint Closed as Rejected
          </h4>
          <p className="text-xs text-rose-700 mt-0.5">
            This issue could not be approved for municipal action. Review administrator remarks below for the detailed justification.
          </p>
        </div>
      )}

      {/* 2. Detailed Audit Log Timeline */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Official Audit Trail &amp; Status Transitions
        </h4>
        <div className="relative border-l-2 border-slate-200 pl-4 space-y-6 ml-2">
          {history.map((event, idx) => (
            <div key={event.id || idx} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-teal-600 ring-4 ring-white" />

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${getStatusColor(
                      event.newStatus
                    )}`}
                  >
                    {event.newStatus.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-700">
                    {event.changedBy}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {formatDate(event.createdAt)}
                  </span>
                </div>

                {event.remarks && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 mt-1">
                    {event.remarks}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
