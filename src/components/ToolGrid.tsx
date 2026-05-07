import { ToolCard } from "@/components/ToolCard";
import { type ProductivityTool } from "@/data/productivityTools";

export function ToolGrid({ tools }: { tools: ProductivityTool[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
