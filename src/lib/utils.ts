import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatCategoryName(category: string): string {
  return category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getStatusColor(status: string) {
  switch (status) {
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "UNDER_REVIEW":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "APPROVED":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "RESOLVED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "REJECTED":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case "LOW":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "HIGH":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "CRITICAL":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}
