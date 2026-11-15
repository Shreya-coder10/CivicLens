import { z } from "zod";
import {
  invokeOpenRouterModel,
  isOpenRouterConfigured,
  DEFAULT_OPEN_SOURCE_MODEL,
} from "../ai/openrouter";
import { IssueCategory, IssueSeverity, AIEnhanceResult } from "@/types";

// Schema for structured AI complaint output
const enhancedComplaintSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20),
  suggestedCategory: z.enum([
    "ROADS_AND_POTHOLES",
    "GARBAGE_AND_WASTE",
    "WATER_SUPPLY_AND_LEAKAGE",
    "STREETLIGHTS_AND_ELECTRICITY",
    "DRAINAGE_AND_SANITATION",
    "PUBLIC_INFRASTRUCTURE",
    "OTHER",
  ]),
  suggestedSeverity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  shortSummary: z.string().min(10).max(300),
});

export class AIService {
  /**
   * Check whether OpenRouter is configured and available
   */
  static isAvailable(): boolean {
    return isOpenRouterConfigured();
  }

  /**
   * Feature A & B: Enhance an informal citizen complaint into a well-structured civic report
   * Using Open Source models via OpenRouter (e.g., Llama-3.3-70B, Mistral, Qwen)
   */
  static async enhanceComplaintDescription(
    informalInput: string
  ): Promise<AIEnhanceResult> {
    if (!this.isAvailable()) {
      throw new Error(
        "OpenRouter API key is not configured. Please supply OPENROUTER_API_KEY in your .env file."
      );
    }

    const systemPrompt = `You are CivicLens AI, an open-source municipal civic intelligence model designed to assist citizens in reporting urban infrastructure problems.
Your duty is to transform unstructured, informal citizen notes into structured, professional, and actionable civic complaints.
STRICT RULES:
1. Preserve the user's factual details (exact hazards, locations mentioned, timeframe). NEVER hallucinate facts, street names, or damages not present in the input.
2. Categorize the issue into EXACTLY ONE of:
   - ROADS_AND_POTHOLES
   - GARBAGE_AND_WASTE
   - WATER_SUPPLY_AND_LEAKAGE
   - STREETLIGHTS_AND_ELECTRICITY
   - DRAINAGE_AND_SANITATION
   - PUBLIC_INFRASTRUCTURE
   - OTHER
3. Assign severity: LOW, MEDIUM, HIGH, or CRITICAL (use CRITICAL only for immediate life-safety hazards or severe public blockages).
4. Respond ONLY with a valid JSON object matching this exact schema:
{
  "title": "Clear, concise, professional headline (max 80 chars)",
  "description": "Thorough, respectful, objective description detailing the issue and municipal impact",
  "suggestedCategory": "ROADS_AND_POTHOLES",
  "suggestedSeverity": "HIGH",
  "shortSummary": "A 1-2 sentence executive summary for field workers"
}`;

    const userPrompt = `Citizen submission to structure:
"${informalInput}"

Output valid JSON only. Do not add conversational text before or after the JSON.`;

    const rawResponse = await invokeOpenRouterModel(systemPrompt, userPrompt);

    // Extract JSON block even if model includes markdown code fences
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse structured JSON from OpenRouter model response");
    }

    const parsedJson = JSON.parse(jsonMatch[0]);
    const validated = enhancedComplaintSchema.parse(parsedJson);

    return {
      title: validated.title,
      description: validated.description,
      suggestedCategory: validated.suggestedCategory as IssueCategory,
      suggestedSeverity: validated.suggestedSeverity as IssueSeverity,
      shortSummary: validated.shortSummary,
    };
  }

  /**
   * Feature C: Generate concise executive summary of a lengthy complaint for administrators
   */
  static async generateSummary(
    title: string,
    description: string,
    category: string
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error("OpenRouter API key is not configured.");
    }

    const systemPrompt = `You are a municipal administrator's assistant. Provide a 1-2 sentence factual summary of the citizen report focusing on the exact hazard, public impact, and urgency. Do not invent details.`;
    const userPrompt = `Complaint:
Title: ${title}
Category: ${category}
Description: ${description}`;

    const response = await invokeOpenRouterModel(systemPrompt, userPrompt);
    return response.trim();
  }

  /**
   * Feature D: Synthesize community trends grounded exclusively in actual database statistics
   */
  static async generateCommunityInsights(stats: {
    totalReports: number;
    resolved: number;
    inProgress: number;
    underReview: number;
    categoryBreakdown: { category: string; count: number }[];
    topLocations?: { address: string; count: number }[];
  }): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error("OpenRouter API key is not configured.");
    }

    const systemPrompt = `You are CivicLens Community Intelligence Analyst.
Analyze the provided civic database statistics and produce an insightful, executive summary paragraph for city administrators.
CRITICAL CONSTRAINT: You must STRICTLY ground your analysis on the provided numbers. Do NOT invent numbers, complaints, percentages, or locations not present in the input.`;

    const userPrompt = `Verified Database Metrics:
- Total complaints logged: ${stats.totalReports}
- Resolved complaints: ${stats.resolved}
- Work in progress: ${stats.inProgress}
- Pending review: ${stats.underReview}
- Category Breakdown:
${stats.categoryBreakdown.map((c) => `  * ${c.category}: ${c.count}`).join("\n")}
${
  stats.topLocations && stats.topLocations.length > 0
    ? `- Notable Locations:\n${stats.topLocations
        .map((l) => `  * ${l.address}: ${l.count} reports`)
        .join("\n")}`
    : ""
}

Write a professional 2-3 paragraph community intelligence summary highlighting predominant infrastructure pressure points and civic resolution progress.`;

    const response = await invokeOpenRouterModel(systemPrompt, userPrompt);
    return response.trim();
  }
}
