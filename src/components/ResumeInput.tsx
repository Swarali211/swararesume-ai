import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Product Manager",
  "General",
] as const;

interface Props {
  resumeText: string;
  role: string;
  onTextChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onAnalyze: () => void;
}

export function ResumeInput({
  resumeText,
  role,
  onTextChange,
  onRoleChange,
  onAnalyze,
}: Props) {
  return (
    <section className="screen-enter w-full max-w-2xl" aria-labelledby="resumeiq-title">
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-brand">
          <Sparkles className="size-6" />
        </div>
        <h1 id="resumeiq-title" className="brand-text text-4xl font-extrabold sm:text-6xl">
          ResumeIQ
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
          Get instant AI feedback on your resume
        </p>
      </div>

      <div className="card-lift mt-10 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-premium backdrop-blur sm:p-8">
        <label className="mb-2.5 block text-sm font-semibold text-foreground">
          Your resume
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={10}
          className="min-h-56 w-full resize-y rounded-xl border border-input bg-background/70 p-4 text-[15px] leading-7 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
        />

        <label className="mb-2.5 mt-6 block text-sm font-semibold text-foreground">
          Target role
        </label>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-input bg-background/70 px-4 text-sm text-foreground outline-none transition-all focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <Button
          type="button"
          onClick={onAnalyze}
          className="mt-7 h-14 w-full rounded-xl bg-brand text-base font-semibold text-brand-foreground shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg active:translate-y-0"
        >
          <Sparkles className="size-5" />
          Analyze My Resume
        </Button>
      </div>
    </section>
  );
}
