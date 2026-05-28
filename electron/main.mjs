import { app, BrowserWindow, ipcMain, protocol, shell } from "electron";
import electronUpdater from "electron-updater";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { autoUpdater } = electronUpdater;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const staticRoot = path.join(projectRoot, "out");
const devUrl = "http://127.0.0.1:3000";
const appOrigin = "productivity-hub://app";
const releasePageUrl = "https://github.com/IshrakFaisal/Productivity-Hub/releases/latest";
let nextProcess;
let updateState = {
  state: "idle",
  message: "Ready to check for updates.",
  currentVersion: app.getVersion(),
  supported: app.isPackaged,
  releaseUrl: releasePageUrl,
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: "productivity-hub",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".html") return "text/html";
  if (extension === ".js") return "text/javascript";
  if (extension === ".css") return "text/css";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".ico") return "image/x-icon";
  if (extension === ".png") return "image/png";
  if (extension === ".json") return "application/json";
  if (extension === ".txt") return "text/plain";
  return "application/octet-stream";
}

async function staticBuildExists() {
  try {
    await fs.access(path.join(staticRoot, "index.html"));
    return true;
  } catch {
    return false;
  }
}

function resolveStaticPath(url) {
  const parsed = new URL(url);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  } else if (!path.extname(pathname)) {
    pathname = path.posix.join(pathname, "index.html");
  }

  const filePath = path.normalize(path.join(staticRoot, pathname));
  if (!filePath.startsWith(staticRoot)) {
    return path.join(staticRoot, "index.html");
  }

  return filePath;
}

function registerStaticProtocol() {
  protocol.handle("productivity-hub", async (request) => {
    let filePath = resolveStaticPath(request.url);

    try {
      await fs.access(filePath);
    } catch {
      filePath = path.join(staticRoot, "index.html");
    }

    const bytes = await fs.readFile(filePath);
    return new Response(bytes, {
      headers: {
        "content-type": getContentType(filePath),
      },
    });
  });
}

function startNextServer() {
  if (nextProcess) return;

  nextProcess = spawn(
    "npm.cmd",
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", "3000"],
    {
      cwd: projectRoot,
      shell: false,
      stdio: "ignore",
      windowsHide: true,
    },
  );

  nextProcess.unref();
}

function broadcastUpdateState() {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("updates:state", updateState);
  });
}

function setUpdateState(nextState) {
  updateState = {
    ...updateState,
    ...nextState,
    currentVersion: app.getVersion(),
    supported: app.isPackaged,
    releaseUrl: releasePageUrl,
  };
  broadcastUpdateState();
}

function configureUpdates() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "IshrakFaisal",
    repo: "Productivity-Hub",
  });

  autoUpdater.on("checking-for-update", () => {
    setUpdateState({ state: "checking", message: "Checking GitHub Releases for a newer installer." });
  });

  autoUpdater.on("update-available", (info) => {
    setUpdateState({
      state: "available",
      message: `Version ${info.version} is ready to download.`,
      version: info.version,
    });
  });

  autoUpdater.on("update-not-available", () => {
    setUpdateState({ state: "current", message: "You are running the latest available version." });
  });

  autoUpdater.on("download-progress", (progress) => {
    setUpdateState({
      state: "downloading",
      message: `Downloading update: ${Math.round(progress.percent)}%.`,
      progress: Math.round(progress.percent),
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    setUpdateState({
      state: "downloaded",
      message: `Version ${info.version} downloaded. Restart to install it.`,
      version: info.version,
      progress: 100,
    });
  });

  autoUpdater.on("error", (error) => {
    setUpdateState({
      state: "error",
      message: error instanceof Error ? error.message : "Update check failed.",
    });
  });
}

function registerUpdateIpc() {
  ipcMain.handle("updates:get-state", () => updateState);
  ipcMain.handle("updates:check", async () => {
    if (!app.isPackaged) {
      setUpdateState({
        state: "development",
        message: "Update checks run from the installed app. Package and install Productivity Hub first.",
      });
      return updateState;
    }

    await autoUpdater.checkForUpdates();
    return updateState;
  });
  ipcMain.handle("updates:download", async () => {
    if (!app.isPackaged) return updateState;
    await autoUpdater.downloadUpdate();
    return updateState;
  });
  ipcMain.handle("updates:install", () => {
    if (app.isPackaged) {
      autoUpdater.quitAndInstall(false, true);
    }
  });
  ipcMain.handle("app:open-external", (_event, url) => {
    if (typeof url === "string" && /^https?:\/\//.test(url)) {
      shell.openExternal(url);
    }
  });
}

async function waitForDevServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(devUrl);
      if (response.ok) return;
    } catch {
      // Next.js is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function getStartUrl() {
  if (await staticBuildExists()) {
    registerStaticProtocol();
    return `${appOrigin}/dashboard`;
  }

  startNextServer();
  await waitForDevServer();
  return `${devUrl}/dashboard`;
}

async function createWindow() {
  const startUrl = await getStartUrl();

  const window = new BrowserWindow({
    width: 1360,
    height: 920,
    minWidth: 1040,
    minHeight: 720,
    backgroundColor: "#08090c",
    title: "Productivity Hub",
    icon: path.join(projectRoot, "public", "productivity-hub-icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  window.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
    window.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(`
        <body style="margin:0;background:#08090c;color:white;font:16px system-ui;display:grid;place-items:center;height:100vh">
          <main style="max-width:560px;padding:32px">
            <h1>Productivity Hub could not start</h1>
            <p style="color:#b7b7b7;line-height:1.6">Electron failed to load the app files.</p>
            <pre style="white-space:pre-wrap;color:#d9ff63">${errorCode}: ${errorDescription}</pre>
          </main>
        </body>
      `)}`,
    );
  });

  await window.loadURL(startUrl);

}

configureUpdates();
registerUpdateIpc();

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (nextProcess && !nextProcess.killed) {
    nextProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
