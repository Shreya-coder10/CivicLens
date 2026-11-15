"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2, Check, AlertCircle, ArrowRight, Cpu } from "lucide-react";
import { toast } from "sonner";
import { AIEnhanceResult } from "@/types";

interface AIAssistantProps {
  onApplySuggestion: (suggestion: AIEnhanceResult) => void;
}

export function AIComplaintAssistant({ onApplySuggestion }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIEnhanceResult | null>(null);
  const [unavailableNotice, setUnavailableNotice] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length < 10) {
      toast.error("Please enter a short sentence describing the problem (at least 10 characters).");
      return;
    }

    setLoading(true);
    setUnavailableNotice(null);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setUnavailableNotice(
            data.error ||
              "OpenRouter API key is not configured. Add OPENROUTER_API_KEY in your .env file to enable open-source AI assistance."
          );
        } else {
          toast.error(data.error || "Failed to contact OpenRouter AI");
        }
        return;
      }

      setAiResult(data.data);
      toast.success("Open-source model structured your complaint successfully!");
    } catch (err: any) {
      toast.error(err.message || "Network error while connecting to AI service");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (aiResult) {
      onApplySuggestion(aiResult);
      toast.success("AI draft applied to form! You can review and refine all fields.");
      setIsOpen(false);
    }
  };

  return (
    <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/70 to-emerald-50/40 p-4 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D9488] text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              Open-Source AI Assistant
              <Badge variant="teal" className="text-[10px] py-0">Llama 3.3 / OpenRouter</Badge>
            </h4>
            <p className="text-xs text-slate-600">
              Type what happened informally. Open-source GenAI will structure it into an official municipal report.
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isOpen ? "outline" : "default"}
          onClick={() => setIsOpen(!isOpen)}
          className={isOpen ? "border-teal-300 text-teal-800" : "bg-[#0D9488] hover:bg-[#0F766E] text-white"}
        >
          {isOpen ? "Close Assistant" : "Use GenAI Assistant"}
        </Button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3 pt-3 border-t border-teal-200/60">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Your informal notes or description:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., The road near my house has a big hole and water collects there whenever it rains. Motorbikes are slipping."
              className="min-h-[70px] bg-white border-teal-200 focus-visible:ring-teal-600 text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Open Source Models (Llama 3.3, Mistral, Qwen) • Strictly preserves your facts
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-[#172554] hover:bg-[#1e3a8a] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-teal-400" />
                  Generating Structured Report...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
                  Structure With Open AI
                </>
              )}
            </Button>
          </div>

          {unavailableNotice && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">OpenRouter AI key not configured</p>
                <p className="mt-0.5 text-amber-700">{unavailableNotice}</p>
                <p className="mt-1 text-[11px] text-amber-600">
                  You can proceed to manually enter your complaint details below.
                </p>
              </div>
            </div>
          )}

          {aiResult && (
            <Card className="border-teal-300 bg-white shadow-sm mt-3">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-teal-600" /> Open Source Draft Proposal
                  </span>
                  <div className="flex gap-1.5">
                    <Badge variant="teal">{aiResult.suggestedCategory.replace(/_/g, " ")}</Badge>
                    <Badge variant="warning">{aiResult.suggestedSeverity}</Badge>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Suggested Title:</span>
                  <p className="text-sm font-semibold text-slate-900">{aiResult.title}</p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Structured Description:</span>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">{aiResult.description}</p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Executive Summary:</span>
                  <p className="text-xs text-slate-600 italic">&quot;{aiResult.shortSummary}&quot;</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Applying this fills the form. You retain full control to edit.
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApply}
                    className="bg-[#0D9488] hover:bg-[#0F766E] text-white"
                  >
                    Apply Suggestion to Form
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
