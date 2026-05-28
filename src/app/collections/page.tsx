import { GitCompare, Layers3, Search, Sparkles } from "lucide-react";
import { CollectionCard } from "@/components/CollectionCard";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { templateCollections } from "@/data/collections";

const collectionStats = [
  { label: "Templates", value: templateCollections.length },
  { label: "Average score", value: Math.round(templateCollections.reduce((sum, collection) => sum + collection.score, 0) / templateCollections.length) },
  { label: "Lowest upkeep", value: templateCollections.filter((collection) => collection.maintenance === "Low").length },
];

export default function CollectionsPage() {
  const lowMaintenance = templateCollections.filter((collection) => collection.maintenance === "Low");
  const teamReady = templateCollections.filter((collection) => collection.strengths.some((strength) => strength.toLowerCase().includes("team") || strength.toLowerCase().includes("collaboration")));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>Collections</Badge>
            <Badge>Editable stack templates</Badge>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Start with a proven productivity system.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400">
            Browse curated stack templates for students, founders, teams, creators, agencies, and focused solo work. Each collection can be opened, compared, or loaded into Stack Builder.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/stack-builder">
              <Layers3 className="h-4 w-4" />
              Build from scratch
            </ButtonLink>
            <ButtonLink href="/quiz" variant="secondary">
              <Sparkles className="h-4 w-4" />
              Find my stack
            </ButtonLink>
            <ButtonLink href="/tools" variant="secondary">
              <Search className="h-4 w-4" />
              Browse tools
            </ButtonLink>
          </div>
        </div>

        <Card className="bg-[radial-gradient(circle_at_top_left,rgba(190,242,100,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]">
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-3 gap-3">
              {collectionStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-lime-200/20 bg-lime-200/10 p-4">
              <div className="text-sm font-semibold text-lime-100">Template workflow</div>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                Pick a collection, review the tool roles, then load it into Stack Builder to adjust overlap, coverage, and maintenance level.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">All templates</h2>
            <p className="mt-2 text-sm text-neutral-400">Ready-made starting points you can customize instead of building from a blank page.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templateCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <CollectionRail title="Low-maintenance starters" description="Good first stacks for people who want clarity before power." collections={lowMaintenance} />
        <CollectionRail title="Team-ready systems" description="Better for collaboration, shared decisions, and visible accountability." collections={teamReady} />
      </section>

      <section className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(190,242,100,0.14),rgba(56,189,248,0.08),rgba(255,255,255,0.04))] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Not sure which collection fits?</h2>
            <p className="mt-3 max-w-2xl text-neutral-300">Use the quiz for a personal recommendation, then compare the suggested tools before committing to a stack.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/quiz">
              <Sparkles className="h-4 w-4" />
              Take quiz
            </ButtonLink>
            <ButtonLink href="/compare" variant="secondary">
              <GitCompare className="h-4 w-4" />
              Compare tools
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function CollectionRail({
  title,
  description,
  collections,
}: {
  title: string;
  description: string;
  collections: typeof templateCollections;
}) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-400">{description}</p>
        <div className="mt-5 space-y-3">
          {collections.slice(0, 4).map((collection) => (
            <ButtonLink key={collection.id} href={`/collections/${collection.id}`} variant="secondary" className="h-auto w-full justify-between px-4 py-3">
              <span className="text-left">
                <span className="block font-semibold">{collection.name}</span>
                <span className="mt-1 block text-xs text-neutral-500">{collection.audience}</span>
              </span>
              <span className="rounded-md border border-lime-200/20 bg-lime-200/10 px-2 py-1 text-xs text-lime-100">{collection.score}</span>
            </ButtonLink>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
