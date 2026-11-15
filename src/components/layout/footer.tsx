import Link from "next/link";
import { ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      {/* Civic Emergency Helpline Banner */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-3.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Life-Safety Emergencies:</strong> For active fires, gas leaks, or medical emergencies, dial municipal emergency dispatch immediately.
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <PhoneCall className="h-3 w-3 text-teal-600" /> Emergency: 112
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <PhoneCall className="h-3 w-3 text-teal-600" /> Municipal Call Center: 1916
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <ShieldAlert className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Civic<span className="text-teal-600">Lens</span>
              </span>
            </div>
            <p className="max-w-md text-sm text-slate-600 font-medium">
              &quot;See the problem. Report the issue. Improve your community.&quot;
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              A transparent civic issue management platform connecting citizens with local municipal public works authorities for verified, data-driven community improvements.
            </p>
            <div className="flex items-center space-x-2 pt-1 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Public Audit Timeline • Direct Ward Dispatch • Open Intelligence</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Platform Directory
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/issues" className="hover:text-teal-700 transition-colors">
                  Public Issues Feed
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-teal-700 transition-colors">
                  Community Geographic Map
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-teal-700 transition-colors">
                  Civic Analytics &amp; Trends
                </Link>
              </li>
              <li>
                <Link href="/dashboard/report" className="hover:text-teal-700 transition-colors">
                  Submit Issue Report
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-700 transition-colors">
                  Municipal Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic categories */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Monitored Sectors
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              <li>Roads &amp; Surface Subsidence</li>
              <li>Solid Waste &amp; Public Sanitation</li>
              <li>Water Leakage &amp; Supply Pipeline</li>
              <li>Streetlights &amp; Transit Corridors</li>
              <li>Stormwater Drainage &amp; Sewage</li>
              <li>Public Bridges &amp; Facilities</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CivicLens. Public Service Infrastructure.</p>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <Link href="/issues" className="hover:text-slate-600">
              Public Tracking
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-600">
              Official Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
