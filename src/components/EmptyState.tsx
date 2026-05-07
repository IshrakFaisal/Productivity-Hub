import { Search } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-10 text-center">
      <Search className="mx-auto h-6 w-6 text-neutral-500" />
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{body}</p>
    </div>
  );
}
