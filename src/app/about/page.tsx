import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Badge className="border-lime-200/30 bg-lime-200/10 text-lime-100">MVP scope</Badge>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">About Productivity Hub</h1>
      <p className="mt-4 text-lg leading-8 text-neutral-300">
        Productivity Hub helps people choose a realistic software stack instead
        of endlessly switching tools. It focuses on fit: one home base,
        supporting apps, workflow coverage, and the tradeoffs that matter in
        daily work.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Local mock data", "The MVP uses a typed catalog in productivityTools.ts, so it is easy to expand before adding a database."],
          ["No accounts yet", "Authentication, payments, saved stacks, and admin tooling are intentionally out of scope for the first version."],
          ["Comparison-first", "The product centers on decisions: main app potential, stack overlap, collaboration, AI, offline use, and ecosystem fit."],
        ].map(([title, body]) => (
          <Card key={title}>
            <CardHeader>
              <h2 className="font-semibold text-white">{title}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-neutral-400">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
