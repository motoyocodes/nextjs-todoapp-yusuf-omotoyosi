// src/app/api/suggestions/route.ts
import { NextResponse } from "next/server";

type ReqBody = { topic?: string };

export async function POST(req: Request) {
  try {
    console.log("✅ OpenAI key exists:", !!process.env.OPENAI_API_KEY);
    console.log(
      "🔑 Key starts with:",
      process.env.OPENAI_API_KEY?.slice(0, 10)
    );

    const body: ReqBody = await req.json();
    const topic = (body.topic || "").trim();
    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    // ✅ 3. Fallback if OpenAI key is missing or invalid
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠ No OpenAI API key found — using mock suggestions.");
      return NextResponse.json({
        text: `Mock suggestions for "${topic}".`,
        items: [
          `Research something about ${topic}`,
          `Write down key ideas for ${topic}`,
          `Take one small action toward ${topic}`,
        ],
      });
    }

    const prompt = `Give me 3 short, actionable todo items related to "${topic}".`;

    const openAiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 200,
        }),
      }
    );

    // 🔍 Log full response if not OK
    if (!openAiRes.ok) {
      const txt = await openAiRes.text();
      console.error("OpenAI error details:", txt);

      // fallback if quota or API fails
      return NextResponse.json({
        text: `Mock suggestions for "${topic}" (AI unavailable).`,
        items: [
          `Review your current ${topic} tasks`,
          `Set one new goal about ${topic}`,
          `Take a 10-minute break before continuing ${topic}`,
        ],
      });
    }

    const data = await openAiRes.json();
    const text: string =
      data?.choices?.[0]?.message?.content?.trim() ?? "No suggestions.";

    const items = text
      .split(/\r?\n/)
      .map((line: string) =>
        line.replace(/^\s*\d+[\).:-]\s*|^\s*[-•]\s*/u, "").trim()
      )
      .filter((line: string) => line.length > 0);

    return NextResponse.json({ text, items });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
