import { ArrowRight, BookOpenText, GitCompare, Layers3, Sparkles } from "lucide-react";
import { GuideCard } from "@/components/GuideCard";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { guides } from "@/data/guides";

export default function GuidesPage() {
  const [featured, ...rest] = guides;

  return (
    <div>
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-20">
          <div>
            <Badge>Editorial guides</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-white">
              Clear buying advice for your productivity operating system.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
              Read decision guides that connect tools, tradeoffs, stacks, and user types before you commit your workday to another app.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quiz">
                <Sparkles className="h-4 w-4" />
                Take the quiz
              </ButtonLink>
              <ButtonLink href="/compare" variant="secondary">
                <GitCompare className="h-4 w-4" />
                Compare tools
              </ButtonLink>
            </div>
          </div>

          <Card className="bg-[linear-gradient(135deg,rgba(190,242,100,0.13),rgba(56,189,248,0.08),rgba(255,255,255,0.04))]">
            <CardContent className="space-y-4 p-5">
              {[
                ["Choose a home base", "Find the app that should hold your context."],
                ["Decide stack shape", "One app, focused stack, or home base plus support."],
                ["Compare the tradeoffs", "See where each app is sharp and where it bends."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <BookOpenText className="h-4 w-4 text-lime-200" />
                    {title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <GuideCard guide={featured} featured />
          <div className="grid gap-4">
            {rest.slice(0, 2).map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.slice(2).map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Turn advice into a working stack.</h2>
              <p className="mt-3 max-w-2xl text-neutral-400">Use a guide to narrow the field, then run the quiz or stack builder to pressure-test the setup against your actual work.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/stack-builder">
                <Layers3 className="h-4 w-4" />
                Build a stack
              </ButtonLink>
              <ButtonLink href="/tools" variant="secondary">
                Browse tools
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
