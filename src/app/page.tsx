import Link from "next/link";
import { ArrowRight, Bot, CalendarDays, CheckCircle2, ClipboardList, GitCompare, LayoutGrid, Search, Sparkles, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToolCard } from "@/components/ToolCard";
import { ToolLogo } from "@/components/ToolLogo";
import { productivityTools } from "@/data/productivityTools";

const featuredCategories = [
  { label: "All-in-one workspaces", icon: LayoutGrid, href: "/tools?category=Knowledge", detail: "Docs, databases, dashboards, and team memory." },
  { label: "Task managers", icon: ClipboardList, href: "/tools?category=Tasks", detail: "Capture, prioritize, recur, and execute." },
  { label: "Calendar planners", icon: CalendarDays, href: "/tools?category=Calendar", detail: "Time blocking, scheduling, and daily planning." },
  { label: "Team systems", icon: Users, href: "/tools?category=Collaboration", detail: "Projects, communication, and shared ownership." },
  { label: "AI productivity", icon: Bot, href: "/tools?ai=true", detail: "Summaries, writing, scheduling, and automation." },
  { label: "Comparison picks", icon: GitCompare, href: "/compare", detail: "Put contenders side by side before committing." },
];

const archetypes = ["Student", "Founder", "Creator", "Developer", "Manager", "Freelancer"];

export default function Home() {
  const featuredTools = productivityTools.filter((tool) => ["notion", "todoist", "obsidian", "google-workspace", "clickup", "linear"].includes(tool.id));

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-1.5 text-sm font-medium text-neutral-300">
              <Zap className="h-3.5 w-3.5 text-lime-200" />
              Software decisions, not app collecting
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Find the productivity app you&apos;ll actually live in.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Compare tools, discover your ideal stack, and decide whether you need one all-in-one app or a focused set of apps.
            </p>
            <form action="/tools" className="mt-8 max-w-2xl">
              <label className="relative block rounded-xl border border-white/12 bg-white/[0.055] p-1 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  name="q"
                  placeholder="Search Notion, Todoist, Obsidian, ClickUp..."
                  className="h-14 w-full rounded-lg border border-transparent bg-black/35 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-lime-200/45 focus:ring-4 focus:ring-lime-200/10"
                />
              </label>
            </form>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quiz" className="h-11">
                <Sparkles className="h-4 w-4" />
                Find my stack
              </ButtonLink>
              <ButtonLink href="/tools" variant="secondary" className="h-11">
                Browse tools
              </ButtonLink>
              <ButtonLink href="/guides" variant="ghost" className="h-11">
                Read guides
              </ButtonLink>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["24", "curated tools"],
                ["4", "editorial guides"],
                ["2", "decision modes"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="text-2xl font-semibold tracking-tight text-white">{value}</div>
                  <div className="mt-1 text-xs text-neutral-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Featured categories</h2>
            <p className="mt-2 text-neutral-400">Start with the kind of work you need to organize.</p>
          </div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-lime-200">
            Explore full directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.label} href={category.href} className="rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.065]">
                <Icon className="h-5 w-5 text-lime-200" />
                <h3 className="mt-4 font-semibold text-white">{category.label}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{category.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Featured tools</h2>
              <p className="mt-2 text-neutral-400">A starter set of strong contenders for your home base or support stack.</p>
            </div>
            <ButtonLink href="/compare" variant="secondary">
              Open comparison
            </ButtonLink>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <Bento title="One app vs stack" body="A home base reduces context switching. A focused stack keeps specialist jobs crisp. Productivity Hub helps you decide where the tradeoff lands for your work." />
        <Bento title="Popular comparisons" body="Notion vs Coda, Todoist vs TickTick, Asana vs ClickUp, Obsidian vs Capacities, Motion vs Akiflow." />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.035))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Choose by archetype, not hype.</h2>
              <p className="mt-3 max-w-2xl text-neutral-300">A student, founder, developer, and manager should not blindly copy the same setup. Start with the shape of your day.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {archetypes.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href="/quiz" className="h-11">Find my stack</ButtonLink>
              <ButtonLink href="/stack-builder" variant="secondary" className="h-11">Build manually</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroPreview() {
  const support = ["Todoist", "Google Workspace", "Slack"];
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_35%_10%,rgba(215,255,107,0.18),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(125,211,252,0.15),transparent_30%)] blur-2xl" />
      <Card className="relative overflow-hidden border-white/12 bg-[#0b0d11]/78">
        <div className="border-b border-white/10 bg-white/[0.025] px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
            </div>
            <span className="text-xs font-medium text-neutral-500">Stack recommendation</span>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500">Recommended home base</p>
              <div className="mt-3 flex items-center gap-3">
                <ToolLogo name="Notion" className="h-12 w-12" />
                <div>
                  <h2 className="text-2xl font-semibold text-white">Notion</h2>
                  <p className="text-sm text-neutral-400">Flexible systems, docs, and knowledge</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-lime-200/25 bg-lime-200/10 px-3 py-2 text-center">
              <div className="text-2xl font-semibold text-lime-100">86</div>
              <div className="text-[10px] uppercase tracking-wide text-neutral-400">Stack score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="mb-3 text-sm font-medium text-neutral-300">Supporting apps</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {support.map((name) => (
                <div key={name} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <ToolLogo name={name} className="h-8 w-8 text-xs" />
                  <div className="mt-2 text-sm font-medium text-white">{name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-white">Coverage map</span>
              <span className="text-neutral-500">5 of 6 lanes</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {["Notes", "Tasks", "Docs", "Team", "AI", "Cal"].map((lane, index) => (
                <div key={lane} className="space-y-2">
                  <div className={index === 5 ? "h-10 rounded-md border border-amber-200/25 bg-amber-200/10" : "h-10 rounded-md border border-lime-200/20 bg-lime-200/[0.12]"} />
                  <div className="truncate text-center text-[10px] text-neutral-500">{lane}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            {["Too many task apps", "No calendar app selected"].map((warning) => (
              <div key={warning} className="flex items-center gap-2 rounded-md border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-sm text-amber-100">
                <CheckCircle2 className="h-4 w-4" />
                {warning}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Bento({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-8 text-neutral-300">{body}</p>
      </CardContent>
    </Card>
  );
}
