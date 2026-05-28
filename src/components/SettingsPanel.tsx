"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, ExternalLink, Loader2, RefreshCw, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { downloadTextFile, useProductivityHubStore } from "@/lib/productivityStore";

const fallbackUpdateState: ProductivityHubUpdateState = {
  state: "development",
  message: "Desktop update controls are available in the installed Productivity Hub app.",
  currentVersion: "0.1.0",
  supported: false,
  releaseUrl: "https://github.com/IshrakFaisal/Productivity-Hub/releases/latest",
};

export function SettingsPanel() {
  const [updateState, setUpdateState] = useState<ProductivityHubUpdateState>(fallbackUpdateState);
  const [busy, setBusy] = useState(false);
  const { state, resetWorkspace } = useProductivityHubStore();
  const desktopApi = typeof window !== "undefined" ? window.productivityHub : undefined;

  useEffect(() => {
    desktopApi?.updates.getState().then(setUpdateState).catch(() => setUpdateState(fallbackUpdateState));
    const dispose = desktopApi?.updates.onState(setUpdateState);

    return () => dispose?.();
  }, [desktopApi]);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }

  function exportWorkspace() {
    downloadTextFile(`productivity-hub-workspace-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), "application/json");
  }

  const canDownload = updateState.state === "available" && updateState.supported;
  const canInstall = updateState.state === "downloaded" && updateState.supported;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
            Manage desktop updates, local workspace data, release links, and app maintenance.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => desktopApi?.openExternal(updateState.releaseUrl)}>
          <ExternalLink className="h-4 w-4" />
          Releases
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-400">Installed version</p>
              <p className="mt-2 text-2xl font-semibold text-white">{updateState.currentVersion}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-400">Saved stacks</p>
              <p className="mt-2 text-2xl font-semibold text-white">{state.savedStacks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-400">Favorite tools</p>
              <p className="mt-2 text-2xl font-semibold text-white">{state.favorites.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Software updates</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-400">Checks the latest GitHub Release and downloads a signed-or-unsigned installer update through Electron.</p>
              </div>
              <span className="rounded-md border border-white/10 bg-white/[0.055] px-2 py-1 text-xs font-medium text-neutral-300">
                {updateState.supported ? "Installed app" : "Development mode"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start gap-3">
                {updateState.state === "checking" || updateState.state === "downloading" ? (
                  <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-lime-200" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-lime-200" />
                )}
                <div>
                  <p className="font-semibold text-white">{statusTitle(updateState)}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">{updateState.message}</p>
                </div>
              </div>
              {typeof updateState.progress === "number" ? (
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-lime-300 transition-all" style={{ width: `${updateState.progress}%` }} />
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => run(() => desktopApi?.updates.check() ?? Promise.resolve())} disabled={busy || !desktopApi}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Check for updates
              </Button>
              <Button type="button" variant="secondary" onClick={() => run(() => desktopApi?.updates.download() ?? Promise.resolve())} disabled={busy || !canDownload}>
                <Download className="h-4 w-4" />
                Download update
              </Button>
              <Button type="button" variant="secondary" onClick={() => desktopApi?.updates.install()} disabled={!canInstall}>
                <RotateCcw className="h-4 w-4" />
                Restart and install
              </Button>
              <Button type="button" variant="ghost" onClick={() => desktopApi?.openExternal(updateState.releaseUrl)}>
                <ExternalLink className="h-4 w-4" />
                GitHub releases
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <ShieldCheck className="h-5 w-5 text-lime-200" />
              Local data
            </h2>
            <p className="text-sm leading-6 text-neutral-400">Workspace data lives in local storage on this device. Export before resetting or testing releases.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button type="button" className="w-full" onClick={exportWorkspace}>
              <Download className="h-4 w-4" />
              Export workspace
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={resetWorkspace}>
              <RotateCcw className="h-4 w-4" />
              Reset local data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Release checklist</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-neutral-400">
            <p>1. Merge changes to the default branch.</p>
            <p>2. Create a tag like `v0.2.0`.</p>
            <p>3. GitHub Actions builds the Windows installer and publishes release assets.</p>
            <p>4. Installed apps can detect the new release.</p>
          </CardContent>
        </Card>
      </aside>
      </div>
    </div>
  );
}

function statusTitle(updateState: ProductivityHubUpdateState) {
  if (updateState.state === "available") return `Update ${updateState.version} available`;
  if (updateState.state === "downloaded") return "Update ready to install";
  if (updateState.state === "current") return "Already up to date";
  if (updateState.state === "error") return "Update check failed";
  if (updateState.state === "development") return "Install the desktop app first";
  if (updateState.state === "downloading") return "Downloading update";
  if (updateState.state === "checking") return "Checking for updates";
  return "Update system ready";
}
