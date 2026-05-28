import { ArrowRight, BookOpenText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { type Guide, resolveGuideTool } from "@/data/guides";

export function GuideHero({ guide }: { guide: Guide }) {
  const heroTools = guide.heroTools.map(resolveGuideTool);

  return (
    <section className="border-b border-white/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{guide.category}</Badge>
            <span className="text-sm text-neutral-500">{guide.readTime}</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {guide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-neutral-300">{guide.deck}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-400">{guide.description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={guide.primaryCta.href}>
              {guide.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={guide.secondaryCta.href} variant="secondary">
              {guide.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <Card className="overflow-hidden border-lime-200/20 bg-black/35">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-lime-100">
              <BookOpenText className="h-4 w-4" />
              Decision map
            </div>
            <div className="grid gap-3">
              {heroTools.map((tool, index) => (
                <div key={tool.id} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <ToolLogo name={tool.name} className="h-10 w-10 text-xs" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{tool.name}</p>
                      <p className="truncate text-xs text-neutral-500">{tool.categories.slice(0, 3).join(" / ")}</p>
                    </div>
                  </div>
                  <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs font-semibold text-neutral-300">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
