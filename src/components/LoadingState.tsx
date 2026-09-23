import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading your resume...",
  "Checking formatting...",
  "Scoring keyword match...",
  "Evaluating impact...",
  "Almost done...",
];

export function LoadingState() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="screen-enter w-full max-w-3xl" aria-live="polite" aria-busy="true">
      <div className="mb-6 text-center">
        <p key={i} className="animate-fade-in text-base font-semibold text-foreground">
          {MESSAGES[i]}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Building your personalized review</p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-premium sm:p-8">
        <div className="skeleton mx-auto h-7 w-44 rounded-md" />
        <div className="skeleton mx-auto mt-7 size-40 rounded-full border-[14px] border-muted bg-transparent sm:size-48" />
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border/70 p-5">
              <div className="flex items-center justify-between">
                <div className="skeleton h-5 w-28 rounded" />
                <div className="skeleton h-5 w-10 rounded" />
              </div>
              <div className="skeleton mt-5 h-2 w-full rounded-full" />
              <div className="skeleton mt-4 h-3 w-11/12 rounded" />
              <div className="skeleton mt-2 h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-premium sm:p-8">
        <div className="skeleton h-6 w-48 rounded" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex h-14 items-center gap-3 rounded-xl border border-border/70 px-4">
              <div className="skeleton size-8 shrink-0 rounded-lg" />
              <div className="skeleton h-3 flex-1 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
