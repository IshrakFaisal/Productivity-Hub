import { productivityTools, type ProductivityTool } from "../data/productivityTools";

export type QuizAnswers = Record<string, string>;

export type QuizRecommendation = {
  homeBase: ProductivityTool;
  supporting: ProductivityTool[];
  alternativeHome: ProductivityTool;
  confidence: number;
  stackDecision: string;
  winnerReasons: string[];
  mismatchWarnings: string[];
  runnerUps: {
    tool: ProductivityTool;
    score: number;
    lostBecause: string;
  }[];
};

export function recommendProductivityStack(answers: QuizAnswers): QuizRecommendation {
  const scored = productivityTools
    .map((tool) => scoreTool(tool, answers))
    .sort((a, b) => b.score - a.score);
  const homeBase = scored[0]?.tool ?? productivityTools[0];
  const supporting = scored
    .map((item) => item.tool)
    .filter((tool) => tool.id !== homeBase.id && (tool.taskScore >= 7 || tool.calendarScore >= 7 || tool.collaborationScore >= 8 || tool.integrationsScore >= 8))
    .slice(0, answers.stack === "One app for everything" ? 2 : 3);
  const alternativeHome = scored.find((item) => item.tool.id !== homeBase.id && item.tool.mainAppScore >= 7)?.tool ?? scored[1].tool;
  const winner = scored[0];
  const runnerUps = scored.slice(1, 4).map((item) => ({
    tool: item.tool,
    score: item.score,
    lostBecause: explainLoss(item.tool, homeBase, answers),
  }));
  const gap = Math.max(0, (scored[0]?.score ?? 0) - (scored[1]?.score ?? 0));
  const confidence = Math.max(58, Math.min(96, Math.round(64 + gap / 2 + Object.keys(answers).length * 3)));
  const stackDecision = getStackDecision(homeBase, supporting, answers);
  const mismatchWarnings = getMismatchWarnings(homeBase, supporting, answers);

  return {
    homeBase,
    supporting,
    alternativeHome,
    confidence,
    stackDecision,
    winnerReasons: winner?.reasons.slice(0, 5) ?? [],
    mismatchWarnings,
    runnerUps,
  };
}

export function scoreTool(tool: ProductivityTool, answers: QuizAnswers) {
  let score = tool.mainAppScore * 3 + tool.integrationsScore + tool.powerScore;
  const reasons = [
    `${tool.name} starts strong with a ${tool.mainAppScore}/10 home-base score and ${tool.integrationsScore}/10 integrations.`,
  ];

  function add(points: number, reason: string) {
    if (points <= 0) return;
    score += points;
    reasons.push(reason);
  }

  const roleSignal = (answers.role ?? "").toLowerCase().split(" ")[0];
  add(roleSignal && tool.bestFor.some((item) => item.toLowerCase().includes(roleSignal)) ? 14 : 0, `It is explicitly strong for ${answers.role?.toLowerCase()} workflows.`);
  add(answers.system === "Simple tools" ? tool.simplicityScore * 2 - tool.powerScore : 0, `You preferred simple tools, and ${tool.name} scores ${tool.simplicityScore}/10 for simplicity.`);
  add(answers.system === "Powerful all-in-one" ? tool.powerScore * 2 + tool.mainAppScore : 0, `You preferred a powerful system, and ${tool.name} has ${tool.powerScore}/10 power.`);
  add(answers.system === "Balanced" ? tool.simplicityScore + tool.powerScore : 0, "It balances simplicity and power better than most options.");
  add(answers.team === "Mostly alone" ? (tool.collaborationScore <= 5 ? 8 : 2) : 0, "It fits a solo-leaning workflow without forcing team process.");
  add(answers.team === "Small team" ? tool.collaborationScore : 0, "Its collaboration score supports small-team use.");
  add(answers.team === "Large team" ? tool.collaborationScore * 2 : 0, `Large-team work needs collaboration strength, where it scores ${tool.collaborationScore}/10.`);
  add(answers.need === "Notes" ? tool.notesScore * 2 : 0, `Notes were your priority, and it scores ${tool.notesScore}/10 there.`);
  add(answers.need === "Tasks" ? tool.taskScore * 2 : 0, `Tasks were your priority, and it scores ${tool.taskScore}/10 there.`);
  add(answers.need === "Calendar" ? tool.calendarScore * 2 : 0, `Calendar was your priority, and it scores ${tool.calendarScore}/10 there.`);
  add(answers.need === "Docs" ? tool.notesScore + tool.knowledgeScore : 0, "Docs need writing plus knowledge structure, both of which it can support.");
  add(answers.need === "Projects" && tool.categories.includes("Projects") ? 14 : 0, "It has a real project-management lane.");
  add(answers.need === "Focus" && tool.categories.includes("Focus") ? 16 : 0, "It is built for focus and daily planning.");
  add(answers.need === "Collaboration" ? tool.collaborationScore * 2 : 0, `Collaboration was your priority, and it scores ${tool.collaborationScore}/10 there.`);
  add(answers.view === "Boards" && ["Trello", "Asana", "ClickUp"].includes(tool.name) ? 12 : 0, "Its interface matches your preference for boards.");
  add(answers.view === "Lists" && ["Todoist", "TickTick", "Things 3"].includes(tool.name) ? 12 : 0, "Its interface matches your preference for lists.");
  add(answers.view === "Databases" && ["Notion", "Airtable", "Coda"].includes(tool.name) ? 12 : 0, "Its interface matches your preference for databases.");
  add(answers.view === "Plain text" && ["Obsidian", "Apple Notes"].includes(tool.name) ? 12 : 0, "Its interface matches your preference for plain text.");
  add(answers.view === "Calendar views" ? tool.calendarScore * 1.5 : 0, `Calendar views matter to you, and it scores ${tool.calendarScore}/10 for calendar support.`);
  add(answers.stack === "One app for everything" ? tool.mainAppScore * 2 : 0, "You asked for one app, so main-app potential mattered heavily.");
  add(answers.setup === "Almost none" ? tool.simplicityScore * 1.6 : 0, "You want low setup, so simplicity helped its score.");
  add(answers.setup === "I like building systems" ? tool.powerScore * 1.5 + tool.knowledgeScore : 0, "You are willing to build a system, so power and knowledge structure mattered.");

  return { tool, score, reasons };
}

