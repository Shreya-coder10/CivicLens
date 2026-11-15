import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  FileCheck2,
  Clock,
  BarChart3,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  // Enforce server-side role-based access control
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if ((session.user as any).role !== "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          403 – Administrator Privileges Required
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-md">
          Your account ({session.user.email}) does not possess municipal administrative authorization.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 rounded-md bg-[#172554] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1e3a8a]"
        >
          Return to Citizen Dashboard
        </Link>
      </div>
    );
  }

  const adminNav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "All Complaints", icon: FileCheck2 },
    {
      href: "/admin/complaints?status=UNDER_REVIEW",
      label: "Pending Reviews",
      icon: Clock,
    },
    { href: "/admin/analytics", label: "Analytics & AI Insights", icon: BarChart3 },
    { href: "/admin/users", label: "User Management", icon: Users },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 w-full border-b border-indigo-200 bg-[#172554] text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Link href="/admin" className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <span className="font-bold text-base tracking-tight text-white">
                CivicLens <span className="text-teal-400 font-mono text-xs">ADMIN</span>
              </span>
            </Link>
            <span className="rounded bg-indigo-900/60 border border-indigo-700/50 px-2 py-0.5 text-[10px] text-indigo-200">
              Municipal Operations Hub
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
            >
              Public Site <ExternalLink className="h-3 w-3" />
            </Link>
            <span className="text-indigo-400">|</span>
            <span className="text-slate-300 font-semibold">{session.user.name}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Admin Sidebar */}
          <aside className="md:col-span-1 lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                  Operations Console
                </span>
                <p className="text-xs font-bold text-slate-900">Command &amp; Triage</p>
              </div>

              <nav className="space-y-1">
                {adminNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-indigo-600" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Admin Main Workspace */}
          <main className="md:col-span-3 lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
