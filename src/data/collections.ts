import { productivityTools } from "@/data/productivityTools";
import { stackTemplates, type StackTemplate } from "@/data/stackTemplates";
import { analyzeProductivityStack } from "@/lib/stackAnalysis";

export type CollectionDetail = {
  outcome: string;
  rhythm: string[];
  setupSteps: string[];
  bestWhen: string[];
  avoidWhen: string[];
  upgradePath: string;
};

export type TemplateCollection = StackTemplate &
  CollectionDetail & {
    score: number;
    homeBaseId?: string;
    coverage: string[];
  };

const collectionDetails: Record<string, CollectionDetail> = {
  "minimal-solo": {
    outcome: "A calm personal operating system that keeps capture, planning, docs, and scheduling separated without creating a busy stack.",
    rhythm: ["Capture tasks in Todoist", "Plan projects and reference notes in Notion", "Keep events and shared files in Google Workspace"],
    setupSteps: ["Create a Notion dashboard with Projects, Areas, and Resources", "Connect Todoist to calendar visibility", "Add a weekly review checklist for loose notes and files"],
    bestWhen: ["You work mostly alone", "You want fewer decisions every morning", "You need a practical starter stack"],
    avoidWhen: ["You need deep team reporting", "You want every workflow inside one native app"],
    upgradePath: "Add Slack or Linear only when collaboration or product work becomes a real daily lane.",
  },
  "student-research": {
    outcome: "A durable study stack for lectures, research notes, deadlines, and group documents without subscription-heavy tooling.",
    rhythm: ["Write durable notes in Obsidian", "Track deadlines and recurring study blocks in TickTick", "Collaborate on files and schedules in Google Workspace"],
    setupSteps: ["Create folders for classes, papers, and permanent notes", "Add every syllabus deadline as a TickTick project", "Use one shared Google Drive folder per group project"],
    bestWhen: ["You need offline notes", "You are juggling classes and deadlines", "You want low-cost tools"],
    avoidWhen: ["You want a fully visual dashboard", "You dislike maintaining a note system"],
    upgradePath: "Add Notion or Craft later if you need prettier publishing or group knowledge bases.",
  },
  "founder-command-center": {
    outcome: "A high-leverage operating system for strategy, product execution, communication, and calendar-led focus.",
    rhythm: ["Keep strategy, metrics, and operating docs in Notion", "Run product execution in Linear", "Route team communication through Slack", "Plan days in Akiflow"],
    setupSteps: ["Define which decisions belong in Notion versus Slack", "Create Linear teams and cycles before importing tasks", "Block founder focus windows in Akiflow"],
    bestWhen: ["You need fast context switching", "You manage product and operations", "You accept some setup complexity"],
    avoidWhen: ["Your team does not maintain documentation", "You need a low-maintenance personal stack"],
    upgradePath: "Add Airtable or Coda only if operations data outgrows Notion databases.",
  },
  "software-team": {
    outcome: "A clean product team workspace with separate lanes for issues, docs, communication, and office collaboration.",
    rhythm: ["Run product work in Linear", "Discuss decisions in Slack", "Write specs and team docs in Notion", "Handle meetings and shared files in Google Workspace"],
    setupSteps: ["Create one Linear workflow for product delivery", "Link specs from Notion into Linear issues", "Define Slack channels for decision-making versus alerts"],
    bestWhen: ["You build software with a team", "You want fast issue tracking", "You need clear docs beside execution"],
    avoidWhen: ["You need client-facing project portals", "Your work is not issue-driven"],
    upgradePath: "Add Coda or Airtable for heavier cross-functional planning and reporting.",
  },
  "agency-operations": {
    outcome: "A collaborative delivery stack for agencies that need accountability, client-ready docs, communication, and structured tracking.",
    rhythm: ["Track client work in Asana", "Keep fast communication in Slack", "Use Google Workspace for files and meetings", "Model pipelines and retainers in Airtable"],
    setupSteps: ["Create standard Asana project templates", "Build an Airtable base for clients, deliverables, and reporting", "Set Slack channel naming rules for client work"],
    bestWhen: ["You manage multiple clients", "You need repeatable delivery", "You work with internal and external collaborators"],
    avoidWhen: ["You are a solo creator", "You dislike process-heavy tools"],
    upgradePath: "Add Superhuman or Motion when inbox and scheduling become bottlenecks.",
  },
  "apple-personal": {
    outcome: "A quiet Apple-first personal stack for tasks, notes, writing, and offline-first daily planning.",
    rhythm: ["Run execution through Things 3", "Write polished notes and docs in Craft", "Capture quick thoughts in Apple Notes"],
    setupSteps: ["Create Things 3 areas for work, personal, and recurring routines", "Use Craft spaces for active writing projects", "Keep Apple Notes as the fast inbox, not the archive"],
    bestWhen: ["You live on Apple devices", "You value elegance over team features", "You want low friction"],
    avoidWhen: ["You need Windows or Android support", "You collaborate deeply with a team"],
    upgradePath: "Add Amie for calendar planning or Notion if collaboration becomes important.",
  },
  "enterprise-suite": {
    outcome: "A suite-first company setup for organizations that need admin controls, documents, calendar, and structured project accountability.",
    rhythm: ["Use Microsoft 365 for mail, meetings, and files", "Run project accountability in Asana", "Keep fast cross-team updates in Slack"],
    setupSteps: ["Define Microsoft 365 folder ownership", "Create Asana portfolios for team-level visibility", "Separate Slack decisions from Microsoft file storage"],
    bestWhen: ["You work in a company environment", "Admin controls matter", "People already live in Office files"],
    avoidWhen: ["You want a lightweight solo setup", "Your team resists formal process"],
    upgradePath: "Add Airtable or Coda for operational databases that spreadsheets cannot safely manage.",
  },
  "creator-studio": {
    outcome: "A polished creation stack for drafting, planning, idea capture, and publishing-adjacent personal knowledge.",
    rhythm: ["Draft and publish from Craft", "Drive execution through Todoist", "Plan scheduling in Amie", "Develop reusable ideas in Capacities"],
    setupSteps: ["Create content pipelines in Todoist", "Use Craft for final drafts and shareable docs", "Create Capacities objects for people, topics, and references"],
    bestWhen: ["You create written or media work", "You want beautiful writing surfaces", "You need both idea capture and execution"],
    avoidWhen: ["You need advanced team project management", "You want one app for every workflow"],
    upgradePath: "Add Airtable for sponsorships, production calendars, or lightweight CRM workflows.",
  },
};

export const templateCollections: TemplateCollection[] = stackTemplates.map((template) => {
  const tools = productivityTools.filter((tool) => template.toolIds.includes(tool.id));
  const analysis = analyzeProductivityStack(tools);

  return {
    ...template,
    ...collectionDetails[template.id],
    score: analysis.score,
    homeBaseId: analysis.homeBase?.id,
    coverage: Object.entries(analysis.categoryCounts)
      .filter(([, count]) => count > 0)
      .map(([category]) => category)
      .slice(0, 6),
  };
});

export function getTemplateCollectionById(id: string) {
  return templateCollections.find((collection) => collection.id === id);
}
