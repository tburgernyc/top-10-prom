import { streamText } from "ai";
import { geminiFlash, ARIA_SYSTEM_PROMPT } from "@/lib/gemini";

export const runtime = "edge";

/* ── Request body shape ──────────────────────────────────────────────────── */
interface ChatRequestBody {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = streamText({
      model: geminiFlash,
      system: ARIA_SYSTEM_PROMPT,
      messages,
      maxTokens: 800,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("[/api/chat] error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
