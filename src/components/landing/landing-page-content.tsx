"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { formatCategoryName } from "@/lib/utils";

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
  const categories = [
    {
      title: "Roads & Potholes",
      desc: "Surface subsidence, road craters, and missing asphalt.",
      icon: Construction,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Garbage & Waste",
      desc: "Overflowing dumpsters, illegal dumping, and market waste.",
      icon: Trash2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Water Supply & Leakage",
      desc: "Burst municipal pipes, low pressure, and clean water loss.",
      icon: Droplets,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Streetlights & Power",
      desc: "Dark transit corridors, flickering lamps, and damaged poles.",
      icon: Lightbulb,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      title: "Drainage & Sanitation",
      desc: "Clogged stormwater drains, sewage backflow, and open manholes.",
      icon: Layers,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Public Infrastructure",
      desc: "Broken footbridge railings, collapsed boundary walls, bus stops.",
      icon: Building2,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Capture & Describe",
      desc: "Take a photo and write a quick informal description of the problem near you.",
    },
    {
      num: "02",
      title: "AI Formats Your Report",
      desc: "The assistant suggests a category, severity level, and rewrites your note into a clear complaint.",
    },
    {
      num: "03",
      title: "Municipal Field Triage",
      desc: "Verified complaints are dispatched directly to local ward authorities and field supervisors.",
    },
    {
      num: "04",
      title: "Transparent Resolution",
      desc: "Track status updates, field remarks, and resolution proof in a public audit timeline.",
    },
  ];

  const faqs = [
    {
      q: "How does the AI help me write a better complaint?",
      a: "Most people write informal notes — 'water is pooling near the school road'. The AI turns that into a structured complaint with the right category and severity, while keeping everything you wrote.",
    },
    {
      q: "Can I track my complaint without an account?",
      a: "Yes. Every report gets a unique reference number (like CIV-2026-10492). Bookmark the link or note the ID to check updates anytime.",
    },
    {
      q: "Where are my photos stored?",
      a: "Photos are stored securely on Amazon S3 and linked to your complaint. Only authorised reviewers can access them.",
    },
    {
      q: "Who can be an administrator?",
      a: "Administrators are provisioned separately — no one can self-assign that role through the app.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#0f172a] text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              Your Community. <br className="hidden sm:inline" />
              Your Voice. <span className="text-[#0D9488]">Your Impact.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Report local infrastructure problems, track their status, and see your city improve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard/report">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-8 shadow-lg shadow-teal-900/40"
                >
                  Report an Issue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/issues">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-400 text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Explore Community Issues
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Stats Ribbon */}
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">{stats.totalReports}</p>
              <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">
                Reports submitted              </p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-3xl font-extrabold text-teal-400">{stats.resolved}</p>
              <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">
                Resolved
              </p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-3xl font-extrabold text-amber-400">{stats.inProgress}</p>
              <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">
                In progress
              </p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-3xl font-extrabold text-blue-400">{stats.underReview}</p>
              <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">
                Under review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How CivicLens Works */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              How CivicLens Works
            </h3>
            <p className="text-sm text-slate-600 mt-3">
              Four steps from report to resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-6 hover:shadow-md transition-shadow"
              >
                <span className="text-4xl font-extrabold text-slate-200 block mb-3">
                  {step.num}
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Monitored Civic Domains */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              What You Can Report
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <Card key={i} className="border-slate-200 hover:border-teal-300 transition-colors">
                  <CardContent className="p-6 space-y-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Bedrock GenAI Feature Spotlight */}
      <section className="py-20 bg-gradient-to-r from-teal-900 to-[#172554] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge className="bg-teal-400/20 text-teal-300 border-teal-300/30">
                <Bot className="h-3.5 w-3.5 mr-1" /> Open-Source AI Intelligence
              </Badge>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Write it in plain language. We handle the rest.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                You don&apos;t need to know the right department or use official terminology. Describe the problem in plain language and the AI formats it into a proper complaint — with the right category, severity, and a clear summary for the reviewer.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">Your facts, unchanged:</strong> The AI only uses what you wrote — no assumptions.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">Spot patterns:</strong> See which issues are most common in your area.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">You stay in control:</strong> Review and edit every AI suggestion before submitting.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual simulation card */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono text-teal-300">
                  AI ASSISTANT
                </span>
                <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] text-teal-200">
                  Free & Open Source
                </span>
              </div>
              <div className="rounded-lg bg-black/40 p-3 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Citizen Input:
                </span>
                <p className="italic">
                  &quot;The road near my house has a big hole and water collects there whenever it rains. Motorbikes slip.&quot;
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 text-slate-900 space-y-2 shadow">
                <div className="flex items-center justify-between">
                  <Badge variant="teal">ROADS &amp; POTHOLES</Badge>
                  <Badge variant="warning">HIGH SEVERITY</Badge>
                </div>
                <p className="text-sm font-bold text-[#172554]">
                  Severe Road Subsidence and Hazardous Water Accumulation
                </p>
                <p className="text-xs text-slate-600">
                  Active crater causing severe waterlogging during rain events, presenting immediate skid and rollover risk for two-wheel vehicles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recent Public Issues Feed Preview */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Recent Reports
              </h3>
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
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
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

      {/* 6. FAQ Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Common Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-slate-200">
                <CardContent className="p-5 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
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
