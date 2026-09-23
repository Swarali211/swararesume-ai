import { Sparkles } from "lucide-react";

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
  error: string | null;
  onTextChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onAnalyze: () => void;
}

export function ResumeInput({
  resumeText,
  role,
  error,
  onTextChange,
  onRoleChange,
  onAnalyze,
}: Props) {
  return (
    <div className="animate-rise w-full max-w-2xl">
      <div className="text-center">
        <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          ResumeIQ
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Get instant AI feedback on your resume
        </p>
      </div>

      <div className="mt-10 rounded-2xl bg-card p-6 shadow-xl shadow-indigo-500/10 ring-1 ring-border sm:p-8">
        <label className="mb-2 block text-sm font-medium text-foreground">
          Your resume
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={10}
          className="w-full resize-y rounded-xl border border-input bg-background p-4 text-sm leading-relaxed text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />

        <label className="mb-2 mt-5 block text-sm font-medium text-foreground">
          Target role
        </label>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          onClick={onAnalyze}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-indigo-500/30 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          <Sparkles className="size-5" />
          Analyze My Resume
        </button>
      </div>
    </div>
  );
}
