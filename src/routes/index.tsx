import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeResume, type AnalysisResult } from "@/lib/analyze.functions";
import { loadHistory, saveHistory, type HistoryEntry } from "@/lib/history";
import { ResumeInput } from "@/components/ResumeInput";
import { LoadingState } from "@/components/LoadingState";
import { ResultsView } from "@/components/ResultsView";
import { ErrorState } from "@/components/ErrorState";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  ssr: false,
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "ResumeIQ — AI Resume Analyzer" },
      {
        name: "description",
        content:
          "Get instant AI feedback on your resume and see how well it matches your next role.",
      },
      { property: "og:title", content: "ResumeIQ — AI Resume Analyzer" },
      {
        property: "og:description",
        content: "Get instant AI feedback on your resume with ResumeIQ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://swararesume-ai.lovable.app/" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: Index,
});

type Screen = "input" | "loading" | "error" | "results";

function Index() {
  const [screen, setScreen] = useState<Screen>("input");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("Frontend Developer");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const run = useServerFn(analyzeResume);

  useEffect(() => setHistory(loadHistory()), []);

  const handleAnalyze = async () => {
    setError(null);
    setScreen("loading");
    try {
      const res = await run({
        data: { resumeText, role: role as never, jobDescription: jobDescription || undefined },
      });
      setResult(res);
      setHistory(
        saveHistory({
          id: crypto.randomUUID(),
          resumeSnippet: resumeText.slice(0, 140),
          score: res.overallScore,
          role,
          timestamp: new Date().toISOString(),
          result: res,
        }),
      );
      setScreen("results");
    } catch (e) {
      let message =
        e instanceof Error
          ? e.message
          : "Something went wrong analyzing your resume. Please try again.";
      if (message.startsWith("[")) {
        try {
          message = (JSON.parse(message) as { message?: string }[])[0]?.message ?? message;
        } catch {
          /* keep raw message */
        }
      }
      setError(message);
      setScreen("error");
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setResult(entry.result);
    setRole(entry.role);
    setResumeText(entry.resumeSnippet);
    setHistoryOpen(false);
    setScreen("results");
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
      <div className="fixed right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setHistoryOpen(true)}
          aria-label="Open analysis history"
        >
          <History />
        </Button>
        <ThemeToggle />
      </div>
      <HistoryPanel
        open={historyOpen}
        entries={history}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleHistorySelect}
      />
      {screen === "input" && (
        <ResumeInput
          resumeText={resumeText}
          jobDescription={jobDescription}
          role={role}
          onTextChange={setResumeText}
          onJobDescriptionChange={setJobDescription}
          onRoleChange={setRole}
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
      {screen === "results" && result && <ResultsView result={result} onReset={handleReset} />}
    </main>
  );
}
