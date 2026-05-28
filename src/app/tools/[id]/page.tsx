import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Gauge, LockKeyhole, MoveRight, ShieldCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ScoreBar";
import { ToolCard } from "@/components/ToolCard";
import { ToolLogo } from "@/components/ToolLogo";
import { ToolViewTracker } from "@/components/ToolViewTracker";
import { getAlternatives, getMainAppVerdict, getToolById, productivityTools } from "@/data/productivityTools";

export function generateStaticParams() {
  return productivityTools.map((tool) => ({ id: tool.id }));
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) notFound();
  const alternatives = getAlternatives(tool).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolViewTracker toolId={tool.id} />
      <Link href="/tools" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to directory
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <CardHeader className="bg-[linear-gradient(135deg,rgba(190,242,100,0.13),rgba(56,189,248,0.08),transparent)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ToolLogo name={tool.name} className="h-16 w-16 text-base" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  {tool.categories.map((category) => (
                    <Badge key={category}>{category}</Badge>
                  ))}
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">{tool.name}</h1>
                <p className="mt-3 text-lg leading-8 text-neutral-300">{tool.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
            <List title="Best for" items={tool.bestFor} positive />
            <List title="Not ideal for" items={tool.notIdealFor} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Can this be your main app?</h2>
            <p className="text-sm leading-6 text-neutral-400">{getMainAppVerdict(tool)}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar label="Main app potential" value={tool.mainAppScore} />
            <ScoreBar label="Simplicity" value={tool.simplicityScore} tone="green" />
            <ScoreBar label="Power" value={tool.powerScore} tone="blue" />
            <ScoreBar label="Collaboration" value={tool.collaborationScore} />
            <ButtonLink href={`/compare?apps=${tool.id}`} className="w-full">
              Compare {tool.name}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Editorial verdict</h2>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-8 text-neutral-300">
              {tool.name} can be your productivity home base if you value {tool.strengths.slice(0, 2).join(" and ").toLowerCase()}. But you may still want a dedicated {tool.calendarScore < 6 ? "calendar" : "task"} app if that part of your workflow is mission-critical.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <Info title="Strengths" items={tool.strengths} />
        <Info title="Weaknesses" items={tool.weaknesses} />
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">Platform and pricing</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-neutral-300">
            <p><span className="font-semibold text-white">Pricing:</span> {tool.pricing}</p>
            <p><span className="font-semibold text-white">Platforms:</span> {tool.platforms.join(", ")}</p>
            <p><span className="font-semibold text-white">AI:</span> {tool.hasAI ? "Built-in AI capabilities" : "No native AI focus"}</p>
            <p><span className="font-semibold text-white">Teams:</span> {tool.supportsTeams ? "Supports team workflows" : "Mostly solo-first"}</p>
            <p><span className="font-semibold text-white">Offline:</span> {tool.worksOffline ? "Works offline" : "Mostly online"}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">Decision factors</h2>
            <p className="text-sm leading-6 text-neutral-400">Practical buying signals beyond the feature checklist.</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Factor icon={<Gauge className="h-4 w-4" />} label="Setup difficulty" value={tool.setupDifficulty} />
            <Factor icon={<MoveRight className="h-4 w-4" />} label="Learning curve" value={tool.learningCurve} />
            <Factor icon={<LockKeyhole className="h-4 w-4" />} label="Lock-in risk" value={tool.lockInRisk} />
            <Factor icon={<ShieldCheck className="h-4 w-4" />} label="Migration" value={tool.migrationDifficulty} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">Data and privacy notes</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-neutral-300">
            <p><span className="font-semibold text-white">Data ownership:</span> {tool.dataOwnership}</p>
            <p><span className="font-semibold text-white">Privacy posture:</span> {tool.privacyNotes}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Info title={`Choose ${tool.name} if`} items={tool.chooseIf} />
        <Info title={`Avoid ${tool.name} if`} items={tool.avoidIf} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">Suggested pairings</h2>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {tool.suggestedPairings.map((pairing) => (
              <Badge key={pairing}>{pairing}</Badge>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">Feature scores</h2>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <ScoreBar label="Tasks" value={tool.taskScore} />
            <ScoreBar label="Notes" value={tool.notesScore} />
            <ScoreBar label="Calendar" value={tool.calendarScore} />
            <ScoreBar label="Knowledge" value={tool.knowledgeScore} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">Alternatives</h2>
          <ButtonLink href="/compare" variant="secondary">
            Compare alternatives
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {alternatives.map((alternative) => (
            <ToolCard key={alternative.id} tool={alternative} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Factor({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <span className="text-lime-200">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function List({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div>
      <h2 className="font-semibold text-white">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-neutral-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            {positive ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-white">{title}</h2>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-neutral-300">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-200" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
