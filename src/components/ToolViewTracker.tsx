"use client";

import { useEffect } from "react";
import { useProductivityHubStore } from "@/lib/productivityStore";

export function ToolViewTracker({ toolId }: { toolId: string }) {
  const { trackTool } = useProductivityHubStore();

  useEffect(() => {
    trackTool(toolId);
  }, [toolId, trackTool]);

  return null;
}
