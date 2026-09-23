import { useRef, useState } from "react";
import { FileUp, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Product Manager",
  "General",
] as const;

interface Props {
  resumeText: string;
  jobDescription: string;
  role: string;
  onTextChange: (v: string) => void;
  onJobDescriptionChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onAnalyze: () => void;
}

export function ResumeInput({
  resumeText,
  jobDescription,
  role,
  onTextChange,
  onJobDescriptionChange,
  onRoleChange,
  onAnalyze,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileError("");
    if (file.type !== "application/pdf") {
      setFileError("Please choose a PDF file.");
      return;
    }
    setParsing(true);
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data, disableWorker: true }).promise;
      const pages = await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, index) => {
          const page = await pdf.getPage(index + 1);
          const content = await page.getTextContent();
          return content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
        }),
      );
      onTextChange(pages.join("\n\n"));
    } catch {
      setFileError("We couldn't read that PDF. Try pasting the text instead.");
    } finally {
      setParsing(false);
    }
  };

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
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="resume-text" className="text-sm font-semibold text-foreground">
            Your resume
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={parsing}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {parsing ? <LoaderCircle className="animate-spin" /> : <FileUp />}{" "}
            {parsing ? "Reading PDF..." : "Upload PDF"}
          </Button>
        </div>
        <Textarea
          id="resume-text"
          value={resumeText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={10}
          className="mt-3 min-h-56 resize-y rounded-xl bg-background/70 p-4 text-[15px] leading-7"
        />
        {fileError && <p className="mt-2 text-sm text-warning">{fileError}</p>}
        <label
          htmlFor="target-role"
          className="mb-2.5 mt-6 block text-sm font-semibold text-foreground"
        >
          Target role
        </label>
        <select
          id="target-role"
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
        <label
          htmlFor="job-description"
          className="mb-2.5 mt-6 block text-sm font-semibold text-foreground"
        >
          Paste job description{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Add a job description to see your match score and keyword gaps..."
          rows={5}
          className="resize-y rounded-xl bg-background/70 p-4 text-[15px] leading-7"
        />
        <Button
          type="button"
          onClick={onAnalyze}
          className="mt-7 h-14 w-full rounded-xl bg-brand text-base font-semibold text-brand-foreground shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg active:translate-y-0"
        >
          <Sparkles />
          Analyze My Resume
        </Button>
      </div>
    </section>
  );
}
