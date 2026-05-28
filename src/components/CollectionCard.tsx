import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { productivityTools } from "@/data/productivityTools";
import { type TemplateCollection } from "@/data/collections";

export function CollectionCard({ collection }: { collection: TemplateCollection }) {
  const tools = productivityTools.filter((tool) => collection.toolIds.includes(tool.id));
  const homeBase = tools.find((tool) => tool.id === collection.homeBaseId);

  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1 hover:border-lime-200/30 hover:bg-white/[0.06]">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge>{collection.philosophy}</Badge>
              <Badge>{collection.maintenance} upkeep</Badge>
            </div>
            <Link href={`/collections/${collection.id}`} className="mt-4 block text-xl font-semibold tracking-tight text-white transition group-hover:text-lime-100">
              {collection.name}
            </Link>
            <p className="mt-2 text-sm font-medium text-lime-100/70">{collection.audience}</p>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-lime-200/25 bg-lime-200/10">
            <span className="text-lg font-semibold text-lime-100">{collection.score}</span>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-400">{collection.description}</p>

        <div className="mt-5 flex -space-x-2">
          {tools.slice(0, 5).map((tool) => (
            <ToolLogo key={tool.id} name={tool.name} className="h-9 w-9 border-[#101116] text-[10px]" />
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Home base</div>
          <div className="mt-2 text-sm font-medium text-white">{homeBase?.name ?? "Flexible by preference"}</div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href={`/stack-builder?template=${collection.id}`} className="flex-1">
            <Layers3 className="h-4 w-4" />
            Use template
          </ButtonLink>
          <ButtonLink href={`/collections/${collection.id}`} variant="secondary" className="flex-1">
            View details
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  );
}
