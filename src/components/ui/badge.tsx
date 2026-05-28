import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/10 bg-white/[0.055] px-2 py-1 text-xs font-medium text-neutral-300 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
        className,
      )}
      {...props}
    />
  );
}
