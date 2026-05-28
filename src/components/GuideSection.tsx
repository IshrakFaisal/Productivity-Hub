import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GuideComparisonTable } from "@/components/GuideComparisonTable";
import { GuideToolMention } from "@/components/GuideToolMention";
import { type GuideSection as GuideSectionData } from "@/data/guides";

export function GuideSection({ section, index }: { section: GuideSectionData; index: number }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="text-sm font-semibold text-lime-100/70">0{index + 1}</div>
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{section.title}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base leading-8 text-neutral-300">{section.body}</p>

          {section.bullets ? (
            <ul className="grid gap-3 md:grid-cols-2">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-neutral-300">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-lime-200" />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}

          {section.tools ? (
            <div className="grid gap-3 md:grid-cols-2">
              {section.tools.map((mention) => (
                <GuideToolMention key={`${section.id}-${mention.toolId}-${mention.label}`} mention={mention} />
              ))}
            </div>
          ) : null}

          {section.comparison ? <GuideComparisonTable rows={section.comparison} /> : null}
        </CardContent>
      </Card>
    </section>
  );
}
