import { ToolLogo } from "@/components/ToolLogo";
import { type ProductivityTool } from "@/data/productivityTools";

export function ToolProfileHeader({ tool }: { tool: ProductivityTool }) {
  return (
    <div className="flex items-center gap-3">
      <ToolLogo name={tool.name} />
      <div>
        <h1 className="text-2xl font-semibold text-white">{tool.name}</h1>
        <p className="text-sm text-neutral-400">{tool.tagline}</p>
      </div>
    </div>
  );
}
