import { StackBuilder } from "@/components/StackBuilder";

export default function StackBuilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Stack builder</h1>
        <p className="mt-3 text-neutral-400">
          Build a productivity setup and catch overlap, missing calendar
          coverage, and collaboration gaps before the stack gets messy.
        </p>
      </div>
      <StackBuilder />
    </div>
  );
}
