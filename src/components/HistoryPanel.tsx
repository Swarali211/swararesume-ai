import { ArrowDown, ArrowUp, Clock3, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HistoryEntry } from "@/lib/history";

interface Props {
  open: boolean;
  entries: HistoryEntry[];
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ open, entries, onClose, onSelect }: Props) {
  const latest = entries[0];
  const previous = entries[1];
  const trend = latest && previous ? latest.score - previous.score : 0;

  return (
    <>
      {open && (
        <button
          aria-label="Close history"
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Analysis history"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ResumeIQ
            </p>
            <h2 className="mt-1 text-xl font-bold text-foreground">Analysis history</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close history">
            <X />
          </Button>
        </div>
        {latest && previous && (
          <div className="mx-5 mt-5 flex items-center gap-3 rounded-xl bg-brand-soft p-4 text-sm">
            <span
              className={`flex size-9 items-center justify-center rounded-full ${trend >= 0 ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}
            >
              {trend >= 0 ? <ArrowUp /> : <ArrowDown />}
            </span>
            <span className="text-muted-foreground">
              Latest score is{" "}
              <strong className="text-foreground">
                {Math.abs(trend)} points {trend >= 0 ? "higher" : "lower"}
              </strong>{" "}
              than your previous analysis.
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {entries.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
              <History className="mb-3 size-10 opacity-50" />
              <p className="font-medium text-foreground">No analyses yet</p>
              <p className="mt-1 text-sm">Your completed reviews will appear here.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="card-lift rounded-xl border border-border bg-background/50 p-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{entry.role}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-sm font-bold text-brand">
                    {entry.score}/100
                  </span>
                </div>
                <p className="mt-3 truncate text-sm text-muted-foreground">{entry.resumeSnippet}</p>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

export default HistoryPanel;
