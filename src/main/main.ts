import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import { join } from "node:path";
import { platform } from "node:process";
import { registerMainHandlers } from "./services";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === "production") {
  import("source-map-support").then((mapper) => mapper.default.install());
}

const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
  import("electron-debug").then(({ default: debug }) => debug());
}

const installExtensions = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const devtools = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["VUEJS_DEVTOOLS"];

  return devtools
    .default(
      extensions.map((name) => devtools[name]),
      forceDownload
    )
    .catch(console.log);
};

nativeTheme.on("updated", () => {
  mainWindow &&
    mainWindow.webContents.send(
      "native-theme:changed",
      nativeTheme.shouldUseDarkColors ? "dark" : "light"
    );
});

const createWindow = async (code?: number) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? join(process.resourcesPath, "assets")
    : join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    title: "unisdk-builder",
    width: isDebug ? 1920 : 1024,
    // maxWidth:  1024,
    // minWidth: 1024,
    height: isDebug ? 1080 : 728,
    // maxHeight: 728,
    // minHeight: 728,
    center: true,
    resizable: false,
    icon: getAssetPath("icon.png"),
    titleBarStyle: process.platform === "darwin" ? "hidden" : "default",
    trafficLightPosition: {
      x: 12,
      y: 12,
    },
    opacity: 0,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#121212" : "#f0f0f0",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
      sandbox: false,
      spellcheck: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // if (isDebug) mainWindow.webContents.openDevTools({ mode: "right" });

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      setTimeout(() => mainWindow!.setOpacity(1), 60);

      if (code !== void 0) {
        setTimeout(() => {
          mainWindow?.webContents.send("migration-error");
        }, 800);
      }
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("window-all-closed", () => {
  app.quit();
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    /// Make the window take focus when trying to run a second instance
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app
    .whenReady()
    .then(async () => {
      mainWindow === null && createWindow();
      app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null || BrowserWindow.getAllWindows().length === 0)
          createWindow();
      });

      registerMainHandlers(mainWindow);
    })
    .catch(console.log);
}

Promise.resolve()
  .then(() => {
    if (platform !== "darwin") {
      ipcMain.on("window:close", (_event) => {
        mainWindow && mainWindow.close();
      });

      ipcMain.on("window:minimize", (_event) => {
        mainWindow && mainWindow.minimize();
      });
    }
  })
  .catch(console.error);
