"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, CheckCircle2, GitCompare, Users, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ScoreBar";
import { ToolLogo } from "@/components/ToolLogo";
import { ProductivityTool } from "@/data/productivityTools";

export function ToolCard({ tool }: { tool: ProductivityTool }) {
  const coverage = Math.round((tool.taskScore + tool.notesScore + tool.calendarScore + tool.knowledgeScore) / 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur transition-colors duration-300 hover:border-lime-200/30 hover:bg-white/[0.075]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(190,242,100,0.14),rgba(56,189,248,0.1),transparent)] opacity-80" />
      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ToolLogo name={tool.name} />
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">{tool.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-400">{tool.tagline}</p>
            </div>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-lg border border-white/10 bg-black/30">
            <span className="text-lg font-semibold text-lime-200">{tool.mainAppScore}</span>
            <span className="-mt-3 text-[10px] uppercase text-neutral-500">home</span>
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
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {tool.pricing} · best for {tool.bestFor.slice(0, 2).join(", ")}
          </div>
          <div className="flex items-center gap-2">
            {tool.worksOffline ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <WifiOff className="h-4 w-4 text-amber-300" />}
            {tool.worksOffline ? "Works offline" : "Mostly online"}
          </div>
          <div className="flex items-center gap-2">
            {tool.hasAI ? <Bot className="h-4 w-4 text-sky-300" /> : <Users className="h-4 w-4 text-neutral-500" />}
            {tool.hasAI ? "AI features included" : tool.supportsTeams ? "Team-ready without AI focus" : "Solo-first specialist"}
          </div>
        </div>
        <div className="mt-auto flex gap-2 pt-2">
          <ButtonLink href={`/tools/${tool.id}`} className="flex-1">
            View profile
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
          <Link
            href={`/compare?apps=${tool.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-neutral-200 transition hover:bg-white/[0.1]"
            aria-label={`Compare ${tool.name}`}
          >
            <GitCompare className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </motion.article>
  );
}
