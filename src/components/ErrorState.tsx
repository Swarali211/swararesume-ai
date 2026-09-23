import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}

export function ErrorState({ message, onRetry, onBack }: Props) {
  return (
    <section className="screen-enter w-full max-w-xl text-center" aria-labelledby="error-title">
      <div className="rounded-2xl border border-border/80 bg-card/90 px-6 py-10 shadow-premium backdrop-blur sm:px-10 sm:py-12">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-soft text-brand">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-brand/20 bg-card shadow-sm">
            <Sparkles className="size-6" />
            <span className="absolute -right-1 -top-1 size-3 rounded-full bg-warning ring-4 ring-card" />
          </div>
        </div>
        <h1 id="error-title" className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
          We hit a small snag
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-muted-foreground">
          {message || "Your resume couldn't be analyzed this time. Your text is still here, so you can try again."}
        </p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 rounded-xl px-5"
          >
            <ArrowLeft />
            Review resume
          </Button>
          <Button
            type="button"
            onClick={onRetry}
            className="h-12 rounded-xl bg-brand px-6 text-brand-foreground shadow-brand transition-all hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg"
          >
            <RefreshCw />
            Try again
          </Button>
        </div>
      </div>
    </section>
  );
}