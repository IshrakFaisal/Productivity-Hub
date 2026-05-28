"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Boxes,
  BookOpenText,
  GitCompare,
  Home,
  Info,
  Layers3,
  LayoutDashboard,
  Library,
  Menu,
  PanelsTopLeft,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CommandPalette } from "@/components/CommandPalette";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tools", label: "Directory", icon: Library },
  { href: "/collections", label: "Collections", icon: PanelsTopLeft },
  { href: "/guides", label: "Guides", icon: BookOpenText },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/quiz", label: "Quiz", icon: Sparkles },
  { href: "/stack-builder", label: "Stack Builder", icon: Layers3 },
];

const utilityItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About", icon: Info },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const currentItem = [...navItems, ...utilityItems].find((item) => isActive(pathname, item.href)) ?? navItems[0];

  return (
    <div className="min-h-screen bg-[#07080a] text-white md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <aside className="hidden h-screen border-r border-white/10 bg-[#090a0d]/92 md:sticky md:top-0 md:flex md:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white text-neutral-950 shadow-[0_0_0_1px_rgba(255,255,255,0.18)_inset]">
              <Boxes className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-white">Productivity Hub</span>
              <span className="block truncate text-xs text-neutral-500">Local workspace</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <NavGroup items={navItems} pathname={pathname} />
          <div className="h-px bg-white/10" />
          <NavGroup items={utilityItems} pathname={pathname} muted />
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="mb-2 flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-neutral-400 transition hover:bg-white/[0.075] hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Command
            </span>
            <kbd className="rounded border border-white/10 bg-black/25 px-1.5 py-0.5 text-[10px] text-neutral-500">Ctrl K</kbd>
          </button>
          <ButtonLink href="/quiz" className="w-full justify-start">
            <Sparkles className="h-4 w-4" />
            Find Stack
          </ButtonLink>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080a]/86 backdrop-blur-2xl">
          <div className="hidden h-16 items-center justify-between gap-4 px-5 md:flex">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">{currentItem.label}</div>
              <div className="text-xs text-neutral-500">Productivity Hub desktop</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.055] px-4 text-sm font-medium tracking-[-0.01em] text-white shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition hover:border-white/18 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Command
                <kbd className="rounded border border-white/10 bg-black/25 px-1.5 py-0.5 text-[10px] text-neutral-500">Ctrl K</kbd>
              </button>
              <ButtonLink href="/compare" variant="secondary">
                <GitCompare className="h-4 w-4" aria-hidden="true" />
                Compare
              </ButtonLink>
              <ButtonLink href="/quiz">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Find Stack
              </ButtonLink>
            </div>
          </div>

          <div className="flex h-14 items-center justify-between gap-4 px-4 md:hidden">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3 font-semibold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white text-neutral-950">
                <Boxes className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="truncate">Productivity Hub</span>
            </Link>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-neutral-200"
              aria-label="Open command palette"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function NavGroup({
  items,
  pathname,
  muted = false,
}: {
  items: typeof navItems;
  pathname: string;
  muted?: boolean;
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-200",
              active
                ? "border border-white/10 bg-white/[0.085] text-white shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
                : muted
                  ? "text-neutral-500 hover:bg-white/[0.055] hover:text-neutral-200"
                  : "text-neutral-400 hover:bg-white/[0.055] hover:text-white",
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-lime-200" : "text-neutral-500")} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
