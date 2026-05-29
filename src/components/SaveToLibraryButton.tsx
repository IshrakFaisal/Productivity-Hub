"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductivityHubStore } from "@/lib/productivityStore";

type SaveTarget =
  | {
      type: "collection";
      id: string;
      name: string;
    }
  | {
      type: "guide";
      id: string;
      name: string;
    };

export function SaveToLibraryButton({
  target,
  compact = false,
  className,
}: {
  target: SaveTarget;
  compact?: boolean;
  className?: string;
}) {
  const { state, toggleSavedCollection, toggleSavedGuide } = useProductivityHubStore();
  const saved = target.type === "collection" ? state.savedCollections.includes(target.id) : state.savedGuides.includes(target.id);
  const Icon = saved ? BookmarkCheck : Bookmark;
  const label = saved ? "Saved" : compact ? "Save" : "Save to Library";

  return (
    <button
      type="button"
      onClick={() => {
        if (target.type === "collection") {
          toggleSavedCollection(target.id);
        } else {
          toggleSavedGuide(target.id);
        }
      }}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium tracking-[-0.01em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        saved
          ? "border-lime-200/40 bg-lime-200/15 text-lime-100 focus-visible:outline-lime-200"
          : "border-white/12 bg-white/[0.055] text-white hover:border-white/18 hover:bg-white/[0.09] focus-visible:outline-white/40",
        compact && "h-9 px-3 text-xs",
        className,
      )}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${target.name} from My Library` : `Save ${target.name} to My Library`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
