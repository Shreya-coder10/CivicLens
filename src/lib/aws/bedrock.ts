import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const region = process.env.AWS_REGION || "us-east-1";
const defaultModelId =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

export function getBedrockClient(): BedrockRuntimeClient | null {
  try {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      return new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }

    // Amplify / EC2 IAM Execution Role
    return new BedrockRuntimeClient({ region });
  } catch (error) {
    console.error("Failed to initialize AWS Bedrock client:", error);
    return null;
  }
}

export function isBedrockConfigured(): boolean {
  // If explicitly provided or running in AWS execution environment
  return Boolean(
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.AWS_ROLE_ARN
  );
}

export async function invokeBedrockModel(
  systemPrompt: string,
  userPrompt: string,
  modelId: string = defaultModelId
): Promise<string> {
  const client = getBedrockClient();
  if (!client) {
    throw new Error(
      "AWS Bedrock client is not configured. Please supply AWS credentials in .env or run with an attached IAM role."
    );
  }

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.2, // low temperature for deterministic, factual outputs
  };

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(responseBody);

  if (parsed.content && Array.isArray(parsed.content) && parsed.content[0]?.text) {
    return parsed.content[0].text;
  }

  throw new Error("Unexpected response structure from Amazon Bedrock");
}
