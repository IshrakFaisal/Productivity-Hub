"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Bookmark, BookOpenText, Download, GitCompare, Heart, Layers3, Library, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SaveToLibraryButton } from "@/components/SaveToLibraryButton";
import { ToolLogo } from "@/components/ToolLogo";
import { templateCollections } from "@/data/collections";
import { guides } from "@/data/guides";
import { getToolById, type ProductivityTool } from "@/data/productivityTools";
import { downloadTextFile, useProductivityHubStore } from "@/lib/productivityStore";

export function MyLibrary() {
  const { state, deleteStack, toggleFavorite } = useProductivityHubStore();
  const savedTools = state.favorites.map(getToolById).filter(isTool);
  const savedCollections = state.savedCollections
    .map((id) => templateCollections.find((collection) => collection.id === id))
    .filter((collection): collection is (typeof templateCollections)[number] => Boolean(collection));
  const savedGuides = state.savedGuides
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is (typeof guides)[number] => Boolean(guide));
  const totalSaved = savedTools.length + savedCollections.length + savedGuides.length + state.savedStacks.length;
  const bestCollection = [...savedCollections].sort((a, b) => b.score - a.score)[0];
  const strongestStack = [...state.savedStacks].sort((a, b) => b.score - a.score)[0];
  const compareIds = savedTools.length >= 2 ? savedTools.slice(0, 4).map((tool) => tool.id) : bestCollection?.toolIds.slice(0, 4) ?? [];
  const compareHref = compareIds.length >= 2 ? `/compare?apps=${compareIds.join(",")}` : "/compare";
  const readinessScore = Math.min(100, savedTools.length * 12 + savedCollections.length * 18 + savedGuides.length * 10 + state.savedStacks.length * 22);

  function exportLibraryBrief() {
    const lines = [
      "Productivity Hub library brief",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Decision readiness: ${readinessScore}/100`,
      `Saved tools: ${savedTools.map((tool) => tool.name).join(", ") || "None"}`,
      `Saved collections: ${savedCollections.map((collection) => collection.name).join(", ") || "None"}`,
      `Saved guides: ${savedGuides.map((guide) => guide.title).join(", ") || "None"}`,
      `Saved stacks: ${state.savedStacks.map((stack) => `${stack.name} (${stack.score})`).join(", ") || "None"}`,
      "",
      "Recommended next move:",
      getNextMove(savedTools.length, savedCollections.length, savedGuides.length, state.savedStacks.length),
    ].join("\n");

    downloadTextFile(`productivity-hub-library-${new Date().toISOString().slice(0, 10)}.txt`, lines);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>My Library</Badge>
            <Badge>Local workspace</Badge>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Keep the tools and systems worth revisiting.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400">
            Save tools, editorial guides, curated collections, and stack snapshots into one private library on this device.
          </p>
        </div>
        <Card className="bg-[radial-gradient(circle_at_top_left,rgba(190,242,100,0.16),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]">
          <CardContent className="grid grid-cols-2 gap-3 p-5 sm:p-6">
            <Metric label="Saved items" value={totalSaved} />
            <Metric label="Tools" value={savedTools.length} />
            <Metric label="Collections" value={savedCollections.length} />
            <Metric label="Stacks" value={state.savedStacks.length} />
          </CardContent>
        </Card>
      </section>

      {totalSaved === 0 ? (
        <Card className="border-dashed border-white/15 bg-white/[0.025]">
          <CardContent className="grid place-items-center px-6 py-16 text-center">
            <Library className="h-10 w-10 text-neutral-600" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Your Library is empty</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400">
              Save a collection, favorite a tool, or create a stack snapshot to turn browsing into a decision history.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/collections">Browse collections</ButtonLink>
              <ButtonLink href="/tools" variant="secondary">Browse tools</ButtonLink>
              <ButtonLink href="/guides" variant="secondary">Read guides</ButtonLink>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader className="bg-[linear-gradient(135deg,rgba(190,242,100,0.12),rgba(56,189,248,0.07),transparent)]">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
                <Sparkles className="h-5 w-5 text-lime-200" />
                Decision board
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
                A quick read on whether your saved research is ready to become a comparison, stack, or final shortlist.
              </p>
            </div>
            <div className="grid h-20 w-20 place-items-center rounded-lg border border-lime-200/25 bg-lime-200/10">
              <span className="text-2xl font-semibold text-lime-100">{readinessScore}</span>
              <span className="-mt-5 text-[10px] uppercase tracking-wide text-neutral-500">ready</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3">
          <DecisionAction
            title="Compare shortlist"
            body={compareIds.length >= 2 ? "Open a focused comparison from saved tools or your best saved collection." : "Save at least two tools or one collection to unlock a focused comparison."}
            href={compareHref}
            label="Compare"
            icon={<GitCompare className="h-4 w-4" />}
          />
          <DecisionAction
            title="Open best template"
            body={bestCollection ? `${bestCollection.name} is your strongest saved collection at ${bestCollection.score}/100.` : "Save a collection to create a reusable starting point for Stack Builder."}
            href={bestCollection ? `/collections/${bestCollection.id}` : "/collections"}
            label={bestCollection ? "Open collection" : "Browse collections"}
            icon={<Bookmark className="h-4 w-4" />}
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Download className="h-4 w-4 text-lime-200" />
              Export brief
            </div>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Download a plain-text summary of saved tools, collections, guides, stacks, and the next recommended move.
            </p>
            <Button type="button" variant="secondary" className="mt-4 w-full" onClick={exportLibraryBrief} disabled={totalSaved === 0}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <Bookmark className="h-5 w-5 text-lime-200" />
                Saved collections
              </h2>
              <ButtonLink href="/collections" variant="secondary">Browse</ButtonLink>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedCollections.map((collection) => (
              <div key={collection.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/collections/${collection.id}`} className="font-semibold text-white transition hover:text-lime-100">
                      {collection.name}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-400">{collection.description}</p>
                  </div>
                  <SaveToLibraryButton target={{ type: "collection", id: collection.id, name: collection.name }} compact />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{collection.philosophy}</Badge>
                  <Badge>{collection.maintenance} upkeep</Badge>
                  <Badge>{collection.score} score</Badge>
                </div>
              </div>
            ))}
            {savedCollections.length === 0 ? <LibraryEmpty body="Save collection templates you may want to use later." href="/collections" label="Browse collections" /> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <BookOpenText className="h-5 w-5 text-sky-200" />
                Saved guides
              </h2>
              <ButtonLink href="/guides" variant="secondary">Browse</ButtonLink>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedGuides.map((guide) => (
              <div key={guide.slug} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/guides/${guide.slug}`} className="font-semibold text-white transition hover:text-lime-100">
                      {guide.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-400">{guide.description}</p>
                  </div>
                  <SaveToLibraryButton target={{ type: "guide", id: guide.slug, name: guide.title }} compact />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{guide.category}</Badge>
                  <Badge>{guide.readTime}</Badge>
                </div>
              </div>
            ))}
            {savedGuides.length === 0 ? <LibraryEmpty body="Save guides you want to revisit before choosing a stack." href="/guides" label="Browse guides" /> : null}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <Heart className="h-5 w-5 text-rose-200" />
                Favorite tools
              </h2>
              <ButtonLink href="/tools" variant="secondary">Browse</ButtonLink>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {savedTools.map((tool) => (
              <div key={tool.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/tools/${tool.id}`} className="min-w-0">
                    <ToolLogo name={tool.name} className="h-9 w-9" />
                    <h3 className="mt-3 truncate font-semibold text-white">{tool.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-400">{tool.tagline}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(tool.id)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 bg-black/25 text-lime-200 transition hover:bg-white/[0.07]"
                    aria-label={`Remove ${tool.name} from favorites`}
                  >
                    <Heart className="h-4 w-4 fill-lime-200" />
                  </button>
                </div>
              </div>
            ))}
            {savedTools.length === 0 ? <LibraryEmpty body="Favorite tools from the directory to keep them here." href="/tools" label="Browse tools" /> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <Layers3 className="h-5 w-5 text-lime-200" />
                Saved stacks
              </h2>
              <ButtonLink href="/stack-builder" variant="secondary">Build</ButtonLink>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.savedStacks.map((stack) => (
              <div key={stack.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/stack-builder?stack=${encodeURIComponent(stack.id)}`} className="font-semibold text-white transition hover:text-lime-100">
                      {stack.name}
                    </Link>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">{stack.notes ?? "Saved stack snapshot"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-lime-200/25 bg-lime-200/10 px-2 py-1 text-sm font-semibold text-lime-100">{stack.score}</span>
                    <button
                      type="button"
                      onClick={() => deleteStack(stack.id)}
                      className="rounded-md p-2 text-neutral-500 transition hover:bg-white/10 hover:text-rose-200"
                      aria-label={`Delete ${stack.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stack.toolIds.map((toolId) => {
                    const tool = getToolById(toolId);
                    return tool ? <Badge key={tool.id}>{tool.name}</Badge> : null;
                  })}
                </div>
              </div>
            ))}
            {state.savedStacks.length === 0 ? <LibraryEmpty body="Save stack snapshots from Stack Builder." href="/stack-builder" label="Build a stack" /> : null}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(190,242,100,0.13),rgba(56,189,248,0.08),rgba(255,255,255,0.04))] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Turn your library into a decision.</h2>
            <p className="mt-3 max-w-2xl text-neutral-300">Compare saved tools, load a saved collection, or use Stack Builder to reduce overlap before committing to a workflow.</p>
            {strongestStack ? <p className="mt-2 text-sm text-lime-100">Your strongest saved stack is {strongestStack.name} at {strongestStack.score}/100.</p> : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/compare">
              <GitCompare className="h-4 w-4" />
              Compare tools
            </ButtonLink>
            <ButtonLink href="/stack-builder" variant="secondary">
              <Layers3 className="h-4 w-4" />
              Build stack
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function DecisionAction({
  title,
  body,
  href,
  label,
  icon,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-lime-200">{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p>
      <ButtonLink href={href} variant="secondary" className="mt-4 w-full">
        {label}
      </ButtonLink>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">{label}</div>
    </div>
  );
}

function LibraryEmpty({ body, href, label }: { body: string; href: string; label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 p-5 text-sm text-neutral-400 sm:col-span-2">
      <p>{body}</p>
      <ButtonLink href={href} variant="secondary" className="mt-4">
        {label}
      </ButtonLink>
    </div>
  );
}

function isTool(tool: ProductivityTool | undefined): tool is ProductivityTool {
  return Boolean(tool);
}

function getNextMove(toolCount: number, collectionCount: number, guideCount: number, stackCount: number) {
  if (stackCount > 0) return "Open your strongest saved stack and remove any duplicate task, calendar, or notes apps.";
  if (toolCount >= 2) return "Compare your saved tools side by side and pick one home base candidate.";
  if (collectionCount > 0) return "Open your strongest saved collection, then load it into Stack Builder.";
  if (guideCount > 0) return "Turn the guide you saved into a shortlist by saving two or three mentioned tools.";
  return "Start by saving a collection or favoriting two tools from the directory.";
}
