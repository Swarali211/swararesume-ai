import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { analyzeResume, type AnalysisResult } from "@/lib/analyze.functions";
import { ResumeInput } from "@/components/ResumeInput";
import { LoadingState } from "@/components/LoadingState";
import { ResultsView } from "@/components/ResultsView";
import { ErrorState } from "@/components/ErrorState";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
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
      { property: "og:url", content: "https://swararesume-ai.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://swararesume-ai.lovable.app/" }],
  }),
  component: Index,
});

type Screen = "input" | "loading" | "error" | "results";

function Index() {
  const [screen, setScreen] = useState<Screen>("input");
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState("Frontend Developer");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useServerFn(analyzeResume);

  const handleAnalyze = async () => {
    setError(null);
    setScreen("loading");
    try {
      const res = await run({ data: { resumeText, role: role as never, jobDescription: jobDescription.trim() || undefined } });
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
      setScreen("error");
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeText("");
    setJobDescription("");
    setError(null);
    setScreen("input");
  };

  return (
    <main className="app-canvas relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24">
      <div className="fixed right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      {screen === "input" && (
        <ResumeInput
          resumeText={resumeText}
          role={role}
          jobDescription={jobDescription}
          onTextChange={setResumeText}
          onRoleChange={setRole}
          onJobDescriptionChange={setJobDescription}
          onAnalyze={handleAnalyze}
        />
      )}
      {screen === "loading" && <LoadingState />}
      {screen === "error" && (
        <ErrorState
          message={error ?? ""}
          onRetry={handleAnalyze}
          onBack={() => setScreen("input")}
        />
      )}
      {screen === "results" && result && (
        <ResultsView result={result} onReset={handleReset} />
      )}
    </main>
  );
}
