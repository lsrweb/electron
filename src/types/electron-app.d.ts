import { type App, App } from "electron";
import { Server as SocketIOServer } from "socket.io";
import { BrowserWindow } from "electron";

interface CustomApp extends App {
  ws?: SocketIOServer;
  mainWindow?: BrowserWindow;
}
