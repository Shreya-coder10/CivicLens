const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Default to top open-source models: Llama 3.3 70B or free tier open source
export const DEFAULT_OPEN_SOURCE_MODEL = (
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct"
)
  .replace(/['"]/g, "")
  .trim();

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export async function invokeOpenRouterModel(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_OPEN_SOURCE_MODEL
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured in your environment variables. Please add your OpenRouter key to enable open-source GenAI assistance."
    );
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
      "X-Title": "CivicLens Municipal AI",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2, // deterministic and fact-grounded
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMessage = errorText;
    try {
      const errJson = JSON.parse(errorText);
      parsedMessage = errJson?.error?.message || errorText;
    } catch {}
    throw new Error(`OpenRouter API error (${response.status}): ${parsedMessage}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];

  if (!choice?.message?.content) {
    throw new Error("No text response returned from OpenRouter model");
  }

  return choice.message.content;
}
