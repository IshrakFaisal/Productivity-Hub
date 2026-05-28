"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenText,
  Download,
  FileJson,
  GitCompare,
  Layers3,
  LayoutDashboard,
  Library,
  PanelsTopLeft,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import { ToolLogo } from "@/components/ToolLogo";
import { templateCollections } from "@/data/collections";
import { guides } from "@/data/guides";
import { productivityTools } from "@/data/productivityTools";
import { downloadTextFile, useProductivityHubStore } from "@/lib/productivityStore";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  title: string;
  subtitle: string;
  section: "Navigation" | "Tools" | "Guides" | "Templates" | "Saved stacks" | "Workspace";
  keywords: string;
  icon: ReactNode;
  href?: string;
  action?: () => void;
};

const navigationCommands: CommandItem[] = [
  {
    id: "nav-dashboard",
    title: "Open Dashboard",
    subtitle: "Saved stacks, recent tools, and workspace state",
    section: "Navigation",
    keywords: "home workspace overview dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: "/dashboard",
  },
  {
    id: "nav-directory",
    title: "Browse Tool Directory",
    subtitle: "Search and filter productivity apps",
    section: "Navigation",
    keywords: "tools directory browse apps search",
    icon: <Library className="h-4 w-4" />,
    href: "/tools",
  },
  {
    id: "nav-collections",
    title: "Open Collections",
    subtitle: "Browse curated productivity stack templates",
    section: "Navigation",
    keywords: "collections templates stacks proven systems",
    icon: <PanelsTopLeft className="h-4 w-4" />,
    href: "/collections",
  },
  {
    id: "nav-guides",
    title: "Read Editorial Guides",
    subtitle: "Decision guides for tools and stacks",
    section: "Navigation",
    keywords: "guides articles editorial advice",
    icon: <BookOpenText className="h-4 w-4" />,
    href: "/guides",
  },
  {
    id: "nav-compare",
    title: "Open Compare",
    subtitle: "Compare 2-4 productivity tools",
    section: "Navigation",
    keywords: "compare comparison table apps",
    icon: <GitCompare className="h-4 w-4" />,
    href: "/compare",
  },
  {
    id: "nav-quiz",
    title: "Find My Stack",
    subtitle: "Take the recommendation quiz",
    section: "Navigation",
    keywords: "quiz recommendation find stack",
    icon: <Sparkles className="h-4 w-4" />,
    href: "/quiz",
  },
  {
    id: "nav-stack-builder",
    title: "Open Stack Builder",
    subtitle: "Build and analyze a manual stack",
    section: "Navigation",
    keywords: "stack builder analyze overlap",
    icon: <Layers3 className="h-4 w-4" />,
    href: "/stack-builder",
  },
  {
    id: "nav-settings",
    title: "Open Settings",
    subtitle: "Updates, export, reset, and release controls",
    section: "Navigation",
    keywords: "settings preferences updates release",
    icon: <Settings className="h-4 w-4" />,
    href: "/settings",
  },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { state, resetWorkspace } = useProductivityHubStore();

  const commands = useMemo<CommandItem[]>(() => {
    const toolCommands = productivityTools.flatMap((tool) => [
      {
        id: `tool-${tool.id}`,
        title: `Open ${tool.name}`,
        subtitle: tool.tagline,
        section: "Tools" as const,
        keywords: [tool.name, tool.tagline, tool.categories.join(" "), tool.bestFor.join(" "), "profile tool"].join(" "),
        icon: <ToolLogo name={tool.name} className="h-8 w-8 text-[10px]" />,
        href: `/tools/${tool.id}`,
      },
      {
        id: `compare-${tool.id}`,
        title: `Compare ${tool.name}`,
        subtitle: `Start a comparison with ${tool.name}`,
        section: "Tools" as const,
        keywords: [tool.name, "compare comparison"].join(" "),
        icon: <GitCompare className="h-4 w-4" />,
        href: `/compare?apps=${tool.id}`,
      },
    ]);

    const guideCommands = guides.map((guide) => ({
      id: `guide-${guide.slug}`,
      title: guide.title,
      subtitle: guide.description,
      section: "Guides" as const,
      keywords: [guide.title, guide.category, guide.description].join(" "),
      icon: <BookOpenText className="h-4 w-4" />,
      href: `/guides/${guide.slug}`,
    }));

    const templateCommands = templateCollections.flatMap((collection) => [
      {
        id: `template-open-${collection.id}`,
        title: collection.name,
        subtitle: `${collection.audience} - ${collection.philosophy}`,
        section: "Templates" as const,
        keywords: [collection.name, collection.audience, collection.description, collection.philosophy, "collection template stack"].join(" "),
        icon: <PanelsTopLeft className="h-4 w-4" />,
        href: `/collections/${collection.id}`,
      },
      {
        id: `template-use-${collection.id}`,
        title: `Use ${collection.name}`,
        subtitle: `Load ${collection.toolIds.length} apps into Stack Builder`,
        section: "Templates" as const,
        keywords: [collection.name, collection.toolIds.join(" "), "use load stack builder template"].join(" "),
        icon: <Layers3 className="h-4 w-4" />,
        href: `/stack-builder?template=${collection.id}`,
      },
    ]);

    const stackCommands = state.savedStacks.map((stack) => ({
      id: `stack-${stack.id}`,
      title: stack.name,
      subtitle: `${stack.toolIds.length} tools - saved stack score ${stack.score}`,
      section: "Saved stacks" as const,
      keywords: [stack.name, stack.notes, stack.toolIds.join(" "), "saved stack"].filter(Boolean).join(" "),
      icon: <Layers3 className="h-4 w-4" />,
      href: `/stack-builder?stack=${encodeURIComponent(stack.id)}`,
    }));

    const workspaceCommands: CommandItem[] = [
      {
        id: "workspace-export",
        title: "Export Workspace JSON",
        subtitle: "Download favorites, saved stacks, onboarding, and quiz result",
        section: "Workspace",
        keywords: "export backup download workspace json",
        icon: <Download className="h-4 w-4" />,
        action: () => {
          downloadTextFile(`productivity-hub-workspace-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), "application/json");
        },
      },
      {
        id: "workspace-reset",
        title: "Reset Local Workspace",
        subtitle: "Clear local favorites, stacks, onboarding, and quiz result",
        section: "Workspace",
        keywords: "reset clear local data workspace",
        icon: <RotateCcw className="h-4 w-4" />,
        action: () => {
          if (window.confirm("Reset all local Productivity Hub data on this device?")) {
            resetWorkspace();
          }
        },
      },
      {
        id: "workspace-release-center",
        title: "Open Release Center",
        subtitle: "Check app version, updates, and release notes",
        section: "Workspace",
        keywords: "release updates version settings installer",
        icon: <Wrench className="h-4 w-4" />,
        href: "/settings",
      },
    ];

    return [...navigationCommands, ...toolCommands, ...guideCommands, ...templateCommands, ...stackCommands, ...workspaceCommands];
  }, [resetWorkspace, state]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands.slice(0, 12);

    return commands
      .map((command) => ({
        command,
        score: scoreCommand(command, normalized),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.command)
      .slice(0, 40);
  }, [commands, query]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
      if (event.key === "Escape" && open) {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      setQuery("");
      setSelectedIndex(0);
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  function runCommand(command: CommandItem) {
    if (command.action) command.action();
    if (command.href) router.push(command.href);
    onOpenChange(false);
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) => Math.min(filtered.length - 1, current + 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) => Math.max(0, current - 1));
    }
    if (event.key === "Enter" && filtered[selectedIndex]) {
      event.preventDefault();
      runCommand(filtered[selectedIndex]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/62 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close command palette" onClick={() => onOpenChange(false)} />
      <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden rounded-xl border border-white/12 bg-[#0b0d11]/96 shadow-[0_35px_120px_rgba(0,0,0,0.62)] ring-1 ring-white/5 sm:mt-16">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-neutral-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search tools, guides, stacks, and actions..."
            className="h-10 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-neutral-500"
          />
          <kbd className="hidden rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs font-medium text-neutral-500 sm:inline-flex">Esc</kbd>
        </div>

        <div className="max-h-[min(620px,72vh)] overflow-y-auto p-2">
          {filtered.length > 0 ? (
            <CommandList commands={filtered} selectedIndex={selectedIndex} onSelect={runCommand} />
          ) : (
            <div className="grid place-items-center px-6 py-16 text-center">
              <FileJson className="h-8 w-8 text-neutral-600" />
              <h2 className="mt-4 font-semibold text-white">No command found</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">Try a tool name, guide topic, saved stack, or action like export.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-neutral-500">
          <span>Ctrl K to open anywhere</span>
          <span>Enter to run</span>
        </div>
      </div>
    </div>
  );
}

function CommandList({
  commands,
  selectedIndex,
  onSelect,
}: {
  commands: CommandItem[];
  selectedIndex: number;
  onSelect: (command: CommandItem) => void;
}) {
  return (
    <div>
      {commands.map((command, index) => {
        const showSection = command.section !== commands[index - 1]?.section;

        return (
          <div key={command.id}>
            {showSection ? <div className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">{command.section}</div> : null}
            <button
              type="button"
              onClick={() => onSelect(command)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition",
                index === selectedIndex ? "bg-white/[0.085]" : "hover:bg-white/[0.055]",
              )}
            >
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.045] text-neutral-400", index === selectedIndex && "text-lime-200")}>
                {command.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">{command.title}</span>
                <span className="mt-0.5 block truncate text-xs text-neutral-500">{command.subtitle}</span>
              </span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 text-neutral-600", index === selectedIndex && "text-lime-200")} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function scoreCommand(command: CommandItem, query: string) {
  const title = command.title.toLowerCase();
  const haystack = `${command.title} ${command.subtitle} ${command.section} ${command.keywords}`.toLowerCase();

  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (haystack.includes(query)) return 50;

  const tokens = query.split(/\s+/).filter(Boolean);
  const matches = tokens.filter((token) => haystack.includes(token)).length;
  return matches ? matches * 12 : 0;
}
