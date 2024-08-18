import { app, BrowserWindow, ipcMain } from "electron";
import store from "electron-store";

const storeInit = new store();

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.whenReady().then(() => {
  const STORE_PATH = app.getPath("userData");

  console.log(STORE_PATH);

  // init
  ipcMain.handle("store-get", async (event, key) => {
    return storeInit.get(key);
  });

  ipcMain.handle("store-set", async (event, key, value) => {
    return storeInit.set(key, value);
  });
});

// 当所有窗口关闭时退出（macOS 除外）。在那里，很常见
// 让应用程序及其菜单栏保持活动状态直到用户退出
// 明确使用 Cmd + Q。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // 在 OS X 上，当出现以下情况时，通常会在应用程序中重新创建一个窗口：
  // 单击停靠图标，并且没有打开其他窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
