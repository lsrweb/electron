import { createTray } from "./main_/core/Tray";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { registerMainHandlers } from "./main_/controller";
import { APPDIR } from "./main_/constants";
import { checkFolderExist } from "./main_/utils/folder";

import { Server } from "socket.io";
import http from "http";
import { toJson } from "./render_/utils";
import FeedBack from "./main_/utils/feedback";

// 创建 WebSocket 服务
// 创建 HTTP 服务器
const server = http.createServer();
// 创建 Socket.IO 服务器
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket.IO is connected");

  socket.on("message", (message) => {
    console.log(`Main get message: ${message}`);
    // 处理收到的消息
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO is disconnected");
  });

  // 向客户端发送消息
  socket.emit("message", "Main process Socket.IO server is connected");
});

server.listen(8080, () => {
  console.log("Socket.IO is running on ws://127.0.0.1:8080");
});

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
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
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

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("main-process-loaded");
  });

  // eslint-disable-next-line
  // @ts-ignore
  app["ws"] = io;
  // eslint-disable-next-line
  // @ts-ignore
  app["mainWindow"] = mainWindow;
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
