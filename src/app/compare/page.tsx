import { CompareTool } from "@/components/CompareTool";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Compare apps</h1>
        <p className="mt-3 text-neutral-400">
          Put 2-4 tools side by side and decide which one should be your home
          base, task layer, team hub, or support app.
        </p>
      </div>
      <CompareTool />
    </div>
  );
}
