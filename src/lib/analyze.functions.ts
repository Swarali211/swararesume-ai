import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AnalyzeInput = z.object({
  resumeText: z.string().min(30, "Please paste at least a few lines of your resume."),
  role: z.enum([
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Product Manager",
    "General",
  ]),
});

export interface CategoryScore {
  name: string;
  score: number;
  feedback: string;
}

export interface Suggestion {
  type: "warning" | "tip" | "good";
  text: string;
}

export interface AnalysisResult {
  overallScore: number;
  categories: CategoryScore[];
  suggestions: Suggestion[];
}

function extractJson(text: string): AnalysisResult {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI response was not valid JSON.");
  return JSON.parse(match[0]) as AnalysisResult;
}

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

    const prompt = `You are an expert resume reviewer. Analyze the following resume for a "${
      data.role
    }" position.

Return ONLY valid JSON in this exact structure, with no markdown, no code fences, no explanation:
{
  "overallScore": number (0-100),
  "categories": [
    {"name": "Clarity", "score": number (0-25), "feedback": "string"},
    {"name": "Impact", "score": number (0-25), "feedback": "string"},
    {"name": "Keywords", "score": number (0-25), "feedback": "string"},
    {"name": "Formatting", "score": number (0-25), "feedback": "string"}
  ],
  "suggestions": [
    {"type": "warning" | "tip" | "good", "text": "string"}
  ]
}

Give 5-8 specific, actionable suggestions. "warning" = problem to fix, "tip" = improvement idea, "good" = something done well.

RESUME:
${data.resumeText}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Gemini API error (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = json.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("");
    if (!text) throw new Error("Gemini returned an empty response.");

    return extractJson(text);
  });
