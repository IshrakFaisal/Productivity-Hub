import { ToolDirectory } from "@/components/ToolDirectory";

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Tool directory</h1>
        <p className="mt-3 text-neutral-400">
          Search productivity apps by category, stack role, collaboration,
          offline support, AI, pricing, and ecosystem fit.
        </p>
      </div>
      <ToolDirectory />
    </div>
  );
}
