import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MapPin,
  BarChart3,
  User,
  ShieldCheck,
} from "lucide-react";

export default async function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/report", label: "Report an Issue", icon: PlusCircle },
    { href: "/dashboard/my-reports", label: "My Reports", icon: FileText },
    { href: "/map", label: "Community Map", icon: MapPin },
    { href: "/insights", label: "Civic Insights", icon: BarChart3 },
    { href: "/dashboard/profile", label: "Citizen Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Sidebar */}
          <aside className="md:col-span-1 lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Citizen Portal
                </span>
                <p className="font-semibold text-slate-900 truncate">
                  {session.user.name}
                </p>
                <span className="text-xs text-teal-700 font-medium">
                  Verified Resident
                </span>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {(session.user as any).role === "ADMIN" && (
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-900 hover:bg-indigo-100"
                  >
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span>Switch to Admin Portal</span>
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Main content pane */}
          <main className="md:col-span-3 lg:col-span-4">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
