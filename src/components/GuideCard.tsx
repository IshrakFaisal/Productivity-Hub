import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { type Guide, resolveGuideTool } from "@/data/guides";

export function GuideCard({ guide, featured = false }: { guide: Guide; featured?: boolean }) {
  const heroTools = guide.heroTools.map(resolveGuideTool).slice(0, featured ? 4 : 3);

  return (
    <Link href={`/guides/${guide.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:border-lime-200/35 group-hover:bg-white/[0.075]">
        <CardHeader className={featured ? "bg-[linear-gradient(135deg,rgba(190,242,100,0.16),rgba(56,189,248,0.09),transparent)]" : undefined}>
          <div className="flex items-center justify-between gap-3">
            <Badge>{guide.category}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <Clock3 className="h-3.5 w-3.5" />
              {guide.readTime}
            </span>
          </div>
          <h2 className={featured ? "pt-3 text-3xl font-semibold tracking-tight text-white" : "pt-3 text-xl font-semibold tracking-tight text-white"}>
            {guide.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-6 text-neutral-400">{guide.description}</p>
        </CardHeader>
        <CardContent className="mt-auto space-y-5 pt-2">
          <div className="flex -space-x-2">
            {heroTools.map((tool) => (
              <ToolLogo key={tool.id} name={tool.name} className="h-10 w-10 border-[#191b20] text-xs" />
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-lime-200">
            Read guide
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
