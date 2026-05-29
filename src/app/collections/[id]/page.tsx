import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, GitCompare, Layers3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SaveToLibraryButton } from "@/components/SaveToLibraryButton";
import { ScoreBar } from "@/components/ScoreBar";
import { ToolLogo } from "@/components/ToolLogo";
import { getTemplateCollectionById, templateCollections } from "@/data/collections";
import { productivityTools, type ProductivityTool } from "@/data/productivityTools";
import { analyzeProductivityStack, stackCoverageCategories } from "@/lib/stackAnalysis";

export function generateStaticParams() {
  return templateCollections.map((collection) => ({ id: collection.id }));
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = getTemplateCollectionById(id);

  if (!collection) notFound();

  const tools = productivityTools.filter((tool) => collection.toolIds.includes(tool.id));
  const analysis = analyzeProductivityStack(tools);
  const compareHref = `/compare?apps=${tools
    .slice(0, 4)
    .map((tool) => tool.id)
    .join(",")}`;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to collections
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{collection.philosophy}</Badge>
            <Badge>{collection.maintenance} upkeep</Badge>
            <Badge>{tools.length} apps</Badge>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">{collection.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-400">{collection.outcome}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/stack-builder?template=${collection.id}`}>
              <Layers3 className="h-4 w-4" />
              Use this template
            </ButtonLink>
            <SaveToLibraryButton target={{ type: "collection", id: collection.id, name: collection.name }} />
            <ButtonLink href={compareHref} variant="secondary">
              <GitCompare className="h-4 w-4" />
              Compare included tools
            </ButtonLink>
            <ButtonLink href="/quiz" variant="secondary">
              <Sparkles className="h-4 w-4" />
              Take quiz
            </ButtonLink>
          </div>
        </div>

        <Card className="bg-[radial-gradient(circle_at_top_left,rgba(190,242,100,0.18),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Stack score</div>
                <p className="mt-1 text-sm text-neutral-500">Based on coverage, simplicity, team fit, and overlap.</p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-lg border border-lime-200/25 bg-lime-200/10">
                <span className="text-2xl font-semibold text-lime-100">{analysis.score}</span>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <ScoreBar label="Coverage" value={analysis.coverageScore} />
              <ScoreBar label="Simplicity" value={analysis.simplicityScore} tone="green" />
              <ScoreBar label="Team readiness" value={analysis.teamScore} tone="blue" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Included tools</h2>
              <p className="text-sm leading-6 text-neutral-400">Each app has a job, so the stack stays useful instead of becoming a collection habit.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {tools.map((tool) => (
                <ToolRoleRow key={tool.id} tool={tool} />
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <DetailList title="Best when" items={collection.bestWhen} />
            <DetailList title="Avoid when" items={collection.avoidWhen} />
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Setup plan</h2>
              <p className="text-sm leading-6 text-neutral-400">A practical order of operations for making this collection real.</p>
            </CardHeader>
            <CardContent className="grid gap-3">
              {collection.setupSteps.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-lime-200/25 bg-lime-200/10 text-sm font-semibold text-lime-100">{index + 1}</span>
                  <p className="text-sm leading-6 text-neutral-300">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Daily rhythm</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {collection.rhythm.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-neutral-300">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Coverage map</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {stackCoverageCategories.map((category) => (
                <div key={category} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-sm font-medium text-white">{category}</div>
                  <p className="mt-1 text-xs text-neutral-500">{analysis.categoryCounts[category] ?? 0} app{analysis.categoryCounts[category] === 1 ? "" : "s"}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Upgrade path</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-neutral-300">{collection.upgradePath}</p>
              <ButtonLink href={`/stack-builder?template=${collection.id}`} className="mt-5 w-full">
                Open in Stack Builder
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function ToolRoleRow({ tool }: { tool: ProductivityTool }) {
  return (
    <Link href={`/tools/${tool.id}`} className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-lime-200/30 hover:bg-white/[0.07]">
      <ToolLogo name={tool.name} className="h-10 w-10" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white">{tool.name}</span>
          <Badge>{getToolRole(tool)}</Badge>
        </span>
        <span className="mt-1 block text-sm leading-6 text-neutral-400">{tool.tagline}</span>
      </span>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-600" />
    </Link>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-neutral-300">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function getToolRole(tool: ProductivityTool) {
  if (tool.mainAppScore >= 8) return "Home base";
  if (tool.taskScore >= 8) return "Task layer";
  if (tool.calendarScore >= 8) return "Calendar layer";
  if (tool.collaborationScore >= 8) return "Team layer";
  if (tool.knowledgeScore >= 8) return "Knowledge layer";
  return "Support app";
}
