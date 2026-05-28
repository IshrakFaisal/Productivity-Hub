import { Dashboard } from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Your productivity workspace</h1>
        <p className="mt-3 text-neutral-400">
          Save stacks, revisit contenders, export your decision trail, and keep your productivity system honest over time.
        </p>
      </div>
      <Dashboard />
    </div>
  );
}
