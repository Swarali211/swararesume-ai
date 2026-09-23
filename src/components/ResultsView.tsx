import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  FileText,
  Lightbulb,
  RotateCcw,
  SpellCheck,
  Target,
  Type,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/analyze.functions";
import { ScoreGauge } from "./ScoreGauge";

const CATEGORY_ICONS: Record<string, typeof Type> = {
  Clarity: Type,
  Impact: Target,
  Keywords: SpellCheck,
  Formatting: FileText,
};

const SUGGESTION_META = {
  warning: { icon: AlertTriangle, classes: "bg-amber-500/10 text-amber-600" },
  tip: { icon: Lightbulb, classes: "bg-indigo-500/10 text-indigo-600" },
  good: { icon: CheckCircle2, classes: "bg-emerald-500/10 text-emerald-600" },
} as const;

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsView({ result, onReset }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="animate-rise w-full max-w-3xl">
      <div className="rounded-2xl bg-card p-8 shadow-xl shadow-indigo-500/10 ring-1 ring-border">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Your Resume Score
        </h2>
        <div className="mt-6 flex justify-center">
          <ScoreGauge score={result.overallScore} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {result.categories.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat.name] ?? FileText;
            return (
              <div
                key={cat.name}
                className="animate-rise rounded-2xl border border-border bg-background p-5"
                style={{ animationDelay: `${idx * 90}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600">
                      <Icon className="size-4.5" />
                    </span>
                    <span className="font-semibold text-foreground">{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {cat.score}
                    <span className="text-muted-foreground">/25</span>
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-[width] duration-1000 ease-out"
                    style={{ width: `${(cat.score / 25) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {cat.feedback}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-card p-8 shadow-xl shadow-indigo-500/10 ring-1 ring-border">
        <h3 className="text-xl font-bold text-foreground">Detailed Suggestions</h3>
        <div className="mt-5 space-y-3">
          {result.suggestions.map((s, i) => {
            const meta = SUGGESTION_META[s.type] ?? SUGGESTION_META.tip;
            const Icon = meta.icon;
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border bg-background"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${meta.classes}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground line-clamp-1">
                    {s.text}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="animate-fade-in px-4 pb-4 pl-15 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-indigo-500/30 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <RotateCcw className="size-5" />
        Try Another Resume
      </button>
    </div>
  );
}
