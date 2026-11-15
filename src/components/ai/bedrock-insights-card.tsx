"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2, Bot, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function BedrockInsightsCard() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<string | null>(null);

  const fetchInsight = async () => {
    setLoading(true);
    setUnavailable(null);
    try {
      const res = await fetch("/api/ai/insights");
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setUnavailable(
            data.error ||
              "OpenRouter AI is not configured. Add OPENROUTER_API_KEY in your .env file to enable open-source community intelligence."
          );
        } else {
          toast.error(data.error || "Failed to generate AI insights");
        }
        return;
      }

      setInsight(data.insight);
      toast.success("Community intelligence synthesized with open-source GenAI!");
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch community insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-teal-200 bg-gradient-to-br from-teal-50/50 via-white to-slate-50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D9488] text-white shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                Open-Source Community Intelligence Brief
                <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
                  Grounded in Live Data
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Synthesize municipal issue patterns and bottleneck hotspots using open-source GenAI (Llama 3.3 / Mistral via OpenRouter).
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            onClick={fetchInsight}
            disabled={loading}
            className="bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-teal-400" />
                Analyzing Database...
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
                Generate Intelligence Brief
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {unavailable && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">OpenRouter API key is not configured</p>
              <p className="mt-0.5 text-amber-700">{unavailable}</p>
            </div>
          </div>
        )}

        {insight ? (
          <div className="rounded-lg border border-teal-200 bg-white p-4 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap shadow-sm">
            {insight}
          </div>
        ) : (
          !unavailable && (
            <p className="text-xs text-slate-500 italic">
              Click &quot;Generate Intelligence Brief&quot; above to have open-source models analyze live complaint frequencies, geographic hotspots, and turnaround times.
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
}
