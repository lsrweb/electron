import { app, BrowserWindow } from "electron";
import path from "path";
import { createTray } from "./main_/core/Tray";
import { registerMainHandlers } from "./main_/controller";
import { APPDIR } from "./main_/constants";
import { checkFolderExist } from "./main_/utils/folder";
import { Server } from "socket.io";
import http from "http";
import type { CustomApp } from "./types/electron-app";
import { toJson } from "./render_/utils";

if (process.env.NODE_ENV === "production") {
  // @ts-ignore
  import("source-map-support").then((mapper) => mapper.default.install());
}

const isDebug = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
if (isDebug) {
  import("electron-debug").then(({ default: debug }) => debug());
}

const installExtensions = async () => {
  const devtools = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return devtools
    .default(
      extensions.map((name) => devtools[name]),
      forceDownload
    )
    .catch(console.log);
};

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("message", (message) => {});

  socket.on("disconnect", () => {});

  socket.emit("message", toJson({ type: "init", message: "Socket.IO is running on ws://127.0.0.1:8080" }));
});

server.listen(8080, () => {
  console.log("Socket.IO is running on ws://127.0.0.1:8080");
});

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1860,
    height: 900,
    minWidth: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
      spellcheck: false,
    },
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "../../images/icon.png"),
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (isDebug) {
    await installExtensions();
  }
  if (isDebug) mainWindow.webContents.openDevTools({ mode: "right" });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("close", (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);

    event.preventDefault();
  });
};

const gotTheLock = app.requestSingleInstanceLock();

// 如果已经有了实例，则退出已有实例
if (!gotTheLock) {
  app.exit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    (app as CustomApp).ws = io;
    (app as CustomApp).mainWindow = mainWindow;

    registerMainHandlers(mainWindow);
    checkFolderExist(APPDIR);
    createTray(mainWindow);

    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("main-process-loaded");
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

process.on("uncaughtException", (error) => {});

process.on("unhandledRejection", (error) => {});
