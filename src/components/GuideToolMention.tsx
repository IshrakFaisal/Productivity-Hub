import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { type GuideToolMention as GuideToolMentionData, resolveGuideTool } from "@/data/guides";

export function GuideToolMention({ mention }: { mention: GuideToolMentionData }) {
  const tool = resolveGuideTool(mention.toolId);

  return (
    <Link href={`/tools/${tool.id}`} className="group block h-full">
      <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:border-lime-200/30 group-hover:bg-white/[0.075]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              <ToolLogo name={tool.name} className="h-10 w-10 text-xs" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-100/70">{mention.label}</p>
                <h3 className="mt-1 font-semibold text-white">{tool.name}</h3>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-lime-200" />
          </div>
          <p className="mt-3 text-sm leading-6 text-neutral-400">{mention.note}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.categories.slice(0, 3).map((category) => (
              <span key={category} className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-neutral-300">
                {category}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
