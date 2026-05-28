"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Save, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToolLogo } from "@/components/ToolLogo";
import { recommendProductivityStack, type QuizAnswers, type QuizRecommendation } from "@/lib/quizRecommendation";
import { downloadTextFile, useProductivityHubStore } from "@/lib/productivityStore";
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

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const complete = step >= questions.length;
  const question = questions[Math.min(step, questions.length - 1)];
  const progress = Math.round((Math.min(step, questions.length) / questions.length) * 100);
  const result = useMemo(() => recommendProductivityStack(answers), [answers]);

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

function QuizResults({ result, answers, onBack, onRestart }: { result: QuizRecommendation; answers: QuizAnswers; onBack: () => void; onRestart: () => void }) {
  const [saved, setSaved] = useState(false);
  const { saveQuizResult, saveStack } = useProductivityHubStore();

  function saveResult() {
    saveQuizResult({
      homeBaseId: result.homeBase.id,
      supportIds: result.supporting.map((tool) => tool.id),
      answers,
    });
    saveStack({
      name: `${result.homeBase.name} recommended stack`,
      toolIds: [result.homeBase.id, ...result.supporting.map((tool) => tool.id)],
      score: result.confidence,
      notes: `Quiz recommendation based on ${Object.values(answers).join(", ")}`,
    });
    setSaved(true);
  }

  function exportResult() {
    const report = [
      "Productivity Hub quiz recommendation",
      `Home base: ${result.homeBase.name}`,
      `Supporting apps: ${result.supporting.map((tool) => tool.name).join(", ")}`,
      `Confidence: ${result.confidence}%`,
      `One app vs stack: ${result.stackDecision}`,
      `Alternative home base: ${result.alternativeHome.name}`,
      "",
      "Answers:",
      ...Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`),
      "",
      "Why it won:",
      ...result.winnerReasons.map((reason) => `- ${reason}`),
      "",
      "Watch-outs:",
      ...result.mismatchWarnings.map((warning) => `- ${warning}`),
    ].join("\n");

    downloadTextFile(`productivity-quiz-result-${new Date().toISOString().slice(0, 10)}.txt`, report);
  }

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
          <div className="grid gap-3 md:grid-cols-[220px_1fr]">
            <div className="rounded-lg border border-lime-200/20 bg-lime-200/10 p-4">
              <p className="text-sm text-lime-100/80">Recommendation confidence</p>
              <div className="mt-2 text-4xl font-semibold text-lime-100">{result.confidence}%</div>
              <div className="mt-3 h-2 rounded-full bg-black/30">
                <div className="h-2 rounded-full bg-lime-300" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-white">One app vs stack verdict</p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">{result.stackDecision}</p>
            </div>
          </div>
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
            <Insight title="Why it won" items={result.winnerReasons} />
            <Insight title="Mismatch warnings" items={result.mismatchWarnings} />
            <Insight title="Setup advice" items={["Give each app one job before importing old data.", "Start with one dashboard or inbox, then add automations later.", "Review overlap after two weeks of real use."]} />
            <Insight title="Alternative stack" items={[`Try ${result.alternativeHome.name} as the home base.`, `Pair with ${result.alternativeHome.suggestedPairings.slice(0, 2).join(" and ")}.`, "Better if you want a different balance of structure and simplicity."]} />
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h3 className="font-semibold text-white">Why the runner-ups lost</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {result.runnerUps.map((runner) => (
                <div key={runner.tool.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ToolLogo name={runner.tool.name} className="h-8 w-8" />
                      <span className="font-medium text-white">{runner.tool.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-400">{Math.round(runner.score)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">{runner.lostBecause}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={saveResult}>
              <Save className="h-4 w-4" />
              {saved ? "Saved" : "Save result"}
            </Button>
            <Button type="button" variant="secondary" onClick={exportResult}>
              <Download className="h-4 w-4" />
              Export
            </Button>
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
