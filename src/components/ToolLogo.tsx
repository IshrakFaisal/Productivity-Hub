import { Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToolLogo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[linear-gradient(135deg,rgba(215,255,107,0.95),rgba(125,211,252,0.9))] text-sm font-bold text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
        className,
      )}
      aria-hidden="true"
    >
      {initials || <Boxes className="h-5 w-5" />}
    </div>
  );
}
