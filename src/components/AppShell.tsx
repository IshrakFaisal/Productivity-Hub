import Link from "next/link";
import { Boxes, GitCompare, Library, Menu, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  { href: "/tools", label: "Directory" },
  { href: "/compare", label: "Compare" },
  { href: "/quiz", label: "Quiz" },
  { href: "/stack-builder", label: "Stack Builder" },
  { href: "/about", label: "About" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08090c] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(132,204,22,0.18),transparent_28%),radial-gradient(circle_at_86%_4%,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,#08090c_0%,#101116_42%,#08090c_100%)]" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08090c]/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-lime-200/30 bg-lime-300 text-neutral-950 shadow-[0_0_24px_rgba(190,242,100,0.22)]">
              <Boxes className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>Productivity Hub</span>
          </Link>
          <nav className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <ButtonLink href="/compare" variant="secondary">
              <GitCompare className="h-4 w-4" aria-hidden="true" />
              Compare
            </ButtonLink>
            <ButtonLink href="/quiz">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Find Stack
            </ButtonLink>
          </div>
          <Link
            href="/tools"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-neutral-200 sm:hidden"
            aria-label="Open directory"
          >
            <Menu className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-neutral-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-medium text-neutral-200">
            <Library className="h-4 w-4" aria-hidden="true" />
            Local mock intelligence for better productivity decisions.
          </div>
          <div>Clarity over app collecting.</div>
        </div>
      </footer>
    </div>
  );
}