function getStackDecision(homeBase: ProductivityTool, supporting: ProductivityTool[], answers: QuizAnswers) {
  if (answers.stack === "One app for everything" && homeBase.mainAppScore >= 8 && supporting.length <= 2) {
    return `Start with ${homeBase.name} as the center. Add only narrow support apps where the score gaps are obvious.`;
  }

  if (answers.stack === "Multiple focused tools") {
    return `Use a focused stack. Let ${homeBase.name} hold the system map, but give tasks, calendar, or communication their own clear lane.`;
  }

  return `Use a home-base-plus-support model. ${homeBase.name} should hold context, while ${supporting.map((tool) => tool.name).join(", ")} cover sharper jobs.`;
}

function getMismatchWarnings(homeBase: ProductivityTool, supporting: ProductivityTool[], answers: QuizAnswers) {
  const warnings = [...homeBase.weaknesses.slice(0, 2)];

  if (answers.need === "Calendar" && homeBase.calendarScore < 7) {
    warnings.unshift(`${homeBase.name} is not calendar-native enough to schedule your whole week by itself.`);
  }
  if (answers.need === "Tasks" && homeBase.taskScore < 7) {
    warnings.unshift(`${homeBase.name} may need a dedicated task app for execution.`);
  }
  if (answers.team !== "Mostly alone" && homeBase.collaborationScore < 7) {
    warnings.unshift(`${homeBase.name} may be weak for team coordination.`);
  }
  if (supporting.length >= 3 && answers.setup === "Almost none") {
    warnings.unshift("This recommendation adds several support apps even though you prefer low setup.");
  }

  return Array.from(new Set(warnings)).slice(0, 4);
}

function explainLoss(tool: ProductivityTool, winner: ProductivityTool, answers: QuizAnswers) {
  if (answers.need === "Tasks" && tool.taskScore < winner.taskScore) return `${winner.name} won because it covered the broader system while keeping task support acceptable.`;
  if (answers.need === "Calendar" && tool.calendarScore < winner.calendarScore) return `${winner.name} matched your calendar needs more directly.`;
  if (answers.team !== "Mostly alone" && tool.collaborationScore < winner.collaborationScore) return `${winner.name} is stronger for collaboration.`;
  if (tool.mainAppScore < winner.mainAppScore) return `${winner.name} has a higher home-base score.`;
  return `${winner.name} had a better combined fit across your answers.`;
}
