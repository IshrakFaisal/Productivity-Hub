import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolLogo } from "@/components/ToolLogo";
import { type GuideComparisonRow, resolveGuideTool } from "@/data/guides";

export function GuideComparisonTable({ rows }: { rows: GuideComparisonRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="hidden grid-cols-[240px_1fr_1fr_140px] border-b border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 md:grid">
        <span>Tool</span>
        <span>Best for</span>
        <span>Tradeoff</span>
        <span>Verdict</span>
      </div>
      <div className="divide-y divide-white/10">
        {rows.map((row) => {
          const tool = resolveGuideTool(row.toolId);
          return (
            <Link
              key={`${row.toolId}-${row.score}`}
              href={`/tools/${tool.id}`}
              className="grid gap-3 bg-white/[0.025] p-4 transition hover:bg-white/[0.06] md:grid-cols-[220px_1fr_1fr_140px] md:items-center"
            >
              <div className="flex items-center gap-3">
                <ToolLogo name={tool.name} className="h-9 w-9 text-xs" />
                <div>
                  <p className="font-semibold text-white">{tool.name}</p>
                  <p className="text-xs text-neutral-500">{tool.pricing}</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-neutral-300">{row.bestFor}</p>
              <p className="text-sm leading-6 text-neutral-400">{row.tradeoff}</p>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-lime-200">
                {row.score}
                <ArrowRight className="h-4 w-4" />
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
