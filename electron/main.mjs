import { app, BrowserWindow, protocol, shell } from "electron";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const staticRoot = path.join(projectRoot, "out");
const devUrl = "http://127.0.0.1:3000";
const appOrigin = "productivity-hub://app";
let nextProcess;

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
    return `${appOrigin}/`;
  }

  startNextServer();
  await waitForDevServer();
  return devUrl;
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
