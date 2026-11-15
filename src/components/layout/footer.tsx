import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#172554] text-white">
                <ShieldAlert className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#172554]">
                Civic<span className="text-[#0D9488]">Lens</span>
              </span>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              &quot;See the problem. Report the issue. Improve your community.&quot;
            </p>
            <p className="text-xs text-slate-500">
              Report civic issues, track their resolution, and help hold your municipality accountable.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">
              Platform
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/issues" className="hover:text-slate-900">
                  Public Issues Feed
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-slate-900">
                  Interactive Issue Map
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-slate-900">
                  Community Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/report" className="hover:text-slate-900">
                  Report a Civic Problem
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-slate-900">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">
              Monitored Domains
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Roads &amp; Potholes</li>
              <li>Garbage &amp; Solid Waste</li>
              <li>Water Leakage &amp; Supply</li>
              <li>Streetlights &amp; Power</li>
              <li>Drainage &amp; Sanitation</li>
              <li>Public Infrastructure</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CivicLens</p>
        </div>
      </div>
    </footer>
  );
}
