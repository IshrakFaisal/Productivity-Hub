import { cn } from "@/lib/utils";

export function ScoreBar({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "green" | "blue";
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4 text-xs text-neutral-400">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}/10</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full shadow-[0_0_18px_currentColor]",
            tone === "green" && "bg-emerald-400 text-emerald-400",
            tone === "blue" && "bg-sky-300 text-sky-300",
            tone === "neutral" && "bg-lime-300 text-lime-300",
          )}
          style={{ width: `${Math.max(0, Math.min(10, value)) * 10}%` }}
        />
      </div>
    </div>
  );
}
