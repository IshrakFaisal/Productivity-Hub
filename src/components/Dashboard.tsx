"use client";

import Link from "next/link";
import type { ChangeEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { Download, Heart, Layers3, RotateCcw, Sparkles, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { getToolById, productivityTools, type ProductivityTool } from "@/data/productivityTools";
import { downloadTextFile, useProductivityHubStore } from "@/lib/productivityStore";

export function Dashboard() {
  const { state, deleteStack, importWorkspace, resetWorkspace, saveOnboarding } = useProductivityHubStore();
  const [importStatus, setImportStatus] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const favoriteTools = state.favorites.map(getToolById).filter(isTool);
  const recentTools = state.recentToolIds.map(getToolById).filter(isTool);
  const quizHomeBase = state.quizResult ? getToolById(state.quizResult.homeBaseId) : undefined;
  const strongestStack = [...state.savedStacks].sort((a, b) => b.score - a.score)[0];
  const personalizedTools = useMemo(() => getPersonalizedTools(state.onboarding), [state.onboarding]);

  function exportWorkspace() {
    downloadTextFile(
      `productivity-hub-workspace-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(state, null, 2),
      "application/json",
    );
  }

  async function importWorkspaceFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      importWorkspace(JSON.parse(await file.text()));
      setImportStatus("Workspace imported successfully.");
    } catch (error) {
      setImportStatus(error instanceof Error ? error.message : "Could not import this workspace file.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      {!state.onboarding?.completed || editingProfile ? (
        <OnboardingCard
          initial={state.onboarding}
          onComplete={(profile) => {
            saveOnboarding(profile);
            setEditingProfile(false);
          }}
        />
      ) : null}

      {state.onboarding?.completed && !editingProfile ? (
        <Card className="overflow-hidden">
          <CardHeader className="bg-[linear-gradient(135deg,rgba(190,242,100,0.12),rgba(56,189,248,0.08))]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Personalized for a {state.onboarding.role.toLowerCase()}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  You prefer {state.onboarding.toolPreference.toLowerCase()} tools, work {state.onboarding.teamMode.toLowerCase()}, and care most about {state.onboarding.priority.toLowerCase()}.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={() => setEditingProfile(true)}>
                Edit profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 pt-5 md:grid-cols-3">
            {personalizedTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]">
                <ToolLogo name={tool.name} className="h-9 w-9" />
                <h3 className="mt-3 font-semibold text-white">{tool.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-400">{tool.tagline}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-4">
        <Metric title="Library items" value={state.favorites.length + state.savedCollections.length + state.savedGuides.length + state.savedStacks.length} detail="Saved tools, guides, collections, and stacks" />
        <Metric title="Saved stacks" value={state.savedStacks.length} detail="Local stack snapshots on this device" />
        <Metric title="Best score" value={strongestStack?.score ?? 0} detail={strongestStack?.name ?? "Build a stack to score it"} />
        <Metric title="Quiz home base" value={quizHomeBase?.mainAppScore ?? 0} detail={quizHomeBase?.name ?? "Run the stack finder"} />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Layers3 className="h-5 w-5 text-lime-200" />
                  Saved stacks
                </h2>
                <p className="mt-2 text-sm text-neutral-400">Use these as your personal decision history.</p>
              </div>
              <ButtonLink href="/stack-builder" variant="secondary">Build stack</ButtonLink>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.savedStacks.map((stack) => (
              <div key={stack.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{stack.name}</h3>
                    <p className="mt-1 text-sm text-neutral-400">{stack.notes}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-lime-200/25 bg-lime-200/10 px-2 py-1 text-sm font-semibold text-lime-100">{stack.score}</span>
                    <button
                      type="button"
                      onClick={() => deleteStack(stack.id)}
                      className="rounded-md p-2 text-neutral-500 transition hover:bg-white/10 hover:text-rose-200"
                      aria-label={`Delete ${stack.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stack.toolIds.map((toolId) => {
                    const tool = getToolById(toolId);
                    return tool ? <Badge key={tool.id}>{tool.name}</Badge> : null;
                  })}
                </div>
              </div>
            ))}
            {state.savedStacks.length === 0 && (
              <Empty title="No saved stacks yet" body="Open Stack Builder, choose tools, then save a stack snapshot." href="/stack-builder" label="Open Stack Builder" />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Sparkles className="h-5 w-5 text-lime-200" />
                Recommended next move
              </h2>
            </CardHeader>
            <CardContent>
              {quizHomeBase ? (
                <div className="flex gap-3">
                  <ToolLogo name={quizHomeBase.name} />
                  <div>
                    <p className="font-semibold text-white">Keep evaluating {quizHomeBase.name}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">Your latest quiz result points to this as your strongest home base candidate.</p>
                  </div>
                </div>
              ) : (
                <Empty title="Run the quiz" body="Get a home base recommendation before building a long stack." href="/quiz" label="Find my stack" compact />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Workspace actions</h2>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button type="button" onClick={exportWorkspace}>
                <Download className="h-4 w-4" />
                Export workspace JSON
              </Button>
              <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={importWorkspaceFile} />
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Import workspace JSON
              </Button>
              <Button type="button" variant="secondary" onClick={resetWorkspace}>
                <RotateCcw className="h-4 w-4" />
                Reset local workspace
              </Button>
              {importStatus ? <p className="text-sm leading-6 text-neutral-400">{importStatus}</p> : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ToolList title="Favorite tools" icon={<Heart className="h-5 w-5 text-lime-200" />} tools={favoriteTools} empty="Favorite tools from cards to keep them here." />
        <ToolList title="Recently viewed" icon={<Sparkles className="h-5 w-5 text-sky-200" />} tools={recentTools} empty="Open a few profiles and they will appear here." />
      </section>
    </div>
  );
}

function OnboardingCard({
  initial,
  onComplete,
}: {
  initial: ReturnType<typeof useProductivityHubStore>["state"]["onboarding"];
  onComplete: ReturnType<typeof useProductivityHubStore>["saveOnboarding"];
}) {
  const [role, setRole] = useState(initial?.role ?? "Founder");
  const [teamMode, setTeamMode] = useState(initial?.teamMode ?? "Mostly alone");
  const [toolPreference, setToolPreference] = useState(initial?.toolPreference ?? "Balanced");
  const [priority, setPriority] = useState(initial?.priority ?? "Clarity");
  const [currentTools, setCurrentTools] = useState<string[]>(initial?.currentTools ?? ["notion"]);

  function toggleTool(toolId: string) {
    setCurrentTools((items) => (items.includes(toolId) ? items.filter((id) => id !== toolId) : [...items, toolId]).slice(0, 6));
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[linear-gradient(135deg,rgba(190,242,100,0.16),rgba(56,189,248,0.1))]">
        <h2 className="text-2xl font-semibold text-white">Set up your productivity profile</h2>
        <p className="text-sm leading-6 text-neutral-300">This stays on your device and makes the dashboard, quiz context, and recommendations more useful.</p>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <Segmented label="Role" value={role} options={["Founder", "Student", "Creator", "Developer", "Manager", "Freelancer"]} onChange={setRole} />
        <Segmented label="Work style" value={teamMode} options={["Mostly alone", "Small team", "Large team"]} onChange={setTeamMode} />
        <Segmented label="Tool taste" value={toolPreference} options={["Simple tools", "Balanced", "Powerful systems"]} onChange={setToolPreference} />
        <Segmented label="Priority" value={priority} options={["Clarity", "Focus", "Collaboration", "Knowledge", "Execution"]} onChange={setPriority} />
        <div>
          <p className="text-sm font-semibold text-white">Current tools</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {productivityTools.slice(0, 14).map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => toggleTool(tool.id)}
                className={currentTools.includes(tool.id) ? "rounded-md border border-lime-200/40 bg-lime-200/15 px-3 py-2 text-sm text-lime-100" : "rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/[0.07]"}
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>
        <Button type="button" onClick={() => onComplete({ role, teamMode, toolPreference, priority, currentTools })}>
          Save profile
        </Button>
      </CardContent>
    </Card>
  );
}

function Segmented({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={value === option ? "rounded-md border border-lime-200/40 bg-lime-200/15 px-3 py-2 text-sm text-lime-100" : "rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/[0.07]"}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function getPersonalizedTools(profile: ReturnType<typeof useProductivityHubStore>["state"]["onboarding"]) {
  if (!profile) return productivityTools.slice(0, 3);

  return [...productivityTools]
    .sort((a, b) => scorePersonalTool(b, profile) - scorePersonalTool(a, profile))
    .slice(0, 3);
}

function scorePersonalTool(tool: ProductivityTool, profile: NonNullable<ReturnType<typeof useProductivityHubStore>["state"]["onboarding"]>) {
  let score = tool.mainAppScore + tool.integrationsScore;
  if (tool.bestFor.some((item) => item.toLowerCase().includes(profile.role.toLowerCase().split(" ")[0]))) score += 8;
  if (profile.teamMode !== "Mostly alone") score += tool.collaborationScore;
  if (profile.toolPreference === "Simple tools") score += tool.simplicityScore;
  if (profile.toolPreference === "Powerful systems") score += tool.powerScore;
  if (profile.priority === "Focus") score += tool.categories.includes("Focus") ? 10 : tool.taskScore;
  if (profile.priority === "Collaboration") score += tool.collaborationScore * 2;
  if (profile.priority === "Knowledge") score += tool.knowledgeScore * 2;
  if (profile.priority === "Execution") score += tool.taskScore * 2;
  if (profile.currentTools.includes(tool.id)) score += 4;
  return score;
}

function Metric({ title, value, detail }: { title: string; value: number; detail: string }) {
  return (
    <Card>
      <CardHeader>
        <p className="text-sm text-neutral-400">{title}</p>
        <div className="text-3xl font-semibold text-white">{value}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-neutral-400">{detail}</p>
      </CardContent>
    </Card>
  );
}

function Empty({ title, body, href, label, compact = false }: { title: string; body: string; href: string; label: string; compact?: boolean }) {
  return (
    <div className={compact ? "rounded-lg border border-dashed border-white/15 p-4" : "rounded-lg border border-dashed border-white/15 p-8 text-center"}>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p>
      <ButtonLink href={href} variant="secondary" className="mt-4">
        {label}
      </ButtonLink>
    </div>
  );
}

function isTool(tool: ProductivityTool | undefined): tool is ProductivityTool {
  return Boolean(tool);
}

function ToolList({ title, icon, tools, empty }: { title: string; icon: ReactNode; tools: ProductivityTool[]; empty: string }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          {icon}
          {title}
        </h2>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.id} href={`/tools/${tool.id}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]">
            <ToolLogo name={tool.name} className="h-9 w-9" />
            <h3 className="mt-3 font-semibold text-white">{tool.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-400">{tool.tagline}</p>
          </Link>
        ))}
        {tools.length === 0 && <p className="text-sm text-neutral-400">{empty}</p>}
      </CardContent>
    </Card>
  );
}
