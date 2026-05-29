"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, ExternalLink, Layers3, Plus, Save, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ScoreBar";
import { ToolLogo } from "@/components/ToolLogo";
import { productivityTools } from "@/data/productivityTools";
import { stackTemplates } from "@/data/stackTemplates";
import { downloadTextFile, useProductivityHubStore } from "@/lib/productivityStore";
import { analyzeProductivityStack, stackCoverageCategories } from "@/lib/stackAnalysis";

export function StackBuilder() {
  const [selectedIds, setSelectedIds] = useState(["notion", "todoist", "google-workspace"]);
  const [status, setStatus] = useState("");
  const { state, saveStack } = useProductivityHubStore();
  const loadedStackId = useRef<string | null>(null);
  const loadedTemplateId = useRef<string | null>(null);
  const selectedTools = productivityTools.filter((tool) => selectedIds.includes(tool.id));
  const analysis = useMemo(() => analyzeProductivityStack(selectedTools), [selectedTools]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const stackId = searchParams.get("stack");
    const templateId = searchParams.get("template");

    if (templateId && loadedTemplateId.current !== templateId) {
      const template = stackTemplates.find((item) => item.id === templateId);
      if (template) {
        const timer = window.setTimeout(() => {
          loadedTemplateId.current = templateId;
          setSelectedIds(template.toolIds);
          setStatus(`Loaded ${template.name}`);
        }, 0);

        return () => window.clearTimeout(timer);
      }
    }

    if (!stackId || loadedStackId.current === stackId) return;

    const stack = state.savedStacks.find((item) => item.id === stackId);
    if (!stack) return;

    const timer = window.setTimeout(() => {
      loadedStackId.current = stackId;
      setSelectedIds(stack.toolIds);
      setStatus(`Loaded ${stack.name}`);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [state.savedStacks]);

  function toggleTool(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function saveCurrentStack() {
    if (selectedIds.length === 0) return;

    const stack = saveStack({
      name: `${analysis.homeBase?.name ?? "Custom"} productivity stack`,
      toolIds: selectedIds,
      score: analysis.score,
      notes: analysis.messages[0]?.text,
    });
    setStatus(`Saved ${stack.name}`);
  }

  function exportReport() {
    const report = [
      "Productivity Hub stack report",
      `Score: ${analysis.score}`,
      `Recommended home base: ${analysis.homeBase?.name ?? "None"}`,
      "",
      "Selected tools:",
      ...selectedTools.map((tool) => `- ${tool.name}: ${tool.tagline}`),
      "",
      "Analysis:",
      ...analysis.messages.map((message) => `- ${message.text}`),
    ].join("\n");

    downloadTextFile(`productivity-stack-${new Date().toISOString().slice(0, 10)}.txt`, report);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Sparkles className="h-5 w-5 text-lime-200" />
              Start from a proven stack template
            </h2>
            <p className="text-sm leading-6 text-neutral-400">Pick a real-world pattern, then customize it until the analysis feels honest for your work.</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {stackTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-4 transition hover:-translate-y-0.5 hover:border-lime-200/35 hover:bg-white/[0.07]"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIds(template.toolIds);
                    setStatus(`Loaded ${template.name}`);
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-lime-100/70">{template.audience}</p>
                    </div>
                    <Badge>{template.maintenance} upkeep</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-400">{template.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {template.toolIds.map((toolId) => {
                      const tool = productivityTools.find((item) => item.id === toolId);
                      return tool ? <Badge key={tool.id}>{tool.name}</Badge> : null;
                    })}
                  </div>
                </button>
                <Link
                  href={`/collections/${template.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-lime-100/80 transition hover:text-lime-100"
                >
                  View collection
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

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
      </div>

      <div className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
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
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <Button type="button" onClick={saveCurrentStack} disabled={selectedIds.length === 0}>
                <Save className="h-4 w-4" />
                Save stack
              </Button>
              <Button type="button" variant="secondary" onClick={exportReport} disabled={selectedIds.length === 0}>
                <Download className="h-4 w-4" />
                Export report
              </Button>
            </div>
            {status ? <p className="text-sm text-lime-200">{status}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Coverage map</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {stackCoverageCategories.map((category) => (
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

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Saved snapshots</h3>
            <p className="text-sm text-neutral-400">Load a previous stack from this device.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.savedStacks.slice(0, 4).map((stack) => (
              <button
                key={stack.id}
                type="button"
                onClick={() => {
                  setSelectedIds(stack.toolIds);
                  setStatus(`Loaded ${stack.name}`);
                }}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-lime-200/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-white">{stack.name}</span>
                  <span className="rounded-md border border-lime-200/25 bg-lime-200/10 px-2 py-1 text-xs font-semibold text-lime-100">{stack.score}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{stack.toolIds.length} apps</p>
              </button>
            ))}
            {state.savedStacks.length === 0 ? <p className="text-sm leading-6 text-neutral-400">Saved stacks will appear here after you create your first snapshot.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
