import { createTray } from "./main_/core/Tray";
import { app, BrowserWindow } from "electron";
import path from "path";
import { registerMainHanlders } from "./main_/controller";

if (require("electron-squirrel-startup")) {
  app.quit();
}
let mainWindow: BrowserWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "../../images/icon.png"),
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.whenReady().then(async () => {
  // 注册托盘图标
  createTray(mainWindow);

  // 注册事件暴露程序
  registerMainHanlders(mainWindow);
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
