"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Layers3, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ScoreBar";
import { ToolLogo } from "@/components/ToolLogo";
import { productivityTools } from "@/data/productivityTools";

const coverage = ["Notes", "Tasks", "Calendar", "Docs", "Projects", "Collaboration"];

export function StackBuilder() {
  const [selectedIds, setSelectedIds] = useState(["notion", "todoist", "google-workspace"]);
  const selectedTools = productivityTools.filter((tool) => selectedIds.includes(tool.id));
  const analysis = useMemo(() => analyze(selectedTools), [selectedTools]);

  function toggleTool(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <Layers3 className="h-5 w-5 text-lime-200" />
            Select tools from the directory
          </h2>
          <p className="text-sm leading-6 text-neutral-400">Build a stack, then watch overlap, missing categories, score, and recommended home base update instantly.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {productivityTools.map((tool) => {
              const selected = selectedIds.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-0.5 hover:border-lime-200/35 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <ToolLogo name={tool.name} className="h-10 w-10" />
                      <div className="min-w-0">
                        <div className="font-semibold text-white">{tool.name}</div>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-400">{tool.tagline}</p>
                      </div>
                    </div>
                    <span className="rounded-md border border-white/10 bg-black/20 p-1.5 text-neutral-300">
                      {selected ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tool.categories.slice(0, 2).map((category) => (
                      <Badge key={category}>{category}</Badge>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Stack score</h3>
                <p className="text-sm text-neutral-400">{selectedTools.length} app{selectedTools.length === 1 ? "" : "s"} selected</p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-lg border border-lime-200/25 bg-lime-200/10">
                <span className="text-2xl font-semibold text-lime-100">{analysis.score}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar label="Coverage" value={analysis.coverageScore} />
            <ScoreBar label="Simplicity" value={analysis.simplicityScore} tone="green" />
            <ScoreBar label="Team readiness" value={analysis.teamScore} tone="blue" />
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="text-sm font-semibold text-white">Recommended home base</div>
              <div className="mt-3 flex items-center gap-3">
                {analysis.homeBase ? <ToolLogo name={analysis.homeBase.name} className="h-9 w-9" /> : null}
                <div className="text-sm text-neutral-300">{analysis.homeBase?.name ?? "Select a tool first"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Coverage map</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {coverage.map((category) => (
              <div key={category} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  {analysis.categoryCounts[category] ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <AlertTriangle className="h-4 w-4 text-amber-300" />}
                  {category}
                </div>
                <p className="mt-1 text-xs text-neutral-500">{analysis.categoryCounts[category] ?? 0} app{analysis.categoryCounts[category] === 1 ? "" : "s"}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Stack analysis</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.messages.map((message) => (
              <div key={message.text} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm">
                {message.type === "good" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />}
                <span className="text-neutral-300">{message.text}</span>
              </div>
            ))}
            <Button variant="secondary" className="w-full" onClick={() => setSelectedIds(["notion", "todoist", "google-workspace"])}>
              Reset starter stack
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function analyze(tools: typeof productivityTools) {
  const categoryCounts = tools.reduce<Record<string, number>>((counts, tool) => {
    tool.categories.forEach((category) => {
      counts[category] = (counts[category] ?? 0) + 1;
    });
    return counts;
  }, {});
  const homeBase = [...tools].sort((a, b) => b.mainAppScore - a.mainAppScore)[0];
  const missing = coverage.filter((category) => !categoryCounts[category]);
  const overlap = Object.entries(categoryCounts).filter(([, count]) => count >= 3);
  const average = (key: "simplicityScore" | "collaborationScore") => Math.round(tools.reduce((sum, tool) => sum + tool[key], 0) / Math.max(1, tools.length));
  const coverageScore = Math.round(((coverage.length - missing.length) / coverage.length) * 10);
  const simplicityScore = Math.max(1, Math.min(10, average("simplicityScore") - Math.max(0, tools.length - 4)));
  const teamScore = Math.max(1, average("collaborationScore"));
  const score = Math.max(1, Math.min(99, Math.round(coverageScore * 6 + simplicityScore * 2 + teamScore * 2 - overlap.length * 4)));
  const messages: { type: "warning" | "good"; text: string }[] = [];

  if (overlap.some(([category]) => category === "Tasks")) messages.push({ type: "warning", text: "You have 3 task apps. Consider simplifying capture and execution." });
  if (!categoryCounts.Calendar) messages.push({ type: "warning", text: "You do not have a calendar app. Add scheduling coverage for time-based work." });
  if (teamScore < 6) messages.push({ type: "warning", text: "This stack is strong for solo work but weak for team collaboration." });
  if (tools.length > 4) messages.push({ type: "warning", text: "This is a powerful but high-maintenance setup. Make every app earn its place." });
  if (homeBase) messages.push({ type: "good", text: `${homeBase.name} is the clearest productivity home base in this stack.` });
  if (coverageScore >= 8) messages.push({ type: "good", text: "Core coverage is healthy across notes, tasks, calendar, docs, and projects." });
  if (messages.length === 0) messages.push({ type: "warning", text: "Select a few tools to see stack guidance." });

  return { categoryCounts, coverageScore, homeBase, messages, score, simplicityScore, teamScore };
}
