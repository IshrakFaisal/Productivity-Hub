import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GitCompare, Layers3, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GuideHero } from "@/components/GuideHero";
import { GuideSection } from "@/components/GuideSection";
import { SaveToLibraryButton } from "@/components/SaveToLibraryButton";
import { getGuideBySlug, guides } from "@/data/guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to guides
        </Link>
      </div>

      <GuideHero guide={guide} />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <Card>
              <CardHeader>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">In this guide</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                {guide.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`} className="block rounded-md px-3 py-2 text-sm leading-5 text-neutral-400 transition hover:bg-white/[0.06] hover:text-white">
                    {section.title}
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </aside>

        <article className="space-y-6">
          <div className="flex justify-end">
            <SaveToLibraryButton target={{ type: "guide", id: guide.slug, name: guide.title }} />
          </div>

          {guide.sections.map((section, index) => (
            <GuideSection key={section.id} section={section} index={index} />
          ))}

          <Card className="bg-[linear-gradient(135deg,rgba(190,242,100,0.13),rgba(56,189,248,0.08),rgba(255,255,255,0.04))]">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">Make the decision concrete.</h2>
                  <p className="mt-3 max-w-2xl text-neutral-300">
                    Turn this guide into a recommendation, side-by-side comparison, or manual stack analysis.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <ButtonLink href="/quiz">
                    <Sparkles className="h-4 w-4" />
                    Take the quiz
                  </ButtonLink>
                  <ButtonLink href="/compare" variant="secondary">
                    <GitCompare className="h-4 w-4" />
                    Compare tools
                  </ButtonLink>
                  <ButtonLink href="/stack-builder" variant="secondary">
                    <Layers3 className="h-4 w-4" />
                    Build a stack
                  </ButtonLink>
                </div>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
