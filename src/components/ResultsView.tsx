import { useState, type CSSProperties } from "react";
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
import { Button } from "@/components/ui/button";

const CATEGORY_ICONS: Record<string, typeof Type> = {
  Clarity: Type,
  Impact: Target,
  Keywords: SpellCheck,
  Formatting: FileText,
};

const SUGGESTION_META = {
  warning: { icon: AlertTriangle, classes: "bg-warning-soft text-warning" },
  tip: { icon: Lightbulb, classes: "bg-brand-soft text-brand" },
  good: { icon: CheckCircle2, classes: "bg-success-soft text-success" },
} as const;

const CONFETTI = [
  ["left-[8%]", "top-4", "bg-brand", "rotate-12"],
  ["left-[19%]", "top-12", "bg-success", "-rotate-12"],
  ["left-[31%]", "top-2", "bg-warning", "rotate-45"],
  ["right-[31%]", "top-7", "bg-brand-end", "-rotate-45"],
  ["right-[18%]", "top-3", "bg-warning", "rotate-12"],
  ["right-[7%]", "top-14", "bg-success", "rotate-45"],
] as const;

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsView({ result, onReset }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="screen-enter relative w-full max-w-3xl">
      {result.overallScore >= 80 && (
        <div className="pointer-events-none absolute inset-x-0 -top-7 h-28 overflow-hidden" aria-hidden="true">
          {CONFETTI.map(([x, y, color, rotate], index) => (
            <span
              key={index}
              className={`confetti absolute ${x} ${y} ${color} ${rotate} h-3 w-2 rounded-sm`}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      )}
      <div className="card-lift rounded-2xl border border-border/80 bg-card/90 p-5 shadow-premium backdrop-blur sm:p-8">
        <h2 className="text-center text-xl font-bold text-foreground sm:text-2xl">
          Your Resume Score
        </h2>
        <div className="mt-6 flex justify-center">
          <ScoreGauge score={result.overallScore} />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {result.categories.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat.name] ?? FileText;
            return (
              <div
                key={cat.name}
                className="card-lift animate-rise rounded-xl border border-border/80 bg-background/60 p-5"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Icon className="size-4.5" />
                    </span>
                    <span className="text-base font-bold text-foreground">{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {cat.score}
                    <span className="text-muted-foreground">/25</span>
                  </span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="progress-fill h-full rounded-full bg-brand"
                    style={{ "--progress": `${(cat.score / 25) * 100}%`, animationDelay: `${250 + idx * 100}ms` } as CSSProperties}
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {cat.feedback}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-lift mt-10 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-premium backdrop-blur sm:p-8">
        <h3 className="text-xl font-bold text-foreground">Detailed Suggestions</h3>
        <div className="mt-5 space-y-3">
          {result.suggestions.map((s, i) => {
            const meta = SUGGESTION_META[s.type] ?? SUGGESTION_META.tip;
            const Icon = meta.icon;
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border/80 bg-background/60 transition-all hover:border-brand/25 hover:shadow-sm"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="h-auto min-h-14 w-full justify-start rounded-none px-4 py-3.5 text-left hover:bg-accent/60 sm:min-h-16"
                  aria-expanded={isOpen}
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
                </Button>
                {isOpen && (
                  <p className="animate-fade-in px-4 pb-5 pl-15 text-sm leading-6 text-muted-foreground">
                    {s.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Button
        type="button"
        onClick={onReset}
        className="mt-10 h-14 w-full rounded-xl bg-brand text-base font-semibold text-brand-foreground shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg active:translate-y-0"
      >
        <RotateCcw className="size-5" />
        Try Another Resume
      </Button>
    </section>
  );
}
