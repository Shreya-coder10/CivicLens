"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  ArrowRight,
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Building2,
  Layers,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  Cpu,
  Activity,
  FileCheck2,
  Users2,
  ExternalLink,
  ChevronRight,
  Flame,
  AlertTriangle,
  Radio,
  FileText,
  Sparkles,
  Smartphone,
  Eye,
} from "lucide-react";
import { formatCategoryName, getStatusColor } from "@/lib/utils";

interface LandingProps {
  stats: {
    totalReports: number;
    resolved: number;
    inProgress: number;
    underReview: number;
  };
  recentComplaints: any[];
}

export function LandingPageContent({ stats, recentComplaints }: LandingProps) {
  const router = useRouter();
  const [searchRef, setSearchRef] = useState("");
  const [activeTab, setActiveTab] = useState<"triage" | "clustering" | "citizen">("triage");

  const heroRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lightweight GSAP hero sequence
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        gsap.from(".gsap-hero-badge", {
          opacity: 0,
          y: -10,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.from(".gsap-hero-title", {
          opacity: 0,
          y: 20,
          duration: 0.65,
          delay: 0.1,
          ease: "power3.out",
        });
        gsap.from(".gsap-hero-sub", {
          opacity: 0,
          y: 15,
          duration: 0.6,
          delay: 0.2,
          ease: "power3.out",
        });
        gsap.from(".gsap-hero-actions", {
          opacity: 0,
          y: 15,
          duration: 0.6,
          delay: 0.3,
          ease: "power3.out",
        });
        if (consoleRef.current) {
          gsap.from(consoleRef.current, {
            opacity: 0,
            y: 25,
            duration: 0.8,
            delay: 0.35,
            ease: "power3.out",
          });
        }
      }, heroRef);

      return () => ctx.revert();
    }
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim()) {
      router.push(`/issues?search=${encodeURIComponent(searchRef.trim())}`);
    }
  };

  const categories = [
    {
      title: "Roads & Potholes",
      desc: "Surface subsidence, craters, and missing asphalt.",
      icon: Construction,
      categoryKey: "ROADS_AND_POTHOLES",
      badge: "PWD Dispatch",
    },
    {
      title: "Garbage & Sanitation",
      desc: "Overflowing dumpsters, illegal dumps, market waste.",
      icon: Trash2,
      categoryKey: "GARBAGE_AND_WASTE",
      badge: "Solid Waste",
    },
    {
      title: "Water Supply & Leakage",
      desc: "Burst municipal mains, low pressure, clean water loss.",
      icon: Droplets,
      categoryKey: "WATER_SUPPLY_AND_LEAKAGE",
      badge: "Water Board",
    },
    {
      title: "Streetlights & Grid",
      desc: "Dark transit corridors, flickering lamps, exposed wires.",
      icon: Lightbulb,
      categoryKey: "STREETLIGHTS_AND_ELECTRICITY",
      badge: "Electrical Dept",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Geotag & Capture",
      desc: "Upload a photo from your phone. CivicLens extracts spatial coordinates and timestamp.",
    },
    {
      num: "02",
      title: "AI Analysis & Categorization",
      desc: "Our engine verifies severity, removes duplicate tickets, and maps to the correct municipal department.",
    },
    {
      num: "03",
      title: "Verified Field Resolution",
      desc: "Municipal crews complete repair work, attaching photo evidence and closing the ticket with public audit logs.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* =========================================================================
          SECTION 1: HERO - SPLIT SAAS PATTERN (Lucxar Law 1: 55% Text / 45% Mockup)
          ========================================================================= */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#090D16] text-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: 58% SaaS Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="gsap-hero-badge inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/60 px-3.5 py-1 text-xs font-medium text-teal-300 backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="font-mono text-[11px] tracking-tight uppercase text-teal-400">Civic Intelligence</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">24-Hour Municipal SLA</span>
              </div>

              {/* 7-Word Outcome-First Headline */}
              <h1 className="gsap-hero-title font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Report city issues. <br />
                <span className="text-teal-400">Track resolution in real time.</span>
              </h1>

              {/* Specific 2-Sentence Value Proposition */}
              <p className="gsap-hero-sub text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                CivicLens connects citizen reports directly to municipal field dispatch. Track transparent SLA milestones from initial geotag to verified repair with public audit logs.
              </p>

              {/* High-Contrast Action CTAs */}
              <div className="gsap-hero-actions flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/dashboard/report">
                  <Button
                    size="lg"
                    className="btn-premium w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-7 h-12 rounded-lg shadow-glow"
                  >
                    Report an Issue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/map">
                  <Button
                    size="lg"
                    variant="outline"
                    className="btn-premium w-full sm:w-auto border-slate-700/80 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white h-12 rounded-lg"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-teal-400" />
                    Live Operations Map
                  </Button>
                </Link>
              </div>

              {/* In-Hero Reference Lookup Form */}
              <div className="pt-3 max-w-md">
                <form onSubmit={handleTrackSubmit} className="relative flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    type="text"
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                    placeholder="Track by Reference (e.g. CIV-2026-10492)..."
                    className="pl-10 pr-24 h-11 bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-teal-500 rounded-lg text-xs sm:text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1.5 h-8 bg-teal-600 hover:bg-teal-500 text-white text-xs px-3.5 rounded-md font-medium"
                  >
                    Track
                  </Button>
                </form>
              </div>

              {/* Quantified Municipal Trust Counters */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
                <div>
                  <p className="font-heading text-2xl font-bold text-white tracking-tight">{stats.totalReports}</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Logged Reports</p>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <p className="font-heading text-2xl font-bold text-teal-400 tracking-tight">{stats.resolved}</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Verified Solved</p>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <p className="font-heading text-2xl font-bold text-amber-400 tracking-tight">24.6h</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Average SLA</p>
                </div>
              </div>
            </div>

            {/* Right Column: 42% Interactive SaaS Operations Console Mockup */}
            <div className="lg:col-span-5" ref={consoleRef}>
              <div className="rounded-xl border border-slate-800/90 bg-slate-900/90 p-1 shadow-2xl backdrop-blur">
                {/* Console Window Header */}
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-950/80 rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-slate-400">civiclens.gov/dispatch-ops</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>GPS 28.6139° N</span>
                  </div>
                </div>

                {/* Interactive Mode Tabs */}
                <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs">
                  <button
                    onClick={() => setActiveTab("triage")}
                    className={`py-2 px-3 text-center font-medium transition-colors border-b-2 ${
                      activeTab === "triage"
                        ? "border-teal-400 text-teal-300 bg-teal-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    AI Triage
                  </button>
                  <button
                    onClick={() => setActiveTab("clustering")}
                    className={`py-2 px-3 text-center font-medium transition-colors border-b-2 ${
                      activeTab === "clustering"
                        ? "border-teal-400 text-teal-300 bg-teal-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    GIS Clusters
                  </button>
                  <button
                    onClick={() => setActiveTab("citizen")}
                    className={`py-2 px-3 text-center font-medium transition-colors border-b-2 ${
                      activeTab === "citizen"
                        ? "border-teal-400 text-teal-300 bg-teal-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Audit Trail
                  </button>
                </div>

                {/* Console Body Content */}
                <div className="p-4 space-y-3.5 text-left font-sans">
                  {activeTab === "triage" && (
                    <>
                      {/* Active Ticket Card */}
                      <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-teal-400 font-semibold">CIV-2026-08492</span>
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/20">
                            In Field Progress
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Main Aqueduct Pipeline Leak</p>
                          <p className="text-xs text-slate-400 mt-0.5">Outer Ring Rd, Ward 12 Junction · 4,200L clean water loss</p>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-teal-400" />
                            SLA Remaining: 18h 42m
                          </span>
                          <span className="text-slate-300 font-medium">Assigned: Water Supply Board</span>
                        </div>
                      </div>

                      {/* AI Confidence Meter */}
                      <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Cpu className="h-4 w-4 text-teal-400" />
                          <div className="text-xs">
                            <p className="text-slate-200 font-medium">Auto-Categorization Model</p>
                            <p className="text-[10px] text-slate-400">Llama 3.3 70B · Confidence: 99.4%</p>
                          </div>
                        </div>
                        <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-mono font-bold text-emerald-400">
                          HIGH PRIORITY
                        </span>
                      </div>

                      {/* Secondary Ticket Preview */}
                      <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 flex items-center justify-between opacity-80">
                        <div className="text-xs">
                          <span className="font-mono text-slate-400">CIV-2026-08488</span>
                          <p className="text-slate-200 font-medium mt-0.5">High-Voltage Line Sagging</p>
                        </div>
                        <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[10px] text-teal-300 border border-teal-500/20">
                          Electrical Dept
                        </span>
                      </div>
                    </>
                  )}

                  {activeTab === "clustering" && (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Spatial Deduplication Radar</span>
                          <span className="text-teal-400 font-mono text-[11px]">Radius: 50m</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          3 citizen complaints merged into single operational work order at <span className="text-white font-mono">28.6141, 77.2090</span>.
                        </p>
                        <div className="rounded bg-slate-900 p-2 font-mono text-[10px] text-emerald-400 flex items-center justify-between">
                          <span>Deduplication saved: 2 dispatch cycles</span>
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                      <div className="p-2 text-center text-xs text-slate-400">
                        <Link href="/map" className="text-teal-400 hover:underline flex items-center justify-center gap-1">
                          Open Full GIS Operations Map <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab === "citizen" && (
                    <div className="space-y-2.5 text-xs">
                      <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">Cryptographic Verification</span>
                          <span className="text-emerald-400 text-[10px] font-mono">JWT Verified</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          HMAC-SHA256 signed audit records guarantee complaint integrity and transparent status progression.
                        </p>
                      </div>
                      <div className="rounded bg-slate-900/60 p-2.5 text-[11px] text-slate-300 flex items-center justify-between">
                        <span>Role Enforcement: Strict RBAC</span>
                        <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Console Footer Status Bar */}
                <div className="border-t border-slate-800 px-4 py-2 bg-slate-950/90 rounded-b-lg flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Audit Sync: Connected</span>
                  <span>14 Wards Online</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: TRUST & COMPATIBILITY STANDARDS (Light Shift: #FFFFFF)
          ========================================================================= */}
      <section data-aos="fade-up" className="py-8 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Built on Open Civic Standards & Verified Infrastructure
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center items-center justify-center">
            <div className="flex items-center justify-center space-x-2 text-slate-700 py-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-semibold tracking-tight">Stateless JWT Auth</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-700 py-2">
              <Layers className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-semibold tracking-tight">PostgreSQL NeonDB</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-700 py-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-semibold tracking-tight">GIS Spatial Clustering</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-700 py-2">
              <FileCheck2 className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-semibold tracking-tight">24-Hour Municipal SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OUTCOME COMPARISON (Subtle Slate #F8FAFC)
          ========================================================================= */}
      <section data-aos="fade-up" className="py-20 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Why traditional grievance systems fail.
            </h2>
            <p className="text-base text-slate-600">
              Citizens submit complaints into bureaucratic black holes. CivicLens replaces opaque dockets with verified, tracked accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 space-y-5 shadow-subtle">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">The Traditional Grievance Trap</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>18+ Days Average Response:</strong> Paper dockets sit in transit between disparate municipal departments.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Zero Tracking Visibility:</strong> Citizens receive no progress updates after initial call logging.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Duplicate Work Dispatches:</strong> 15 people report the same road crater, triggering redundant inspection calls.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Unverified Closures:</strong> Complaints marked "Resolved" administratively without proof of actual field repair.</span>
                </li>
              </ul>
            </div>

            {/* The CivicLens Way */}
            <div className="rounded-xl border-2 border-teal-600/30 bg-teal-50/20 p-7 space-y-5 shadow-card relative">
              <div className="absolute top-4 right-4">
                <span className="rounded-full bg-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  The SaaS Standard
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                  <Check className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-950">CivicLens Municipal Platform</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>24-Hour SLA Target:</strong> Direct routing to designated ward supervisor with live countdown clocks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Public Milestone Tracking:</strong> Real-time status changes viewable by anyone using unique Reference IDs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Proximity Deduplication:</strong> Automated GIS clustering links neighboring reports to a single work ticket.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Mandatory Completion Audits:</strong> Field crews must upload photo verification before ticket status resolves.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE BREATHING STAT SECTION (Lucxar Law 5: High Contrast Dark #090D16)
          ========================================================================= */}
      <section data-aos="zoom-in" className="py-20 md:py-28 bg-[#090D16] text-white border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-widest">
            Measurable Community Impact
          </p>
          <p className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none">
            24.6h
          </p>
          <p className="text-lg sm:text-xl text-slate-300 max-w-xl mx-auto font-normal">
            Average time from citizen photograph to verified field inspection across 14 municipal administrative wards.
          </p>
          <div className="pt-4 max-w-lg mx-auto border-t border-slate-800/80">
            <p className="text-sm italic text-slate-400">
              “CivicLens eliminated our 3-week docket backlog by routing clean, geotagged complaints straight to ward supervisors.”
            </p>
            <p className="text-xs font-semibold text-teal-400 mt-2">
              — Office of Municipal Urban Redressal, Central Ward Operations
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: 4 CORE SAAS MODULES (Lucxar Law 12: 4 Cards, NOT 3)
          ========================================================================= */}
      <section data-aos="fade-up" className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Purpose-built for civic accountability.
            </h2>
            <p className="text-base text-slate-600">
              Every feature is engineered to compress the distance between citizen detection and departmental action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <div className="card-elevated rounded-xl border border-slate-200 bg-[#FAFAFA] p-6 space-y-3.5 hover:border-teal-500/50 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">Autonomous Intake</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Converts casual photos and raw citizen descriptions into structured municipal work orders with instant severity scoring.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-teal-700 font-medium">
                Saves 8 min per intake
              </div>
            </div>

            {/* Module 2 */}
            <div className="card-elevated rounded-xl border border-slate-200 bg-[#FAFAFA] p-6 space-y-3.5 hover:border-teal-500/50 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">GIS Deduplication</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Auto-merges proximate issues within 50 meters into a single ticket, aggregating affected citizen signatures.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-blue-700 font-medium">
                Eliminates 38% duplicate calls
              </div>
            </div>

            {/* Module 3 */}
            <div className="card-elevated rounded-xl border border-slate-200 bg-[#FAFAFA] p-6 space-y-3.5 hover:border-teal-500/50 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">JWT Cryptographic Audit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Stateless token verification prevents ticket manipulation and enforces strict role separation between citizens and municipal staff.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-medium">
                Immutable lifecycle log
              </div>
            </div>

            {/* Module 4 */}
            <div className="card-elevated rounded-xl border border-slate-200 bg-[#FAFAFA] p-6 space-y-3.5 hover:border-teal-500/50 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">Public Telemetry</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ward-level performance rankings, resolution rate dashboards, and open datasets hold municipal corporations accountable.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-amber-700 font-medium">
                100% Public transparency
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HOW IT WORKS (3-Step Asymmetric Process)
          ========================================================================= */}
      <section data-aos="fade-up" className="py-20 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Three steps to a verified fix.
            </h2>
            <p className="text-base text-slate-600">
              A frictionless workflow designed for both citizens on mobile and field workers on site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative rounded-xl border border-slate-200 bg-white p-7 shadow-subtle space-y-4">
                <span className="font-mono text-4xl font-bold text-teal-600/30 block">
                  {step.num}
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CATEGORIES BENTO GRID (Direct Filter Links)
          ========================================================================= */}
      <section data-aos="fade-up" className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Departmental dispatch categories.
              </h2>
              <p className="text-base text-slate-600">
                Issues are automatically routed to the corresponding municipal agency.
              </p>
            </div>
            <Link href="/issues" className="mt-4 md:mt-0 text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
              View All Department Issues <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={`/issues?category=${cat.categoryKey}`}
                  className="card-elevated group rounded-xl border border-slate-200 bg-[#FAFAFA] p-5 hover:bg-white hover:border-teal-500/50 shadow-subtle transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-semibold">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: LIVE PUBLIC TRANSPARENCY FEED
          ========================================================================= */}
      {recentComplaints && recentComplaints.length > 0 && (
        <section data-aos="fade-up" className="py-20 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-mono font-semibold text-teal-700 uppercase tracking-wider">
                  Live Public Audit Feed
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                  Recently Reported Community Incidents
                </h2>
              </div>
              <Link href="/issues" className="mt-3 md:mt-0 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
                Browse Full Audit Log <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentComplaints.slice(0, 3).map((complaint) => {
                const statusColor = getStatusColor(complaint.status);
                return (
                  <Link
                    key={complaint.id}
                    href={`/issues/${complaint.id}`}
                    className="card-elevated rounded-xl border border-slate-200 bg-white p-5 shadow-subtle hover:border-teal-500/50 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] text-slate-500">
                          {complaint.reference_id || `CIV-${complaint.id.slice(0, 8)}`}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusColor}`}>
                          {complaint.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="font-heading text-sm font-bold text-slate-900 line-clamp-1">
                        {complaint.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {complaint.location_name || "Central District"}
                      </span>
                      <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 9: HIGH-CONTRAST SAAS ACTION CARD (Lucxar Law 9: Single Primary Action)
          ========================================================================= */}
      <section data-aos="fade-up" className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#090D16] text-white p-8 sm:p-12 md:p-16 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/60 px-3 py-1 text-xs font-mono text-teal-300">
              <Radio className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
              <span>Zero Account Requirement for Urgent Reports</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
              Spot a civic hazard? Fix it in 60 seconds.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              No endless paperwork. No unmonitored queues. Every report is assigned a public tracking code and dispatched directly to ward officers.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/report">
                <Button
                  size="lg"
                  className="btn-premium w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-8 h-12 rounded-lg shadow-glow"
                >
                  Report an Issue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-premium w-full sm:w-auto border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 h-12 rounded-lg"
                >
                  Municipal Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}