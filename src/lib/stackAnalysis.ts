import { type ProductivityTool } from "../data/productivityTools";

export const stackCoverageCategories = ["Notes", "Tasks", "Calendar", "Docs", "Projects", "Collaboration"];

export type StackAnalysisMessage = {
  type: "warning" | "good";
  text: string;
};

export type StackAnalysis = {
  categoryCounts: Record<string, number>;
  coverageScore: number;
  homeBase?: ProductivityTool;
  messages: StackAnalysisMessage[];
  score: number;
  simplicityScore: number;
  teamScore: number;
};

export function analyzeProductivityStack(tools: ProductivityTool[]): StackAnalysis {
  const categoryCounts = tools.reduce<Record<string, number>>((counts, tool) => {
    tool.categories.forEach((category) => {
      counts[category] = (counts[category] ?? 0) + 1;
    });
    return counts;
  }, {});
  const homeBase = [...tools].sort((a, b) => b.mainAppScore - a.mainAppScore)[0];
  const missing = stackCoverageCategories.filter((category) => !categoryCounts[category]);
  const overlap = Object.entries(categoryCounts).filter(([, count]) => count >= 3);
  const average = (key: "simplicityScore" | "collaborationScore") => Math.round(tools.reduce((sum, tool) => sum + tool[key], 0) / Math.max(1, tools.length));
  const coverageScore = Math.round(((stackCoverageCategories.length - missing.length) / stackCoverageCategories.length) * 10);
  const simplicityScore = Math.max(1, Math.min(10, average("simplicityScore") - Math.max(0, tools.length - 4)));
  const teamScore = Math.max(1, average("collaborationScore"));
  const score = Math.max(1, Math.min(99, Math.round(coverageScore * 6 + simplicityScore * 2 + teamScore * 2 - overlap.length * 4)));
  const messages: StackAnalysisMessage[] = [];

  if (overlap.some(([category]) => category === "Tasks")) messages.push({ type: "warning", text: "You have 3 task apps. Consider simplifying capture and execution." });
  if (!categoryCounts.Calendar) messages.push({ type: "warning", text: "You do not have a calendar app. Add scheduling coverage for time-based work." });
  if (teamScore < 6) messages.push({ type: "warning", text: "This stack is strong for solo work but weak for team collaboration." });
  if (tools.length > 4) messages.push({ type: "warning", text: "This is a powerful but high-maintenance setup. Make every app earn its place." });
  if (homeBase) messages.push({ type: "good", text: `${homeBase.name} is the clearest productivity home base in this stack.` });
  if (coverageScore >= 8) messages.push({ type: "good", text: "Core coverage is healthy across notes, tasks, calendar, docs, and projects." });
  if (messages.length === 0) messages.push({ type: "warning", text: "Select a few tools to see stack guidance." });

  return { categoryCounts, coverageScore, homeBase, messages, score, simplicityScore, teamScore };
}
