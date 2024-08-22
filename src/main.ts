import { createTray } from "./main_/core/Tray";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { registerMainHandlers } from "./main_/controller";
import { APPDIR } from "./main_/constants";
import { checkFolderExist } from "./main_/utils/folder";

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
      sandbox: false,
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

app.whenReady().then(() => {
  createWindow();
  registerMainHandlers(mainWindow);
  // 初始化配置文件的文件夹
  checkFolderExist(APPDIR);

  // 注册托盘图标
  createTray(mainWindow);
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
