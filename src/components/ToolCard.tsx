"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, CheckCircle2, GitCompare, Heart, Users, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ScoreBar";
import { ToolLogo } from "@/components/ToolLogo";
import { ProductivityTool } from "@/data/productivityTools";
import { useProductivityHubStore } from "@/lib/productivityStore";

export function ToolCard({ tool }: { tool: ProductivityTool }) {
  const coverage = Math.round((tool.taskScore + tool.notesScore + tool.calendarScore + tool.knowledgeScore) / 4);
  const { state, toggleFavorite, trackTool } = useProductivityHubStore();
  const favorite = state.favorites.includes(tool.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-colors duration-300 hover:border-white/18 hover:bg-white/[0.065]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(215,255,107,0.55),rgba(125,211,252,0.45),transparent)] opacity-0 transition group-hover:opacity-100" />
      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ToolLogo name={tool.name} />
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">{tool.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-400">{tool.tagline}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(tool.id)}
              className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-black/25 text-neutral-500 transition hover:border-white/18 hover:bg-white/[0.06] hover:text-lime-200"
              aria-label={favorite ? `Remove ${tool.name} from favorites` : `Save ${tool.name} to favorites`}
            >
              <Heart className={favorite ? "h-4 w-4 fill-lime-200 text-lime-200" : "h-4 w-4"} />
            </button>
            <div className="grid h-14 w-14 place-items-center rounded-lg border border-lime-200/20 bg-lime-200/[0.08]">
              <span className="text-lg font-semibold text-lime-100">{tool.mainAppScore}</span>
              <span className="-mt-3 text-[10px] uppercase tracking-wide text-neutral-500">home</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tool.categories.slice(0, 3).map((category) => (
            <Badge key={category}>{category}</Badge>
          ))}
        </div>
        <ScoreBar label="Main app potential" value={tool.mainAppScore} />
        <ScoreBar label="Workflow coverage" value={coverage} tone="blue" />
        <div className="grid gap-2 text-sm text-neutral-300">
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.025] px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {tool.pricing} - best for {tool.bestFor.slice(0, 2).join(", ")}
          </div>
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.025] px-3 py-2">
            {tool.worksOffline ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <WifiOff className="h-4 w-4 text-amber-300" />}
            {tool.worksOffline ? "Works offline" : "Mostly online"}
          </div>
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.025] px-3 py-2">
            {tool.hasAI ? <Bot className="h-4 w-4 text-sky-300" /> : <Users className="h-4 w-4 text-neutral-500" />}
            {tool.hasAI ? "AI features included" : tool.supportsTeams ? "Team-ready without AI focus" : "Solo-first specialist"}
          </div>
        </div>
        <div className="mt-auto flex gap-2 pt-2">
          <ButtonLink href={`/tools/${tool.id}`} className="flex-1" onClick={() => trackTool(tool.id)}>
            View profile
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
          <Link
            href={`/compare?apps=${tool.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.055] text-neutral-300 transition hover:border-white/18 hover:bg-white/[0.09] hover:text-white"
            aria-label={`Compare ${tool.name}`}
          >
            <GitCompare className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </motion.article>
  );
}
