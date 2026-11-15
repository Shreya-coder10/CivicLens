import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { AIService } from "@/lib/services/ai.service";
import { aiEnhanceSchema } from "@/lib/validations/complaint.schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to use the AI assistant." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = aiEnhanceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid prompt" },
        { status: 400 }
      );
    }

    if (!AIService.isAvailable()) {
      return NextResponse.json(
        {
          error:
            "OpenRouter API key is not configured. Please add OPENROUTER_API_KEY in .env to enable open-source GenAI.",
          isAvailable: false,
        },
        { status: 503 }
      );
    }

    const result = await AIService.enhanceComplaintDescription(
      validated.data.prompt
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("AI Enhance error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI enhancement request." },
      { status: 500 }
    );
  }
}
