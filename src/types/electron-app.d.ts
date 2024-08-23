import { App } from "electron";
import { Server as SocketIOServer } from "socket.io";
import { BrowserWindow } from "electron";

declare module "electron" {
  interface App {
    ws?: SocketIOServer;
    mainWindow?: BrowserWindow;
  }
}

export {};
