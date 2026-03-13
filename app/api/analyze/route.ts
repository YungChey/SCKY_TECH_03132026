import { NextResponse } from "next/server";
import { analyzeRecommendation } from "@/lib/analyzeRecommendation";
import { getDemoAnswer } from "@/lib/demoAnalysis";
import { extractProductClaims } from "@/lib/extractProductClaims";
import { persistAnalysisRun } from "@/lib/persistence";
import { extractBrandMentions, resolveEntity } from "@/lib/productCatalog";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function getOutputText(payload: OpenAIResponse) {
  if (payload.output_text) {
    return payload.output_text;
  }

  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .filter((content) => content.type === "output_text" && content.text)
      .map((content) => content.text)
      .join("\n")
      .trim() ?? ""
  );
}

function buildAnalysisResponse(
  prompt: string,
  answer: string,
  source: "openai" | "demo",
  modeMessage?: string
) {
  const claims = extractProductClaims(answer);
  const brandMentions = extractBrandMentions(answer);
  const resolution = resolveEntity(prompt, claims.product, answer, brandMentions);
  const analysis = analyzeRecommendation(claims, resolution);

  return {
    prompt,
    answer,
    claims,
    brandMentions,
    verifiedProduct: resolution.verifiedProduct,
    resolution,
    analysis,
    source,
    modeMessage,
  };
}

async function persistResponse(
  payload: ReturnType<typeof buildAnalysisResponse>
) {
  try {
    await persistAnalysisRun({
      prompt: payload.prompt,
      answer: payload.answer,
      source: payload.source,
      model: MODEL,
      modeMessage: payload.modeMessage,
      claims: payload.claims,
      brandMentions: payload.brandMentions,
      verifiedProduct: payload.verifiedProduct,
      resolution: payload.resolution,
      analysis: payload.analysis,
    });
  } catch (error) {
    console.error("Failed to persist analysis run", error);
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  let body: { prompt?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const prompt = body.prompt?.trim();

  if (!prompt) {
    return NextResponse.json(
      { error: 'Missing "prompt" in request body.' },
      { status: 400 }
    );
  }

  if (!apiKey) {
    const responsePayload = buildAnalysisResponse(
      prompt,
      getDemoAnswer(prompt),
      "demo",
      "Demo mode is active because OPENAI_API_KEY is not configured."
    );
    await persistResponse(responsePayload);
    return NextResponse.json(responsePayload);
  }

  try {
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: `Answer the user's shopping prompt in 2-4 sentences and include concrete product details when relevant.\n\nPrompt: ${prompt}`,
      }),
    });

    if (!openAIResponse.ok) {
      const responsePayload = buildAnalysisResponse(
        prompt,
        getDemoAnswer(prompt),
        "demo",
        "Demo mode is active because the live OpenAI request was unavailable."
      );
      await persistResponse(responsePayload);
      return NextResponse.json(responsePayload);
    }

    const payload = (await openAIResponse.json()) as OpenAIResponse;
    const answer = getOutputText(payload);
    const responsePayload = buildAnalysisResponse(prompt, answer, "openai");
    await persistResponse(responsePayload);
    return NextResponse.json(responsePayload);
  } catch (error) {
    const responsePayload = buildAnalysisResponse(
      prompt,
      getDemoAnswer(prompt),
      "demo",
      `Demo mode is active because the live request failed${
        error instanceof Error ? `: ${error.message}` : "."
      }`
    );
    await persistResponse(responsePayload);
    return NextResponse.json(responsePayload);
  }
}
