import { useRef, useState } from "react";
import { FileText, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PDFJS_VERSION = "6.3.289";
const PDFJS_CDN = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}`;

interface PdfTextItem {
  str: string;
}
interface PdfTextContent {
  items: PdfTextItem[];
}
interface PdfPage {
  getTextContent(): Promise<PdfTextContent>;
}
interface PdfDocument {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
}
interface PdfjsModule {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(params: { data: ArrayBuffer }): { promise: Promise<PdfDocument> };
}

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
  jobDescription: string;
  onTextChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onJobDescriptionChange: (v: string) => void;
  onAnalyze: () => void;
}

export function ResumeInput({
  resumeText,
  role,
  jobDescription,
  onTextChange,
  onRoleChange,
  onJobDescriptionChange,
  onAnalyze,
}: Props) {
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractPdfText = async (file: File): Promise<string> => {
    const pdfjs: PdfjsModule = await import(
      /* @vite-ignore */ `${PDFJS_CDN}/build/pdf.min.mjs`
    );
    pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/build/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n";
    }
    return fullText.trim();
  };

  const handleFile = async (file: File) => {
    setParseError(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setParseError("Please upload a .pdf file.");
      return;
    }
    setParsing(true);
    setFileName(file.name);
    try {
      const text = await extractPdfText(file);
      if (!text || text.length < 30) {
        setParseError("Could not extract enough text from this PDF. Try pasting your resume instead.");
        onTextChange("");
      } else {
        onTextChange(text);
      }
    } catch {
      setParseError("Failed to read this PDF. It may be scanned or corrupted. Try pasting your resume instead.");
      onTextChange("");
    } finally {
      setParsing(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const clearPdf = () => {
    setFileName(null);
    setParseError(null);
    onTextChange("");
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

        {fileName && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-3 py-2.5 text-sm text-foreground">
            <FileText className="size-4 shrink-0 text-brand" />
            <span className="flex-1 truncate">{fileName}</span>
            <button
              type="button"
              onClick={clearPdf}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {parseError && (
          <p className="mt-2.5 text-sm text-error">{parseError}</p>
        )}

        <div
          className="mt-4"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={parsing}
            className={`flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-4 py-5 text-sm font-medium transition-all ${
              dragOver
                ? "border-brand bg-brand/5 text-brand"
                : "border-border text-muted-foreground hover:border-brand/40 hover:text-brand"
            } ${parsing ? "cursor-wait opacity-60" : "cursor-pointer"}`}
          >
            {parsing ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Extracting text from PDF...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Or upload PDF
              </>
            )}
          </button>
        </div>

        <label className="mb-2.5 mt-6 block text-sm font-semibold text-foreground">
          Paste job description (optional)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here to see how well your resume matches..."
          rows={5}
          className="min-h-32 w-full resize-y rounded-xl border border-input bg-background/70 p-4 text-[15px] leading-7 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
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
          disabled={parsing}
          className="mt-7 h-14 w-full rounded-xl bg-brand text-base font-semibold text-brand-foreground shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg active:translate-y-0"
        >
          <Sparkles className="size-5" />
          Analyze My Resume
        </Button>
      </div>
    </section>
  );
}
