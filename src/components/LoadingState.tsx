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
    <div className="animate-rise flex flex-col items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p
      key={i}
      className="animate-fade-in mt-6 text-lg font-medium text-muted-foreground"
      >
        {MESSAGES[i]}
      </p>
    </div>
  );
}
