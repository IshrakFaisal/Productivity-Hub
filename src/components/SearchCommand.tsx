"use client";

import { Search } from "lucide-react";

export function SearchCommand({ value, onChange, placeholder = "Search tools" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-white/10 bg-black/30 pl-10 pr-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-lime-200/50"
      />
    </label>
  );
}
