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
  jobDescription: z.string().optional().nullable(),
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

export interface JdMatchData {
  jdMatchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface AnalysisResult {
  overallScore: number;
  categories: CategoryScore[];
  suggestions: Suggestion[];
  jdMatch?: JdMatchData;
}

function extractJson(text: string): AnalysisResult {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI response was not valid JSON.");
  try {
    return JSON.parse(match[0]) as AnalysisResult;
  } catch {
    throw new Error("The analysis response was incomplete. Please try again.");
  }
}

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

    const hasJd = data.jobDescription && data.jobDescription.trim().length > 0;

    const jdInstructions = hasJd
      ? `

Also compare the resume to the following job description. Include these three additional fields at the top level of the JSON:
- "jdMatchScore": number (0-100), how well the resume matches the job description
- "matchedKeywords": array of strings, keywords from the job description that ARE present in the resume
- "missingKeywords": array of strings, keywords from the job description that are MISSING from the resume

JOB DESCRIPTION:
${data.jobDescription!.trim()}`
      : "";

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
  ]${hasJd ? `,
  "jdMatchScore": number (0-100),
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"]` : ""}
}

Give 5-8 specific, actionable suggestions. "warning" = problem to fix, "tip" = improvement idea, "good" = something done well.${jdInstructions}

RESUME:
${data.resumeText}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
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

    const result = extractJson(text);
    if (result.jdMatchScore !== undefined && result.matchedKeywords !== undefined) {
      result.jdMatch = {
        jdMatchScore: result.jdMatchScore,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords ?? [],
      };
      delete result.jdMatchScore;
      delete result.matchedKeywords;
      delete result.missingKeywords;
    }
    return result;
  });
