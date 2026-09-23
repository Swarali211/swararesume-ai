import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { analyzeResume, type AnalysisResult } from "@/lib/analyze.functions";
import { ResumeInput } from "@/components/ResumeInput";
import { LoadingState } from "@/components/LoadingState";
import { ResultsView } from "@/components/ResultsView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeIQ — AI Resume Analyzer" },
      {
        name: "description",
        content:
          "Get instant AI feedback on your resume. Score clarity, impact, keywords and formatting, and get actionable suggestions.",
      },
      { property: "og:title", content: "ResumeIQ — AI Resume Analyzer" },
      {
        property: "og:description",
        content: "Get instant AI feedback on your resume with ResumeIQ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Screen = "input" | "loading" | "results";

function Index() {
  const [screen, setScreen] = useState<Screen>("input");
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState("Frontend Developer");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useServerFn(analyzeResume);

  const handleAnalyze = async () => {
    setError(null);
    setScreen("loading");
    try {
      const res = await run({ data: { resumeText, role: role as never } });
      setResult(res);
      setScreen("results");
    } catch (e) {
      let message =
        e instanceof Error
          ? e.message
          : "Something went wrong analyzing your resume. Please try again.";
      if (message.startsWith("[")) {
        try {
          const issues = JSON.parse(message) as { message?: string }[];
          message = issues[0]?.message ?? message;
        } catch {
          /* keep raw message */
        }
      }
      setError(message);
      setScreen("input");
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeText("");
    setError(null);
    setScreen("input");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-background to-purple-50 px-4 py-12">
      {screen === "input" && (
        <ResumeInput
          resumeText={resumeText}
          role={role}
          error={error}
          onTextChange={setResumeText}
          onRoleChange={setRole}
          onAnalyze={handleAnalyze}
        />
      )}
      {screen === "loading" && <LoadingState />}
      {screen === "results" && result && (
        <ResultsView result={result} onReset={handleReset} />
      )}
    </main>
  );
}
