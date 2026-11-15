"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  MapPin,
  BarChart3,
  FileText,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const navLinks = [
    { href: "/issues", label: "Public Issues", icon: FileText },
    { href: "/map", label: "Community Map", icon: MapPin },
    { href: "/insights", label: "Civic Insights", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#172554] text-white shadow-sm">
            <ShieldAlert className="h-5 w-5 text-teal-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#172554]">
              Civic<span className="text-[#0D9488]">Lens</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-[#172554]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side CTA & User Actions */}
        <div className="hidden md:flex md:items-center md:space-x-3">
          {session?.user ? (
            <div className="flex items-center space-x-3">
              {isAdmin ? (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 bg-indigo-50/50 text-indigo-900 hover:bg-indigo-100"
                  >
                    <ShieldCheck className="mr-1.5 h-4 w-4 text-indigo-600" />
                    Admin Portal
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="mr-1.5 h-4 w-4 text-slate-600" />
                    Citizen Portal
                  </Button>
                </Link>
              )}

              <Link href={isAdmin ? "/admin/complaints" : "/dashboard/report"}>
                <Button size="sm" className="bg-[#172554] hover:bg-[#1e3a8a] text-white">
                  <PlusCircle className="mr-1.5 h-4 w-4 text-teal-400" />
                  Report Issue
                </Button>
              </Link>

              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="text-slate-500 hover:text-rose-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard/report">
                <Button size="sm" className="bg-[#172554] hover:bg-[#1e3a8a] text-white">
                  <PlusCircle className="mr-1.5 h-4 w-4 text-teal-400" />
                  Report an Issue
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-700" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <link.icon className="h-5 w-5 text-slate-500" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {session?.user ? (
              <div className="space-y-2">
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-5 w-5 text-teal-600" />
                  <span>{isAdmin ? "Admin Portal" : "Citizen Dashboard"}</span>
                </Link>
                <Link
                  href="/dashboard/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-md bg-[#172554] px-3 py-2 text-base font-medium text-white"
                >
                  <PlusCircle className="h-5 w-5 text-teal-400" />
                  <span>Submit New Complaint</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out ({session.user.name})</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#172554] text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
