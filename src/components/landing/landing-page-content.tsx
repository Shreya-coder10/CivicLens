"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  HelpCircle,
  Eye,
  Bot,
  Layers,
  Search,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
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

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim()) {
      router.push(`/issues?search=${encodeURIComponent(searchRef.trim())}`);
    }
  };

  const categories = [
    {
      title: "Roads & Potholes",
      desc: "Surface subsidence, road craters, and missing asphalt.",
      icon: Construction,
      categoryKey: "ROADS_AND_POTHOLES",
      accent: "from-amber-500/10 to-orange-500/5 border-amber-200/80 text-amber-700",
      iconBg: "bg-amber-100 text-amber-800",
    },
    {
      title: "Garbage & Waste",
      desc: "Overflowing dumpsters, illegal dumping, and market waste.",
      icon: Trash2,
      categoryKey: "GARBAGE_AND_WASTE",
      accent: "from-emerald-500/10 to-teal-500/5 border-emerald-200/80 text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Water Supply & Leakage",
      desc: "Burst municipal pipes, low pressure, and clean water loss.",
      icon: Droplets,
      categoryKey: "WATER_SUPPLY_AND_LEAKAGE",
      accent: "from-blue-500/10 to-cyan-500/5 border-blue-200/80 text-blue-700",
      iconBg: "bg-blue-100 text-blue-800",
    },
    {
      title: "Streetlights & Power",
      desc: "Dark transit corridors, flickering lamps, and damaged poles.",
      icon: Lightbulb,
      categoryKey: "STREETLIGHTS_AND_ELECTRICITY",
      accent: "from-yellow-500/10 to-amber-500/5 border-yellow-200/80 text-yellow-800",
      iconBg: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Drainage & Sanitation",
      desc: "Clogged stormwater drains, sewage backflow, and open manholes.",
      icon: Layers,
      categoryKey: "DRAINAGE_AND_SANITATION",
      accent: "from-purple-500/10 to-indigo-500/5 border-purple-200/80 text-purple-700",
      iconBg: "bg-purple-100 text-purple-800",
    },
    {
      title: "Public Infrastructure",
      desc: "Broken footbridge railings, collapsed boundary walls, bus stops.",
      icon: Building2,
      categoryKey: "PUBLIC_INFRASTRUCTURE",
      accent: "from-rose-500/10 to-red-500/5 border-rose-200/80 text-rose-700",
      iconBg: "bg-rose-100 text-rose-800",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Capture & Describe",
      desc: "Snap a photo and write what you see in plain everyday language.",
    },
    {
      num: "02",
      title: "AI Formats Your Report",
      desc: "Our assistant recommends the right category, urgency, and clear summary.",
    },
    {
      num: "03",
      title: "Municipal Field Triage",
      desc: "Dispatched directly to the relevant ward supervisor and road crew.",
    },
    {
      num: "04",
      title: "Transparent Resolution",
      desc: "Track status transitions, field inspection notes, and work completion.",
    },
  ];

  const faqs = [
    {
      q: "How does the AI help me write a better complaint?",
      a: "Most citizens report problems informally — 'water is pooling near the school road'. The assistant converts this into a structured municipal complaint with recommended categorization and urgency, while preserving all your original facts.",
    },
    {
      q: "Can I track my complaint without an account?",
      a: "Yes. Every report receives an official reference code (e.g. CIV-2026-10492). Simply enter the ID in our lookup box or bookmark your tracking URL to check live status updates anytime.",
    },
    {
      q: "Where are my uploaded photos stored?",
      a: "Photographs are uploaded directly to secure cloud storage (Amazon S3) and attached to the complaint record. Only authorized municipal field staff and citizens viewing the public audit log can view them.",
    },
    {
      q: "How are administrator roles verified?",
      a: "Administrator privileges are protected by cryptographic role-based access control (RBAC). Admin credentials must be provisioned through administrative authorization, preventing self-assignment.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* 1. Hero Section - Deep Civic Slate with Precision Grid */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-24 md:pt-28 md:pb-32 border-b border-slate-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-medium text-teal-300 backdrop-blur">
              <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Verified Municipal Redressal Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              Your Community. <br className="hidden sm:inline" />
              Your Voice. <span className="text-teal-400">Your Impact.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Report local civic infrastructure problems, monitor resolution progress in real time, and help build a safer, cleaner neighborhood.
            </p>

            {/* Quick Actions & Instant Tracker */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
              <Link href="/dashboard/report">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-semibold px-7 shadow-lg shadow-teal-900/40 h-11"
                >
                  Report an Issue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/issues">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white h-11"
                >
                  <Eye className="mr-2 h-4 w-4 text-teal-400" />
                  Explore Public Issues
                </Button>
              </Link>
              <Link href="/map">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white h-11"
                >
                  <MapPin className="mr-2 h-4 w-4 text-teal-400" />
                  Live Map
                </Button>
              </Link>
            </div>

            {/* In-Hero Reference Lookup Form */}
            <div className="pt-4 max-w-md mx-auto">
              <form onSubmit={handleTrackSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="Track by Reference ID (e.g. CIV-2026-10492)..."
                  className="pl-10 pr-24 h-11 bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-teal-500 rounded-xl text-xs sm:text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 h-8 bg-teal-600 hover:bg-teal-500 text-white text-xs px-3 rounded-lg"
                >
                  Track
                </Button>
              </form>
            </div>
          </div>

          {/* Hero Metrics Ribbon */}
          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 backdrop-blur md:grid-cols-4 shadow-xl">
            <div className="p-3 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{stats.totalReports}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                Reports Submitted
              </p>
            </div>
            <div className="p-3 text-center sm:border-l border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">{stats.resolved}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                Resolved
              </p>
            </div>
            <div className="p-3 text-center border-t sm:border-t-0 sm:border-l border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">{stats.inProgress}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                In Progress
              </p>
            </div>
            <div className="p-3 text-center border-t sm:border-t-0 sm:border-l border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 tracking-tight">{stats.underReview}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                Under Review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Map Teaser Banner */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-50/80 via-white to-slate-50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm flex-shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Interactive Community Geographic Map
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-xl">
                  Inspect active repairs, sanitation hotspots, and resolved civic work orders across wards with open street mapping.
                </p>
              </div>
            </div>
            <Link href="/map" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white">
                Launch Live Map
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Issue Categories - Bento Grid */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3 text-teal-800 border-teal-300 bg-teal-50">
              Municipal Services
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              What You Can Report
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select any civic sector to file a structured complaint directly to responsible field departments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <Card
                  key={i}
                  className="group relative overflow-hidden border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.iconBg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Link
                        href={`/dashboard/report?category=${c.categoryKey}`}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Report <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-950 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {c.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How CivicLens Works - Clear Linear Pipeline */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-slate-700 border-slate-300">
              Transparent Redressal Flow
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              How CivicLens Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From informal neighborhood observation to verified municipal resolution in four clear stages.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-3xl font-extrabold text-teal-700 mb-3 font-mono">
                    {step.num}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Intelligent Assistant Feature Highlight */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40">
                <Bot className="h-3.5 w-3.5 mr-1.5" /> AI Drafting Assistant
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Write it in plain language. We handle the rest.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                You don&apos;t need to know the right municipal department or memorize official terminology. Describe the problem in plain language and the assistant formats it into an actionable complaint — suggesting category, severity, and an executive brief for reviewers.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 rounded-full bg-teal-500/20 items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-teal-400" />
                  </div>
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">Strict Fact Preservation:</strong> The model works only from what you wrote — no outside assumptions.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 rounded-full bg-teal-500/20 items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-teal-400" />
                  </div>
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">Community Patterns:</strong> Identifies recurring neighborhood bottlenecks from verified statistics.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 rounded-full bg-teal-500/20 items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-teal-400" />
                  </div>
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">Citizen Autonomy:</strong> Review, adjust, or overwrite all suggestions before submitting.
                  </p>
                </div>
              </div>
            </div>

            {/* Split Visual Simulation Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-teal-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> AI ASSISTANT DEMO
                </span>
                <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] text-teal-200">
                  Instant Structuring
                </span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Citizen Input:
                </span>
                <p className="italic text-slate-200">
                  &quot;The road near my house has a big hole and water collects there whenever it rains. Motorbikes slip.&quot;
                </p>
              </div>
              <div className="rounded-xl bg-white p-4 text-slate-900 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" className="text-[10px]">ROADS &amp; POTHOLES</Badge>
                  <Badge variant="warning" className="text-[10px]">HIGH SEVERITY</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Severe Road Subsidence and Hazardous Water Accumulation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Active crater causing severe waterlogging during rain events, presenting immediate skid and rollover risk for two-wheel vehicles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recent Public Submissions */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-2 text-slate-600">
                Public Records
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Recent Reports
              </h2>
            </div>
            <Link href="/issues" className="mt-4 sm:mt-0">
              <Button variant="outline" className="border-slate-300">
                View All Public Issues
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentComplaints.slice(0, 3).map((item) => (
              <Card key={item.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {item.referenceId}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.aiSummary || item.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[180px]">📍 {item.address}</span>
                    <Link
                      href={`/issues/${item.id}`}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      Track →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-slate-200 bg-white">
                <CardContent className="p-5 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
