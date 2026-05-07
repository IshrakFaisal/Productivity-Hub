"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { productivityTools, type ProductivityTool } from "@/data/productivityTools";
import { cn } from "@/lib/utils";

const questions = [
  { id: "role", label: "What best describes you?", options: ["Student", "Founder", "Creator", "Developer", "Manager", "Freelancer", "Team member"] },
  { id: "system", label: "Simple tools or powerful all-in-one systems?", options: ["Simple tools", "Powerful all-in-one", "Balanced"] },
  { id: "team", label: "Do you mostly work alone or with a team?", options: ["Mostly alone", "Small team", "Large team"] },
  { id: "need", label: "What do you need most?", options: ["Notes", "Tasks", "Calendar", "Docs", "Projects", "Focus", "Collaboration"] },
  { id: "view", label: "What interface feels natural?", options: ["Boards", "Lists", "Databases", "Plain text", "Calendar views", "Dashboards"] },
  { id: "stack", label: "One app for everything or focused tools?", options: ["One app for everything", "Multiple focused tools", "Home base plus support tools"] },
  { id: "setup", label: "How much setup are you willing to do?", options: ["Almost none", "Some setup", "I like building systems"] },
] as const;

type Answers = Record<string, string>;

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const complete = step >= questions.length;
  const question = questions[Math.min(step, questions.length - 1)];
  const progress = Math.round((Math.min(step, questions.length) / questions.length) * 100);
  const result = useMemo(() => recommend(answers), [answers]);

  function answer(value: string) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setTimeout(() => setStep((current) => Math.min(questions.length, current + 1)), 120);
  }

  if (complete) {
    return <QuizResults result={result} answers={answers} onBack={() => setStep(questions.length - 1)} onRestart={() => { setAnswers({}); setStep(0); }} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 text-sm text-neutral-400">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-lime-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <h2 className="text-3xl font-semibold tracking-tight text-white">{question.label}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => answer(option)}
                className={cn(
                  "min-h-20 rounded-lg border border-white/10 bg-white/[0.045] p-4 text-left text-base font-medium text-neutral-100 transition hover:-translate-y-0.5 hover:border-lime-200/40 hover:bg-lime-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-200",
                  answers[question.id] === option && "border-lime-200/50 bg-lime-200/15",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep((current) => Math.min(questions.length, current + 1))}>
              Skip
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function recommend(answers: Answers) {
  const scored = productivityTools
    .map((tool) => ({ tool, score: scoreTool(tool, answers) }))
    .sort((a, b) => b.score - a.score);
  const homeBase = scored[0]?.tool ?? productivityTools[0];
  const supporting = scored
    .map((item) => item.tool)
    .filter((tool) => tool.id !== homeBase.id && (tool.taskScore >= 7 || tool.calendarScore >= 7 || tool.collaborationScore >= 8 || tool.integrationsScore >= 8))
    .slice(0, answers.stack === "One app for everything" ? 2 : 3);
  const alternativeHome = scored.find((item) => item.tool.id !== homeBase.id && item.tool.mainAppScore >= 7)?.tool ?? scored[1].tool;
  return { homeBase, supporting, alternativeHome };
}

function scoreTool(tool: ProductivityTool, answers: Answers) {
  let score = tool.mainAppScore * 3 + tool.integrationsScore + tool.powerScore;
  if (tool.bestFor.some((item) => item.toLowerCase().includes((answers.role ?? "").toLowerCase().split(" ")[0]))) score += 14;
  if (answers.system === "Simple tools") score += tool.simplicityScore * 2 - tool.powerScore;
  if (answers.system === "Powerful all-in-one") score += tool.powerScore * 2 + tool.mainAppScore;
  if (answers.system === "Balanced") score += tool.simplicityScore + tool.powerScore;
  if (answers.team === "Mostly alone") score += tool.collaborationScore <= 5 ? 8 : 2;
  if (answers.team === "Small team") score += tool.collaborationScore;
  if (answers.team === "Large team") score += tool.collaborationScore * 2;
  if (answers.need === "Notes") score += tool.notesScore * 2;
  if (answers.need === "Tasks") score += tool.taskScore * 2;
  if (answers.need === "Calendar") score += tool.calendarScore * 2;
  if (answers.need === "Docs") score += tool.notesScore + tool.knowledgeScore;
  if (answers.need === "Projects") score += tool.categories.includes("Projects") ? 14 : 0;
  if (answers.need === "Focus") score += tool.categories.includes("Focus") ? 16 : 0;
  if (answers.need === "Collaboration") score += tool.collaborationScore * 2;
  if (answers.view === "Boards" && ["Trello", "Asana", "ClickUp"].includes(tool.name)) score += 12;
  if (answers.view === "Lists" && ["Todoist", "TickTick", "Things 3"].includes(tool.name)) score += 12;
  if (answers.view === "Databases" && ["Notion", "Airtable", "Coda"].includes(tool.name)) score += 12;
  if (answers.view === "Plain text" && ["Obsidian", "Apple Notes"].includes(tool.name)) score += 12;
  if (answers.view === "Calendar views") score += tool.calendarScore * 1.5;
  if (answers.stack === "One app for everything") score += tool.mainAppScore * 2;
  if (answers.setup === "Almost none") score += tool.simplicityScore * 1.6;
  if (answers.setup === "I like building systems") score += tool.powerScore * 1.5 + tool.knowledgeScore;
  return score;
}

function QuizResults({ result, answers, onBack, onRestart }: { result: ReturnType<typeof recommend>; answers: Answers; onBack: () => void; onRestart: () => void }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="overflow-hidden">
        <CardHeader className="bg-[linear-gradient(135deg,rgba(190,242,100,0.16),rgba(56,189,248,0.1))]">
          <div className="flex items-center gap-2 text-sm font-medium text-lime-100">
            <Sparkles className="h-4 w-4" />
            Your recommended stack
          </div>
          <div className="mt-4 flex items-center gap-4">
            <ToolLogo name={result.homeBase.name} className="h-14 w-14" />
            <div>
              <h2 className="text-3xl font-semibold text-white">{result.homeBase.name}</h2>
              <p className="mt-1 text-neutral-300">Best home base app</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <p className="text-lg leading-8 text-neutral-300">
            Your best home base is <span className="font-semibold text-white">{result.homeBase.name}</span>. Pair it with{" "}
            <span className="font-semibold text-white">{result.supporting.map((tool) => tool.name).join(", ")}</span> for the parts of work where a focused app will feel lighter.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {[result.homeBase, ...result.supporting].map((tool) => (
              <div key={tool.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <ToolLogo name={tool.name} className="h-9 w-9" />
                <h3 className="mt-3 font-semibold text-white">{tool.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-400">{tool.tagline}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Insight title="Why it fits" items={[`${result.homeBase.name} matches your strongest preference signals.`, "The support apps cover gaps without duplicating every workflow.", "The stack keeps one home base instead of spreading context everywhere."]} />
            <Insight title="Potential downsides" items={result.homeBase.weaknesses.slice(0, 3)} />
            <Insight title="Setup advice" items={["Give each app one job before importing old data.", "Start with one dashboard or inbox, then add automations later.", "Review overlap after two weeks of real use."]} />
            <Insight title="Alternative stack" items={[`Try ${result.alternativeHome.name} as the home base.`, `Pair with ${result.alternativeHome.suggestedPairings.slice(0, 2).join(" and ")}.`, "Better if you want a different balance of structure and simplicity."]} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onBack} variant="secondary"><ArrowLeft className="h-4 w-4" />Revise answers</Button>
            <Button onClick={onRestart} variant="ghost">Start over</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="h-fit">
        <CardHeader>
          <h3 className="font-semibold text-white">Your inputs</h3>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.values(answers).map((answer) => (
            <Badge key={answer}>{answer}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Insight({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-400">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-lime-200" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
