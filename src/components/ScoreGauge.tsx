import { useEffect, useState } from "react";

export function ScoreGauge({ score }: { score: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const r = 84;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  const label =
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work";

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-52">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            strokeWidth="14"
            className="stroke-indigo-100"
          />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            stroke="url(#gauge-gradient)"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
          <defs>
            <linearGradient id="gauge-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">out of 100</span>
        </div>
      </div>
      <p className="mt-4 text-xl font-semibold text-foreground">{label}</p>
    </div>
  );
}
