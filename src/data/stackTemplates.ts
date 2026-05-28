export type StackTemplate = {
  id: string;
  name: string;
  audience: string;
  description: string;
  toolIds: string[];
  philosophy: "One home base" | "Focused stack" | "Suite-first" | "Local-first";
  maintenance: "Low" | "Medium" | "High";
  strengths: string[];
  tradeoffs: string[];
};

export const stackTemplates: StackTemplate[] = [
  {
    id: "minimal-solo",
    name: "Minimal Solo Stack",
    audience: "Freelancers and personal productivity",
    description: "A calm setup with one flexible home base, one task layer, and one calendar layer.",
    toolIds: ["notion", "todoist", "google-workspace"],
    philosophy: "One home base",
    maintenance: "Low",
    strengths: ["Clear place for docs and planning", "Fast task capture", "Calendar coverage without extra ceremony"],
    tradeoffs: ["Notion still needs discipline", "Google Workspace can scatter files without conventions"],
  },
  {
    id: "student-research",
    name: "Student Research Stack",
    audience: "Students, researchers, and deep note-takers",
    description: "Local-first notes plus a lightweight execution layer for study plans and deadlines.",
    toolIds: ["obsidian", "ticktick", "google-workspace"],
    philosophy: "Local-first",
    maintenance: "Medium",
    strengths: ["Strong knowledge retention", "Offline-friendly notes and tasks", "Good calendar and document collaboration"],
    tradeoffs: ["Obsidian setup can become a hobby", "Team project management is light"],
  },
  {
    id: "founder-command-center",
    name: "Founder Command Center",
    audience: "Founders and operators",
    description: "A flexible operating system for docs, planning, communication, and time blocking.",
    toolIds: ["notion", "linear", "slack", "akiflow"],
    philosophy: "One home base",
    maintenance: "High",
    strengths: ["Strong strategy and product planning", "Fast team communication", "Calendar-first execution"],
    tradeoffs: ["High-maintenance if every app gets customized", "Calendar coverage depends on Akiflow habits"],
  },
  {
    id: "software-team",
    name: "Software Team Stack",
    audience: "Developers and product teams",
    description: "Fast issue tracking, team communication, docs, and shared calendar/doc infrastructure.",
    toolIds: ["linear", "slack", "notion", "google-workspace"],
    philosophy: "Focused stack",
    maintenance: "Medium",
    strengths: ["Excellent product execution lane", "Clear team communication", "Good docs and meeting support"],
    tradeoffs: ["Not ideal for non-software operations", "Requires ownership boundaries between Linear and Notion"],
  },
  {
    id: "agency-operations",
    name: "Agency Operations Stack",
    audience: "Agencies, managers, and client teams",
    description: "Structured project delivery with docs, communication, and client-facing collaboration.",
    toolIds: ["asana", "slack", "google-workspace", "airtable"],
    philosophy: "Focused stack",
    maintenance: "Medium",
    strengths: ["Strong project accountability", "Great collaboration coverage", "Flexible tracking databases"],
    tradeoffs: ["Can feel process-heavy", "Airtable needs database-minded ownership"],
  },
  {
    id: "apple-personal",
    name: "Apple Personal Stack",
    audience: "Apple-first personal productivity",
    description: "Elegant, low-friction personal productivity with strong offline support.",
    toolIds: ["things-3", "craft", "apple-notes"],
    philosophy: "Focused stack",
    maintenance: "Low",
    strengths: ["Very simple daily flow", "Beautiful writing and notes", "Works well offline"],
    tradeoffs: ["Weak collaboration", "No serious team project layer", "Apple ecosystem lock-in"],
  },
  {
    id: "enterprise-suite",
    name: "Enterprise Suite Stack",
    audience: "Managers and company teams",
    description: "A suite-first setup for organizations that need admin controls, office files, email, and meetings.",
    toolIds: ["microsoft-365", "asana", "slack"],
    philosophy: "Suite-first",
    maintenance: "Medium",
    strengths: ["Strong enterprise controls", "Good project accountability", "Familiar docs and calendar tooling"],
    tradeoffs: ["Can feel heavy", "Work may scatter across Teams, Outlook, Asana, and files"],
  },
  {
    id: "creator-studio",
    name: "Creator Studio Stack",
    audience: "Creators, writers, and solo builders",
    description: "A polished writing and publishing-adjacent system with tasks and scheduling.",
    toolIds: ["craft", "todoist", "amie", "capacities"],
    philosophy: "Focused stack",
    maintenance: "Medium",
    strengths: ["Beautiful writing surface", "Strong personal execution", "Good idea and knowledge capture"],
    tradeoffs: ["No robust team layer", "Calendar and tasks may overlap if roles are unclear"],
  },
];

export function getStackTemplateById(id: string) {
  return stackTemplates.find((template) => template.id === id);
}
