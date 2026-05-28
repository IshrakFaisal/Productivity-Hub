"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { categories, platforms, pricingModels, productivityTools } from "@/data/productivityTools";
import { cn } from "@/lib/utils";

const booleanFilters = [
  { id: "ai", label: "AI features" },
  { id: "offline", label: "Offline support" },
  { id: "teams", label: "Team support" },
];

const sorters = [
  { id: "mainAppScore", label: "Main app score" },
  { id: "simplicityScore", label: "Simplicity" },
  { id: "powerScore", label: "Power" },
  { id: "collaborationScore", label: "Collaboration" },
] as const;

type SortKey = (typeof sorters)[number]["id"];

export function ToolDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [pricing, setPricing] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [active, setActive] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("mainAppScore");

  const tools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return productivityTools
      .filter((tool) => {
        const haystack = [tool.name, tool.tagline, tool.description, ...tool.categories, ...tool.bestFor, ...tool.strengths].join(" ").toLowerCase();
        if (normalized && !haystack.includes(normalized)) return false;
        if (category !== "All" && !tool.categories.includes(category)) return false;
        if (pricing !== "All" && tool.pricing !== pricing) return false;
        if (platform !== "All" && !tool.platforms.includes(platform)) return false;
        if (active.includes("ai") && !tool.hasAI) return false;
        if (active.includes("offline") && !tool.worksOffline) return false;
        if (active.includes("teams") && !tool.supportsTeams) return false;
        return true;
      })
      .sort((a, b) => b[sort] - a[sort]);
  }, [active, category, platform, pricing, query, sort]);

  const hasFilters = query || category !== "All" || pricing !== "All" || platform !== "All" || active.length > 0;

  function toggleFilter(id: string) {
    setActive((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[292px_1fr]">
      <aside className="h-fit rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:sticky lg:top-24">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <SlidersHorizontal className="h-4 w-4" />
          Refine directory
        </div>
        <div className="mt-4 space-y-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools"
              className="h-11 w-full rounded-md border border-white/10 bg-black/35 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-lime-200/50 focus:ring-4 focus:ring-lime-200/10"
            />
          </label>
          {[
            ["Category", category, setCategory, ["All", ...categories]],
            ["Pricing", pricing, setPricing, ["All", ...pricingModels]],
            ["Platform", platform, setPlatform, ["All", ...platforms]],
          ].map(([label, value, setter, options]) => (
            <label key={label as string} className="block">
              <span className="text-xs font-medium text-neutral-400">{label as string}</span>
              <select
                value={value as string}
                onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/35 px-3 text-sm text-white outline-none focus:border-lime-200/50"
              >
                {(options as string[]).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-400">
              <Filter className="h-3.5 w-3.5" />
              Capabilities
            </div>
            <div className="grid gap-2">
              {booleanFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-sm font-medium transition",
                    active.includes(filter.id)
                      ? "border-lime-200/35 bg-lime-200/[0.12] text-lime-100"
                      : "border-white/10 bg-white/[0.035] text-neutral-300 hover:border-white/18 hover:bg-white/[0.07]",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/35 px-3 text-sm text-white outline-none focus:border-lime-200/50"
            >
              {sorters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {hasFilters && (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setPricing("All");
                setPlatform("All");
                setActive([]);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </aside>
      <section>
        <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3">
          <p className="text-sm text-neutral-400">
            Showing <span className="font-semibold text-white">{tools.length}</span> tools
          </p>
          <p className="hidden text-sm text-neutral-500 sm:block">Search and filters update instantly.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        {tools.length === 0 && (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-10 text-center">
            <h3 className="font-semibold text-white">No matching tools yet</h3>
            <p className="mt-2 text-sm text-neutral-400">Try clearing a filter or searching for a broader workflow.</p>
          </div>
        )}
      </section>
    </div>
  );
}
