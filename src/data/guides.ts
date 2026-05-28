import { getToolById, type ProductivityTool } from "@/data/productivityTools";

export type GuideToolMention = {
  toolId: string;
  label: string;
  note: string;
};

export type GuideComparisonRow = {
  toolId: string;
  bestFor: string;
  tradeoff: string;
  score: string;
};

export type GuideSection = {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
  tools?: GuideToolMention[];
  comparison?: GuideComparisonRow[];
};

export type Guide = {
  slug: string;
  title: string;
  deck: string;
  description: string;
  readTime: string;
  category: string;
  heroTools: string[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "best-notion-alternatives",
    title: "Best Notion Alternatives",
    deck: "When flexibility turns into upkeep, these are the apps worth considering.",
    description: "A practical guide to Coda, Anytype, Obsidian, Craft, Airtable, Capacities, and Microsoft 365 for people who like Notion's ambition but need a different center of gravity.",
    readTime: "8 min read",
    category: "Alternatives",
    heroTools: ["coda", "anytype", "obsidian", "craft"],
    primaryCta: { label: "Compare alternatives", href: "/compare?apps=notion,coda,anytype,obsidian" },
    secondaryCta: { label: "Take the quiz", href: "/quiz" },
    sections: [
      {
        id: "when-notion-is-wrong",
        title: "When Notion is not the right fit",
        body: "Notion is excellent when you want flexible docs, databases, and lightweight systems in one place. It starts to strain when your work needs stronger offline access, stricter structure, native calendar execution, or less system design.",
        bullets: [
          "You keep rebuilding dashboards instead of using them.",
          "Your team needs stronger project rules than flexible pages provide.",
          "You need local-first notes or offline work as a core requirement.",
          "You want a polished writing app instead of a blank canvas.",
        ],
      },
      {
        id: "best-overall",
        title: "Best overall alternative",
        body: "Coda is the closest Notion alternative for teams that still want docs, tables, formulas, buttons, and lightweight internal apps. It feels more opinionated and operational than Notion, which can be a benefit when workflows need to do something, not just document something.",
        tools: [{ toolId: "coda", label: "Best overall", note: "Stronger for doc-app workflows, buttons, formulas, and team operations." }],
      },
      {
        id: "local-first",
        title: "Best local-first alternative",
        body: "Anytype and Obsidian are the strongest options when data ownership and offline access matter. Anytype feels more visual and object-based, while Obsidian is sharper for markdown notes, backlinks, and personal knowledge systems.",
        tools: [
          { toolId: "anytype", label: "Private workspace", note: "Local-first object workspace for notes, databases, and personal knowledge." },
          { toolId: "obsidian", label: "Markdown knowledge base", note: "Best for local files, backlinks, plugins, and deep personal systems." },
        ],
      },
      {
        id: "specific-picks",
        title: "Best alternatives by job",
        body: "The best Notion replacement depends on which part of Notion you rely on most. Databases, writing, team documents, and personal knowledge each point to different tools.",
        tools: [
          { toolId: "airtable", label: "Best for databases", note: "Use Airtable when structured records, interfaces, and operational tracking matter more than docs." },
          { toolId: "craft", label: "Best for writers", note: "Use Craft when polished documents and low-friction writing matter more than database depth." },
          { toolId: "microsoft-365", label: "Best for teams", note: "Use Microsoft 365 when enterprise controls, Office files, Teams, and Outlook shape the workday." },
        ],
      },
      {
        id: "stay-with-notion",
        title: "Who should stay with Notion",
        body: "Stay with Notion if your real problem is system design, not product fit. If your team already uses it daily, your docs and databases are healthy, and you only need a better task or calendar lane, pairing Notion is smarter than migrating.",
        tools: [{ toolId: "notion", label: "Stay if it is already your home base", note: "Pair it with a dedicated task manager or calendar planner before replacing it." }],
      },
      {
        id: "quick-table",
        title: "Quick comparison table",
        body: "Use this scan when you know the reason Notion is failing.",
        comparison: [
          { toolId: "coda", bestFor: "Operational docs and internal apps", tradeoff: "More learning curve than simple docs", score: "Best overall" },
          { toolId: "anytype", bestFor: "Private local-first personal systems", tradeoff: "Smaller collaboration ecosystem", score: "Best privacy" },
          { toolId: "obsidian", bestFor: "Markdown notes and research", tradeoff: "Weak native collaboration", score: "Best knowledge" },
          { toolId: "airtable", bestFor: "Databases and tracking", tradeoff: "Not ideal for long-form docs", score: "Best data" },
          { toolId: "craft", bestFor: "Beautiful writing and documents", tradeoff: "Less flexible than databases", score: "Best writing" },
        ],
      },
    ],
  },
  {
    slug: "best-productivity-stack-for-students",
    title: "Best Productivity Stack for Students",
    deck: "A practical setup for classes, assignments, exams, research, and group projects.",
    description: "Students need a stack that captures quickly, plans deadlines clearly, stores research, and stays affordable. This guide gives you a simple starter stack and a power-user path.",
    readTime: "7 min read",
    category: "Stacks",
    heroTools: ["notion", "todoist", "google-workspace", "obsidian"],
    primaryCta: { label: "Build this stack", href: "/stack-builder" },
    secondaryCta: { label: "Take the quiz", href: "/quiz" },
    sections: [
      {
        id: "student-principle",
        title: "The student stack principle",
        body: "Your stack should separate planning from storing knowledge. Assignments, exams, and due dates need a task/calendar lane. Class notes, research, and reference material need a home base that can survive the semester.",
        bullets: [
          "Keep due dates visible outside your notes app.",
          "Use one home base for class pages, research, and project context.",
          "Avoid expensive tools unless they replace several apps.",
          "Pick apps that work well on mobile before exams and commutes.",
        ],
      },
      {
        id: "core-stack",
        title: "Recommended core stack",
        body: "For most students, Notion or Obsidian can be the home base. Todoist or TickTick handles assignments. Google Workspace covers calendar, docs, files, and group collaboration.",
        tools: [
          { toolId: "notion", label: "Home base app", note: "Best if you want class dashboards, databases, and structured study hubs." },
          { toolId: "todoist", label: "Task manager", note: "Best for assignments, recurring study blocks, and fast capture." },
          { toolId: "google-workspace", label: "Calendar and group work", note: "Best for class schedules, Docs, Drive, and shared projects." },
          { toolId: "obsidian", label: "Research knowledge app", note: "Best if you want local markdown, backlinks, and long-term notes." },
        ],
      },
      {
        id: "budget-options",
        title: "Budget-friendly options",
        body: "A strong student stack can be mostly free. Google Workspace, Apple Notes, TickTick, Trello, and Notion's free tier can cover a lot before you pay for anything.",
        tools: [
          { toolId: "apple-notes", label: "Free notes", note: "Great for fast capture if you live in the Apple ecosystem." },
          { toolId: "ticktick", label: "Affordable tasks", note: "Adds tasks, calendar, habits, and focus tools in one app." },
          { toolId: "trello", label: "Group projects", note: "Simple visual boards for assignments with multiple people." },
        ],
      },
      {
        id: "starter-stack",
        title: "Simple starter stack",
        body: "Start with Google Calendar for schedule, Todoist for tasks, and Notion for class pages. Add no more until you can explain exactly which problem the new app solves.",
        comparison: [
          { toolId: "google-workspace", bestFor: "Calendar, docs, files, group work", tradeoff: "Can feel scattered without a home base", score: "Required layer" },
          { toolId: "todoist", bestFor: "Assignments and reminders", tradeoff: "Not a notes system", score: "Execution" },
          { toolId: "notion", bestFor: "Class dashboards and notes", tradeoff: "Needs setup discipline", score: "Home base" },
        ],
      },
      {
        id: "power-user-stack",
        title: "Power user stack",
        body: "If you like building systems, use Obsidian for research notes, Notion for dashboards, Todoist for execution, and Google Calendar for time. The key is assigning one job to each app.",
        tools: [
          { toolId: "obsidian", label: "Research vault", note: "Use for long-term notes, citations, and connected ideas." },
          { toolId: "notion", label: "Semester dashboard", note: "Use for course pages, project trackers, and study plans." },
          { toolId: "todoist", label: "Execution list", note: "Use for assignments, deadlines, and recurring review." },
        ],
      },
    ],
  },
  {
    slug: "one-app-vs-multiple-apps",
    title: "One App vs Multiple Apps",
    deck: "The real decision is not minimalism versus power. It is ownership.",
    description: "Use this framework to decide whether you need one all-in-one productivity app or a focused stack with clear jobs for notes, tasks, calendar, and collaboration.",
    readTime: "9 min read",
    category: "Framework",
    heroTools: ["notion", "clickup", "todoist", "google-workspace"],
    primaryCta: { label: "Find my model", href: "/quiz" },
    secondaryCta: { label: "Build a stack", href: "/stack-builder" },
    sections: [
      {
        id: "one-app-benefits",
        title: "Benefits of one app",
        body: "One app works when you need a shared source of truth and can tolerate that some features will be good enough rather than best in class. It reduces context switching and makes onboarding simpler.",
        bullets: [
          "One place to search for projects, docs, and decisions.",
          "Fewer subscriptions and fewer workflow handoffs.",
          "Easier team training when everyone agrees on the same system.",
        ],
        tools: [
          { toolId: "notion", label: "Flexible home base", note: "Best when docs, databases, and knowledge need to live together." },
          { toolId: "clickup", label: "Team work hub", note: "Best when tasks, projects, docs, and dashboards should share one workspace." },
          { toolId: "coda", label: "Doc-app operating system", note: "Best when docs need buttons, formulas, and workflow logic." },
        ],
      },
      {
        id: "one-app-problems",
        title: "Problems with one app",
        body: "All-in-one tools can become slow, overbuilt, or vague. If the app owns everything, every workflow depends on your ability to design the system well.",
        bullets: [
          "Tasks can hide inside dashboards instead of driving action.",
          "Calendar and email are often weaker than dedicated apps.",
          "Flexible databases can become maintenance work.",
        ],
      },
      {
        id: "stack-benefits",
        title: "Benefits of a focused stack",
        body: "A focused stack lets each app do its best job. A task manager can be fast, a calendar can be time-native, and a notes app can stay calm. The cost is coordination.",
        tools: [
          { toolId: "todoist", label: "Execution lane", note: "Fast capture, recurring work, and task clarity." },
          { toolId: "google-workspace", label: "Calendar and documents", note: "Scheduling, shared docs, files, and meetings." },
          { toolId: "slack", label: "Communication lane", note: "Team discussion, notifications, and workflow integrations." },
        ],
      },
      {
        id: "too-many-apps",
        title: "Problems with too many apps",
        body: "A stack becomes app collecting when several tools claim the same job. Three task apps or two home bases create uncertainty. The rule is simple: every app needs one primary job.",
        bullets: [
          "Duplicate task capture creates missed work.",
          "Multiple knowledge bases split search and memory.",
          "Too many integrations can become invisible maintenance.",
        ],
      },
      {
        id: "decision-framework",
        title: "Decision framework",
        body: "Choose one app if your biggest need is shared context. Choose a focused stack if execution quality matters more than centralization. Choose home-base-plus-support when you want one source of truth with specialist tools around it.",
        comparison: [
          { toolId: "notion", bestFor: "Home-base-plus-support", tradeoff: "Needs a task or calendar partner", score: "Flexible center" },
          { toolId: "clickup", bestFor: "One team work hub", tradeoff: "Can feel crowded", score: "All-in-one" },
          { toolId: "todoist", bestFor: "Focused execution stack", tradeoff: "Needs docs and calendar elsewhere", score: "Specialist" },
          { toolId: "google-workspace", bestFor: "Suite-based work", tradeoff: "Needs structure for knowledge", score: "Collaboration layer" },
        ],
      },
      {
        id: "user-patterns",
        title: "Recommended patterns by user type",
        body: "Students often need a low-cost stack. Founders need a home base with a task/calendar layer. Managers need collaboration and reporting. Developers usually need a specialist project tracker plus docs.",
        tools: [
          { toolId: "linear", label: "Developers", note: "Pair Linear with Notion or Google Workspace for software planning plus documentation." },
          { toolId: "asana", label: "Managers", note: "Pair Asana with Slack and Google Workspace for visible ownership and communication." },
          { toolId: "sunsama", label: "Busy solo operators", note: "Pair Sunsama with a source task app when daily planning is the bottleneck." },
        ],
      },
    ],
  },
  {
    slug: "best-task-managers",
    title: "Best Task Managers",
    deck: "The right task app depends on whether you need capture, planning, time blocking, or team ownership.",
    description: "Compare Todoist, TickTick, Things 3, Sunsama, Akiflow, Motion, Trello, Asana, ClickUp, and Linear by workflow fit.",
    readTime: "10 min read",
    category: "Category Guide",
    heroTools: ["todoist", "ticktick", "things-3", "sunsama"],
    primaryCta: { label: "Compare task apps", href: "/compare?apps=todoist,ticktick,things-3,sunsama" },
    secondaryCta: { label: "Build a stack", href: "/stack-builder" },
    sections: [
      {
        id: "best-overall",
        title: "Best overall task manager",
        body: "Todoist is still the safest recommendation for most people. It is fast, cross-platform, clean, and powerful enough for recurring tasks, labels, projects, and natural-language capture without becoming a project-management suite.",
        tools: [{ toolId: "todoist", label: "Best overall", note: "The best balance of speed, clarity, platforms, and power." }],
      },
      {
        id: "simple",
        title: "Best simple task manager",
        body: "TickTick is ideal if you want tasks plus calendar, habits, and focus tools without assembling several apps. It is especially strong for students and personal productivity.",
        tools: [{ toolId: "ticktick", label: "Best simple task manager", note: "Affordable, broad, and practical for personal planning." }],
      },
      {
        id: "apple",
        title: "Best Apple-only option",
        body: "Things 3 is beautiful, calm, and excellent for personal task flow. It is not the right choice for teams or cross-platform work, but Apple-first users often stick with it for years.",
        tools: [{ toolId: "things-3", label: "Best Apple-only option", note: "Elegant personal task management with very low friction." }],
      },
      {
        id: "calendar-planners",
        title: "Best calendar-based planners",
        body: "Sunsama, Akiflow, and Motion are for people whose problem is not remembering tasks, but deciding when work should happen. Sunsama is calm, Akiflow is consolidation-heavy, and Motion leans into AI scheduling.",
        tools: [
          { toolId: "sunsama", label: "Best calm planner", note: "Guided daily planning and calendar blocking." },
          { toolId: "akiflow", label: "Best consolidation inbox", note: "Pulls tasks from many sources into one planning flow." },
          { toolId: "motion", label: "Best AI scheduler", note: "Automatically plans tasks and meetings around deadlines." },
        ],
      },
      {
        id: "team-work",
        title: "Best team task managers",
        body: "Asana and ClickUp are better when tasks need owners, statuses, reporting, views, and cross-functional visibility. Trello is the simplest visual option for lightweight teams.",
        tools: [
          { toolId: "asana", label: "Best team task manager", note: "Structured ownership, timelines, portfolios, and status reporting." },
          { toolId: "clickup", label: "Most powerful team hub", note: "Tasks, docs, dashboards, automations, and many views." },
          { toolId: "trello", label: "Simplest board workflow", note: "Fast visual boards for lightweight planning." },
        ],
      },
      {
        id: "software-teams",
        title: "Best for software teams",
        body: "Linear is purpose-built for software issue tracking and product planning. It is not a general productivity home base, but it is one of the strongest task systems for engineering teams.",
        tools: [{ toolId: "linear", label: "Best for software teams", note: "Fast, keyboard-first issue tracking with GitHub and Slack fit." }],
      },
      {
        id: "comparison-table",
        title: "Comparison table",
        body: "Use this table to pick the task app by job, not hype.",
        comparison: [
          { toolId: "todoist", bestFor: "Most people and cross-platform personal tasks", tradeoff: "Limited docs and team reporting", score: "Best overall" },
          { toolId: "ticktick", bestFor: "Tasks, habits, focus, and calendar in one app", tradeoff: "Interface can feel busy", score: "Best value" },
          { toolId: "things-3", bestFor: "Apple-first personal task flow", tradeoff: "No team collaboration", score: "Best Apple" },
          { toolId: "sunsama", bestFor: "Daily planning and time blocking", tradeoff: "Paid and personal-workflow focused", score: "Best planner" },
          { toolId: "motion", bestFor: "AI scheduling and workload planning", tradeoff: "Requires trust in automation", score: "Best automation" },
          { toolId: "linear", bestFor: "Software issue tracking", tradeoff: "Too specific for general teams", score: "Best dev team" },
        ],
      },
      {
        id: "pairings",
        title: "Recommended pairings",
        body: "A task app rarely needs to hold every part of work. Pair it with a home base for context and a calendar for time.",
        tools: [
          { toolId: "notion", label: "Context layer", note: "Pair with Todoist, TickTick, Sunsama, or Linear for execution." },
          { toolId: "google-workspace", label: "Calendar layer", note: "Pair with nearly any task app when scheduling matters." },
          { toolId: "slack", label: "Team signal layer", note: "Pair with Asana, ClickUp, Linear, or Trello for collaboration." },
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function resolveGuideTool(toolId: string): ProductivityTool {
  const tool = getToolById(toolId);
  if (!tool) {
    throw new Error(`Unknown guide tool: ${toolId}`);
  }
  return tool;
}
