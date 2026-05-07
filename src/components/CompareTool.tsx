"use client";

import { useMemo, useState } from "react";
import { GitCompare, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { productivityTools, type ProductivityTool } from "@/data/productivityTools";

const scoreRows: { key: keyof Pick<ProductivityTool, "simplicityScore" | "powerScore" | "taskScore" | "notesScore" | "calendarScore" | "collaborationScore" | "integrationsScore" | "knowledgeScore" | "mainAppScore">; label: string }[] = [
  { key: "simplicityScore", label: "Ease of use" },
  { key: "powerScore", label: "Power user features" },
  { key: "taskScore", label: "Task management" },
  { key: "notesScore", label: "Notes and docs" },
  { key: "calendarScore", label: "Calendar support" },
  { key: "collaborationScore", label: "Team collaboration" },
  { key: "integrationsScore", label: "Integrations" },
  { key: "knowledgeScore", label: "Knowledge management" },
  { key: "mainAppScore", label: "Main app potential" },
];

export function CompareTool() {
  const [selectedIds, setSelectedIds] = useState(["notion", "todoist"]);
  const selectedTools = useMemo(() => productivityTools.filter((tool) => selectedIds.includes(tool.id)), [selectedIds]);
  const availableTools = productivityTools.filter((tool) => !selectedIds.includes(tool.id));

  function addTool(id: string) {
    if (selectedIds.length < 4) setSelectedIds((current) => [...current, id]);
  }

  function removeTool(id: string) {
    if (selectedIds.length > 2) setSelectedIds((current) => current.filter((item) => item !== id));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <GitCompare className="h-5 w-5 text-lime-200" />
                Compare 2-4 apps side by side
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">
                Scan scores, feature coverage, pricing, and the plain-English verdict for each possible home base.
              </p>
            </div>
            <select
              value=""
              onChange={(event) => {
                if (event.target.value) addTool(event.target.value);
              }}
              disabled={selectedIds.length >= 4}
              className="h-10 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-lime-200/50 disabled:opacity-50"
            >
              <option value="">{selectedIds.length >= 4 ? "Maximum 4 selected" : "Add an app"}</option>
              {availableTools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
      </Card>

      <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.05]">
                <th className="sticky left-0 z-10 w-52 bg-[#15161a] px-4 py-4 text-left font-semibold text-neutral-300">Field</th>
                {selectedTools.map((tool) => (
                  <th key={tool.id} className="sticky top-16 min-w-64 bg-[#15161a] px-4 py-4 text-left">
                    <Header tool={tool} canRemove={selectedIds.length > 2} onRemove={() => removeTool(tool.id)} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scoreRows.map((row) => (
                <tr key={row.label} className="border-b border-white/10">
                  <td className="sticky left-0 bg-[#101116] px-4 py-4 font-medium text-neutral-300">{row.label}</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="px-4 py-4">
                      <ScoreCell value={tool[row.key]} />
                    </td>
                  ))}
                </tr>
              ))}
              {[
                ["AI features", (tool: ProductivityTool) => (tool.hasAI ? "Built in" : "Not native")],
                ["Offline support", (tool: ProductivityTool) => (tool.worksOffline ? "Good" : "Limited")],
                ["Pricing", (tool: ProductivityTool) => tool.pricing],
                ["Best use case", (tool: ProductivityTool) => tool.bestFor.slice(0, 3).join(", ")],
                ["Verdict", (tool: ProductivityTool) => (tool.mainAppScore >= 8 ? "Home base candidate" : tool.mainAppScore >= 6 ? "Strong specialist" : "Support app")],
              ].map(([label, getValue]) => (
                <tr key={label as string} className="border-b border-white/10">
                  <td className="sticky left-0 bg-[#101116] px-4 py-4 font-medium text-neutral-300">{label as string}</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="px-4 py-4 text-neutral-300">
                      {(getValue as (tool: ProductivityTool) => string)(tool)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {selectedTools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              <Header tool={tool} canRemove={selectedIds.length > 2} onRemove={() => removeTool(tool.id)} />
            </CardHeader>
            <CardContent className="space-y-3">
              {scoreRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-neutral-400">{row.label}</span>
                  <span className="font-semibold text-white">{tool[row.key]}/10</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Header({ tool, canRemove, onRemove }: { tool: ProductivityTool; canRemove: boolean; onRemove: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <ToolLogo name={tool.name} className="h-9 w-9" />
        <div>
          <div className="font-semibold text-white">{tool.name}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge>{tool.pricing}</Badge>
            <Badge>{tool.supportsTeams ? "Team" : "Solo"}</Badge>
          </div>
        </div>
      </div>
      <button
        onClick={onRemove}
        disabled={!canRemove}
        className="rounded-md p-1 text-neutral-500 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
        aria-label={`Remove ${tool.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ScoreCell({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-lime-300" style={{ width: `${value * 10}%` }} />
      </div>
      <span className="w-9 text-right font-semibold text-white">{value}/10</span>
    </div>
  );
}
